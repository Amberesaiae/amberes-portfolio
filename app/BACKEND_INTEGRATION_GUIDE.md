# BACKEND INTEGRATION GUIDE
## Contact Form Email Service Setup

**Date:** April 30, 2026  
**Purpose:** Guide for integrating email services with the contact form

---

## OVERVIEW

The contact form now has a fully functional backend API endpoint that sends emails when users submit the form. This guide explains how to set up and configure the email service.

---

## QUICK START

### 1. Choose an Email Service

**Option 1: Resend (Recommended)**
- ✅ Modern, developer-friendly API
- ✅ Generous free tier (100 emails/day)
- ✅ Fast delivery
- ✅ Great documentation
- 🔗 https://resend.com

**Option 2: SendGrid**
- ✅ Established service
- ✅ Free tier (100 emails/day)
- ✅ Reliable delivery
- 🔗 https://sendgrid.com

**Option 3: SMTP (Generic)**
- ✅ Works with any email provider
- ✅ Gmail, Outlook, custom servers
- ⚠️ More complex setup

---

## SETUP INSTRUCTIONS

### Option 1: Resend (Recommended)

#### Step 1: Sign Up
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

#### Step 2: Get API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "Amber Systems Portfolio"
4. Copy the API key (starts with `re_`)

#### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   CONTACT_EMAIL=isaiahamber5@gmail.com
   ```

#### Step 4: Verify Domain (Optional but Recommended)
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Add your domain (e.g., `ambersystems.dev`)
4. Follow DNS setup instructions
5. Wait for verification (usually 5-10 minutes)

**Note:** Without domain verification, emails will be sent from `onboarding@resend.dev`. With verification, you can use `noreply@yourdomain.com`.

#### Step 5: Test
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/contact
3. Fill out and submit the form
4. Check your email inbox

---

### Option 2: SendGrid

#### Step 1: Sign Up
1. Go to https://sendgrid.com
2. Sign up for a free account
3. Complete email verification

#### Step 2: Get API Key
1. Go to https://app.sendgrid.com/settings/api_keys
2. Click "Create API Key"
3. Choose "Restricted Access"
4. Enable "Mail Send" permission
5. Copy the API key (starts with `SG.`)

#### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```env
   SENDGRID_API_KEY=SG.your_actual_api_key_here
   CONTACT_EMAIL=isaiahamber5@gmail.com
   ```

#### Step 4: Verify Sender Identity
1. Go to https://app.sendgrid.com/settings/sender_auth
2. Click "Verify a Single Sender"
3. Fill in your details
4. Verify your email address

#### Step 5: Test
Same as Resend (see above)

---

### Option 3: SMTP (Generic)

#### Step 1: Get SMTP Credentials

**For Gmail:**
1. Enable 2-factor authentication
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password
4. Copy the 16-character password

**For Outlook:**
1. Go to https://account.live.com/proofs/manage/additional
2. Generate an app password
3. Copy the password

**For Custom Server:**
- Get SMTP host, port, username, and password from your hosting provider

#### Step 2: Configure Environment Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=isaiahamber5@gmail.com
```

#### Step 3: Install Nodemailer
```bash
npm install nodemailer
```

#### Step 4: Update API Endpoint
You'll need to modify `app/api/contact.ts` to use Nodemailer instead of Resend/SendGrid. See the Nodemailer documentation for details.

---

## DEPLOYMENT

### Vercel (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add contact form backend"
git push origin main
```

#### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Click "Deploy"

#### Step 3: Add Environment Variables
1. Go to your project settings
2. Click "Environment Variables"
3. Add your variables:
   - `RESEND_API_KEY` (or `SENDGRID_API_KEY`)
   - `CONTACT_EMAIL`
4. Redeploy

#### Step 4: Test Production
1. Go to your production URL
2. Submit a test form
3. Verify email delivery

---

### Netlify

#### Step 1: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### Step 2: Convert API to Netlify Function
Move `app/api/contact.ts` to `netlify/functions/contact.ts` and adjust exports.

#### Step 3: Deploy
```bash
netlify deploy --prod
```

#### Step 4: Add Environment Variables
```bash
netlify env:set RESEND_API_KEY "your_key_here"
netlify env:set CONTACT_EMAIL "your_email@example.com"
```

---

## FEATURES

### Rate Limiting
- **Limit:** 5 requests per hour per IP address
- **Purpose:** Prevent spam and abuse
- **Storage:** In-memory (use Redis in production for multiple servers)

**To adjust rate limit:**
Edit `app/api/contact.ts`:
```typescript
if (limit.count >= 5) { // Change this number
  return { allowed: false, resetTime: limit.resetTime };
}
```

### Email Template
The email sent includes:
- Sender name and email
- Subject line
- Message content
- Professional HTML formatting
- Reply-to header (allows direct reply)

**To customize template:**
Edit the HTML in `sendEmailResend()` or `sendEmailSendGrid()` functions.

### Validation
Form data is validated using Zod schema:
- **Name:** 2-100 characters
- **Email:** Valid email format
- **Subject:** 5-200 characters
- **Message:** 10-5000 characters

**To adjust validation:**
Edit `contactSchema` in `app/api/contact.ts`.

---

## TESTING

### Local Testing

#### Test 1: Valid Submission
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message."
  }'
```

