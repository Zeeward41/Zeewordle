import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterProvider,
} from '@tanstack/react-router';
import { AuthProvider } from '../../../providers/authProvider.tsx';
import { NotificationsProvider } from '../../../providers/notificationsProvider.tsx';
import { Notifications } from '../../../components/Notifications/Notifications.tsx';
import { ModalUserMenu } from '../../../components/ModalUserMenu/ModalUserMenu.tsx';
import { API_ROUTES } from '../../../config/api.ts';

const MockModalUserMenu = () => {
    const rootRoute = createRootRoute({
        component: () => (
            <ModalUserMenu
                onClose={vi.fn()}
                position={{ top: 100, left: 100 }}
            />
        ),
    });

    const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory(),
    });

    return (
        <AuthProvider>
            <NotificationsProvider>
                <Notifications />
                <RouterProvider router={router} />
            </NotificationsProvider>
        </AuthProvider>
    );
};

describe('ModalUserMenu', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(input => {
            if (input === API_ROUTES.me) {
                return Promise.resolve(
                    new Response(
                        JSON.stringify({
                            id: 122,
                            email: 'maria@mail.com',
                            username: 'maria',
                            role: ['user'],
                        }),
                        { status: 200 }
                    )
                );
            }

            return Promise.resolve(
                new Response(
                    JSON.stringify({
                        message: 'Successfully logged out',
                    }),
                    { status: 200 }
                )
            );
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should display an error notification when logout fails', async () => {
        const user = userEvent.setup();

        vi.mocked(globalThis.fetch).mockImplementation(input => {
            if (input === API_ROUTES.me) {
                return Promise.resolve(
                    new Response(
                        JSON.stringify({
                            id: 122,
                            email: 'maria@mail.com',
                            username: 'maria',
                            role: ['user'],
                        }),
                        { status: 200 }
                    )
                );
            }

            return Promise.resolve(
                new Response(
                    JSON.stringify({
                        message: 'Logout failed',
                        success: false,
                    }),
                    { status: 401 }
                )
            );
        });

        render(<MockModalUserMenu />);

        await waitFor(() => {
            expect(
                screen.getByRole('link', { name: /Logout/i })
            ).toBeInTheDocument();
        });

        await user.click(screen.getByRole('link', { name: /Logout/i }));

        expect(await screen.findByText('Logout failed')).toBeInTheDocument();
    });

    it('should handle network errors during logout', async () => {
        const user = userEvent.setup();

        vi.mocked(globalThis.fetch).mockImplementation(input => {
            if (input === API_ROUTES.me) {
                return Promise.resolve(
                    new Response(
                        JSON.stringify({
                            id: 122,
                            email: 'maria@mail.com',
                            username: 'maria',
                            role: ['user'],
                        }),
                        { status: 200 }
                    )
                );
            }

            return Promise.reject(new Error('Network error'));
        });

        render(<MockModalUserMenu />);

        await waitFor(() => {
            expect(
                screen.getByRole('link', { name: /Logout/i })
            ).toBeInTheDocument();
        });

        await user.click(screen.getByRole('link', { name: /Logout/i }));

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(API_ROUTES.logout, {
                method: 'POST',
                credentials: 'include',
            });
        });
    });
});
