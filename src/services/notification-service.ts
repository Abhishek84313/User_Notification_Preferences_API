import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationStatus } from '../schemas/notification-log-schema';

interface NotificationPayload {
  userId: string;
  type: string;
  channel: string;
  content: {
    subject: string;
    body: string;
  };
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel('UserPreference') private userPreferenceModel: Model<any>,
    @InjectModel('NotificationLog') private notificationLogModel: Model<any>
  ) {}

  async sendNotification(payload: NotificationPayload) {
    try {
      // Fetch user preferences
      const userPreferences = await this.userPreferenceModel.findOne({ 
        userId: payload.userId 
      });

      if (!userPreferences) {
        throw new Error('User preferences not found');
      }

      // Check if notification is allowed
      const isAllowed = this.validateNotificationPreferences(
        userPreferences, 
        payload.type, 
        payload.channel
      );

      if (!isAllowed) {
        this.logger.warn(`Notification not sent: User preferences do not allow`);
        return null;
      }

      // Simulate notification sending
      const notificationLog = new this.notificationLogModel({
        userId: payload.userId,
        type: payload.type,
        channel: payload.channel,
        status: NotificationStatus.SENT,
        sentAt: new Date(),
        metadata: payload.content
      });

      return await notificationLog.save();
    } catch (error:any) {
      // Log failed notification
      const failedLog = new this.notificationLogModel({
        userId: payload.userId,
        type: payload.type,
        channel: payload.channel,
        status: NotificationStatus.FAILED,
        failureReason: error.message
      });
      await failedLog.save();

      this.logger.error(`Notification sending failed: ${error.message}`);
      throw error;
    }
  }

  private validateNotificationPreferences(
    preferences: any, 
    type: string, 
    channel: string
  ): boolean {
    // Check if notification type is enabled
    const typeEnabled = preferences.preferences[type];
    const channelEnabled = preferences.preferences.channels[channel];

    return typeEnabled && channelEnabled;
  }

  async getNotificationLogs(userId: string) {
    return this.notificationLogModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getNotificationStats() {
    return {
      total: await this.notificationLogModel.countDocuments(),
      byStatus: await this.notificationLogModel.aggregate([
        { $group: { 
            _id: '$status', 
            count: { $sum: 1 } 
        }}
      ]),
      byType: await this.notificationLogModel.aggregate([
        { $group: { 
            _id: '$type', 
            count: { $sum: 1 } 
        }}
      ])
    };
  }
}
