export interface RegisterBody {
    email: string;
    username: string;
    password?: string;
    google_id?: string;
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
    has_password?: boolean;
}

export interface RegisterResponse {
    user: UserRecord;
}

export interface DBUser {
    id: number;
    email: string;
    username: string;
    password_hash: string | null;
    google_id?: string | null;
    role: string[];
    created_at: Date;
}

// export interface GoogleAuthResponse {
//     user: UserRecord;
// }
