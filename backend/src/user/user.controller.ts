import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  CreatePreferencesDto,
  UpdatePreferencesDto,
} from './dto/preferences.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.userId, updateProfileDto);
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: any) {
    return this.userService.getPreferences(user.userId);
  }

  @Post('preferences')
  @HttpCode(HttpStatus.CREATED)
  async createPreferences(
    @CurrentUser() user: any,
    @Body() createPreferencesDto: CreatePreferencesDto,
  ) {
    return this.userService.createPreferences(user.userId, createPreferencesDto);
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.userService.updatePreferences(user.userId, updatePreferencesDto);
  }
}
