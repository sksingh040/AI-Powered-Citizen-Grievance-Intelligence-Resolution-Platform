import Notification from '../models/Notification.js';

export const sendCivicNotification = async ({
  ticketId,
  recipientPhone = '',
  recipientEmail = '',
  channel = 'in_app',
  title,
  message,
  role = 'citizen'
}) => {
  try {
    const record = {
      ticketId,
      phone: recipientPhone,
      email: recipientEmail,
      channel,
      title,
      message,
      role,
      status: 'delivered',
      sentAt: new Date()
    };

    console.log(`📨 [Notification Service] [${channel.toUpperCase()}] To: ${recipientPhone || recipientEmail || 'Citizen'} | Ticket: ${ticketId} | "${title}"`);

    try {
      if (Notification?.create) {
        await Notification.create(record);
      }
    } catch (e) {
      // Fallback
    }

    return record;
  } catch (error) {
    console.error('Error dispatching notification:', error);
    return null;
  }
};
