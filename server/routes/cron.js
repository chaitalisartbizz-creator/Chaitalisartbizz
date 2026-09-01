const express = require('express');
const router = express.Router();

router.all('/', async (req, res) => {
  try {
    // 1. Verify the Cron Secret
    const authHeader = req.headers.authorization || req.headers.Authorization || req.headers.get?.('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.warn("Unauthorized Cron Attempt");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log("Cron job triggered successfully at", new Date().toISOString());
    
    // TODO: Add logic here (e.g., refreshing Flash Deals, cleaning up old carts, etc.)
    
    return res.status(200).json({ success: true, message: 'Cron job executed successfully!' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return res.status(500).json({ error: 'Internal server error during cron job' });
  }
});

module.exports = router;
