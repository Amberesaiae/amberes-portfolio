import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const inputDir = './public/images';
const outputDir = './public/images/optimized';

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generateModernFormats(inputPath, filename) {
  const ext = extname(filename);
  const baseName = basename(filename, ext);
  
  console.log(`Processing: ${filename}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`  Original: ${(statSync(inputPath).size / 1024 / 1024).toFixed(2)}MB (${metadata.width}x${metadata.height})`);
    
    // Generate WebP (85% quality, good balance)
    const webpPath = join(outputDir, `${baseName}.webp`);
    await image
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    const webpSize = statSync(webpPath).size;
    console.log(`  ✓ WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB (${((1 - webpSize / statSync(inputPath).size) * 100).toFixed(0)}% smaller)`);
    
    // Generate AVIF (75% quality, best compression)
    const avifPath = join(outputDir, `${baseName}.avif`);
    await image
      .avif({ quality: 75, effort: 6 })
      .toFile(avifPath);
    const avifSize = statSync(avifPath).size;
    console.log(`  ✓ AVIF: ${(avifSize / 1024 / 1024).toFixed(2)}MB (${((1 - avifSize / statSync(inputPath).size) * 100).toFixed(0)}% smaller)`);
    
    // Copy original to optimized folder for fallback
    const originalPath = join(outputDir, filename);
    await image.toFile(originalPath);
    console.log(`  ✓ Original copied for fallback`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
  }
  
  console.log('');
}

async function main() {
  console.log('🖼️  Generating modern image formats (WebP & AVIF)...\n');
  console.log('Input directory:', inputDir);
  console.log('Output directory:', outputDir);
  console.log('');
  
  const files = readdirSync(inputDir);
  const imageFiles = files.filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} images to process\n`);
  
  let totalOriginalSize = 0;
  let totalWebPSize = 0;
  let totalAVIFSize = 0;
  
  for (const file of imageFiles) {
    const inputPath = join(inputDir, file);
    const stats = statSync(inputPath);
    
    // Only process files larger than 100KB
    if (stats.size > 100 * 1024) {
      totalOriginalSize += stats.size;
      await generateModernFormats(inputPath, file);
      
      const baseName = basename(file, extname(file));
      const webpPath = join(outputDir, `${baseName}.webp`);
      const avifPath = join(outputDir, `${baseName}.avif`);
      
      if (existsSync(webpPath)) totalWebPSize += statSync(webpPath).size;
      if (existsSync(avifPath)) totalAVIFSize += statSync(avifPath).size;
    } else {
      console.log(`Skipping ${file} (too small: ${(stats.size / 1024).toFixed(0)}KB)`);
    }
  }
  
  console.log('═'.repeat(60));
  console.log('📊 Summary:');
  console.log('═'.repeat(60));
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total WebP size:     ${(totalWebPSize / 1024 / 1024).toFixed(2)}MB (${((1 - totalWebPSize / totalOriginalSize) * 100).toFixed(0)}% reduction)`);
  console.log(`Total AVIF size:     ${(totalAVIFSize / 1024 / 1024).toFixed(2)}MB (${((1 - totalAVIFSize / totalOriginalSize) * 100).toFixed(0)}% reduction)`);
  console.log('');
  console.log('✅ All images processed successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Update components to use <picture> element');
  console.log('2. Serve AVIF to modern browsers, WebP as fallback, PNG/JPG as final fallback');
}

main().catch(console.error);
