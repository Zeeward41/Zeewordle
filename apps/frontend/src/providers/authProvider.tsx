import { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.tsx';
import type { UserRecord } from '../types/auth.types.tsx';
import { API_ROUTES } from '../config/api.ts';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserRecord | null>(null);

    const login = (data: UserRecord): void => {
        setUser(data);
    };

    const logout = async (): Promise<void> => {
        const response = await fetch(API_ROUTES.logout, {
            method: 'POST',
        });
        if (response.ok) {
            setUser(null);
        }
    };

    useEffect(() => {
        const checkAuthStatus = async (): Promise<void> => {
            try {
                const response = await fetch(API_ROUTES.me);
                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = (await response.json()) as UserRecord;
                setUser(data);
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };
        void checkAuthStatus();
    }, []);

    return (
        <AuthContext value={{ user, login, logout }}>{children}</AuthContext>
    );
}
