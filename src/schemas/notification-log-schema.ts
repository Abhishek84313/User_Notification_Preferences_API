import * as mongoose from 'mongoose';

export enum NotificationType {
  MARKETING = 'marketing',
  NEWSLETTER = 'newsletter',
  UPDATES = 'updates'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}

export const NotificationLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(NotificationType), 
    required: true 
  },
  channel: { 
    type: String, 
    enum: Object.values(NotificationChannel), 
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(NotificationStatus), 
    default: NotificationStatus.PENDING 
  },
  sentAt: Date,
  failureReason: String,
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export const NotificationLogModel = mongoose.model('NotificationLog', NotificationLogSchema);
