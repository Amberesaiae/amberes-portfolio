# Get Blob Token and Complete Setup

## Current Status
✅ Public Blob store created: `amberes-videos-public`
✅ Old private store deleted
⏳ Need to link store to project and get token

## Get the Token

### Option 1: Via Dashboard (Easiest)
1. Go to: https://vercel.com/isaiahamber5-6265s-projects/~/stores/blob/store_bmgSTv5KKazU2ZdG
2. Look for **"Connect to Project"** or **"Environment Variables"** section
3. You should see `BLOB_READ_WRITE_TOKEN`
4. Copy the token value

### Option 2: Via CLI
Run this command and follow the prompts:
```bash
vercel env add BLOB_READ_WRITE_TOKEN production
```
When prompted, paste the token from the dashboard.

## Complete Setup Steps

### 1. Add Token to Local Environment
Create/update `app/.env.local`:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

### 2. Add Token to Vercel (All Environments)
```bash
# Production
vercel env add BLOB_READ_WRITE_TOKEN production --scope isaiahamber5-6265s-projects

# Preview  
vercel env add BLOB_READ_WRITE_TOKEN preview --scope isaiahamber5-6265s-projects

# Development
vercel env add BLOB_READ_WRITE_TOKEN development --scope isaiahamber5-6265s-projects
```

### 3. Upload Videos to Public Store
```bash
cd app
bun run upload-videos
```

This will upload all 7 videos (~91MB total) to the public Blob store.

### 4. Update Video URLs Configuration
The upload script will automatically update `app/src/lib/video-urls.ts` with new public URLs.

Verify the URLs contain `.public.blob` (not `.private.blob`):
```typescript
// Should look like:
"try.mp4": "https://bmgstv5kkazu2zdg.public.blob.vercel-storage.com/try.mp4"
```

### 5. Enable CDN in Code
Edit `app/src/lib/video-urls.ts`:
```typescript
const USE_CDN = true; // Change from false to true
```

### 6. Verify Blob is Public
```bash
cd app
bun run verify-blob
```

Should show: ✅ STORE IS PUBLIC!

### 7. Deploy
```bash
git add -A
git commit -m "feat: migrate to public Vercel Blob CDN"
git push origin main
```

## Verification Checklist

After deployment:
- [ ] Videos load on https://www.amberesaiae.space
- [ ] No authentication errors in browser console
- [ ] Video URLs contain `.public.blob.vercel-storage.com`
- [ ] Videos load quickly from CDN edge locations

## Store Details

**Store Name**: amberes-videos-public
**Store ID**: store_bmgSTv5KKazU2ZdG
**Access**: Public ✅
**Base URL**: bmgstv5kkazu2zdg.public.blob.vercel-storage.com
**Region**: iad1 (Washington, D.C.)
**Dashboard**: https://vercel.com/isaiahamber5-6265s-projects/~/stores/blob/store_bmgSTv5KKazU2ZdG

## Quick Commands Reference

```bash
# List stores
vercel blob list-stores --all --scope isaiahamber5-6265s-projects

# List files in store
vercel blob list --scope isaiahamber5-6265s-projects

# Upload a single file
vercel blob put path/to/video.mp4 --scope isaiahamber5-6265s-projects

# Verify setup
cd app && bun run verify-blob

# Upload all videos
cd app && bun run upload-videos
```

## Troubleshooting

### Can't find token?
1. Go to dashboard link above
2. Click "Connect to Project"
3. Select "amberes-portfolio"
4. Token will be displayed

### Upload fails?
- Check token is in `app/.env.local`
- Verify store is public: `vercel blob list-stores --all`
- Check you're in the `app` directory

### Videos still not loading?
- Verify `USE_CDN = true` in `app/src/lib/video-urls.ts`
- Check URLs contain `.public.blob` not `.private.blob`
- Clear browser cache and hard refresh (Ctrl+Shift+R)
