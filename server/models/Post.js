const mongoose = require('mongoose');

// post schema for mongodb
const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now  // auto set current time
    }
});

module.exports = mongoose.model('Post', PostSchema);
