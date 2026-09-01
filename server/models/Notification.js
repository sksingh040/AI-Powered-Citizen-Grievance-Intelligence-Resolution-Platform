import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    recipientPhone: { type: String, default: '' },
    recipientEmail: { type: String, default: '' },
    channel: { type: String, enum: ['sms', 'email', 'push', 'whatsapp', 'in_app'], default: 'in_app' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    ticketId: { type: String, default: null },
    status: { type: String, enum: ['queued', 'sent', 'delivered', 'failed'], default: 'sent' },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
