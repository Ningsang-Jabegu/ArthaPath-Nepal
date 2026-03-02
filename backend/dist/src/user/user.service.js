"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_preference_entity_1 = require("../entities/user-preference.entity");
let UserService = class UserService {
    userRepository;
    preferencesRepository;
    constructor(userRepository, preferencesRepository) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'email', 'name', 'created_at', 'updated_at'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: updateProfileDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (updateProfileDto.name !== undefined) {
            user.name = updateProfileDto.name;
        }
        if (updateProfileDto.email !== undefined) {
            user.email = updateProfileDto.email;
        }
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }
    async getPreferences(userId) {
        const preferences = await this.preferencesRepository.findOne({
            where: { user_id: userId },
        });
        return preferences;
    }
    async createPreferences(userId, createPreferencesDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingPreferences = await this.preferencesRepository.findOne({
            where: { user_id: userId },
        });
        if (existingPreferences) {
            throw new common_1.ConflictException('User preferences already exist. Use PATCH to update.');
        }
        const preferences = this.preferencesRepository.create({
            user_id: userId,
            risk_tolerance: createPreferencesDto.risk_tolerance,
            liquidity_need: createPreferencesDto.liquidity_need,
            has_emergency_fund: createPreferencesDto.has_emergency_fund,
        });
        return this.preferencesRepository.save(preferences);
    }
    async updatePreferences(userId, updatePreferencesDto) {
        let preferences = await this.preferencesRepository.findOne({
            where: { user_id: userId },
        });
        if (!preferences) {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            preferences = this.preferencesRepository.create({
                user_id: userId,
                risk_tolerance: updatePreferencesDto.risk_tolerance || 'Medium',
                liquidity_need: updatePreferencesDto.liquidity_need || 'Medium',
                has_emergency_fund: updatePreferencesDto.has_emergency_fund || false,
            });
        }
        else {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_preference_entity_1.UserPreference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map