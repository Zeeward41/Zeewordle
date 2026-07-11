import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { MainLayout } from '../layouts/MainLayout';
import { AuthProvider } from '../providers/authProvider';
import { Notifications } from '../components/Notifications/Notifications';
import { NotificationsProvider } from '../providers/notificationsProvider';

const RootLayout = () => (
    <AuthProvider>
        <NotificationsProvider>
            <MainLayout />
            <Notifications />
            <TanStackRouterDevtools />
        </NotificationsProvider>
    </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
