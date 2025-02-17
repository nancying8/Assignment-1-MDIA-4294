const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const bookRouter = require('./routes/books');

// Middleware
app.use(bodyParser.json());

// api/books/images will be defautl and adding the img url after / will have access to the image.
app.use('/api/books/images/', express.static(path.join(__dirname, 'public')));

// Use books router
app.use('/api', bookRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
