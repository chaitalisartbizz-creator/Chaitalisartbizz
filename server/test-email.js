require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Artbizz Orders" <${process.env.GMAIL_USER}>`,
    to: 'chaitalisartbizz@gmail.com',
    subject: `🚨 New Order #999 Alert! - ₹15000`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #C9A84C; margin-bottom: 5px;">New Order Received!</h2>
        <p style="color: #555; font-size: 14px; margin-top: 0;">Order #999 has just been placed.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <h3 style="color: #333; margin-bottom: 10px;">Customer Details:</h3>
        <p style="margin: 4px 0;"><strong>Name:</strong> Chaitali Debugging</p>
        
        <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Order Summary:</h3>
        <ul style="background: #f9f9f9; padding: 15px 30px; border-radius: 5px;">
          <li>Resin Table</li>
        </ul>
        
        <h3 style="color: #2C2C2C; font-size: 20px;">Total Amount: <span style="color: #C9A84C;">₹15000</span></h3>
        <p style="font-size: 12px; color: #888; margin-top: 30px;">
          This is an automated alert from Chaitali's Artbizz System.
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Sent:", info.messageId);
}

testEmail().catch(console.error);
