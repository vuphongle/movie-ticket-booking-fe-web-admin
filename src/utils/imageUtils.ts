/**
 * Utility functions for image processing
 */

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compress and resize image if it exceeds the maximum file size
 */
export const compressImage = (file: File, maxSize: number = MAX_FILE_SIZE, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    // If file is already smaller than max size, return as is
    if (file.size <= maxSize) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not supported'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      const { width, height } = img;
      
      // Start with original dimensions and reduce if needed
      let newWidth = width;
      let newHeight = height;
      
      // Calculate scale factor based on file size
      const compressionRatio = Math.sqrt(maxSize / file.size);
      newWidth = Math.floor(width * compressionRatio);
      newHeight = Math.floor(height * compressionRatio);

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Try different quality levels if needed
      const currentQuality = quality;
      
      const tryCompress = (q: number): void => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // If still too large and quality can be reduced further
          if (blob.size > maxSize && q > 0.1) {
            tryCompress(q - 0.1);
            return;
          }

          // Create new file from compressed blob
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        }, file.type, q);
      };

      tryCompress(currentQuality);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check if file is an image
  if (!isImageFile(file)) {
    return {
      valid: false,
      error: 'Please select an image file (JPG, PNG, GIF, etc.)',
    };
  }

  // Check file size (we'll compress it, but let's set a reasonable upper limit)
  const maxAllowedSize = 50 * 1024 * 1024; // 50MB upper limit
  if (file.size > maxAllowedSize) {
    return {
      valid: false,
      error: 'File is too large. Maximum size allowed is 50MB.',
    };
  }

  return { valid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};