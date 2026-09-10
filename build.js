const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filesToCopy = ['index.html', 'styles.css', 'app.js', 'Anireekshithaa_Clickable_Invitation.pdf', 'merged_poster_with_qr.png'];
for (const file of filesToCopy) {
  const srcPath = path.join(__dirname, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(publicDir, file));
  }
}

const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const assetsDir = path.join(__dirname, 'assets');
if (fs.existsSync(assetsDir)) {
  copyDir(assetsDir, path.join(publicDir, 'assets'));
}

console.log('Build completed successfully.');
