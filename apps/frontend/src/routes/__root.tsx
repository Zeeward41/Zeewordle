import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { MainLayout } from '../layouts/MainLayout';
import { AuthProvider } from '../providers/authProvider';

const RootLayout = () => (
    <AuthProvider>
        <MainLayout />
        <TanStackRouterDevtools />
    </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
