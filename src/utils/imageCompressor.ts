/**
 * Utility to compress and optimize images client-side before uploading to Firestore.
 * Ensures fast loading on all devices and keeps document sizes safely under Firestore 1MB limits.
 */
export interface CompressedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
}

export async function compressImageFile(
  file: File,
  maxDimension: number = 1600,
  quality: number = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scale
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data url if canvas context unavailable
          const rawUrl = event.target?.result as string;
          resolve({
            dataUrl: rawUrl,
            originalSize: file.size,
            compressedSize: file.size,
            width: img.width,
            height: img.height,
            format: file.type || 'image/jpeg',
          });
          return;
        }

        // Image smoothing for high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, fallback to JPEG
        const outputFormat = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputFormat, quality);

        // Calculate approximate size in bytes from base64
        const stringLength = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const compressedSize = Math.round(stringLength * (3 / 4));

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize,
          width,
          height,
          format: outputFormat,
        });
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
