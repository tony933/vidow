// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static('public'));

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // عندما ينضم مستخدم إلى الغرفة
//   socket.on('joinRoom', (username, room) => {
//     socket.join(room);
//     io.to(room).emit('userJoined', username); // إرسال إشعار بانضمام المستخدم
//   });

//   // عندما يتلقى الخادم عرض (offer)
//   socket.on('offer', (offer, room) => {
//     socket.to(room).emit('offer', offer, socket.id); // إرسال العرض للمستخدمين في نفس الغرفة
//   });

//   // عندما يتلقى الخادم إجابة (answer)
//   socket.on('answer', (answer, room) => {
//     socket.to(room).emit('answer', answer, socket.id); // إرسال الإجابة للمستخدمين في نفس الغرفة
//   });

//   // عندما يتلقى الخادم ICE candidate
//   socket.on('iceCandidate', (candidate, room) => {
//     socket.to(room).emit('iceCandidate', candidate, socket.id); // إرسال الـ ICE candidate للمستخدمين في نفس الغرفة
//   });

//   // عندما ينقطع اتصال المستخدم
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// إعداد الخادم
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://vidow.vercel.app", // السماح بالاتصال من هذا النطاق
        methods: ["GET", "POST"]
    }
});

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
