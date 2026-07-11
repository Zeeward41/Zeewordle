import { createFileRoute } from '@tanstack/react-router';
import { Register } from '../../pages/Register/Register.tsx';

export const Route = createFileRoute('/auth/register')({
    component: () => {
        return <Register />;
    },
});
