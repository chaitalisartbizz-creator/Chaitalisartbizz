const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  try {
    const slides = await prisma.slide.findMany();
    const categories = await prisma.category.findMany();
    const deals = await prisma.deal.findMany();
    const productsRaw = await prisma.product.findMany();
    const products = productsRaw.map(p => {
      let parsedImages = [];
      try { parsedImages = p.images ? JSON.parse(p.images) : []; } catch(e) {}
      let parsedFeatures = [];
      try { parsedFeatures = p.features ? JSON.parse(p.features) : []; } catch(e) {}
      
      return {
        ...p,
        images: parsedImages,
        features: parsedFeatures,
        img: parsedImages.length > 0 ? parsedImages[0] : null
      };
    });

    const settings = await prisma.frontendSetting.findFirst();
    const banners = await prisma.banner.findMany();

    res.json({
      slides,
      banners,
      categories,
      deals,
      products,
      frontendSettings: settings
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data', 
      details: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
