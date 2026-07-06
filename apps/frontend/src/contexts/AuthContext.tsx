import { createContext } from 'react';
import type { UserRecord } from '../types/auth.types';

interface AuthContextType {
    user: UserRecord | null;
    login: (data: UserRecord) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
