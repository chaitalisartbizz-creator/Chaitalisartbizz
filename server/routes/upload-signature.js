const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/', (req, res) => {
  try {
    const timestamp = Math.round((new Date).getTime()/1000);
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'artbizz_media'
    };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    res.json({
      timestamp,
      signature,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    console.error('Signature Error:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

module.exports = router;
