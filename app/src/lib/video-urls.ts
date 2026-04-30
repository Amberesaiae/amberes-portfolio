// Video URL configuration
// Currently using local videos for both development and production
// To use Vercel Blob CDN: Set up public Blob store (see VERCEL_BLOB_SETUP.md)

const USE_CDN = false; // Set to true after setting up public Vercel Blob store

const CDN_URLS: Record<string, string> = {
  "try.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/try.mp4",
  "runaway.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/runaway.mp4",
  "seen.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/seen.mp4",
  "not-today.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/not-today.mp4",
  "the-pen.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/the-pen.mp4",
  "opportunities.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/opportunities.mp4",
  "dream-date.mp4": "https://i4rlpll9gbg5bs9n.private.blob.vercel-storage.com/dream-date.mp4"
};

// Helper to get video URL by filename
// Falls back to local videos in development or if CDN URL not found
export function getVideoUrl(filename: string): string {
  if (USE_CDN && CDN_URLS[filename]) {
    return CDN_URLS[filename];
  }
  return `/vids/${filename}`;
}
