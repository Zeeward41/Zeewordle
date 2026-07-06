import { useState } from 'react';
import { AuthContext } from '../contexts/AuthContext.tsx';
import type { UserRecord } from '../types/auth.types.tsx';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserRecord | null>(null);

    return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
}
