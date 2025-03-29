import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage, ChatMessageDto } from '../models/chat-message';

interface IncomingWSMessage {
  token: string;
}

interface HistoryMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private ws?: WebSocket;
  messages$ = new BehaviorSubject<string>('');
  connected$ = new BehaviorSubject<boolean>(false);

  connect(): void {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => this.connected$.next(true);
    this.ws.onclose = () => this.connected$.next(false);

    this.ws.onmessage = (msg: MessageEvent<string>) => {
      const data: IncomingWSMessage = JSON.parse(msg.data);
      this.messages$.next(data.token);
    };
  }

  send(user: string, message: string, history: ChatMessageDto[], systemMessage?: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({ user, message, history, systemMessage }));
  }

  async loadHistory(user: string): Promise<ChatMessage[]> {
    const res = await fetch(`http://localhost:3000/api/history/${user}`);
    const data: HistoryMessage[] = await res.json();
    return data.map((m) => ({ role: m.role, content: m.text }));
  }
}
