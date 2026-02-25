const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session for flash messages
app.use(session({
    secret: 'phoenix-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========== CONTACT FORM EMAIL SETUP ==========
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

// ===== CONTACT PAGE =====
app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'Contact Us - Phoenix Innovative Technologies',
        success: req.session.success,
        error: req.session.error
    });
    req.session.success = null;
    req.session.error = null;
});

// Contact Form Submission
app.post('/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    
    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <h3>Message:</h3>
            <p>${message}</p>
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

// ===== AI CHATBOT API ROUTE =====
app.post('/api/chat', express.json(), (req, res) => {
    const { message } = req.body;
    
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

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});