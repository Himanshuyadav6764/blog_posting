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

// Connect to MongoDB
let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });
        isConnected = true;
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// For local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Open http://localhost:${PORT} in your browser`);
        });
    });
}

// Export for Vercel serverless
module.exports = app;
