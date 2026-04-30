# Vercel Blob Setup for Public Video Access

## Issue
The current Vercel Blob store is **private**, which means videos require authentication tokens to access. This breaks both local development and production deployment.

## Solution: Create a Public Vercel Blob Store

### Step 1: Create a New Public Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: **amberes-portfolio**
3. Go to **Storage** tab
4. Click **Create Database** → **Blob**
5. Name it: `amberes-videos-public`
6. **IMPORTANT**: Set **Access Control** to **Public**
7. Click **Create**

### Step 2: Get the New Token

1. After creating the store, copy the `BLOB_READ_WRITE_TOKEN`
2. Update your local `.env.local` file:
   ```bash
   BLOB_READ_WRITE_TOKEN=your_new_public_token_here
   ```

### Step 3: Re-upload Videos

Run the upload script with the new token:

```bash
cd app
bun run upload-videos
```

This will upload all videos to the **public** Vercel Blob store.

### Step 4: Update Environment Variables in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Update `BLOB_READ_WRITE_TOKEN` with the new public token
3. Make sure it's available for **Production**, **Preview**, and **Development**

### Step 5: Deploy

```bash
git add -A
git commit -m "feat: migrate to public Vercel Blob storage"
git push origin main
```

## Alternative: Use Local Videos Only

If you prefer to keep videos local and not use Vercel Blob:

1. Delete `app/src/lib/video-urls.ts`
2. Update components to use local paths directly:
   ```typescript
   const videoSrc = "/vids/video-name.mp4";
   ```

## Current Status

- ✅ Local development: Uses `/public/vids/` (working)
- ❌ Production: Uses private Vercel Blob URLs (requires authentication)
- 🔧 Fix needed: Migrate to public Vercel Blob store

## Benefits of Public Vercel Blob

- ✅ Global CDN distribution
- ✅ Automatic optimization
- ✅ No authentication required
- ✅ Fast edge delivery
- ✅ Bandwidth optimization
