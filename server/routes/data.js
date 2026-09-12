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
      let parsedFeatures = p.features;
      try { 
        if (p.features && p.features.startsWith('[')) {
          parsedFeatures = JSON.parse(p.features); 
        }
      } catch(e) {}
      let parsedSubcategories = [];
      try {
        if (p.subcategories && p.subcategories.startsWith('[')) {
          parsedSubcategories = JSON.parse(p.subcategories);
        } else if (p.brand) {
          parsedSubcategories = [p.brand]; // legacy fallback
        }
      } catch(e) { parsedSubcategories = p.brand ? [p.brand] : []; }

      return {
        ...p,
        images: parsedImages,
        features: parsedFeatures,
        subcategories: parsedSubcategories,
        img: p.img || (parsedImages.length > 0 ? parsedImages[0] : null)
      };
    });

    const settings = await prisma.frontendSetting.findFirst();
    const banners = await prisma.banner.findMany();
    const instagramFeeds = await prisma.instagramFeed.findMany({ orderBy: { createdAt: 'desc' } });
    let promoCodes = [];
    try { promoCodes = await prisma.promoCode.findMany(); } catch(e) { /* table may not exist in prod yet */ }

    res.json({
      slides,
      banners,
      categories,
      deals,
      products,
      frontendSettings: settings,
      instagramFeeds,
      promoCodes
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
