// Auto-generated Vercel Blob URLs
// Videos are served via Vercel's global CDN with automatic optimization

export const VIDEO_URLS: Record<string, string> = {
  "try.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/try.mp4",
  "runaway.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/runaway.mp4",
  "seen.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/seen.mp4",
  "not-today.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/not-today.mp4",
  "the-pen.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/the-pen.mp4",
  "opportunities.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/opportunities.mp4",
  "dream-date.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/dream-date.mp4"
};

// Helper to get video URL by filename
export function getVideoUrl(filename: string): string {
  return VIDEO_URLS[filename] || `/vids/${filename}`;
}
