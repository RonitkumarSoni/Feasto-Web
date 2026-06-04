import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

async function processImage() {
  const img = await loadImage('public/logo.png');
  
  // We want to make it big and high quality. Let's make the canvas 1024x1024
  const targetSize = 1024;
  const canvas = createCanvas(targetSize, targetSize);
  const ctx = canvas.getContext('2d');
  
  // Draw the image on the canvas scaled up
  ctx.drawImage(img, 0, 0, targetSize, targetSize);
  
  const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // If pixel is very close to white, make it transparent
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0;
    } else if (r > 220 && g > 220 && b > 220) {
      // soften the edges for anti-aliasing
      data[i + 3] = 128;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('public/logo.png', buffer);
  console.log('Background removed and image resized successfully.');
}

processImage().catch(console.error);
