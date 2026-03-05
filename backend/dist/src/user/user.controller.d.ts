import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreatePreferencesDto, UpdatePreferencesDto } from './dto/preferences.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: any): Promise<User>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<User>;
    getPreferences(user: any): Promise<import("../entities/user-preference.entity").UserPreference | null>;
    createPreferences(user: any, createPreferencesDto: CreatePreferencesDto): Promise<import("../entities/user-preference.entity").UserPreference>;
    updatePreferences(user: any, updatePreferencesDto: UpdatePreferencesDto): Promise<import("../entities/user-preference.entity").UserPreference>;
}
