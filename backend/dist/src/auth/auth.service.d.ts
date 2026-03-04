import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
    };
}
export declare class AuthService {
    private userRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    refreshToken(userId: string): Promise<AuthResponse>;
    validateUser(userId: string): Promise<User | null>;
    private generateTokens;
    private hashPassword;
    private comparePasswords;
}
