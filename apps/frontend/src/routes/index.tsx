import { createFileRoute } from '@tanstack/react-router';
import './index.css';

export const Route = createFileRoute('/')({
    component: () => {
        return (
            <>
                <p>Hello</p>
            </>
        );
    },
});
