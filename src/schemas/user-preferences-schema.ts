import * as mongoose from 'mongoose';
import { NotificationFrequency } from '../data/user-preferences-dto';

export const UserPreferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  preferences: {
    marketing: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: false },
    updates: { type: Boolean, default: false },
    frequency: { 
      type: String, 
      enum: Object.values(NotificationFrequency), 
      default: NotificationFrequency.NEVER 
    },
    channels: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    }
  },
  timezone: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const UserPreferenceModel = mongoose.model('UserPreference', UserPreferenceSchema);
