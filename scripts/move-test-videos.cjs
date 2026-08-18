const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\7ad69edb-74a5-45e0-9cf8-6a7c193fb4ea';
const destDir = 'D:\\ar-expression-platform\\scratch\\test-recordings';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp') || f.endsWith('.mp4'));
  let totalBytes = 0;
  let movedCount = 0;

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    try {
      const stat = fs.statSync(srcPath);
      totalBytes += stat.size;
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath); // remove from C: drive
      movedCount++;
    } catch (err) {
      console.error('Error moving file:', file, err.message);
    }
  }

  const mb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`SUCCESS: Moved ${movedCount} test video files (${mb} MB) from C: drive to D:\\ar-expression-platform\\scratch\\test-recordings!`);
} else {
  console.log('Source directory not found.');
}
