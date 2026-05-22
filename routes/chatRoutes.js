const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// 1. SAVE NEW MESSAGE
router.post('/send', async (req, res) => {
    try {
        const newChat = new Chat(req.body);
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// 2. GET ALL CHATS (For Admin Dashboard)
router.get('/all', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
});

module.exports = router;