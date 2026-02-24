const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// GET route - Display contact page
router.get('/', (req, res) => {
    res.render('contact', { 
        title: 'Contact Us - Phoenix Innovative Technologies',
        success: req.session.success,
        error: req.session.error
    });
    // Clear session messages after displaying
    req.session.success = null;
    req.session.error = null;
});

// POST route - Handle form submission
router.post('/', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
        req.session.error = 'Please fill in all required fields.';
        return res.redirect('/contact');
    }
    
    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    h2 { color: #FF6B35; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #666; }
                    .value { margin-top: 5px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>New Contact Form Submission</h2>
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">${name}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">${email}</div>
                    </div>
                    <div class="field">
                        <div class="label">Phone:</div>
                        <div class="value">${phone || 'Not provided'}</div>
                    </div>
                    <div class="field">
                        <div class="label">Subject:</div>
                        <div class="value">${subject}</div>
                    </div>
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        req.session.success = 'Thank you for contacting us! We\'ll get back to you soon.';
    } catch (error) {
        console.error('Email error:', error);
        req.session.error = 'Sorry, there was an error sending your message. Please try again.';
    }
    
    res.redirect('/contact');
});

module.exports = router;