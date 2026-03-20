const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ message: "No Authorization Header" });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Token format error" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'STORM_SECRET_KEY');

        // ต้องมั่นใจว่าใน Token มี userId
        req.user = decoded;

        next(); // <--- ต้องเรียก next() เพื่อไปต่อที่ router.post
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(401).json({ message: "Invalid Token" });
    }
};