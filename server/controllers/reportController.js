const Report = require('../models/report');

exports.getReports = async (req, res) => {
    try {

        const reports = await Report.find().populate('researcher', 'email');
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: "ดึงข้อมูลล้มเหลว" });
    }
};