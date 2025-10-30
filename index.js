const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const postRoutes = require('./server/models/routes/posts');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Serve static files
app.use(express.static(path.join(__dirname, 'server/models/routes/public')));

// API routes
app.use('/api/posts', postRoutes);

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'server/models/routes/public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

connectDB().then(() => {
  app.listen(PORT, HOST, () => console.log(`🚀 Server running on ${HOST}:${PORT}`));
});

module.exports = app;
