const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '../../public/images/heros');
const destination = path.resolve(__dirname, '../../public/images/heros/optimized');

console.log('Target directory:', target);
console.log('Destination directory:', destination);

// Cek apakah direktori ada
if (!fs.existsSync(target)) {
  console.error('Target directory does not exist');
  process.exit(1);
}

// List semua file
const files = fs.readdirSync(target);
console.log('Files in target directory:', files);

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

files.forEach((image) => {
  try {
    console.log(`Processing image: ${image}`);

    // Dapatkan informasi file
    const fullPath = path.join(target, image);

    // Cek apakah file dapat dibaca
    const stats = fs.statSync(fullPath);
    console.log(`File size: ${stats.size} bytes`);

    // Proses gambar
    sharp(fullPath)
      .metadata()
      .then((metadata) => {
        console.log('Image metadata:', metadata);

        return sharp(fullPath)
          .resize(800)
          .toFormat('jpeg')
          .toFile(path.resolve(
            destination,
            `${path.basename(image, path.extname(image))}-large.jpg`
          ));
      })
      .then(() => {
        return sharp(fullPath)
          .resize(480)
          .toFormat('jpeg')
          .toFile(path.resolve(
            destination,
            `${path.basename(image, path.extname(image))}-small.jpg`
          ));
      })
      .then(() => {
        console.log(`Successfully processed ${image}`);
      })
      .catch((err) => {
        console.error(`Error processing ${image}:`, err);
      });
  } catch (err) {
    console.error(`Unexpected error with ${image}:`, err);
  }
});