import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../services/notification-service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { NotificationStatus } from '../schemas/notification-log-schema';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockUserPreferenceModel: jest.Mocked<Model<any>>;
  let mockNotificationLogModel: jest.Mocked<Model<any>>;
  let mockLogger: jest.Mocked<Logger>;

  const mockPayload = {
    userId: 'user123',
    type: 'marketing',
    channel: 'email',
    content: {
      subject: 'Test Notification',
      body: 'This is a test notification'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken('UserPreference'),
          useValue: {
            findOne: jest.fn()
          }
        },
        {
          provide: getModelToken('NotificationLog'),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            aggregate: jest.fn()
          }
        },
        {
          provide: Logger,
          useValue: {
            warn: jest.fn(),
            error: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    mockUserPreferenceModel = module.get(getModelToken('UserPreference'));
    mockNotificationLogModel = module.get(getModelToken('NotificationLog'));
    mockLogger = module.get(Logger);
  });

  describe('sendNotification', () => {
    it('should send notification when preferences allow', async () => {
      // Mock user preferences
      const mockUserPreferences = {
        userId: 'user123',
        preferences: {
          marketing: true,
          channels: {
            email: true
          }
        }
      };

      // Setup mocks
      mockUserPreferenceModel.findOne.mockResolvedValue(mockUserPreferences);
      mockNotificationLogModel.create = jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data)
      }));

      // Call method
      const result = await service.sendNotification(mockPayload);

      // Assertions
      expect(mockUserPreferenceModel.findOne).toHaveBeenCalledWith({ userId: mockPayload.userId });
      expect(result).toMatchObject({
        userId: mockPayload.userId,
        type: mockPayload.type,
        channel: mockPayload.channel,
        status: NotificationStatus.SENT
      });
    });

    it('should not send notification when preferences disallow', async () => {
      // Mock user preferences with notification disabled
      const mockUserPreferences = {
        userId: 'user123',
        preferences: {
          marketing: false,
          channels: {
            email: true
          }
        }
      };

      // Setup mocks
      mockUserPreferenceModel.findOne.mockResolvedValue(mockUserPreferences);

      // Call method
      const result = await service.sendNotification(mockPayload);

      // Assertions
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Notification not sent'));
      expect(result).toBeNull();
    });

    it('should handle errors and log failed notification', async () => {
      // Setup mocks to throw an error
      mockUserPreferenceModel.findOne.mockRejectedValue(new Error('Database error'));
      mockNotificationLogModel.create = jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data)
      }));

      // Call method and expect error
      await expect(service.sendNotification(mockPayload)).rejects.toThrow('Database error');

      // Verify error logging and failed notification log
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Notification sending failed'));
      expect(mockNotificationLogModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: NotificationStatus.FAILED,
          failureReason: 'Database error'
        })
      );
    });
  });

  describe('getNotificationLogs', () => {
    it('should retrieve notification logs for a user', async () => {
      const mockLogs = [
        { userId: 'user123', type: 'marketing', status: NotificationStatus.SENT },
        { userId: 'user123', type: 'transactional', status: NotificationStatus.SENT }
      ];

      mockNotificationLogModel.find.mockResolvedValue(mockLogs);

      const result = await service.getNotificationLogs('user123');

      expect(mockNotificationLogModel.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(result).toEqual(mockLogs);
    });
  });

  // describe('getNotificationStats', () => {
  //   it('should retrieve comprehensive notification statistics', async () => {
  //     mockNotificationLogModel.countDocuments.mockResolvedValue(100);
  //     mockNotificationLogModel.aggregate.mockImplementation((pipeline) => {
  //       if (pipeline[0].$group._id === '$status') {
  //         return [
  //           { _id: NotificationStatus.SENT, count: 80 },
  //           { _id: NotificationStatus.FAILED, count: 20 }
  //         ];
  //       }
  //       return [
  //         { _id: 'marketing', count: 60 },
  //         { _id: 'transactional', count: 40 }
  //       ];
  //     });

  //     const stats = await service.getNotificationStats();

  //     expect(stats).toEqual({
  //       total: 100,
  //       byStatus: [
  //         { _id: NotificationStatus.SENT, count: 80 },
  //         { _id: NotificationStatus.FAILED, count: 20 }
  //       ],
  //       byType: [
  //         { _id: 'marketing', count: 60 },
  //         { _id: 'transactional', count: 40 }
  //       ]
  //     });
  //   });
  // });
});