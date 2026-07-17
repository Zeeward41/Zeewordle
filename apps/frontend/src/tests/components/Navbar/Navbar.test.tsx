import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../../../components/Navbar/Navbar';
import { useAuth } from '../../../hooks/useAuth.ts';
import userEvent from '@testing-library/user-event';

import {
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterProvider,
} from '@tanstack/react-router';
import { AuthProvider } from '../../../providers/authProvider.tsx';
import { NotificationsProvider } from '../../../providers/notificationsProvider.tsx';

const MockNavbar = () => {
    const rootRoute = createRootRoute({ component: Navbar });
    const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory(),
    });
    return (
        <AuthProvider>
            <NotificationsProvider>
                <RouterProvider router={router} />
            </NotificationsProvider>
        </AuthProvider>
    );
};

vi.mock('../../../hooks/useAuth.ts', () => ({
    useAuth: vi.fn(),
}));

describe('Navbar components', () => {
    it('should display ModalHomeMenu when the menu button is clicked and user is not logged in', async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            login: vi.fn(),
            logout: vi.fn(),
        });
        render(<MockNavbar />);

        const navbarMenu = await screen.findByTestId('navbar-menu-btn');
        await userEvent.click(navbarMenu);

        const modalHomeMenu = screen.getByTestId('modal-home-menu');

        expect(modalHomeMenu).toBeInTheDocument();
    });
    it('should display ModalUserMenu when the menu button is clicked and user is logged in', async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {
                id: 1,
                email: 'maria@mail.com',
                username: 'maria',
                role: ['user'],
            },
            login: vi.fn(),
            logout: vi.fn(),
        });
        render(<MockNavbar />);

        const navbarMenu = await screen.findByTestId('navbar-menu-btn');
        await userEvent.click(navbarMenu);

        const modalHomeMenu = screen.getByTestId('modal-user-menu');

        expect(modalHomeMenu).toBeInTheDocument();
    });
});
