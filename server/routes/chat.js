const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Get all chat sessions (Admin)
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get messages for a session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: req.params.sessionId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Post a new message
router.post('/message', async (req, res) => {
  try {
    const { visitorId, text, sender, sessionId } = req.body;
    
    let activeSessionId = sessionId;

    // Create session if it doesn't exist
    if (!activeSessionId) {
      // Find latest session for this visitor today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let existingSession = await prisma.chatSession.findFirst({
        where: {
          visitorId,
          createdAt: { gte: today }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (existingSession) {
        activeSessionId = existingSession.id;
      } else {
        const newSession = await prisma.chatSession.create({
          data: { visitorId }
        });
        activeSessionId = newSession.id;
      }
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        sender,
        text
      }
    });

    // Update session updatedAt
    await prisma.chatSession.update({
      where: { id: activeSessionId },
      data: { updatedAt: new Date() }
    });

    res.json({ message, sessionId: activeSessionId });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
