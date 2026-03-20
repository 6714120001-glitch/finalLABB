const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // มั่นใจว่าไฟล์ชื่อ user.js ตัวเล็ก

router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword, role: role || 'researcher' });
        await user.save();
        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // สร้าง Token ที่มีทั้ง userId และ role
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'STORM_SECRET_KEY',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

module.exports = router;