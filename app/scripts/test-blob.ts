import { list } from '@vercel/blob';

/**
 * Test Vercel Blob connection and list stored files
 */

async function testBlob() {
  console.log('🔍 Testing Vercel Blob connection...\n');

  try {
    const { blobs } = await list();
    
    console.log(`✅ Connected to Vercel Blob!`);
    console.log(`📦 Total files: ${blobs.length}\n`);

    if (blobs.length > 0) {
      console.log('📋 Stored files:');
      blobs.forEach((blob, index) => {
        const sizeMB = (blob.size / 1048576).toFixed(2);
        console.log(`  ${index + 1}. ${blob.pathname}`);
        console.log(`     URL: ${blob.url}`);
        console.log(`     Size: ${sizeMB}MB`);
        console.log(`     Uploaded: ${new Date(blob.uploadedAt).toLocaleString()}\n`);
      });
    } else {
      console.log('📭 No files found in Blob storage');
    }

    // Check if store is public or private
    const firstBlob = blobs[0];
    if (firstBlob) {
      const isPrivate = firstBlob.url.includes('.private.blob');
      console.log(`🔒 Store type: ${isPrivate ? 'PRIVATE' : 'PUBLIC'}`);
      
      if (isPrivate) {
        console.log('\n⚠️  WARNING: Store is PRIVATE');
        console.log('   Videos will require authentication to access');
        console.log('   See VERCEL_BLOB_SETUP.md for instructions to create a public store\n');
      }
    }

  } catch (error) {
    console.error('❌ Error connecting to Vercel Blob:', error);
    console.log('\n💡 Make sure BLOB_READ_WRITE_TOKEN is set in .env.local');
  }
}

testBlob().catch(console.error);
