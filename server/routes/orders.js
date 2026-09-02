const express = require('express');
const router = express.Router();
const prisma = require('../db');
const nodemailer = require('nodemailer');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST create new order (storefront checkout)
router.post('/', async (req, res) => {
  try {
    const {
      visitorId, customerName, customerPhone, customerEmail, customerAddress,
      items, total, paymentMethod, razorpayOrderId,
      razorpayPaymentId, notes
    } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const parsedItems = typeof items === 'string' ? items : JSON.stringify(items);
    const parsedItemsArray = typeof items === 'string' ? JSON.parse(items) : items;

    const order = await prisma.order.create({
      data: {
        visitorId: visitorId && visitorId !== 'anonymous' ? visitorId : null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerAddress,
        items: parsedItems,
        total: parseFloat(total),
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' && razorpayPaymentId ? 'PAID' : 'PENDING',
        status: 'PENDING',
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        notes: notes || null
      }
    });

    // If visitorId is provided, update the visitor profile with their actual name & phone
    if (visitorId && visitorId !== 'anonymous') {
      await prisma.visitor.updateMany({
        where: { visitorId },
        data: {
          name: customerName,
          phone: customerPhone
        }
      }).catch(e => console.error("Error linking visitor to order:", e.message));
    }

    let emailAttempted = false;
    // --- GMAIL ORDER ALERT LOGIC ---
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      emailAttempted = true;
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const itemsHtml = parsedItemsArray.map(item => 
          `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px 12px; font-size: 14px; color: #333;"><strong>${item.name}</strong></td>
            <td style="padding: 15px 12px; text-align: center; font-size: 14px; color: #666;">${item.qty}</td>
            <td style="padding: 15px 12px; text-align: right; font-size: 14px; color: #333;">₹${item.price}</td>
          </tr>`
        ).join('');

        // 1. Send Alert to Store Owner
        const storeMailOptions = {
          from: `"Chaitali's Artbizz" <${process.env.GMAIL_USER}>`,
          to: 'chaitalisartbizz@gmail.com',
          subject: `✨ New Order #${order.id} - ₹${total}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-bottom: 3px solid #C9A84C;">
                  <h1 style="color: #C9A84C; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">Chaitali's Artbizz</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">New Order Notification</p>
                </div>
                <div style="padding: 40px 30px;">
                  <h2 style="margin-top: 0; color: #1a1a1a; font-size: 22px;">Order #${order.id}</h2>
                  <p style="color: #666; font-size: 14px; line-height: 1.6;">You have received a new order.</p>
                  
                  <div style="background-color: #fafafa; border-left: 4px solid #C9A84C; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                    <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; margin-bottom: 12px;">Customer Details</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
                      <tr><td style="padding: 4px 0; width: 100px;"><strong>Name:</strong></td><td style="padding: 4px 0;">${customerName}</td></tr>
                      <tr><td style="padding: 4px 0;"><strong>Phone:</strong></td><td style="padding: 4px 0;"><a href="tel:${customerPhone}" style="color: #C9A84C; text-decoration: none;">${customerPhone}</a></td></tr>
                      ${customerEmail ? `<tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td style="padding: 4px 0;">${customerEmail}</td></tr>` : ''}
                      <tr><td style="padding: 4px 0; vertical-align: top;"><strong>Address:</strong></td><td style="padding: 4px 0;">${customerAddress}</td></tr>
                      <tr><td style="padding: 4px 0;"><strong>Payment:</strong></td><td style="padding: 4px 0;">${paymentMethod}</td></tr>
                      ${notes ? `<tr><td style="padding: 4px 0; vertical-align: top;"><strong>Notes:</strong></td><td style="padding: 4px 0; color: #888;"><i>"${notes}"</i></td></tr>` : ''}
                    </table>
                  </div>

                  <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Order Summary</h3>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                    <thead>
                      <tr style="background-color: #f8f8f8; border-bottom: 2px solid #ddd;">
                        <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666;">Item</th>
                        <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #666;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2" style="padding: 20px 12px 10px; text-align: right; font-size: 16px; font-weight: bold; color: #1a1a1a;">Total Amount:</td>
                        <td style="padding: 20px 12px 10px; text-align: right; font-size: 20px; font-weight: bold; color: #C9A84C;">₹${total}</td>
                      </tr>
                    </tfoot>
                  </table>
                  <div style="text-align: center; margin-top: 40px; margin-bottom: 30px;">
                    <a href="https://chaitaliartbizz.com/admin" style="background-color: #1a1a1a; color: #C9A84C; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-size: 14px; display: inline-block;">View Dashboard</a>
                  </div>
                  <!-- Footer -->
                  <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-top: 3px solid #C9A84C;">
                    <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 300; letter-spacing: 1px; color: #C9A84C; text-transform: uppercase;">Chaitali's Artbizz</p>
                    
                    <div style="margin-bottom: 20px;">
                      <a href="https://instagram.com/chaitalis.artbizz" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                        <img src="https://img.icons8.com/ios-filled/24/C9A84C/instagram-new.png" alt="Instagram" width="24" height="24" style="display: block;">
                      </a>
                      <a href="https://facebook.com/chaitalis.artbizz" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                        <img src="https://img.icons8.com/ios-filled/24/C9A84C/facebook-new.png" alt="Facebook" width="24" height="24" style="display: block;">
                      </a>
                      <a href="https://youtube.com/@chaitalis.artbizz" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                        <img src="https://img.icons8.com/ios-filled/24/C9A84C/youtube-play.png" alt="YouTube" width="24" height="24" style="display: block;">
                      </a>
                    </div>

                    <p style="margin: 5px 0; font-size: 13px; color: #ccc;">WhatsApp/Call: <a href="tel:+917020821578" style="color: #C9A84C; text-decoration: none;">+91 70208 21578</a></p>
                    <p style="margin: 5px 0 15px 0; font-size: 13px; color: #ccc;">Email: <a href="mailto:chaitalisartbizz@gmail.com" style="color: #C9A84C; text-decoration: none;">chaitalisartbizz@gmail.com</a></p>
                    <p style="margin: 0; font-size: 11px; color: #666;">This is an automated system alert generated by your website.</p>
                  </div>
                </div>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(storeMailOptions);

        // 2. Send Receipt to Customer (If email provided)
        if (customerEmail) {
          const customerMailOptions = {
            from: `"Chaitali's Artbizz" <${process.env.GMAIL_USER}>`,
            to: customerEmail,
            subject: `Thank you for your order from Chaitali's Artbizz! (#${order.id})`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                  
                  <!-- Header -->
                  <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-bottom: 3px solid #C9A84C;">
                    <h1 style="color: #C9A84C; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">Chaitali's Artbizz</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">Order Confirmation</p>
                  </div>
  
                  <!-- Body -->
                  <div style="padding: 40px 30px;">
                    <h2 style="margin-top: 0; color: #1a1a1a; font-size: 22px;">Hi ${customerName.split(' ')[0]},</h2>
                    <p style="color: #666; font-size: 15px; line-height: 1.6;">Thank you so much for placing your order with us! We have successfully received your order and are currently processing it.</p>
                    
                    <div style="background-color: #fafafa; border-left: 4px solid #C9A84C; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; margin-bottom: 12px;">Order Info</h3>
                      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
                        <tr><td style="padding: 4px 0; width: 100px;"><strong>Order ID:</strong></td><td style="padding: 4px 0;">#${order.id}</td></tr>
                        <tr><td style="padding: 4px 0;"><strong>Payment:</strong></td><td style="padding: 4px 0;">${paymentMethod}</td></tr>
                        <tr><td style="padding: 4px 0; vertical-align: top;"><strong>Shipping to:</strong></td><td style="padding: 4px 0;">${customerAddress}</td></tr>
                      </table>
                    </div>
  
                    <!-- Order Items Table -->
                    <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Your Items</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                      <thead>
                        <tr style="background-color: #f8f8f8; border-bottom: 2px solid #ddd;">
                          <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666;">Item</th>
                          <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #666;">Qty</th>
                          <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Price</th>
                        </tr>
                      </thead>
                      <tbody>${itemsHtml}</tbody>
                      <tfoot>
                        <tr>
                          <td colspan="2" style="padding: 20px 12px 10px; text-align: right; font-size: 16px; font-weight: bold; color: #1a1a1a;">Total Paid:</td>
                          <td style="padding: 20px 12px 10px; text-align: right; font-size: 20px; font-weight: bold; color: #C9A84C;">₹${total}</td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">If you have any questions about your order, please reply to this email or reach out to our support team.</p>
                  </div>
  
                  <!-- Footer -->
                  <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-top: 3px solid #C9A84C;">
                    <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 300; letter-spacing: 1px; color: #C9A84C; text-transform: uppercase;">Chaitali's Artbizz</p>
                    
                    <div style="margin-bottom: 20px;">
                      <a href="https://instagram.com/chaitalis.artbizz" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                        <img src="https://img.icons8.com/ios-filled/24/C9A84C/instagram-new.png" alt="Instagram" width="24" height="24" style="display: block;">
                      </a>
                      <a href="https://facebook.com/chaitalis.artbizz" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                        <img src="https://img.icons8.com/ios-filled/24/C9A84C/facebook-new.png" alt="Facebook" width="24" height="24" style="display: block;">
                      </a>
                      <a href="https://youtube.com/@chaitalis.artbizz" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                        <img src="https://img.icons8.com/ios-filled/24/C9A84C/youtube-play.png" alt="YouTube" width="24" height="24" style="display: block;">
                      </a>
                    </div>

                    <p style="margin: 5px 0; font-size: 13px; color: #ccc;">WhatsApp/Call: <a href="tel:+917020821578" style="color: #C9A84C; text-decoration: none;">+91 70208 21578</a></p>
                    <p style="margin: 5px 0 15px 0; font-size: 13px; color: #ccc;">Email: <a href="mailto:chaitalisartbizz@gmail.com" style="color: #C9A84C; text-decoration: none;">chaitalisartbizz@gmail.com</a></p>
                    <p style="margin: 0; font-size: 12px; color: #666;">© ${new Date().getFullYear()} Chaitali's Artbizz. All rights reserved.</p>
                  </div>
                </div>
              </div>
            `,
          };
          
          await transporter.sendMail(customerMailOptions);
        }

      } catch (mailError) {
        console.error("Failed to setup email transporter:", mailError);
        throw new Error("Email failed: " + mailError.message);
      }
    }

    res.status(201).json({ ...order, emailAttempted });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update order status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE order (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
