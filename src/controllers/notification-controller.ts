import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  Body, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { NotificationService } from '../services/notification-service';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendNotification(@Body() payload: any) {
    return this.notificationService.sendNotification(payload);
  }

  @Get(':userId/logs')
  async getNotificationLogs(@Param('userId') userId: string) {
    return this.notificationService.getNotificationLogs(userId);
  }

  @Get('stats')
  async getNotificationStats() {
    return this.notificationService.getNotificationStats();
  }
}
