const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const postRoutes = require('./models/routes/posts');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'models/routes/public')));

// API routes
app.use('/api/posts', postRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'models/routes/public', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(5000, () => console.log("Server running on port 5000\nOpen http://localhost:5000 in your browser")))
    .catch(err => console.error(err));
