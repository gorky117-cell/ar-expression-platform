const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds.svg');
const pngPath = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds-target.png');

sharp(svgPath)
  .resize(1000, 1000, { fit: 'contain', background: { r: 18, g: 18, b: 24, alpha: 1 } })
  .png()
  .toFile(pngPath)
  .then(() => console.log('Pure target PNG saved to:', pngPath))
  .catch(err => console.error('Error:', err));
