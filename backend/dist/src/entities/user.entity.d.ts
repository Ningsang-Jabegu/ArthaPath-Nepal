export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}
