import { Router } from 'express';
import { Message } from '../lib/message.model';

export const historyApi = Router();

historyApi.get('/history/:user', async (req, res) => {
  const user = req.params.user;
  const messages = await Message.find({ user }).sort({ timestamp: 1 });
  res.json(messages);
});
