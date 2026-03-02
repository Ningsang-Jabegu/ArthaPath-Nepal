import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  CreatePreferencesDto,
  UpdatePreferencesDto,
} from './dto/preferences.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private preferencesRepository: Repository<UserPreference>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is already taken by another user
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update user fields
    if (updateProfileDto.name !== undefined) {
      user.name = updateProfileDto.name;
    }

    if (updateProfileDto.email !== undefined) {
      user.email = updateProfileDto.email;
    }

    await this.userRepository.save(user);

    // Return user without password
    const { password, ...result } = user;
    return result as User;
  }

  async getPreferences(userId: string): Promise<UserPreference | null> {
    const preferences = await this.preferencesRepository.findOne({
      where: { user_id: userId },
    });

    return preferences;
  }

  async createPreferences(
    userId: string,
    createPreferencesDto: CreatePreferencesDto,
  ): Promise<UserPreference> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if preferences already exist
    const existingPreferences = await this.preferencesRepository.findOne({
      where: { user_id: userId },
    });

    if (existingPreferences) {
      throw new ConflictException(
        'User preferences already exist. Use PATCH to update.',
      );
    }

    // Create new preferences
    const preferences = this.preferencesRepository.create({
      user_id: userId,
      risk_tolerance: createPreferencesDto.risk_tolerance,
      liquidity_need: createPreferencesDto.liquidity_need,
      has_emergency_fund: createPreferencesDto.has_emergency_fund,
    });

    return this.preferencesRepository.save(preferences);
  }

  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ): Promise<UserPreference> {
    let preferences = await this.preferencesRepository.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      // If preferences don't exist, create them
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      preferences = this.preferencesRepository.create({
        user_id: userId,
        risk_tolerance: updatePreferencesDto.risk_tolerance || 'Medium',
        liquidity_need: updatePreferencesDto.liquidity_need || 'Medium',
        has_emergency_fund: updatePreferencesDto.has_emergency_fund || false,
      });
    } else {
      // Update existing preferences
      if (updatePreferencesDto.risk_tolerance !== undefined) {
        preferences.risk_tolerance = updatePreferencesDto.risk_tolerance;
      }

      if (updatePreferencesDto.liquidity_need !== undefined) {
        preferences.liquidity_need = updatePreferencesDto.liquidity_need;
      }

      if (updatePreferencesDto.has_emergency_fund !== undefined) {
        preferences.has_emergency_fund =
          updatePreferencesDto.has_emergency_fund;
      }
    }

    return this.preferencesRepository.save(preferences);
  }
}
