import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { MainLayout } from '../layouts/MainLayout';
import { AuthProvider } from '../providers/authProvider';
import { Notifications } from '../components/Notifications/Notifications';
import { NotificationsProvider } from '../providers/notificationsProvider';

import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId =
    window._env_?.VITE_GOOGLE_CLIENT_ID ??
    (import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string | undefined) ??
    '';

const RootLayout = () => (
    <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
            <NotificationsProvider>
                <MainLayout />
                <Notifications />
                <TanStackRouterDevtools />
            </NotificationsProvider>
        </AuthProvider>
    </GoogleOAuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
