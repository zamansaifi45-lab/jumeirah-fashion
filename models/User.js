const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    landmark: { type: String, default: '' },
    role: { type: String, default: 'customer' },
    friends: [{ type: String }],         // Jinhone request accept kar li
    friendRequests: [{ type: String }]   // Jinki request aayi hui hai
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);