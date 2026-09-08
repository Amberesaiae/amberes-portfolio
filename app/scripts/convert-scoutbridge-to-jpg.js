import sharp from 'sharp';
import { statSync } from 'fs';

async function convertToJPG(inputPath, outputPath) {
  const originalSize = statSync(inputPath).size;
  console.log(`Converting: ${inputPath}`);
  console.log(`  Original PNG: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
  
  await sharp(inputPath)
    .jpeg({
      quality: 90,
      mozjpeg: true
    })
    .toFile(outputPath);
  
  const newSize = statSync(outputPath).size;
  console.log(`  New JPG: ${(newSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  Savings: ${((1 - newSize / originalSize) * 100).toFixed(0)}%`);
  console.log('');
}

async function main() {
  console.log('Converting Scoutbridge images to JPG...\n');
  
  await convertToJPG(
    './public/images/project-scoutbridge-1-backup.png',
    './public/images/project-scoutbridge-1.jpg'
  );
  
  await convertToJPG(
    './public/images/project-scoutbridge-2-backup.png',
    './public/images/project-scoutbridge-2.jpg'
  );
  
  console.log('✅ Done! JPG versions created.');
  console.log('Update projects.ts to use .jpg extension');
}

main();
