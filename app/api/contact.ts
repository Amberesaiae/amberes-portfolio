/**
 * Contact Form API Endpoint
 * 
 * This endpoint handles contact form submissions and sends emails.
 * 
 * Supported Email Services:
 * 1. Resend (recommended) - https://resend.com
 * 2. SendGrid - https://sendgrid.com
 * 3. Nodemailer + SMTP
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY (if using Resend)
 * - SENDGRID_API_KEY (if using SendGrid)
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (if using SMTP)
 * - CONTACT_EMAIL (recipient email address)
 */

import { z } from 'zod';

// Rate limiting store (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Contact form schema validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "IDENTIFIER_REQUIRED" }).max(100),
  email: z.string().email({ message: "INVALID_PROTOCOL" }),
  subject: z.string().min(5, { message: "SUBJECT_INSUFFICIENT" }).max(200),
  message: z.string().min(10, { message: "DATA_MINIMUM_NOT_MET" }).max(5000),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Rate limiting: 5 requests per hour per IP
 */
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return { allowed: true };
  }

  if (limit.count >= 5) {
    return { allowed: false, resetTime: limit.resetTime };
  }

  limit.count++;
  return { allowed: true };
}

/**
 * Send email using Resend (recommended)
 */
async function sendEmailResend(data: ContactFormData): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'isaiahamber5@gmail.com';

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Amber Systems <noreply@ambersystems.dev>',
      to: [CONTACT_EMAIL],
      reply_to: data.email,
      subject: `[Contact Form] ${data.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFB000; border-bottom: 2px solid #FFB000; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #FFB000;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${data.name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 0;"><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #ddd;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This message was sent from the Amber Systems contact form.
              Reply directly to this email to respond to ${data.name}.
            </p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }
}

/**
 * Send email using SendGrid
 */
async function sendEmailSendGrid(data: ContactFormData): Promise<void> {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'isaiahamber5@gmail.com';

  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: CONTACT_EMAIL }],
        subject: `[Contact Form] ${data.subject}`,
      }],
      from: {
        email: 'noreply@ambersystems.dev',
        name: 'Amber Systems',
      },
      reply_to: {
        email: data.email,
        name: data.name,
      },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FFB000;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
        `,
      }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`SendGrid API error: ${JSON.stringify(error)}`);
  }
}

/**
 * Main API handler
 */
export default async function handler(req: Request): Promise<Response> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime 
        ? new Date(rateLimit.resetTime).toISOString() 
        : 'unknown';
      
      return new Response(
        JSON.stringify({ 
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          resetTime,
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '3600',
          } 
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Send email (try Resend first, fallback to SendGrid)
    try {
      await sendEmailResend(validatedData);
    } catch (resendError) {
      console.warn('Resend failed, trying SendGrid:', resendError);
      await sendEmailSendGrid(validatedData);
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'TRANSMISSION_COMPLETE',
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    // Validation error
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'VALIDATION_ERROR',
          details: error.errors,
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generic error
    return new Response(
      JSON.stringify({ 
        error: 'INTERNAL_ERROR',
        message: 'Failed to send message. Please try again later.',
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Vercel serverless function export
export const config = {
  runtime: 'edge',
};
