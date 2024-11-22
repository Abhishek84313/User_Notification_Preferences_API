import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { UserPreferencesService } from '../services/preferences-service';
import { UserPreferenceDto } from '../data/user-preferences-dto';

@Controller('api/preferences')
export class UserPreferencesController {
  constructor(private readonly preferencesService: UserPreferencesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPreferences(@Body() createDto: UserPreferenceDto) {
    return this.preferencesService.createPreference(createDto);
  }

  @Get(':userId')
  async getUserPreferences(@Param('userId') userId: string) {
    return this.preferencesService.getUserPreferences(userId);
  }

  @Patch(':userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePreferences(
    @Param('userId') userId: string, 
    @Body() updateDto: Partial<UserPreferenceDto>
  ) {
    return this.preferencesService.updatePreferences(userId, updateDto);
  }

  @Delete(':userId')
  async deletePreferences(@Param('userId') userId: string) {
    return this.preferencesService.deletePreferences(userId);
  }
}
