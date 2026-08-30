import { createFileRoute } from '@tanstack/react-router';
import { Settings } from '../../pages/Settings/Settings.tsx';

export const Route = createFileRoute('/users/profile')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Settings />;
}
