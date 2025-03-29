import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { historyApi } from './app/history-api';
import { setupChatWS } from './app/chat-ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

mongoose.connect('mongodb://localhost:27017/ollama-chat');

app.use(cors());
app.use(express.json());
app.use('/api', historyApi);

server.listen(3000, () => console.log('Backend REST + WS listening on 3000'));

setupChatWS(server);
