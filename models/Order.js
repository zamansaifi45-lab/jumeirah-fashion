const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, required: true },
    items: Array,
    totalAmount: Number,
    utrNumber: { type: String, required: true }, // Payment verification
    status: { type: String, default: 'Verified' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);