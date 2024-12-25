import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import User from '../models/User.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'], 
      credentials: true, 
    },
  });
  

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('joinRoom', ({ challengeId, userId }) => {
        if (!challengeId || !userId) {
            console.log('Invalid joinRoom request: ', { challengeId, userId });
            return;
        }
        socket.join(challengeId);
        console.log(`User ${userId} joined challenge room ${challengeId}`);
    });

    socket.on('sendMessage',async ({ challengeId, userId, content }) => {
        if (!challengeId || !userId || !content) {
            console.log('Invalid sendMessage request: ', { challengeId, userId, content });
            return;
        }
        const user = await User.findById(userId);
        const message = { userId, fullName: user.fullName, content, timestamp: new Date() };
        io.to(challengeId).emit('receiveMessage', message); 
        console.log(`Message from ${userId} to challenge room ${challengeId}: ${content}`);
    });
    

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

export default server;
