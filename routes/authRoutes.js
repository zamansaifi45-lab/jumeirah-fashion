const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        let userExists = await User.findOne({ $or: [{ email }, { mobile }] });
        if (userExists) return res.status(400).json({ message: 'Email or Mobile already registered!' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, mobile, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Account Created Successfully!' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { loginId, password } = req.body;
        const user = await User.findOne({ $or: [{ email: loginId }, { mobile: loginId }] });
        if (!user) return res.status(400).json({ message: 'Account not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect Password!' });

        res.json({ user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, friends: user.friends, friendRequests: user.friendRequests, role: user.role, profilePic: user.profilePic } });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// 3. FORGOT PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { resetId, resetName, newPassword } = req.body;
        const user = await User.findOne({ $or: [{ email: resetId }, { mobile: resetId }], name: { $regex: new RegExp('^' + resetName + '$', 'i') } });
        if (!user) return res.status(400).json({ message: 'Verification failed!' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password reset successfully!' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// 4. GET ALL USERS (For Community)
router.get('/all', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) { res.status(500).json({ message: 'Failed to fetch' }); }
});

// 5. SEND FRIEND REQUEST
router.post('/send-request', async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.body;
        const receiver = await User.findOne({ email: receiverEmail });
        
        if (!receiver) return res.status(404).json({ message: 'User not found' });
        
        // Agar pehle se friend ya request list mein nahi hai toh request bhejo
        if (!receiver.friendRequests.includes(senderEmail) && !receiver.friends.includes(senderEmail)) {
            receiver.friendRequests.push(senderEmail);
            await receiver.save();
            return res.json({ message: 'Request Sent!' });
        }
        res.status(400).json({ message: 'Request already sent or already friends.' });
    } catch (error) { res.status(500).json({ message: 'Error sending request' }); }
});

// 6. ACCEPT FRIEND REQUEST
router.post('/accept-request', async (req, res) => {
    try {
        const { myEmail, senderEmail } = req.body;
        const me = await User.findOne({ email: myEmail });
        const sender = await User.findOne({ email: senderEmail });

        if (me && sender) {
            // Request list se hatao
            me.friendRequests = me.friendRequests.filter(e => e !== senderEmail);
            
            // Dono ko ek dusre ka friend banao
            if (!me.friends.includes(senderEmail)) me.friends.push(senderEmail);
            if (!sender.friends.includes(myEmail)) sender.friends.push(myEmail);

            await me.save();
            await sender.save();
            return res.json({ message: 'Request Accepted! You can now chat.' });
        }
        res.status(404).json({ message: 'User error' });
    } catch (error) { res.status(500).json({ message: 'Error accepting request' }); }
});

module.exports = router;