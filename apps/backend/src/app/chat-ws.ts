import { WebSocketServer } from 'ws';
import axios from 'axios';
import { Message } from '../lib/message.model';
import { IncomingMessage } from 'http';

export function setupChatWS(server: IncomingMessage | any) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', ws => {
    ws.on('message', async (msgRaw: string,) => {
      try {
        const { user, message, history} = JSON.parse(msgRaw);

        const messages = [
          ...(Array.isArray(history) ? history.map((msg) => ({ role: msg.role, content: msg.text })) : []),
          { role: 'user', content: message }
        ];
        await new Message({ user, role: 'user', text: message }).save();

        const res = await axios.post('http://localhost:11434/api/chat', {
          model: 'llama3.2:3b',
          messages,
          stream: false // Streaming deaktiviert
        });

        const botText = res.data.message?.content || '';

        if (botText) {
          await new Message({ user, role: 'assistant', text: botText }).save();
          ws.send(JSON.stringify({ message: botText }));
        }

      } catch (error) {
        console.error('Fehler beim Verarbeiten der Nachricht:', error);
        ws.send(JSON.stringify({ error: 'Fehler beim Chatprozess' }));
      }
    });
  });

  console.log('WebSocket läuft');
}
