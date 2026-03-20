const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const auth = require('../middleware/auth');

// 1. ดึงรายการ Report ทั้งหมด (Dashboard)
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.researcher = req.user.userId;
        }
        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error("GET Reports Error:", err);
        res.status(500).json({ message: "Error fetching reports" });
    }
});

// 2. สร้าง Report ใหม่ (Submit Page)
router.post('/', auth, async (req, res) => {
    try {
        const { title, category, severity, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

        const newReport = new Report({
            title,
            category,
            severity,
            description,
            researcher: req.user.userId,
            status: 'Pending',
            checklist: {
                isReceived: false,
                isTriaged: false,
                isFixed: false,
                isRewarded: false
            }
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (err) {
        console.error("POST Report Error:", err);
        res.status(500).json({ message: "Failed to create report" });
    }
});

// 3. ดูรายละเอียด Report รายตัว
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: "Error fetching report details" });
    }
});

// 4. Admin อัปเดต Status
router.put('/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    try {
        const { status } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { $set: { status: status } },
            { new: true }
        );
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: "Error updating status" });
    }
});

// 5. Admin อัปเดต Checklist
router.put('/:id/checklist', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { $set: { checklist: req.body } },
            { new: true }
        );
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: "Error updating checklist" });
    }
});

module.exports = router;