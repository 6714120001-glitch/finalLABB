const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    sender: { type: String, required: true }, // เก็บ Email ผู้ส่ง
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);