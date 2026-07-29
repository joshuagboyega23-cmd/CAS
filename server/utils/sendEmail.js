const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      host: 'smtp.gmail.com',
      port: 465, // SSL port 465 is reliable on Render
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      // Short timeouts so it never freezes your app
      connectionTimeout: 5000, 
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    const message = {
      from: `CAS Healthcare <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    // Log error cleanly without crashing or blocking the request
    console.error('Email sending failed:', error.message);
    return null;
  }
};

module.exports = sendEmail;