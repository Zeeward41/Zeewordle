import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/api-doc')({
    component: RouteComponent,
    ssr: false,
});

function RouteComponent() {
    useEffect(() => {
        window.location.replace('/docs/api-docs.html');
    }, []);

    return null;
}
