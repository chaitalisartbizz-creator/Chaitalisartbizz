const express = require('express');
const router = express.Router();
const prisma = require('../db');
const UAParser = require('ua-parser-js');
const { adminMessaging } = require('../firebaseAdmin');

// POST /api/analytics/track
// Track a page view or an interaction
router.post('/track', async (req, res) => {
  try {
    const { type, visitorId, page, action, details, fcmToken } = req.body;
    
    // Basic IP and UserAgent capturing
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    // Parse UA
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browser = result.browser.name || 'Unknown Browser';
    const os = result.os.name || 'Unknown OS';
    let device = result.device.type ? result.device.type : 'Desktop';
    if (result.device.vendor) device = `${result.device.vendor} ${result.device.model || device}`;

    // Upsert visitor if we have visitorId
    if (visitorId && visitorId !== 'anonymous') {
      await prisma.visitor.upsert({
        where: { visitorId },
        update: {
          ip: ip?.toString() || '',
          browser,
          os,
          device,
          ...(fcmToken ? { fcmToken } : {})
          // do NOT overwrite name and phone if already present
        },
        create: {
          visitorId,
          ip: ip?.toString() || '',
          browser,
          os,
          device,
          ...(fcmToken ? { fcmToken } : {})
        }
      }).catch(e => console.error("Error upserting visitor:", e.message));
    }

    if (type === 'pageview') {
      await prisma.siteVisit.create({
        data: {
          visitorId: visitorId || 'anonymous',
          page: page || 'Unknown'
        }
      });
    } else if (type === 'interaction') {
      await prisma.activityLog.create({
        data: {
          action: action || 'Unknown Action',
          details: details || '',
          ip: ip?.toString() || '',
          userAgent: userAgent
        }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    res.status(500).json({ error: "Failed to track analytics" });
  }
});

// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    const { range } = req.query; // '7d', '1m', or 'custom'
    const now = new Date();
    let startDate = new Date();

    if (range === '1m') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'custom') {
      const { start, end } = req.query;
      if (start && end) {
        startDate = new Date(start);
        now.setTime(new Date(end).getTime());
      } else {
        startDate.setDate(now.getDate() - 7);
      }
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const visits = await prisma.siteVisit.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      }
    });

    const interactions = await prisma.activityLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: now
        }
      }
    });
    
    const aggregated = {};
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      let dateKey;
      if (range === '7d' || !range) {
        dateKey = d.toLocaleDateString('en-US', { weekday: 'short' }); 
      } else {
        dateKey = d.toISOString().split('T')[0]; 
      }
      
      const exactDate = d.toISOString().split('T')[0];
      aggregated[exactDate] = { 
        name: dateKey, 
        exactDate,
        visits: 0, 
        interactions: 0 
      };
    }

    visits.forEach(v => {
      const d = v.createdAt.toISOString().split('T')[0];
      if (aggregated[d]) {
        aggregated[d].visits += 1;
      }
    });

    interactions.forEach(i => {
      const d = i.timestamp.toISOString().split('T')[0];
      if (aggregated[d]) {
        aggregated[d].interactions += 1;
      }
    });

    const chartData = Object.values(aggregated);

    res.json(chartData);
  } catch (error) {
    console.error("Failed to fetch analytics stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /api/analytics/live
router.get('/live', async (req, res) => {
  try {
    const recentVisits = await prisma.siteVisit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const recentLogs = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    const visitorIds = [...new Set(recentVisits.map(v => v.visitorId))];
    let visitorMap = {};
    let siteVisitsMap = {};
    
    if (visitorIds.length > 0) {
      const visitors = await prisma.visitor.findMany({
        where: { visitorId: { in: visitorIds } }
      });
      visitors.forEach(v => visitorMap[v.visitorId] = v);

      const allVisits = await prisma.siteVisit.findMany({
        where: { visitorId: { in: visitorIds } },
        orderBy: { createdAt: 'asc' }
      });
      
      allVisits.forEach(v => {
        if (!siteVisitsMap[v.visitorId]) siteVisitsMap[v.visitorId] = [];
        siteVisitsMap[v.visitorId].push(v);
      });
    }

    let visitorCounter = 1;
    const nameMap = {};

    const combined = [
      ...recentVisits.map(v => {
        let name = "Visitor";
        if (visitorMap[v.visitorId]) {
          const vis = visitorMap[v.visitorId];
          if (vis.name) {
            name = vis.name;
          } else {
            if (!nameMap[v.visitorId]) {
              nameMap[v.visitorId] = `Visitor ${visitorCounter++}`;
            }
            name = nameMap[v.visitorId];
          }
        } else {
          if (!nameMap[v.visitorId]) {
            nameMap[v.visitorId] = `Visitor ${visitorCounter++}`;
          }
          name = nameMap[v.visitorId];
        }

        // Calculate time on screen (first visit vs last visit)
        const visits = siteVisitsMap[v.visitorId] || [];
        let timeOnScreen = 'Just joined';
        let visitedPages = [];
        
        if (visits.length > 1) {
          const first = new Date(visits[0].createdAt);
          const last = new Date(visits[visits.length - 1].createdAt);
          const diffMins = Math.round((last - first) / 60000);
          timeOnScreen = diffMins > 0 ? `${diffMins} min` : '< 1 min';
          visitedPages = [...new Set(visits.map(vx => vx.page))].slice(-3); // last 3 unique pages
        } else if (visits.length === 1) {
          visitedPages = [visits[0].page];
        }
        
        return {
          id: `v_${v.id}`,
          type: 'visit',
          action: 'Page View',
          details: `Visited ${v.page}`,
          timestamp: v.createdAt,
          visitor: visitorMap[v.visitorId] || null,
          displayName: name,
          timeOnScreen,
          visitedPages
        };
      }),
      ...recentLogs.map(l => {
        return {
          id: `l_${l.id}`,
          type: 'interaction',
          action: l.action,
          details: l.details,
          timestamp: l.timestamp,
          visitor: null,
          displayName: 'System / Log',
          timeOnScreen: '',
          visitedPages: []
        };
      })
    ];

    // deduplicate by visitorId so we don't spam the UI with 100 rows for 1 guy
    // (Assuming we want one row per active user in the 'Live' view)
    const uniqueLiveUsersMap = {};
    combined.forEach(item => {
      const vId = item.visitor?.visitorId || item.id; // use item.id as fallback for logs
      if (!uniqueLiveUsersMap[vId]) {
        uniqueLiveUsersMap[vId] = item;
      } else {
        if (new Date(item.timestamp) > new Date(uniqueLiveUsersMap[vId].timestamp)) {
          uniqueLiveUsersMap[vId] = item; // keep the most recent action
        }
      }
    });

    let finalCombined = Object.values(uniqueLiveUsersMap);
    finalCombined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(finalCombined.slice(0, 50));
  } catch (error) {
    console.error("Failed to fetch live analytics:", error);
    res.status(500).json({ error: "Failed to fetch live analytics" });
  }
});

// POST /api/analytics/notify
router.post('/notify', async (req, res) => {
  try {
    const { fcmToken, title, body, url } = req.body;
    
    if (!adminMessaging) {
      return res.status(500).json({ error: "Push notifications are not configured." });
    }

    const message = {
      notification: {
        title: title || 'New Notification',
        body: body || ''
      },
      webpush: {
        fcmOptions: {
          link: url || '/'
        }
      },
      token: fcmToken
    };

    const response = await adminMessaging.send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Retention & Billing Analytics
router.get('/retention', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'asc' }
    });

    const customers = {};
    let totalRevenue = 0;
    
    for (const order of orders) {
      // Group by phone or visitorId
      const key = order.customerPhone || order.visitorId || order.customerName;
      if (!customers[key]) {
        customers[key] = {
          phone: order.customerPhone,
          name: order.customerName,
          visitorId: order.visitorId,
          orderCount: 0,
          totalSpent: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt
        };
      }
      customers[key].orderCount += 1;
      customers[key].totalSpent += order.total;
      customers[key].lastOrderDate = order.createdAt;
      totalRevenue += order.total;
    }

    const customerList = Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);
    
    const repeatCustomers = customerList.filter(c => c.orderCount > 1);
    const retentionRate = customerList.length > 0 
      ? ((repeatCustomers.length / customerList.length) * 100).toFixed(1) 
      : 0;

    res.json({
      totalCustomers: customerList.length,
      repeatCustomers: repeatCustomers.length,
      retentionRate,
      totalRevenue,
      topCustomers: customerList.slice(0, 50)
    });
    } catch (error) {
      console.error('Error fetching retention analytics:', error);
      res.status(500).json({ error: 'Failed to fetch retention analytics' });
    }
});

