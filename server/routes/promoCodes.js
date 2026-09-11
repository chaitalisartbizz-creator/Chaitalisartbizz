const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all promo codes
router.get('/', async (req, res) => {
  try {
    const promoCodes = await prisma.promoCode.findMany();
    res.json(promoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

// POST new promo code
router.post('/', async (req, res) => {
  try {
    const { title, sub, expiry, color1, color2, emoji, code } = req.body;
    
    const promoCode = await prisma.promoCode.create({
      data: {
        title: title || '',
        sub: sub || '',
        expiry: expiry || '',
        color1: color1 || '#2C2C2C',
        color2: color2 || '#C9A84C',
        emoji: emoji || '🎉',
        code: code || ''
      }
    });
    
    res.status(201).json(promoCode);
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

// PUT update promo code
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sub, expiry, color1, color2, emoji, code } = req.body;
    
    const promoCode = await prisma.promoCode.update({
      where: { id: Number(id) },
      data: {
        title: title || '',
        sub: sub || '',
        expiry: expiry || '',
        color1: color1 || '#2C2C2C',
        color2: color2 || '#C9A84C',
        emoji: emoji || '🎉',
        code: code || ''
      }
    });
    
    res.json(promoCode);
  } catch (error) {
    console.error('Error updating promo code:', error);
    res.status(500).json({ error: 'Failed to update promo code' });
  }
});

// DELETE promo code
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promoCode.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    res.status(500).json({ error: 'Failed to delete promo code' });
  }
});

module.exports = router;
