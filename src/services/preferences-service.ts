import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreferenceDto } from '../data/user-preferences-dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectModel('UserPreference') private userPreferenceModel: Model<any>
  ) {}

  async createPreference(createDto: UserPreferenceDto) {
    const existingPreference = await this.userPreferenceModel.findOne({ userId: createDto.userId });
    if (existingPreference) {
      throw new Error('User preferences already exist');
    }
    
    const newPreference = new this.userPreferenceModel(createDto);
    return newPreference.save();
  }

  async getUserPreferences(userId: string) {
    const preferences = await this.userPreferenceModel.findOne({ userId });
    if (!preferences) {
      throw new NotFoundException('User preferences not found');
    }
    return preferences;
  }

  async updatePreferences(userId: string, updateData: Partial<UserPreferenceDto>) {
    const updatedPreferences = await this.userPreferenceModel.findOneAndUpdate(
      { userId },
      { ...updateData, lastUpdated: new Date() },
      { new: true }
    );

    if (!updatedPreferences) {
      throw new NotFoundException('User preferences not found');
    }
    return updatedPreferences;
  }

  async deletePreferences(userId: string) {
    const result = await this.userPreferenceModel.deleteOne({ userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User preferences not found');
    }
    return { message: 'User preferences deleted successfully' };
  }
}
