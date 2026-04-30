import { list } from '@vercel/blob';

/**
 * Verify that Vercel Blob store is PUBLIC
 * Run this after creating a new public Blob store
 */

async function verifyBlobPublic() {
  console.log('🔍 Verifying Vercel Blob configuration...\n');

  try {
    // Test connection
    const { blobs } = await list();
    
    console.log('✅ Successfully connected to Vercel Blob\n');

    // Check if store is public or private
    if (blobs.length > 0) {
      const firstBlob = blobs[0];
      const isPublic = firstBlob.url.includes('.public.blob');
      const isPrivate = firstBlob.url.includes('.private.blob');

      console.log('📊 Store Information:');
      console.log(`   Total files: ${blobs.length}`);
      console.log(`   Sample URL: ${firstBlob.url}\n`);

      if (isPublic) {
        console.log('✅ ✅ ✅ STORE IS PUBLIC! ✅ ✅ ✅');
        console.log('   Videos will be accessible without authentication\n');
        
        console.log('📝 Next steps:');
        console.log('   1. Edit app/src/lib/video-urls.ts');
        console.log('   2. Change: const USE_CDN = false;');
        console.log('   3. To:     const USE_CDN = true;');
        console.log('   4. Commit and push to deploy\n');
        
        return true;
      } else if (isPrivate) {
        console.log('❌ ❌ ❌ STORE IS PRIVATE! ❌ ❌ ❌');
        console.log('   Videos will NOT be accessible on public website\n');
        
        console.log('🔧 How to fix:');
        console.log('   1. Go to: https://vercel.com/dashboard');
        console.log('   2. Navigate to: amberes-portfolio → Stores');
        console.log('   3. Create NEW Blob store with PUBLIC access');
        console.log('   4. Update BLOB_READ_WRITE_TOKEN in .env.local');
        console.log('   5. Run: bun run upload-videos\n');
        
        return false;
      }
    } else {
      console.log('📭 No files in Blob storage yet');
      console.log('   Run: bun run upload-videos\n');
      return true;
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('No token found')) {
      console.log('\n💡 Fix:');
      console.log('   1. Make sure BLOB_READ_WRITE_TOKEN is in app/.env.local');
      console.log('   2. Get token from: https://vercel.com/dashboard');
      console.log('   3. Navigate to: amberes-portfolio → Stores → Your Blob Store\n');
    }
    
    return false;
  }
}

verifyBlobPublic()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
