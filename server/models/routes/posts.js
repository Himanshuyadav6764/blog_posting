const express = require('express');
const router = express.Router();
const Post = require('../Post');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new post
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content });
        await newPost.save();
        res.json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
