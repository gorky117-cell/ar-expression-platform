import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const overlaysDir = path.join(rootDir, 'public', 'overlays');
const outputNftDir = path.join(rootDir, 'public', 'data', 'nft');

if (!fs.existsSync(outputNftDir)) {
  fs.mkdirSync(outputNftDir, { recursive: true });
}

const templates = [
  { name: 'tree-birds', file: 'tree-birds.svg' },
  { name: 'happy', file: 'happy.svg' },
  { name: 'playful', file: 'playful.svg' },
  { name: 'inspired', file: 'inspired.svg' },
  { name: 'peaceful', file: 'peaceful.svg' }
];

async function run() {
  for (const t of templates) {
    const svgPath = path.join(overlaysDir, t.file);
    const pngPath = path.join(overlaysDir, `${t.name}.png`);
    
    console.log(`\n--- Converting ${t.file} to high-res PNG ---`);
    // Convert SVG to high-res PNG (1000px width/height) with white background for AR.js tracking contrast
    await sharp(svgPath)
      .resize(1000, 1000, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(pngPath);
      
    console.log(`--- Generating NFT descriptors for ${t.name} ---`);
    const creatorScript = path.join(rootDir, 'node_modules', '@webarkit', 'nft-marker-creator-app', 'src', 'NFTMarkerCreator.js');
    
    // Run marker creator script
    execSync(`node "${creatorScript}" -i "${pngPath}" -o "${outputNftDir}"`, {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    // Clean up temporary PNG file
    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
    }
  }
  
  console.log('\n[SUCCESS] NFT descriptor files generated successfully for all templates!');
}

run().catch(console.error);
