import { put } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Upload videos to Vercel Blob Storage
 * Vercel automatically optimizes and serves via global CDN
 */

const VIDEOS_DIR = join(process.cwd(), 'public', 'vids');

async function uploadVideos() {
  console.log('🎬 Uploading videos to Vercel Blob...\n');

  // Get all video files
  const files = readdirSync(VIDEOS_DIR).filter(
    (file) => file.endsWith('.mp4') && !file.includes('test')
  );

  console.log(`Found ${files.length} videos to upload\n`);

  const uploadedUrls: Record<string, string> = {};

  for (const file of files) {
    const filePath = join(VIDEOS_DIR, file);
    const fileBuffer = readFileSync(filePath);
    const fileSizeMB = (fileBuffer.length / 1048576).toFixed(1);

    console.log(`📤 Uploading: ${file} (${fileSizeMB}MB)`);

    try {
      // Upload to Vercel Blob with public access
      const blob = await put(file, fileBuffer, {
        access: 'public',
        addRandomSuffix: false, // Keep original filename
      });

      uploadedUrls[file] = blob.url;
      console.log(`✅ Uploaded: ${blob.url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error);
    }
  }

  // Generate updated video paths file
  console.log('\n📝 Generating video URLs file...');
  
  const videoUrlsContent = `// Auto-generated Vercel Blob URLs
// Videos are served via Vercel's global CDN with automatic optimization

export const VIDEO_URLS = ${JSON.stringify(uploadedUrls, null, 2)};

// Helper to get video URL by filename
export function getVideoUrl(filename: string): string {
  return VIDEO_URLS[filename] || \`/vids/\${filename}\`;
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
  console.log(`   Optimization: Automatic`);
  console.log('\n💡 Next steps:');
  console.log('   1. Update your components to use the new URLs');
  console.log('   2. Deploy to Vercel');
  console.log('   3. Videos will load from CDN edge locations');
}

uploadVideos().catch(console.error);
