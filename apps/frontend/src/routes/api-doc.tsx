import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api-doc')({
    component: RouteComponent,
    ssr: false,
});

function RouteComponent() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
            }}
        >
            <iframe
                src="/docs/api-docs.html"
                title="Documentation API"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            />
        </div>
    );
}
