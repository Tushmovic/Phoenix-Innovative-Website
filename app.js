const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'CONTACT_EMAIL', 'SESSION_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser - REQUIRED for csrf with cookies
app.use(cookieParser());

// Security Middleware - Updated with frameSrc for Google Maps
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://unpkg.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://code.jquery.com", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
        },
    },
}));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'lax'
    }
}));

// CSRF Protection - Initialize after cookieParser and session
const csrfProtection = csrf({ cookie: true });

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========== ROUTES ==========

// Homepage
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home - Phoenix Innovative Technologies',
        success: req.session.success,
        error: req.session.error
    });
    req.session.success = null;
    req.session.error = null;
});

// Services page
app.get('/services', (req, res) => {
    res.render('services', { 
        title: 'Our Services - Phoenix Innovative Technologies' 
    });
});

// About page
app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About Us - Phoenix Innovative Technologies' 
    });
});

// ===== SERVICES PAGES =====
app.get('/services/renewable-energy', (req, res) => {
    res.render('services/renewable-energy', { 
        title: 'Renewable Energy & Solar - Phoenix Innovative Technologies' 
    });
});

app.get('/services/network-infrastructure', (req, res) => {
    res.render('services/network-infrastructure', { 
        title: 'Network Infrastructure - Phoenix Innovative Technologies' 
    });
});

app.get('/services/isp-internet', (req, res) => {
    res.render('services/isp-internet', { 
        title: 'ISP & Internet Services - Phoenix Innovative Technologies' 
    });
});

app.get('/services/cctv-security', (req, res) => {
    res.render('services/cctv-security', { 
        title: 'CCTV & Security Systems - Phoenix Innovative Technologies' 
    });
});

app.get('/services/software-development', (req, res) => {
    res.render('services/software-development', { 
        title: 'Software Development - Phoenix Innovative Technologies' 
    });
});

app.get('/services/it-consulting', (req, res) => {
    res.render('services/it-consulting', { 
        title: 'IT Consulting & Procurement - Phoenix Innovative Technologies' 
    });
});

// ===== ABOUT PAGES =====
app.get('/about/company', (req, res) => {
    res.render('about/company', { 
        title: 'Company Overview - Phoenix Innovative Technologies' 
    });
});

app.get('/about/mission', (req, res) => {
    res.render('about/mission', { 
        title: 'Mission & Vision - Phoenix Innovative Technologies' 
    });
});

app.get('/about/values', (req, res) => {
    res.render('about/values', { 
        title: 'Our Values - Phoenix Innovative Technologies' 
    });
});

app.get('/about/team', (req, res) => {
    res.render('about/team', { 
        title: 'Our Team - Phoenix Innovative Technologies' 
    });
});

app.get('/about/certifications', (req, res) => {
    res.render('about/certifications', { 
        title: 'Certifications - Phoenix Innovative Technologies' 
    });
});

app.get('/about/careers', (req, res) => {
    res.render('about/careers', { 
        title: 'Careers - Phoenix Innovative Technologies' 
    });
});

// ===== POLICY PAGES =====
app.get('/privacy', (req, res) => {
    res.render('privacy', { 
        title: 'Privacy Policy - Phoenix Innovative Technologies' 
    });
});

app.get('/terms', (req, res) => {
    res.render('terms', { 
        title: 'Terms of Service - Phoenix Innovative Technologies' 
    });
});

// ===== CONTACT PAGE - GET WITH CSRF PROTECTION =====
app.get('/contact', csrfProtection, (req, res) => {
    res.render('contact', { 
        title: 'Contact Us - Phoenix Innovative Technologies',
        success: req.session.success,
        error: req.session.error,
        formData: req.session.formData || {},
        csrfToken: req.csrfToken() // Generate real CSRF token
    });
    // Clear session messages after rendering
    req.session.success = null;
    req.session.error = null;
    req.session.formData = null;
});

// ===== CONTACT FORM SUBMISSION - POST WITH CSRF PROTECTION =====
app.post('/contact', csrfProtection, async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
        req.session.error = 'Please fill in all required fields.';
        req.session.formData = req.body;
        return res.redirect('/contact');
    }
    
    try {
        const nodemailer = require('nodemailer');
        
        // Create transporter with better error handling
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Add timeout to prevent hanging
            timeout: 10000 // 10 seconds
        });
        
        // Verify transporter configuration
        await transporter.verify();
        
        const mailOptions = {
            from: `"Phoenix Innovative Technologies" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Received at: ${new Date().toLocaleString()}</small></p>
            `,
            // Plain text version for email clients that don't support HTML
            text: `
                New Contact Form Submission
                ===========================
                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'Not provided'}
                Subject: ${subject}
                
                Message:
                --------
                ${message}
                
                ---
                Received: ${new Date().toLocaleString()}
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${email} to ${process.env.CONTACT_EMAIL}`);
        req.session.success = 'Thank you for contacting us! We\'ll get back to you soon.';
    } catch (error) {
        console.error('❌ Email error:', error.message);
        
        // Provide user-friendly error message
        let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please try again later.';
            console.error('🔐 Gmail authentication error - check EMAIL_USER and EMAIL_PASS');
        } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
            errorMessage = 'Network connection error. Please try again.';
        }
        
        req.session.error = errorMessage;
        req.session.formData = req.body;
    }
    
    res.redirect('/contact');
});

// ===== AI CHATBOT API ROUTE =====
app.post('/api/chat', express.json(), (req, res) => {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.length > 500) {
        return res.status(400).json({ reply: 'Invalid message format.' });
    }
    
    const responses = {
        'services': 'We offer Renewable Energy, Network Infrastructure, ISP Services, CCTV Systems, Software Development, and IT Consulting.',
        'price': 'Please contact our sales team for a customized quote based on your specific needs.',
        'contact': 'You can reach us at +234 913 592 6075 or email phoenixinnovative2025@gmail.com',
        'location': 'We are based in Abuja, Nigeria, and serve clients across the country.',
        'default': 'Thank you for your message. Our team will get back to you soon. For immediate assistance, please call us.'
    };
    
    let reply = responses.default;
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('service') || lowerMsg.includes('offer')) {
        reply = responses.services;
    } else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('quote')) {
        reply = responses.price;
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('email')) {
        reply = responses.contact;
    } else if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where')) {
        reply = responses.location;
    }
    
    res.json({ reply });
});

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Page Not Found - Phoenix Innovative Technologies',
        message: 'The page you\'re looking for doesn\'t exist.',
        error: '404 Not Found'
    });
});

// CSRF Error Handler - Special handling for CSRF token errors
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Handle CSRF token errors
        console.error('CSRF token error:', err);
        return res.status(403).render('error', {
            title: 'Security Error - Phoenix Innovative Technologies',
            message: 'Invalid form submission. Please try again.',
            error: 'CSRF token validation failed'
        });
    }
    next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).render('error', { 
        title: 'Server Error - Phoenix Innovative Technologies',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later.'
    });
});

// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});