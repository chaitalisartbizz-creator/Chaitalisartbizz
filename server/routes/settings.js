const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET settings (normally fetched via /api/data, but useful directly)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.frontendSetting.findFirst();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings
router.put('/', async (req, res) => {
  try {
    const {
      storeName, tagline, logoChar, footerDescription,
      facebookUrl, instagramUrl, youtubeUrl, whatsappNumber,
      logoBase64, whatsappOrderNumber,
      siteAudioUrl, contactEmail, contactPhone, aboutUsData,
      upiId, upiQrImage
    } = req.body;
    
    // Upload logo to Cloudinary if it's new (base64)
    const uploadedLogo = await uploadToCloudinary(logoBase64, 'prime_pets/settings');
    
    // Upload audio to Cloudinary if it's new (base64)
    let uploadedAudioUrl = siteAudioUrl;
    if (siteAudioUrl && siteAudioUrl.startsWith('data:audio/')) {
      uploadedAudioUrl = await uploadToCloudinary(siteAudioUrl, 'prime_pets/audio');
    }

    let settings = await prisma.frontendSetting.findFirst();

    const data = {
      storeName: storeName !== undefined ? storeName : (settings?.storeName || ''),
      tagline: tagline !== undefined ? tagline : (settings?.tagline || ''),
      logoChar: logoChar !== undefined ? logoChar : (settings?.logoChar || ''),
      footerDescription: footerDescription !== undefined ? footerDescription : (settings?.footerDescription || ''),
      facebookUrl: facebookUrl !== undefined ? facebookUrl : (settings?.facebookUrl || ''),
      instagramUrl: instagramUrl !== undefined ? instagramUrl : (settings?.instagramUrl || ''),
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : (settings?.youtubeUrl || ''),
      whatsappNumber: whatsappNumber !== undefined ? whatsappNumber : (settings?.whatsappNumber || ''),
      whatsappOrderNumber: whatsappOrderNumber !== undefined ? whatsappOrderNumber : (settings ? settings.whatsappOrderNumber : null),
      siteAudioUrl: uploadedAudioUrl !== undefined ? uploadedAudioUrl : (settings ? settings.siteAudioUrl : null),
      contactEmail: contactEmail !== undefined ? contactEmail : (settings ? settings.contactEmail : null),
      contactPhone: contactPhone !== undefined ? contactPhone : (settings ? settings.contactPhone : null),
      aboutUsData: aboutUsData !== undefined ? aboutUsData : (settings ? settings.aboutUsData : null),
      upiId: upiId !== undefined ? upiId : (settings ? settings.upiId : null),
      upiQrImage: upiQrImage !== undefined ? upiQrImage : (settings ? settings.upiQrImage : null),
    };

    if (settings) {
      data.logoBase64 = uploadedLogo || settings.logoBase64;
      settings = await prisma.frontendSetting.update({
        where: { id: settings.id },
        data
      });
    } else {
      data.logoBase64 = uploadedLogo || '';
      settings = await prisma.frontendSetting.create({ data });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
