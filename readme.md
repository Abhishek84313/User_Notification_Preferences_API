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
   # npm install
mkdir notification-preferences-api
cd notification-preferences-api

# Initialize TypeScript
npx tsc --init
   ```
3. Configure MongoDB connection
4. Run development server
   ```bash
   npm run start:dev
   ```
## MongoDB Atlas Setup

1. Log in to MongoDB Atlas.
2. Create a new cluster (use the free tier if required).
3. Set up a database user with a username and password in the **Database Access** tab.
4. Allow your IP in the **Network Access** tab or use `0.0.0.0/0` for open access.
5. Get the connection string from the cluster’s **Connect** option. Replace `<username>` and `<password>` accordingly.

## Deployment
- Deployment link : https://user-notification-preferences-api-ten.vercel.app/
 
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
