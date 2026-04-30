import { put } from '@vercel/blob';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename, relative } from 'path';

/**
 * Upload all videos in public/ to Vercel Blob Storage
 */

const PUBLIC_DIR = join(process.cwd(), 'public');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.mp4')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function uploadVideos() {
  console.log('🎬 Uploading all videos to Vercel Blob...\n');

  const videoFiles = getAllFiles(PUBLIC_DIR);
  console.log(`Found ${videoFiles.length} videos to upload\n`);

  const uploadedUrls: Record<string, string> = {};

  for (const filePath of videoFiles) {
    const fileName = basename(filePath);
    const fileBuffer = readFileSync(filePath);
    const fileSizeMB = (fileBuffer.length / 1048576).toFixed(1);

    console.log(`📤 Uploading: ${fileName} (${fileSizeMB}MB) from ${relative(PUBLIC_DIR, filePath)}`);

    try {
      const blob = await put(fileName, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
      });

      uploadedUrls[fileName] = blob.url;
      console.log(`✅ Uploaded: ${blob.url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${fileName}:`, error);
    }
  }

  console.log('\n📝 Generating video URLs file...');

  const videoUrlsContent = `// Auto-generated Vercel Blob URLs
// Videos are served via Vercel's global CDN with automatic optimization

export const USE_CDN = true;

export const VIDEO_URLS: Record<string, string> = ${JSON.stringify(uploadedUrls, null, 2)};

// Helper to get video URL by filename
export function getVideoUrl(filename: string): string {
  if (USE_CDN && VIDEO_URLS[filename]) {
    return VIDEO_URLS[filename];
  }
  return \`/vids/\${filename}\`; // Fallback to local path
}
`;

  const { writeFileSync } = await import('fs');
  writeFileSync(
    join(process.cwd(), 'src', 'lib', 'video-urls.ts'),
    videoUrlsContent
  );

  console.log('✅ Created src/lib/video-urls.ts');
  console.log('\n✨ Upload complete!');
  console.log('\n📊 Summary:');
  console.log(`   Uploaded: ${Object.keys(uploadedUrls).length} videos`);
  console.log(`   CDN: Vercel Edge Network (global)`);
}

uploadVideos().catch(console.error);
