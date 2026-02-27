const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Email transporter setup with better configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true, // Use pooled connections
    maxConnections: 5,
    maxMessages: 10,
    rateDelta: 1000,
    rateLimit: 5
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error.message);
        console.error('Please check your EMAIL_USER and EMAIL_PASS in .env file');
    } else {
        console.log('Email server is ready to send messages');
    }
});

// GET route - Display contact page
router.get('/', (req, res) => {
    res.render('contact', { 
        title: 'Contact Us - Phoenix Innovative Technologies',
        success: req.session.success,
        error: req.session.error,
        formData: req.session.formData || {}
    });
    // Clear session messages after displaying
    req.session.success = null;
    req.session.error = null;
    req.session.formData = null;
});

// POST route - Handle form submission with validation
router.post('/', [
    // Sanitize and validate inputs
    body('name').trim().escape().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim().escape(),
    body('subject').trim().escape().notEmpty().withMessage('Subject is required'),
    body('message').trim().escape().notEmpty().withMessage('Message is required')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.error = errors.array()[0].msg;
        req.session.formData = req.body;
        return res.redirect('/contact');
    }

    const { name, email, phone, subject, message } = req.body;
    
    // Beautiful HTML email template
    const mailOptions = {
        from: `"Phoenix Innovative Technologies" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL,
        replyTo: email,
        subject: `📬 New Contact: ${subject} from ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Reset styles */
                    body, p, h1, h2, h3, h4, h5, h6, div, table, td {
                        margin: 0;
                        padding: 0;
                        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                    }
                    
                    /* Main container */
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
                        border-radius: 30px;
                        overflow: hidden;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    }
                    
                    /* Header with gradient */
                    .email-header {
                        background: linear-gradient(135deg, #FF6B35 0%, #F25F3A 50%, #E71D36 100%);
                        padding: 40px 30px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .email-header::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        right: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
                        animation: rotate 20s linear infinite;
                    }
                    
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    .header-logo {
                        width: 80px;
                        height: 80px;
                        background: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    }
                    
                    .header-logo img {
                        width: 60px;
                        height: 60px;
                        object-fit: contain;
                    }
                    
                    .email-header h1 {
                        color: white;
                        font-size: 28px;
                        font-weight: 700;
                        margin-bottom: 10px;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                        position: relative;
                        z-index: 2;
                    }
                    
                    .email-header p {
                        color: rgba(255,255,255,0.95);
                        font-size: 16px;
                        position: relative;
                        z-index: 2;
                    }
                    
                    /* Content area */
                    .email-content {
                        padding: 40px 30px;
                        background: white;
                    }
                    
                    /* Info cards */
                    .info-card {
                        background: linear-gradient(135deg, #f8f9fa, #ffffff);
                        border-radius: 20px;
                        padding: 25px;
                        margin-bottom: 25px;
                        border: 1px solid rgba(255,107,53,0.1);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                        transition: all 0.3s ease;
                    }
                    
                    .info-card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 10px 25px rgba(255,107,53,0.1);
                        border-color: #FF6B35;
                    }
                    
                    .card-title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #FF6B35;
                    }
                    
                    .card-title .emoji {
                        font-size: 24px;
                        background: linear-gradient(135deg, #FF6B35, #4361EE);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    }
                    
                    .card-title h3 {
                        color: #333;
                        font-size: 18px;
                        font-weight: 700;
                        margin: 0;
                    }
                    
                    .info-content {
                        padding-left: 10px;
                    }
                    
                    .info-content .label {
                        color: #666;
                        font-size: 14px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 5px;
                    }
                    
                    .info-content .value {
                        color: #333;
                        font-size: 18px;
                        font-weight: 500;
                        background: white;
                        padding: 12px 15px;
                        border-radius: 12px;
                        border: 1px solid #e9ecef;
                        margin-top: 5px;
                    }
                    
                    /* Message box */
                    .message-box {
                        background: linear-gradient(135deg, #fff5f0, #ffffff);
                        border-radius: 20px;
                        padding: 25px;
                        margin: 25px 0;
                        border-left: 5px solid #FF6B35;
                    }
                    
                    .message-box h3 {
                        color: #FF6B35;
                        font-size: 18px;
                        font-weight: 700;
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .message-box .message-content {
                        background: white;
                        padding: 20px;
                        border-radius: 15px;
                        color: #333;
                        font-size: 16px;
                        line-height: 1.8;
                        border: 1px solid #e9ecef;
                        box-shadow: inset 0 2px 5px rgba(0,0,0,0.03);
                    }
                    
                    /* Status badges */
                    .status-badge {
                        display: inline-block;
                        padding: 8px 20px;
                        background: linear-gradient(135deg, #2EC4B6, #4361EE);
                        color: white;
                        border-radius: 50px;
                        font-size: 14px;
                        font-weight: 600;
                        margin-top: 15px;
                    }
                    
                    /* Footer */
                    .email-footer {
                        background: linear-gradient(135deg, #0B132B, #1C2541);
                        padding: 30px;
                        text-align: center;
                        color: white;
                    }
                    
                    .footer-logo {
                        margin-bottom: 20px;
                    }
                    
                    .footer-logo img {
                        height: 40px;
                        filter: brightness(0) invert(1);
                    }
                    
                    .footer-text {
                        color: rgba(255,255,255,0.8);
                        font-size: 14px;
                        line-height: 1.8;
                        margin-bottom: 20px;
                    }
                    
                    .social-links {
                        display: flex;
                        justify-content: center;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    
                    .social-link {
                        width: 40px;
                        height: 40px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-decoration: none;
                        font-size: 20px;
                        transition: all 0.3s ease;
                    }
                    
                    .social-link:hover {
                        background: #FF6B35;
                        transform: translateY(-3px);
                    }
                    
                    .copyright {
                        color: rgba(255,255,255,0.6);
                        font-size: 13px;
                        border-top: 1px solid rgba(255,255,255,0.1);
                        padding-top: 20px;
                    }
                    
                    /* Responsive */
                    @media (max-width: 480px) {
                        .email-content {
                            padding: 25px 15px;
                        }
                        
                        .info-card {
                            padding: 15px;
                        }
                        
                        .value {
                            font-size: 16px;
                        }
                    }
                </style>
            </head>
            <body style="background: #f0f2f5; padding: 30px 15px;">
                <div class="email-container">
                    <!-- Header -->
                    <div class="email-header">
                        <div class="header-logo">
                            <img src="https://via.placeholder.com/60x60/FF6B35/ffffff?text=P" alt="Phoenix Logo">
                        </div>
                        <h1>🌟 New Contact Form Submission</h1>
                        <p>You've received a new message from your website</p>
                    </div>
                    
                    <!-- Content -->
                    <div class="email-content">
                        <!-- Personal Info Card -->
                        <div class="info-card">
                            <div class="card-title">
                                <span class="emoji">👤</span>
                                <h3>Personal Information</h3>
                            </div>
                            <div class="info-content">
                                <div style="display: grid; gap: 15px;">
                                    <div>
                                        <div class="label">Full Name</div>
                                        <div class="value">${name}</div>
                                    </div>
                                    <div>
                                        <div class="label">Email Address</div>
                                        <div class="value">${email}</div>
                                    </div>
                                    <div>
                                        <div class="label">Phone Number</div>
                                        <div class="value">${phone || 'Not provided'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Subject Card -->
                        <div class="info-card">
                            <div class="card-title">
                                <span class="emoji">📋</span>
                                <h3>Subject</h3>
                            </div>
                            <div class="info-content">
                                <div class="value" style="background: linear-gradient(135deg, #f8f9fa, #ffffff);">
                                    ${subject}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Message Box -->
                        <div class="message-box">
                            <h3>
                                <span>💬</span>
                                Message Content
                            </h3>
                            <div class="message-content">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <!-- Status -->
                        <div style="text-align: center;">
                            <span class="status-badge">
                                ⏰ Received: ${new Date().toLocaleString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="email-footer">
                        <div class="footer-logo">
                            <img src="https://via.placeholder.com/120x40/ffffff/FF6B35?text=PHOENIX" alt="Phoenix Innovative Technologies">
                        </div>
                        
                        <div class="footer-text">
                            <p style="margin-bottom: 10px;"><strong>Phoenix Innovative Technologies Ltd</strong></p>
                            <p>Building Intelligent Systems for a Smarter World</p>
                            <p style="margin-top: 15px;">
                                📍 Abuja, Nigeria<br>
                                📞 +234 913 592 6075<br>
                                ✉️ phoenixinnovative2025@gmail.com
                            </p>
                        </div>
                        
                        <div class="social-links">
                            <a href="#" class="social-link">📘</a>
                            <a href="#" class="social-link">🐦</a>
                            <a href="#" class="social-link">📷</a>
                            <a href="#" class="social-link">💼</a>
                        </div>
                        
                        <div class="copyright">
                            © ${new Date().getFullYear()} Phoenix Innovative Technologies. All rights reserved.<br>
                            <small>This email was sent from your website contact form.</small>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        // Plain text version for email clients that don't support HTML
        text: `
            NEW CONTACT FORM SUBMISSION
            ===========================
            
            Personal Information:
            --------------------
            Name: ${name}
            Email: ${email}
            Phone: ${phone || 'Not provided'}
            
            Subject: ${subject}
            
            Message:
            --------
            ${message}
            
            ---
            Received: ${new Date().toLocaleString()}
            
            Phoenix Innovative Technologies Ltd
            Building Intelligent Systems for a Smarter World
            Abuja, Nigeria | +234 913 592 6075
        `
    };
    
    try {
        // Send email with timeout
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        
        req.session.success = 'Thank you for contacting us! We\'ll get back to you soon.';
    } catch (error) {
        console.error('❌ Email error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        
        // User-friendly error messages based on error type
        let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please check your email settings.';
            console.error('🔐 Authentication error - Check EMAIL_USER and EMAIL_PASS in .env');
        } else if (error.code === 'ESOCKET') {
            errorMessage = 'Network connection error. Please check your internet and try again.';
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Connection timed out. Please try again.';
        }
        
        req.session.error = errorMessage;
        req.session.formData = req.body;
    }
    
    res.redirect('/contact');
});

module.exports = router;