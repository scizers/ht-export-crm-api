import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['email', 'whatsapp', 'call', 'note'],
    },
    content: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
