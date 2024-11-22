import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferencesController } from './controllers/preferences-controller';
import { NotificationController } from './controllers/notification-controller';
import { UserPreferencesService } from './services/preferences-service';
import { NotificationService } from './services/notification-service';
import { RateLimiterMiddleware } from './rate-limiter';
import { UserPreferenceSchema } from './schemas/user-preferences-schema';
import { NotificationLogSchema } from './schemas/notification-log-schema';
import { AppController } from './controllers/app-controller';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://abhiabhishek9347:wk7Xey53F1EnoJFb@cluster0.9hhvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
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
