import { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.tsx';
import {
    userSummarySchema,
    type userSummaryType,
} from '../schemas/auth.schema.ts';
import { API_ROUTES } from '../config/api.ts';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<userSummaryType | null>(null);

    const login = (data: userSummaryType): void => {
        setUser(data);
    };

    const logout = (): void => {
        setUser(null);
    };

    useEffect(() => {
        const checkAuthStatus = async (): Promise<void> => {
            try {
                const response = await fetch(API_ROUTES.me, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    setUser(null);
                    return;
                }

                // const data = (await response.json()) as userSummaryType;
                const json = (await response.json()) as unknown;
                const data = userSummarySchema.parse(json);
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
