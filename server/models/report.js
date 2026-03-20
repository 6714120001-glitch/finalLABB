const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    researcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checklist: {
        isReceived: { type: Boolean, default: false },
        isTriaged: { type: Boolean, default: false },
        isFixed: { type: Boolean, default: false },
        isRewarded: { type: Boolean, default: false }
    },
    chatHistory: [{
        user: String,
        role: String,
        text: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// ส่งออก Model เพื่อให้ไฟล์อื่นเรียกใช้ .find() หรือ .save() ได้
module.exports = mongoose.model('Report', reportSchema);