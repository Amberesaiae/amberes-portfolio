/**
 * Video optimization utilities for web delivery
 * Supports both local and Cloudinary-hosted videos
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

interface VideoTransformOptions {
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
  format?: 'auto' | 'mp4' | 'webm';
  width?: number;
}

/**
 * Get optimized video URL
 * If Cloudinary is configured, returns Cloudinary URL with automatic optimization
 * Otherwise returns local URL
 */
export function getOptimizedVideoUrl(
  videoPath: string,
  options: VideoTransformOptions = {}
): string {
  const {
    quality = 'auto:good',
    format = 'auto',
    width,
  } = options;

  // If no Cloudinary configured, return local path
  if (!CLOUDINARY_CLOUD_NAME) {
    return videoPath;
  }

  // Extract filename from path
  const filename = videoPath.split('/').pop()?.replace('.mp4', '') || '';
  
  // Build Cloudinary transformation string
  const transformations = [
    `q_${quality}`,
    `f_${format}`,
    width ? `w_${width}` : null,
    'fl_lossy', // Enable lossy compression for smaller files
  ].filter(Boolean).join(',');

  // Return Cloudinary URL
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformations}/portfolio-videos/${filename}`;
}

/**
 * Get video source set for different formats
 * Returns array of sources for <video> element
 */
export function getVideoSources(videoPath: string, width?: number) {
  if (!CLOUDINARY_CLOUD_NAME) {
    return [{ src: videoPath, type: 'video/mp4' }];
  }

  const filename = videoPath.split('/').pop()?.replace('.mp4', '') || '';
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload`;
  const widthParam = width ? `w_${width},` : '';

  return [
    {
      src: `${baseUrl}/${widthParam}q_auto:good,f_webm,fl_lossy/portfolio-videos/${filename}`,
      type: 'video/webm',
    },
    {
      src: `${baseUrl}/${widthParam}q_auto:good,f_mp4,fl_lossy/portfolio-videos/${filename}`,
      type: 'video/mp4',
    },
  ];
}

/**
 * Preload video for faster playback
 */
export function preloadVideo(videoPath: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = getOptimizedVideoUrl(videoPath);
  document.head.appendChild(link);
}
