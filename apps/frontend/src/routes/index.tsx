import { createFileRoute } from '@tanstack/react-router';
import './index.css';
import { Home } from '../pages/Home/Home';

export const Route = createFileRoute('/')({
    component: () => {
        return (
            <>
                <Home />
            </>
        );
    },
});
