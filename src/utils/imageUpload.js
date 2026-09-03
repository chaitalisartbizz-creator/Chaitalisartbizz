import axios from 'axios';

/**
 * Uploads a media file (image or video) to the backend server, 
 * which in turn uploads it to Cloudinary and returns the secure URL.
 * Bypasses multer by sending as a base64 JSON string.
 */
export const handleImageUpload = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64File = reader.result;
        
        const response = await axios.post('/api/upload', { file: base64File }, {
          headers: {
            'Content-Type': 'application/json',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              // Max out at 99% until the server actually responds with the Cloudinary URL
              onProgress(percentCompleted === 100 ? 99 : percentCompleted);
            }
          }
        });

        if (response.data && response.data.url) {
          if (onProgress) onProgress(100);
          resolve(response.data.url);
        } else {
          reject('Upload failed, no URL returned');
        }
      } catch (error) {
        console.error('Upload Error:', error);
        reject(error.response?.data?.error || 'Failed to upload media');
      }
    };
    reader.onerror = (error) => {
      reject('Error reading file: ' + error);
    };
  });
};
