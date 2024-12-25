import express, { json } from 'express';
import * as dotenv from 'dotenv';
import connectDB from './connection/DBConnection.js';
import cors from 'cors';
import cron from 'node-cron';
import {
  authRouter,
  challengeRouter,
  userRouter,
  challengeUserRouter
} from './route/index.js';
import morgan from 'morgan';
import { checkAuthorization } from './middleware/Auth.js';
import { checkToken } from './middleware/Auth.js';
import server from './middleware/Chat.js';

import cookieParser from 'cookie-parser';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import userProfileRouter from './route/UserProfileRoute.js';
import postRouter from './route/Post.js';
import { Server } from 'socket.io';
import routerCategory from './route/Category.js';
import Challenge from './models/Challenge.js';
import crypto from 'crypto';
import config from './config.js';
import axios from 'axios';
import WebSocket, { WebSocketServer } from 'ws';
import reportRouter from './route/ReportRoute.js';

/**
 * @des
 * @author Trịnh Minh Phúc
 * @date 29/01/2024
 * @param {*} req
 * @param {*} res
 * @returns
 */

dotenv.config();
//Create 1 webserver
const app = express();
const port = process.env.PORT || 8080;
const serverPort = 9090;

app.use(
  cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);
connectDB()
  .then(() => {
    console.log('Connect Database Success');
  })
  .catch((e) => console.error(e));



app.use(json());
app.use(cookieParser());
let transactions = {}; 

const generateTransactionId = () => {
  return crypto.randomBytes(4).toString('hex').substring(0, 7);
};


// Endpoint để tạo VietQR


//Todo:Enable in production
// app.use(checkToken)

// app.use(morgan('dev'));

// Router
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/user-profile', userProfileRouter);
app.use('/challenge', challengeRouter);
app.use('/posts', postRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/challengeUser', challengeUserRouter);
app.use('/category', routerCategory);
app.use('/reports', reportRouter);
app.post('/create-vietqr', (req, res) => {
  const { amount } = req.body;
  const transactionId = generateTransactionId();

  const qrUrl = `https://img.vietqr.io/image/${config.bankInfo.bankId}-${config.bankInfo.bankAccount}-${config.bankInfo.template}.png?amount=${amount}&addInfo=${encodeURIComponent( + ' Ma giao dich ' + transactionId)}&accountName=${encodeURIComponent(config.bankInfo.accountName)}`;
  transactions[transactionId] = { status: 'pending', amount };

  res.json({ qrUrl, transactionId });
});
app.get('/check-transaction-status/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactions[transactionId];

  if (transaction) {
    try {
      const response = await axios.get(`${config.casso.apiUrl}/transactions`, {
        headers: {
          'Authorization': `Apikey AK_CS.665e9dc03ffc11ef90c3c9ff66e60f20.RJ37JVOGEyudfZwrBeyTL22qPTTp6E9ugl0NhpVbad4Q9GGWy8B8yWwEkBlP8EXYegZNo3kI`,
          'Content-Type': 'application/json'
        }
      });

     
      const transactionsData = response.data.data.records;    
      console.log('Response from Casso API:', transactionsData);  
      console.log('Transaction ID:',transactionId);
      const updatedTransaction = transactionsData.find(t => t.description.includes(transactionId));

      console.log('Updated transaction:', updatedTransaction);
      
      if (updatedTransaction) {
        transactions[transactionId].status = 'success';
        res.json({ status: 'success', transaction: updatedTransaction });
      } else {
        res.json({ status: 'pending' });
      }

    } catch (error) {
      console.error('Error checking transaction status:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error checking transaction status' });
    }
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

cron.schedule('*/30 * * * * *', async () => {
  // console.log('Running a task every 30 seconds to update expired challenges');
  try {
    const now = new Date();
    await Challenge.updateMany(
      { ExpiresAt: { $lt: now } },
      { $set: { isPublic: false } }
    );
    // console.log('Expired challenges have been updated');
  } catch (error) {
    console.error('Error updating challenges:', error);
  }
});
const wss = new WebSocketServer({ port: 9000 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log('Received message:', message);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});



app.listen(port, async () => {
  console.log('Server node Js running on ' + port);
});
server.listen(serverPort, () => {
  console.log('Server socket.io running on ' + serverPort);
});



