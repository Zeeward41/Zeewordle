import { createContext } from 'react';
import type { userSummaryType } from '../schemas/auth.schema';

interface AuthContextType {
    user: userSummaryType | null;
    login: (data: userSummaryType) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
