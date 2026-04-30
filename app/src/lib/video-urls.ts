// Video URL configuration - Vercel Blob Public CDN
// Store: amberes-videos-public (store_bmgSTv5KKazU2ZdG)
// Access: Public - no authentication required
// CDN: Vercel Edge Network (global, cached up to 1 month)

const CDN_BASE = "https://bmgstv5kkazu2zdg.public.blob.vercel-storage.com";

export const VIDEO_URLS: Record<string, string> = {
  "try.mp4":           `${CDN_BASE}/try.mp4`,
  "runaway.mp4":       `${CDN_BASE}/runaway.mp4`,
  "seen.mp4":          `${CDN_BASE}/seen.mp4`,
  "not-today.mp4":     `${CDN_BASE}/not-today.mp4`,
  "the-pen.mp4":       `${CDN_BASE}/the-pen.mp4`,
  "opportunities.mp4": `${CDN_BASE}/opportunities.mp4`,
  "dream-date.mp4":    `${CDN_BASE}/dream-date.mp4`,
  "hero-bg.mp4":       `${CDN_BASE}/hero-bg.mp4`,
};

// Helper to get video URL by filename
// Falls back to local /vids/ if filename not in CDN map
export function getVideoUrl(filename: string): string {
  return VIDEO_URLS[filename] ?? `/vids/${filename}`;
}
