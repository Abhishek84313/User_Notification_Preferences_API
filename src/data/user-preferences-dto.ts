import { IsEmail, IsNotEmpty, IsString, ValidateNested, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum NotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never'
}

export class ChannelsDto {
  @IsBoolean()
  email: boolean = false;

  @IsBoolean()
  sms: boolean = false;

  @IsBoolean()
  push: boolean = false;
}

export class PreferencesDto {
  @IsBoolean()
  marketing: boolean = false;

  @IsBoolean()
  newsletter: boolean = false;

  @IsBoolean()
  updates: boolean = false;

  @IsEnum(NotificationFrequency)
  frequency: NotificationFrequency | undefined;

  @ValidateNested()
  @Type(() => ChannelsDto)
  channels: ChannelsDto = new ChannelsDto;
}

export class UserPreferenceDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsEmail()
  email!: string;

  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences: PreferencesDto = new PreferencesDto;

  @IsString()
  timezone!: string;
}
