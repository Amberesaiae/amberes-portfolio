# Video Optimization Guide

## Current Setup

All videos are served as static files from Vercel's global CDN edge network.

### Hero Section (`/vids/loops/`)
7 × 6-second clips, WebM/VP9 primary + MP4/H.264 fallback.
- Total: ~2.4MB
- Crossfade every 4s, A/B player pattern

| File | Size | Start |
|------|------|-------|
| the-pen.webm | 192KB | 4s |
| opportunities.webm | 516KB | 30s |
| seen.webm | 804KB | 22s (480p, high motion) |
| dream-date.webm | 152KB | 38s |
| runaway.webm | 280KB | 25s |
| not-today.webm | 448KB | 32s |
| trying.webm | 60KB | 27s |

### Video Scroll Section (`/vids/previews/`)
7 × 30-second previews, WebM/VP9 primary + MP4/H.264 fallback.
- Total: ~10MB, lazy-loaded per scroll position
- User only downloads the active video

| File | Size |
|------|------|
| the-pen.webm | 1.2MB |
| opportunities.webm | 1.5MB |
| seen.webm | 4.0MB (high motion) |
| dream-date.webm | 648KB |
| runaway.webm | 1.3MB |
| not-today.webm | 1.2MB |
| trying.webm | 316KB |

## Re-encoding

To re-encode clips with FFmpeg:

```bash
# Hero loop (6s WebM)
ffmpeg -ss [START] -i source.mp4 -t 6 \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -crf 33 -b:v 0 -an output.webm

# Preview (30s WebM)
ffmpeg -ss [START] -i source.mp4 -t 30 \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -crf 33 -b:v 0 -an output.webm

# MP4 fallback
ffmpeg -ss [START] -i source.mp4 -t [DURATION] \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -crf 23 -preset fast -an -movflags +faststart output.mp4
```
