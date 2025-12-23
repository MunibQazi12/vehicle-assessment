import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateBlurDataURL(imagePath) {
  try {
    const fullPath = join(__dirname, '..', imagePath);
    const buffer = await sharp(fullPath)
      .resize(10) // Tiny size for blur
      .jpeg({ quality: 50 })
      .toBuffer();
    
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

// Generate blur data URLs for the two hero images
const images = [
  'dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/public/assets/images/image.png',
  'dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/public/assets/images/tonkin-enjoy-hero-25-desktop.webp'
];

console.log('Generating blur placeholders...\n');

for (const imagePath of images) {
  const blurDataURL = await generateBlurDataURL(imagePath);
  if (blurDataURL) {
    console.log(`// ${imagePath.split('/').pop()}`);
    console.log(`const blurDataURL = "${blurDataURL}"\n`);
  }
}
