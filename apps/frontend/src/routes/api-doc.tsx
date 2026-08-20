import { createFileRoute } from '@tanstack/react-router';
import apiDocsHtml from '../../public/docs/api-docs.html?raw';

export const Route = createFileRoute('/api-doc')({
    component: RouteComponent,
    ssr: false,
});

function RouteComponent() {
    return (
        <div
            className="api-doc-wrapper"
            dangerouslySetInnerHTML={{ __html: apiDocsHtml }}
        />
    );
}
