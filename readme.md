# User Notification Preferences API

## Overview
Serverless API for managing user notification preferences and sending notifications.

## Features
- User preference management
- Notification tracking
- Rate limiting
- Comprehensive logging

## API Endpoints
- `POST /api/preferences`: Create preferences
- `GET /api/preferences/:userId`: Get preferences
- `PATCH /api/preferences/:userId`: Update preferences
- `DELETE /api/preferences/:userId`: Delete preferences
- `POST /api/notifications/send`: Send notification
- `GET /api/notifications/:userId/logs`: Get notification logs
- `GET /api/notifications/stats`: Get notification statistics

## Setup
1. Clone repository
2. Install dependencies
   ```bash
   # Create project directory
mkdir notification-preferences-api
cd notification-preferences-api

# Initialize TypeScript
npx tsc --init
   ```
4. Configure MongoDB connection
5. Run development server
   ```bash
   npm run start:dev
   ```

## Testing
```bash
npm test
```

## Technologies
- Nest.js
- TypeScript
- MongoDB
- Mongoose
- Jest
- Swagger
