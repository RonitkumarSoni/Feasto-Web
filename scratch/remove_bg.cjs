const Jimp = require('jimp');

Jimp.read('public/logo.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to white
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // alpha to 0
      } else if (red > 220 && green > 220 && blue > 220) {
        // partial transparency for anti-aliasing edges
        this.bitmap.data[idx + 3] = 128;
      }
    });
    return image.resize(1024, Jimp.AUTO).writeAsync('public/logo.png');
  })
  .then(() => {
    console.log('Processed successfully');
  })
  .catch(err => {
    console.error(err);
  });
