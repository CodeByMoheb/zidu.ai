export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const addWatermark = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Watermark properties
      const watermarkText = 'zidu.ai';
      const padding = Math.max(10, img.width * 0.02);
      const fontSize = Math.max(12, img.width * 0.02);
      
      ctx.font = `bold ${fontSize}px "Helvetica Neue", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      // Draw a subtle shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw the watermark text
      ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);
      
      // Get the new base64 image
      const watermarkedImage = canvas.toDataURL(base64Image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg');
      resolve(watermarkedImage);
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
};