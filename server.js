const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// إعداد الخادم
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// إعداد مسار لخدمة الملفات الثابتة (مثل HTML, JS, CSS)
app.use(express.static('public'));

// التعامل مع الاتصال من العميل عبر Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    // استقبال عرض الفيديو من العميل (offer)
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);  // إرسال العرض للمستخدمين الآخرين
    });

    // استقبال إجابة الفيديو (answer)
    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);  // إرسال الإجابة للمستخدمين الآخرين
    });

    // استقبال مرشحات ICE من العميل
    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);  // إرسال المرشح للمستخدمين الآخرين
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
