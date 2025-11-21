const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
// Tell Express where our views folder is
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, Images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROUTES =====

// Homepage Route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home - Phoenix Innovative Technologies' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Views directory:', path.join(__dirname, 'views'));
});