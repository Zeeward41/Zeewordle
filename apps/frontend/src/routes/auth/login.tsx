import { createFileRoute } from '@tanstack/react-router';
import { Login } from '../../pages/Login/Login.tsx';

export const Route = createFileRoute('/auth/login')({
    component: () => {
        return <Login />;
    },
});
