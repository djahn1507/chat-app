import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  user: string;
  role: 'user' | 'assistant' ;
  text: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  user: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Message = model<IMessage>('Message', messageSchema);
