import sharp from 'sharp';
import { statSync } from 'fs';

async function compressImage(inputPath, outputPath) {
  const originalSize = statSync(inputPath).size;
  console.log(`Compressing: ${inputPath}`);
  console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
  
  await sharp(inputPath)
    .png({
      quality: 90,
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: false
    })
    .toFile(outputPath);
  
  const newSize = statSync(outputPath).size;
  console.log(`  Compressed: ${(newSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  Savings: ${((1 - newSize / originalSize) * 100).toFixed(0)}%`);
  console.log('');
}

async function main() {
  console.log('Compressing Scoutbridge images...\n');
  
  await compressImage(
    './public/images/project-scoutbridge-1-backup.png',
    './public/images/project-scoutbridge-1.png'
  );
  
  await compressImage(
    './public/images/project-scoutbridge-2-backup.png',
    './public/images/project-scoutbridge-2.png'
  );
  
  console.log('✅ Done! Images compressed in place.');
}

main();
