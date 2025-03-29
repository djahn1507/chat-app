import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { ChatMessage, ChatMessageDto } from '../../models/chat-message';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  standalone: true,
  selector: 'app-ollama-chat',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  history: ChatMessage[] = [];
  input = '';
  userId = 'frontenduser';

  constructor(private ws: WebSocketService, private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadHistory()
    this.ws.connect();

    // Typisierung des 'data' Parameters als WebSocketResponse
    this.ws.getMessages().subscribe((data: ChatMessageDto | null) => {
      if (data) this.history.push({ role: 'assistant', content: data.message });
    });
  }

  private async loadHistory() {
    this.history = await this.chatService.loadHistory(this.userId);
  }

  send(): void {
    if (!this.input.trim()) return;

    this.history.push({ role: 'user', content: this.input });

    const message: ChatMessageDto = {
      user: this.userId,
      message: this.input,
      history: [...this.history], // Kopie zur Sicherheit
    };

    this.ws.send(message); // Sendet die Nachricht als ChatMessageRequest
    this.input = '';
  }
}
