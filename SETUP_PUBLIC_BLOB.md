# Setup Public Vercel Blob Store

## Current Issue
Your Vercel Blob store is **PRIVATE**, which means videos require authentication and won't load on your public website.

## Solution: Create a Public Blob Store

### Step 1: Create Public Blob Store via Dashboard

1. **Open Vercel Dashboard**:
   ```
   https://vercel.com/isaiahamber5-6265s-projects/amberes-portfolio/stores
   ```

2. **Create New Blob Store**:
   - Click **"Create Database"** or **"Create Store"**
   - Select **"Blob"**
   - Name: `amberes-videos-public`
   - **Access Control**: Select **"Public"** ⚠️ (This is critical!)
   - Click **"Create"**

3. **Copy the Token**:
   - After creation, you'll see `BLOB_READ_WRITE_TOKEN`
   - Copy this token (you'll need it in the next step)

### Step 2: Update Local Environment

Update your `app/.env.local` file with the new token:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

### Step 3: Update Vercel Environment Variables

Run this command to update the production token:

```bash
vercel env add BLOB_READ_WRITE_TOKEN production --scope isaiahamber5-6265s-projects
```

When prompted, paste the new public token.

Also update for preview and development:

```bash
vercel env add BLOB_READ_WRITE_TOKEN preview --scope isaiahamber5-6265s-projects
vercel env add BLOB_READ_WRITE_TOKEN development --scope isaiahamber5-6265s-projects
```

### Step 4: Upload Videos to Public Store

```bash
cd app
bun run upload-videos
```

This will upload all 7 videos to the new **public** Blob store.

### Step 5: Update Video URLs

The upload script will automatically update `app/src/lib/video-urls.ts` with the new public URLs.

### Step 6: Enable CDN in Code

Edit `app/src/lib/video-urls.ts` and change:

```typescript
const USE_CDN = false; // Change this to true
```

To:

```typescript
const USE_CDN = true; // Now using public Blob CDN
```

### Step 7: Deploy

```bash
git add -A
git commit -m "feat: migrate to public Vercel Blob storage"
git push origin main
```

## Verification

After deployment, check:

1. **Videos load on production**: https://www.amberesaiae.space
2. **URLs are public**: Should be `https://XXXXX.public.blob.vercel-storage.com/`
3. **No authentication required**: Videos load without tokens

## Benefits of Public Blob

✅ **Global CDN**: Videos served from edge locations worldwide
✅ **No authentication**: Public access for all users
✅ **Automatic optimization**: Vercel handles compression
✅ **Fast delivery**: Edge caching reduces latency
✅ **Bandwidth savings**: Offloads traffic from main deployment

## Troubleshooting

### Videos still not loading?

1. **Check store is public**:
   - Go to Vercel Dashboard → Stores
   - Verify "Access Control" shows "Public"

2. **Check URLs**:
   - Public URLs contain: `.public.blob.vercel-storage.com`
   - Private URLs contain: `.private.blob.vercel-storage.com`

3. **Verify token**:
   ```bash
   cd app
   bun run tsx scripts/test-blob.ts
   ```

4. **Check environment variables**:
   ```bash
   vercel env ls --scope isaiahamber5-6265s-projects
   ```

### Need to delete old private store?

1. Go to: https://vercel.com/isaiahamber5-6265s-projects/amberes-portfolio/stores
2. Find the old private store
3. Click **"..."** → **"Delete"**
4. Confirm deletion

## Current Status

- ❌ **Private Blob Store**: Videos require authentication (not working)
- ⏳ **Action Required**: Create public Blob store
- ✅ **Fallback Active**: Videos currently served from local files

## Quick Start Command

After creating the public store and updating the token:

```bash
cd app
bun run upload-videos
# Wait for upload to complete
# Edit src/lib/video-urls.ts and set USE_CDN = true
git add -A
git commit -m "feat: enable public Blob CDN for videos"
git push origin main
```

---

**Need Help?**
- Vercel Blob Docs: https://vercel.com/docs/storage/vercel-blob
- Vercel Dashboard: https://vercel.com/dashboard
