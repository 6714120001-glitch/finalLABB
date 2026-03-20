const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');
const Report = require('./models/report');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"]
    }
});

const rateLimit = require('express-rate-limit');
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use(generalLimiter);
app.use(cors());
app.use(express.json());

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bugbounty')
    .then(() => console.log('STORM DATABASE CONNECTED'))
    .catch(err => console.error('DB CONNECTION ERROR:', err));

app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);

io.on('connection', (socket) => {
    socket.on('joinReport', (reportId) => {
        socket.join(reportId);
    });

    socket.on('sendReportMessage', async (data) => {
        const { reportId, user, role, text } = data;
        const newMessage = { user, role, text, timestamp: new Date() };

        try {
            await Report.findByIdAndUpdate(reportId, {
                $push: { chatHistory: newMessage }
            });
            io.to(reportId).emit('receiveMessage', newMessage);
        } catch (err) {
            console.error('Chat save error:', err);
        }
    });

    socket.on('disconnect', () => {
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`STORM SERVER RUNNING ON PORT ${PORT}`);
});