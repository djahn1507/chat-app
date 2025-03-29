export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: Role;
  content: string;
}

// message.model.ts
export interface ChatMessageDto {
  user: string;
  message: string;
  history: ChatMessage[];  // Hier verwenden wir das ChatMessage-Interface für den Verlauf
}