// GET /api/analytics/subscribers
router.get('/subscribers', async (req, res) => {
  try {
    const { db } = require('../db'); // actually it's just prisma above
    const visitors = await prisma.visitor.findMany({
      where: { fcmToken: { not: null } },
      orderBy: { updatedAt: 'desc' },
      take: 50
    });
    res.json(visitors);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// POST /api/analytics/broadcast
router.post('/broadcast', async (req, res) => {
  try {
    const { title, body, url, image } = req.body;
    
    // We must require adminMessaging locally since it's injected inside db? 
    // Wait, let's see how they do it in /notify
    const { adminMessaging } = require('../firebaseAdmin');

    if (!adminMessaging) {
      return res.status(500).json({ error: "Firebase Push notifications are not configured on the server." });
    }

    const { db } = require('../db');

    // Get all visitors with an FCM token
    const visitors = await db.visitor.findMany({
      where: { fcmToken: { not: null } },
      select: { fcmToken: true }
    });

    const tokens = visitors.map(v => v.fcmToken).filter(Boolean);

    if (tokens.length === 0) {
      return res.json({ success: true, count: 0, message: "No subscribers found" });
    }

    const message = {
      notification: { title, body, imageUrl: image },
      data: { url: url || '/' },
      tokens: Array.from(new Set(tokens))
    };

    const response = await adminMessaging.sendEachForMulticast(message);
    res.json({ 
      success: true, 
      count: response.successCount, 
      failedCount: response.failureCount,
      response 
    });
  } catch (error) {
    console.error("Error broadcasting push notification:", error);
    res.status(500).json({ error: "Failed to broadcast notification" });
  }
});

module.exports = router;
