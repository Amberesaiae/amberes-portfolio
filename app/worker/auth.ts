/**
 * WorkOS AuthKit session handling for Studio.
 *
 * Flow: /api/auth/login -> WorkOS hosted login -> /api/auth/callback
 * (code exchanged for a user via user_management/authenticate) -> sealed
 * HttpOnly session cookie. /api/auth/me reports the session; /api/auth/logout
 * clears it. Admin rights come from the ADMIN_USERS allowlist, never from
 * anything the client asserts.
 *
 * No dependencies: sealing is AES-GCM via WebCrypto, keyed by SESSION_SECRET.
 */

import type { Env } from './index';
import { overBudget, rateLimitedResponse } from './ratelimit';

export interface StudioSession {
  userId: string;
  email: string;
  exp: number;
}

interface WorkOSUser {
  id: string;
  email: string;
}

const SESSION_COOKIE = 'studio_session';
const STATE_COOKIE = 'studio_oauth_state';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

async function sessionKey(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function sealSession(session: StudioSession, secret: string): Promise<string> {
  const key = await sessionKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(session));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  const packed = new Uint8Array(iv.length + cipher.byteLength);
  packed.set(iv, 0);
  packed.set(new Uint8Array(cipher), iv.length);
  let binary = '';
  for (const byte of packed) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function unsealSession(sealed: string, secret: string): Promise<StudioSession | null> {
  try {
    const binary = atob(sealed);
    const packed = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const key = await sessionKey(secret);
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: packed.slice(0, 12) },
      key,
      packed.slice(12),
    );
    const session = JSON.parse(new TextDecoder().decode(plain)) as StudioSession;
    if (!session.userId || !session.email || session.exp < Date.now() / 1000) return null;
    return session;
  } catch {
    return null;
  }
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

function sessionCookieHeader(sealed: string, maxAge: number): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(sealed)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function isAdmin(session: StudioSession, allowlist: string | undefined): boolean {
  if (!allowlist) return false;
  const allowed = allowlist
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return (
    allowed.includes(session.email.toLowerCase()) ||
    allowed.includes(session.userId.toLowerCase())
  );
}

export async function getSession(request: Request, env: Env): Promise<StudioSession | null> {
  const sealed = getCookie(request, SESSION_COOKIE);
  if (!sealed || !env.SESSION_SECRET) return null;
  return unsealSession(sealed, env.SESSION_SECRET);
}

function studioUrl(request: Request, query?: string): string {
  const url = new URL(request.url);
  return `${url.origin}/#/studio${query ?? ''}`;
}

/** Route /api/auth/* — returns null when the path is not an auth route. */
export async function handleAuth(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  const { pathname } = url;
  if (!pathname.startsWith('/api/auth/')) return null;

  const action = pathname.slice('/api/auth/'.length);

  if (action === 'login') {
    if (!env.WORKOS_CLIENT_ID || !env.WORKOS_REDIRECT_URI) {
      return Response.json({ error: 'auth_not_configured' }, { status: 503 });
    }
    const state = crypto.randomUUID();
    const authorize = new URL('https://api.workos.com/sso/authorize');
    authorize.searchParams.set('client_id', env.WORKOS_CLIENT_ID);
    authorize.searchParams.set('redirect_uri', env.WORKOS_REDIRECT_URI);
    authorize.searchParams.set('response_type', 'code');
    authorize.searchParams.set('state', state);
    const headers = new Headers();
    headers.set('location', authorize.toString());
    headers.append(
      'set-cookie',
      `${STATE_COOKIE}=${state}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    );
    return new Response(null, { status: 302, headers });
  }

  if (action === 'callback') {
    if (overBudget(request, 'auth-callback', 20, 60)) return rateLimitedResponse();
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const expectedState = getCookie(request, STATE_COOKIE);
    if (!code || !state || state !== expectedState) {
      return Response.redirect(studioUrl(request, '?error=bad_callback'), 302);
    }
    if (!env.WORKOS_CLIENT_ID || !env.WORKOS_API_KEY || !env.SESSION_SECRET) {
      return Response.redirect(studioUrl(request, '?error=not_configured'), 302);
    }
    const tokenRes = await fetch('https://api.workos.com/user_management/authenticate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: env.WORKOS_CLIENT_ID,
        client_secret: env.WORKOS_API_KEY,
        grant_type: 'authorization_code',
        code,
      }),
    });
    if (!tokenRes.ok) {
      return Response.redirect(studioUrl(request, '?error=exchange_failed'), 302);
    }
    const { user } = (await tokenRes.json()) as { user?: WorkOSUser };
    if (!user?.id || !user?.email) {
      return Response.redirect(studioUrl(request, '?error=no_user'), 302);
    }
    const sealed = await sealSession(
      {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
      },
      env.SESSION_SECRET,
    );
    const headers = new Headers();
    headers.append('set-cookie', sessionCookieHeader(sealed, SESSION_TTL_SECONDS));
    headers.append(
      'set-cookie',
      `${STATE_COOKIE}=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    );
    headers.set('location', studioUrl(request));
    return new Response(null, { status: 302, headers });
  }

  if (action === 'me') {
    const session = await getSession(request, env);
    if (!session) return Response.json({ authenticated: false });
    return Response.json({
      authenticated: true,
      user: { id: session.userId, email: session.email },
      isAdmin: isAdmin(session, env.ADMIN_USERS),
    });
  }

  if (action === 'logout') {
    const headers = new Headers();
    headers.append('set-cookie', clearSessionCookieHeader());
    headers.set('location', studioUrl(request));
    return new Response(null, { status: 302, headers });
  }

  return Response.json({ error: 'unknown_auth_route' }, { status: 404 });
}
