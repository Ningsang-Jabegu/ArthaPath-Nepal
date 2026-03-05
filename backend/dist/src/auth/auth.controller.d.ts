import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    refresh(user: any): Promise<AuthResponse>;
    getProfile(user: any): Promise<any>;
}
