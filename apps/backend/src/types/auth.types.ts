export interface RegisterBody {
    email: string;
    username: string;
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
