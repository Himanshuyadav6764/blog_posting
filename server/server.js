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

// Connect to MongoDB
let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        isConnected = true;
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
    }
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'models/routes/public')));

// API routes
app.use('/api/posts', postRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'models/routes/public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all network interfaces for Render

connectDB().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Server running on ${HOST}:${PORT}`);
        console.log(`Open http://localhost:${PORT} in your browser`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Export for Vercel serverless (if needed)
module.exports = app;
