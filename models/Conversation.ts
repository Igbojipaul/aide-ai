// models/Conversation.ts
import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, default: 'none' },
  userId: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);