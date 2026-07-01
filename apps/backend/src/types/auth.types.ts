export interface RegisterBody {
    email: string;
    username: string;
    password: string;
}
export interface LoginBodyByEmail {
    email: string;
    password: string;
}
export interface UserRecord {
    id: number;
    email: string;
    username: string;
    role: string[];
}
export interface RegisterResponse {
    user: UserRecord;
}

export interface DBUser {
    id: number;
    email: string;
    username: string;
    password_hash: string;
    role: string[];
    created_at: Date;
}
