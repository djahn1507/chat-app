import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, retryWhen, switchMap, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatMessageDto } from './../models/chat-message';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<ChatMessageDto> | null = null;
  private messages$ = new BehaviorSubject<ChatMessageDto | null>(null); // Typisiert als WebSocketResponse
  private reconnectInterval = 3000;

  constructor() {
    this.connect();
  }

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      // WebSocket-URL zur Kommunikation
      this.socket$ = webSocket<ChatMessageDto>('ws://localhost:3000');

      this.socket$
        .pipe(
          retryWhen((errors) =>
            errors.pipe(
              switchMap((err) => {
                console.warn(
                  'WebSocket error, retrying in',
                  this.reconnectInterval / 1000,
                  'seconds'
                );
                return timer(this.reconnectInterval);
              })
            )
          )
        )
        .subscribe({
          next: (data: ChatMessageDto) => this.messages$.next(data), // Typisiere 'data' als WebSocketResponse
          error: (err: Error) => console.error('WebSocket error:', err), // Typisiere 'err' als Error
          complete: () => console.warn('WebSocket closed'),
        });
    }
  }

  // Rückgabe eines Observable<WebSocketResponse>
  getMessages() : Observable<ChatMessageDto | null> {
    return this.messages$.asObservable();
  }

  // Verwende das ChatMessageRequest-Interface, um eine Nachricht zu senden
  send(message: ChatMessageDto): void {
    if (this.socket$) {
      this.socket$.next(message); // Sende die Nachricht
    }
  }

  public close() {
    this.socket$?.complete();
  }
}
