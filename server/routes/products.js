const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    const parsedProducts = products.map(p => ({
        ...p,
        images: p.images ? (() => { try { return JSON.parse(p.images); } catch { return []; } })() : [],
        subcategories: p.subcategories ? (() => { try { return JSON.parse(p.subcategories); } catch { return p.brand ? [p.brand] : []; } })() : (p.brand ? [p.brand] : []),
    }));
    res.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const {
      name, brand, subcategories, price, mrp, rating, reviews,
      img, images, tag, badge, category, petType,
      description, features, customization, quality,
      tab1Name, tab2Name, tab3Name, variants
    } = req.body;

    // Normalise subcategories → JSON string stored in DB
    const subsArray = Array.isArray(subcategories)
      ? subcategories
      : (typeof subcategories === 'string' && subcategories.startsWith('[')
          ? (() => { try { return JSON.parse(subcategories); } catch { return []; } })()
          : (brand ? [brand] : []));
    const subsJson = JSON.stringify(subsArray);
    // Primary brand = first selected subcategory (for backward compat)
    const primaryBrand = subsArray[0] || brand || '';

    // Upload main image to Cloudinary if it's base64
    const uploadedImg = await uploadToCloudinary(img, 'artbizz_media/products');

    // Upload additional images
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
        for (const image of images) {
            const up = await uploadToCloudinary(image, 'artbizz_media/products');
            if (up) uploadedImages.push(up);
        }
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand: primaryBrand,
        subcategories: subsJson,
        price: Number(price),
        mrp: Number(mrp),
        rating: Number(rating) || 4.5,
        reviews: Number(reviews) || 0,
        img: uploadedImg || '',
        images: JSON.stringify(uploadedImages),
        tag,
        badge,
        category: category || '',
        petType: petType || 'Resin Art',
        description,
        features,
        customization,
        quality,
        tab1Name,
        tab2Name,
        tab3Name,
        variants
      }
    });

    res.status(201).json({
      ...product,
      images: uploadedImages,
      subcategories: subsArray,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, brand, subcategories, price, mrp, rating, reviews,
      img, images, tag, badge, category, petType,
      description, features, customization, quality,
      tab1Name, tab2Name, tab3Name, variants
    } = req.body;

    // Normalise subcategories
    const subsArray = Array.isArray(subcategories)
      ? subcategories
      : (typeof subcategories === 'string' && subcategories.startsWith('[')
          ? (() => { try { return JSON.parse(subcategories); } catch { return []; } })()
          : (brand ? [brand] : []));
    const subsJson = JSON.stringify(subsArray);
    const primaryBrand = subsArray[0] || brand || '';

    // Upload main image if it's base64 (newly uploaded)
    const uploadedImg = await uploadToCloudinary(img, 'artbizz_media/products');

    // Upload additional images if any are base64
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
        for (const image of images) {
            const up = await uploadToCloudinary(image, 'artbizz_media/products');
            if (up) uploadedImages.push(up);
        }
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        brand: primaryBrand,
        subcategories: subsJson,
        price: Number(price),
        mrp: Number(mrp),
        rating: Number(rating) || 4.5,
        reviews: Number(reviews) || 0,
        img: uploadedImg || '',
        images: JSON.stringify(uploadedImages),
        tag,
        badge,
        category: category || '',
        petType: petType || 'Resin Art',
        description,
        features,
        customization,
        quality,
        tab1Name,
        tab2Name,
        tab3Name,
        variants
      }
    });

    res.json({
      ...product,
      images: uploadedImages,
      subcategories: subsArray,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
