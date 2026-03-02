import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreatePreferencesDto, UpdatePreferencesDto } from './dto/preferences.dto';
export declare class UserService {
    private userRepository;
    private preferencesRepository;
    constructor(userRepository: Repository<User>, preferencesRepository: Repository<UserPreference>);
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    getPreferences(userId: string): Promise<UserPreference | null>;
    createPreferences(userId: string, createPreferencesDto: CreatePreferencesDto): Promise<UserPreference>;
    updatePreferences(userId: string, updatePreferencesDto: UpdatePreferencesDto): Promise<UserPreference>;
}
