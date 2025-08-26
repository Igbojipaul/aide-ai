import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  showPlatforms: {
    type: Boolean,
    default: false
  },
  realAiResponse: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);