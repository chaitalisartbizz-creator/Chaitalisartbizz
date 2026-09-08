const axios = require('axios');
const fs = require('fs');

async function testUpload() {
  try {
    // 1. Get signature locally
    // Note: server is not running locally via Vercel, I'll just use the backend directly.
    const cloudinary = require('cloudinary').v2;
    require('dotenv').config();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const timestamp = Math.round((new Date).getTime()/1000);
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'artbizz_media'
    };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    console.log('Signature generated:', signature);

    // Create a dummy video file
    fs.writeFileSync('dummy.mp4', Buffer.alloc(100 * 1024)); // 100kb empty video (probably invalid but tests network)

    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.mp4'));
    form.append('api_key', process.env.CLOUDINARY_API_KEY);
    form.append('timestamp', timestamp);
    form.append('signature', signature);
    form.append('folder', 'artbizz_media');

    const uploadUrl = \https://api.cloudinary.com/v1_1/\/auto/upload\;

    const res = await axios.post(uploadUrl, form, {
      headers: form.getHeaders()
    });

    console.log('Upload success:', res.data.secure_url);
  } catch(e) {
    console.error('Upload failed:', e.response ? e.response.data : e.message);
  }
}
testUpload();
