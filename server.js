const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// إعداد الخادم
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // السماح للاتصال من أي نطاق
    methods: ["GET", "POST"],
  },
});

// إعداد مسار لخدمة الملفات الثابتة
app.use(express.static('public'));

// التعامل مع الاتصال عبر Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // استلام اسم المستخدم عند الاتصال
  socket.on('join', (username) => {
    socket.username = username; // تخزين اسم المستخدم في الجلسة
    console.log(`${username} joined the chat`);
  });

  // إرسال عرض (offer) للمستخدمين الآخرين
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  // استقبال إجابة (answer)
  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  // استقبال مرشحات ICE
  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);
  });
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
