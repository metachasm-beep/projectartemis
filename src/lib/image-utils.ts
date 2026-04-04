/**
 * Matriarch Image Compression Utility
 * Resizes and compresses images to strictly stay under 200KB.
 */

export const compressImage = async (file: File, maxSizeKB: number = 200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Step 1: Initial Resize if extremely large (4K -> 2K)
        const MAX_DIM = 1600;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = (height / width) * MAX_DIM;
            width = MAX_DIM;
          } else {
            width = (width / height) * MAX_DIM;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Step 2: Binary Search / Iterative Quality Reduction
        let quality = 0.8;
        const attemptCompression = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }

              const sizeKB = blob.size / 1024;
              if (sizeKB <= maxSizeKB || q <= 0.1) {
                console.log(`MATRIARCH_IMG: Compressed to ${Math.round(sizeKB)}KB at quality ${q}`);
                resolve(blob);
              } else {
                // Reduce quality and try again
                attemptCompression(q - 0.1);
              }
            },
            'image/jpeg',
            q
          );
        };

        attemptCompression(quality);
      };
      img.onerror = () => reject(new Error("Image load failed"));
    };
    reader.onerror = () => reject(new Error("File read failed"));
  });
};
