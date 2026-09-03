import { createFileRoute } from '@tanstack/react-router';
import { Game } from '../pages/Game/Game';

export const Route = createFileRoute('/game')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Game />;
}
