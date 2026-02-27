const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');

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

// Limit request size
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Security Middleware - Helmet with CSP configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://unpkg.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://code.jquery.com", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
            connectSrc: ["'self'"],
        },
    },
}));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration with security options
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'lax' // CSRF protection
    }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const contactRoutes = require('./routes/contact');

// CSRF Protection - Apply only to routes that modify data
const csrfProtection = csrf({ cookie: true });

// Make CSRF token available to all views (for GET requests)
app.use((req, res, next) => {
    // Only generate token for GET requests that render forms
    if (req.method === 'GET') {
        try {
            res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
        } catch (err) {
            // Ignore CSRF errors on GET requests
            res.locals.csrfToken = '';
        }
    }
    next();
});

// Apply CSRF protection to POST routes
app.use('/contact', csrfProtection, contactRoutes);

// ========== ROUTES ==========

// Homepage
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home - Phoenix Innovative Technologies',
        success: req.session.success,
        error: req.session.error
    });
    // Clear session messages
    req.session.success = null;
    req.session.error = null;
});

// ===== SERVICES MAIN PAGE =====
app.get('/services', (req, res) => {
    res.render('services', { 
        title: 'Our Services - Phoenix Innovative Technologies' 
    });
});

// ===== ABOUT MAIN PAGE =====
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

// ===== AI CHATBOT API ROUTE =====
app.post('/api/chat', express.json(), (req, res) => {
    const { message } = req.body;
    
    // Input validation
    if (!message || typeof message !== 'string' || message.length > 500) {
        return res.status(400).json({ reply: 'Invalid message format.' });
    }
    
    // Simple response logic - you can expand this or connect to a real AI API
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

// 404 Error Handler - Page not found
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found - Phoenix Innovative Technologies' 
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    
    // Handle CSRF errors specifically
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).render('error', { 
            title: 'Invalid CSRF Token - Phoenix Innovative Technologies',
            message: 'Invalid form submission. Please try again.',
            error: 'CSRF token validation failed'
        });
    }
    
    res.status(500).render('error', { 
        title: 'Server Error - Phoenix Innovative Technologies',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later.'
    });
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security features: Helmet, Rate Limiting, CSRF, Secure Headers`);
});