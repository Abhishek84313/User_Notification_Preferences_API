import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Notification Preferences API')
    .setDescription('API for managing user notification preferences')
    .setVersion('1.0')
    .addTag('preferences', 'User notification preferences')
    .addTag('notifications', 'Notification management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Enable CORS
  app.enableCors();

  // Use environment variable for port or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Application running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error('Error during application bootstrap', err);
});