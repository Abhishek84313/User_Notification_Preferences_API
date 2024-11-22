import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferencesController } from './controllers/preferences-controller';
import { NotificationController } from './controllers/notification-controller';
import { UserPreferencesService } from './services/preferences-service';
import { NotificationService } from './services/notification-service';
import { RateLimiterMiddleware } from './rate-limiter';
import { UserPreferenceSchema } from './schemas/user-preferences-schema';
import { NotificationLogSchema } from './schemas/notification-log-schema';
import { AppController } from './controllers/app-controller';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/User-Notification-Preferences-API-Challenge'),
    //MongooseModule.forRoot(process.env.MONGODB_URI??""),
    MongooseModule.forFeature([
      { name: 'UserPreference', schema: UserPreferenceSchema },
      { name: 'NotificationLog', schema: NotificationLogSchema }
    ])
  ],
  controllers: [
    AppController,
    UserPreferencesController, 
    NotificationController
  ],
  providers: [
    UserPreferencesService, 
    NotificationService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('api/notifications', 'api/preferences');
  }
}