**Expected:** 200 OK, email sent

#### Test 2: Invalid Email
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "subject": "Test Subject",
    "message": "This is a test message."
  }'
```

**Expected:** 400 Bad Request, validation error

#### Test 3: Rate Limiting
Submit 6 requests in quick succession.

**Expected:** First 5 succeed, 6th returns 429 Too Many Requests

### Production Testing

1. Submit a real form on your production site
2. Check email delivery (inbox and spam folder)
3. Verify reply-to works (reply to the email)
4. Test rate limiting (submit 6 times)
5. Test validation (submit invalid data)

---

## MONITORING

### Email Delivery

**Resend:**
- Dashboard: https://resend.com/emails
- View all sent emails
- Check delivery status
- View bounce/complaint rates

**SendGrid:**
- Dashboard: https://app.sendgrid.com/email_activity
- View email activity
- Check delivery stats
- Monitor reputation

### Error Tracking

Add Sentry for error monitoring:

```bash
npm install @sentry/node
```

Update `app/api/contact.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

// In catch block:
Sentry.captureException(error);
```

---

## TROUBLESHOOTING

### Issue: "RESEND_API_KEY not configured"

**Solution:**
1. Check `.env.local` exists
2. Verify `RESEND_API_KEY` is set
3. Restart development server

### Issue: Emails not arriving

**Solution:**
1. Check spam folder
2. Verify API key is correct
3. Check email service dashboard for errors
4. Verify sender email is verified (SendGrid)
5. Check domain verification (Resend)

### Issue: "Rate limit exceeded"

**Solution:**
1. Wait 1 hour for rate limit to reset
2. Or adjust rate limit in code
3. Or use different IP address

### Issue: "Method not allowed"

**Solution:**
Ensure you're using POST request, not GET.

### Issue: CORS errors

**Solution:**
Add CORS headers to API response:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
}
```

---

## SECURITY BEST PRACTICES

### 1. Never Commit API Keys
- ✅ Use `.env.local` (gitignored)
- ✅ Use environment variables in production
- ❌ Never hardcode API keys in code

### 2. Validate All Input
- ✅ Use Zod schema validation
- ✅ Sanitize HTML in emails
- ✅ Limit message length

### 3. Rate Limiting
- ✅ Implement per-IP rate limiting
- ✅ Use Redis for distributed rate limiting
- ✅ Monitor for abuse

### 4. HTTPS Only
- ✅ Always use HTTPS in production
- ✅ Vercel provides HTTPS by default

### 5. Monitor Logs
- ✅ Check email service logs regularly
- ✅ Set up error alerts
- ✅ Monitor delivery rates

---

## COST ESTIMATES

### Resend
- **Free Tier:** 100 emails/day, 3,000/month
- **Pro Plan:** $20/month for 50,000 emails
- **Typical Usage:** 5-10 emails/day = FREE

### SendGrid
- **Free Tier:** 100 emails/day
- **Essentials Plan:** $19.95/month for 50,000 emails
- **Typical Usage:** 5-10 emails/day = FREE

### SMTP (Gmail)
- **Free:** Unlimited (within Gmail limits)
- **Limit:** 500 emails/day for free accounts
- **Typical Usage:** FREE

**Recommendation:** Start with free tier, upgrade if needed.

---

## ADDITIONAL RESOURCES

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Zod Validation](https://zod.dev/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

---

**Document Version:** 1.0  
**Last Updated:** April 30, 2026  
**Author:** Kiro AI Agent  
**Status:** Ready for Use
