import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public', 'images');
const sourceDir = join(__dirname, '..', 'pics');

async function enhanceImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: false,
        kernel: 'lanczos3'
      })
      .sharpen({
        sigma: 1.5,
        m1: 1.0,
        m2: 0.5,
        x1: 2,
        y2: 10,
        y3: 20
      })
      .modulate({
        brightness: 1.05,  // Slightly brighter
        saturation: 1.1,   // More saturated colors
        hue: 0
      })
      .linear(1.15, -(128 * 0.15))  // Increase contrast
      .png({
        quality: 100,
        compressionLevel: 6,
        adaptiveFiltering: true,
        palette: false
      })
      .toFile(outputPath);
    
    console.log(`✓ Enhanced: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error enhancing ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('Enhancing Scoutbridge images...\n');

  // Enhance both scoutbridge images
  await enhanceImage(
    join(sourceDir, 'scoutbridge1.png'),
    join(publicDir, 'project-scoutbridge-1.png')
  );
  
  await enhanceImage(
    join(sourceDir, 'scoutbridge2.png'),
    join(publicDir, 'project-scoutbridge-2.png')
  );

  console.log('\n✓ All images enhanced successfully!');
}

main();
