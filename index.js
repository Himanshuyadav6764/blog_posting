const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const postRoutes = require('./server/models/routes/posts');

// loading env file here
dotenv.config({ path: './server/.env' });

const app = express();
app.use(cors());   // allowing all origins for now
app.use(express.json());

// mongodb connection stuff
let isConnected = false;

async function connectDB() {
  if (isConnected) return;  // already connected
  try {
    console.log('trying to connect mongodb...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    isConnected = true;
    console.log('mongodb connected!');
  } catch (err) {
    console.log('connection failed:', err.message);
    // console.log(err); // for debugging
    process.exit(1);
  }
}

// public folder for html css js files
app.use(express.static(path.join(__dirname, 'server/models/routes/public')));

// api endpoints
app.use('/api/posts', postRoutes);


// home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'server/models/routes/public', 'index.html'));
});

// server start
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';  // works on render/railway

connectDB().then(() => {
  app.listen(PORT, HOST, () => console.log('Server started on port ' + PORT));
});

module.exports = app;
