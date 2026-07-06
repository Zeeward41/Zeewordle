import { createContext } from 'react';
import type { UserRecord } from '../types/auth.types';

interface AuthContextType {
    user: UserRecord | null;
    setUser: React.Dispatch<React.SetStateAction<UserRecord | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
