const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST new category
router.post('/', async (req, res) => {
  try {
    const { label, emoji, img, bg, sub } = req.body;
    
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/categories');

    const category = await prisma.category.create({
      data: {
        label,
        emoji: emoji || '',
        img: uploadedImg || '',
        bg: bg || '#F3F4F6',
        sub: sub || ''
      }
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, emoji, img, bg, sub } = req.body;

    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/categories');

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        label,
        emoji: emoji || '',
        ...(uploadedImg && { img: uploadedImg }),
        bg: bg || '#F3F4F6',
        sub: sub || ''
      }
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
