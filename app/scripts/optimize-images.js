/**
 * Image Optimization Script
 * 
 * This script converts all images in the public/images directory to:
 * - WebP format (good compression, wide browser support)
 * - AVIF format (best compression, modern browsers)
 * - Multiple sizes for responsive images (320w, 640w, 768w, 1024w, 1280w, 1920w)
 * 
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/optimize-images.js
 * 
 * Requirements:
 *   - sharp (npm package for image processing)
 *   - Node.js 14+
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');
const WIDTHS = [320, 640, 768, 1024, 1280, 1920];
const FORMATS = ['webp', 'avif', 'jpeg'];
const QUALITY = {
  webp: 85,
  avif: 80,
  jpeg: 85,
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Get all image files from a directory recursively
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  const relativePath = path.relative(INPUT_DIR, inputPath);
  const parsedPath = path.parse(relativePath);
  const baseName = parsedPath.name;
  const outputSubDir = path.join(OUTPUT_DIR, parsedPath.dir);
  
  // Ensure output subdirectory exists
  if (!fs.existsSync(outputSubDir)) {
    fs.mkdirSync(outputSubDir, { recursive: true });
  }
  
  console.log(`Processing: ${relativePath}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Process each width
    for (const width of WIDTHS) {
      // Skip if image is smaller than target width
      if (metadata.width && metadata.width < width) {
        console.log(`  Skipping ${width}w (original is ${metadata.width}w)`);
        continue;
      }
      
      // Process each format
      for (const format of FORMATS) {
        const outputPath = path.join(
          outputSubDir,
          `${baseName}-${width}.${format}`
        );
        
        await image
          .clone()
          .resize(width, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFormat(format, { quality: QUALITY[format] })
          .toFile(outputPath);
        
        const stats = fs.statSync(outputPath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`  ✓ ${width}w ${format.toUpperCase()} (${sizeMB}MB)`);
      }
    }
    
    console.log(`  ✓ Completed: ${relativePath}\n`);
  } catch (error) {
    console.error(`  ✗ Error processing ${relativePath}:`, error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log(`Input directory: ${INPUT_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Widths: ${WIDTHS.join(', ')}`);
  console.log(`Formats: ${FORMATS.join(', ')}\n`);
  
  const imageFiles = getImageFiles(INPUT_DIR);
  console.log(`Found ${imageFiles.length} images to process\n`);
  
  if (imageFiles.length === 0) {
    console.log('No images found. Exiting.');
    return;
  }
  
  const startTime = Date.now();
  
  // Process images sequentially to avoid memory issues
  for (const imagePath of imageFiles) {
    await optimizeImage(imagePath);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n✅ Optimization complete!`);
  console.log(`   Processed ${imageFiles.length} images in ${duration}s`);
  console.log(`   Output: ${OUTPUT_DIR}`);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
