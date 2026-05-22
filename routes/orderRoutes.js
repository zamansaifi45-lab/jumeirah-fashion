const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. CREATE NEW ORDER
router.post('/create', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: 'Order Placed Successfully!', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
});

// 2. GET ALL ORDERS (For Admin Dashboard)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Newest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

module.exports = router;