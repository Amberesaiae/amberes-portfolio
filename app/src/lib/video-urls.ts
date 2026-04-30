// Video URL configuration
// Serving from Vercel deployment CDN (/public/vids/)
// Vercel automatically serves static files via global CDN edge network

const USE_CDN = false; // Blob store quota exhausted - using Vercel static CDN

const CDN_BASE = "https://bmgstv5kkazu2zdg.public.blob.vercel-storage.com";

const CDN_URLS: Record<string, string> = {
  "try.mp4":           `${CDN_BASE}/try.mp4`,
  "runaway.mp4":       `${CDN_BASE}/runaway.mp4`,
  "seen.mp4":          `${CDN_BASE}/seen.mp4`,
  "not-today.mp4":     `${CDN_BASE}/not-today.mp4`,
  "the-pen.mp4":       `${CDN_BASE}/the-pen.mp4`,
  "opportunities.mp4": `${CDN_BASE}/opportunities.mp4`,
  "dream-date.mp4":    `${CDN_BASE}/dream-date.mp4`,
  "hero-bg.mp4":       `${CDN_BASE}/hero-bg.mp4`,
};

// Returns CDN URL if enabled, falls back to local /vids/
export function getVideoUrl(filename: string): string {
  if (USE_CDN && CDN_URLS[filename]) {
    return CDN_URLS[filename];
  }
  return `/vids/${filename}`;
}
