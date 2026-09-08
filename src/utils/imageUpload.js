import axios from 'axios';

/**
 * Uploads a media file (image or video) directly to Cloudinary using a signature from the backend.
 * This bypasses Vercel's 4.5MB request limit and express.json 10MB limit!
 */
export const handleImageUpload = async (file, onProgress) => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // 1. Get signature from our backend
    const sigRes = await axios.get('/api/upload-signature');
    const { timestamp, signature, cloud_name, api_key } = sigRes.data;

    // 2. Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', 'artbizz_media');

    const uploadUrl = 'https://api.cloudinary.com/v1_1/' + cloud_name + '/auto/upload';

    const response = await axios.post(uploadUrl, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted === 100 ? 99 : percentCompleted);
        }
      }
    });

    if (response.data && response.data.secure_url) {
      if (onProgress) onProgress(100);
      return response.data.secure_url;
    } else {
      throw new Error('Upload failed, no URL returned from Cloudinary');
    }
  } catch (error) {
    console.error('Upload Error:', error);
    throw error.response?.data?.error?.message || error.message || 'Failed to upload media';
  }
};
