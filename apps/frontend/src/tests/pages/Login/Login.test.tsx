import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Login } from '../../../pages/Login/Login.tsx';
import { userEvent } from '@testing-library/user-event';
import {
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterProvider,
} from '@tanstack/react-router';
import { NotificationsProvider } from '../../../providers/notificationsProvider.tsx';
import { Notifications } from '../../../components/Notifications/Notifications.tsx';
import { AuthProvider } from '../../../providers/authProvider.tsx';

const MockLogin = () => {
    const rootRoute = createRootRoute({ component: Login });
    const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory(),
    });
    return (
        <AuthProvider>
            <NotificationsProvider>
                <Notifications />
                <RouterProvider router={router} />;
            </NotificationsProvider>
        </AuthProvider>
    );
};

describe('login', () => {
    beforeEach(() => {
        render(<MockLogin />);
    });
    afterEach(() => {
        cleanup();
    });
    it('should update email field when user types', async () => {
        const emailInput = screen.getByPlaceholderText(/Email/i);

        await userEvent.type(emailInput, 'maria@mail.com');

        expect(emailInput).toHaveValue('maria@mail.com');
    });
    it('should update password field when user types', async () => {
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        await userEvent.type(passwordInput, 'The burning phoenix');

        expect(passwordInput).toHaveValue('The burning phoenix');
    });
    it('should display an error message when email is invalid', async () => {
        const emailInput = screen.getByPlaceholderText(/Email/i);

        await userEvent.type(emailInput, 'noEmail@a');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);

        const errorMessageEmail = screen.getByText(/Invalid email format/i);
        expect(errorMessageEmail).toBeInTheDocument();
    });
    it('should display an error message when password is invalid', async () => {
        const passwordInput = screen.getByPlaceholderText(/Password/i);

        await userEvent.type(passwordInput, 'n');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);

        const errorMessagePassword = screen.getByText(
            /The password must be at least 5 characters/i
        );
        expect(errorMessagePassword).toBeInTheDocument();
    });
    it('should not display any error message when all fields are valid', async () => {
        const emailInput = screen.getByPlaceholderText(/Email/i);
        await userEvent.type(emailInput, 'maria@mail.com');
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        await userEvent.type(passwordInput, 'The Burning Phoenix');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);

        const errorMessageEmail = screen.queryByText(/Invalid email format/i);
        const errorMessagePassword = screen.queryByText(
            /The password must be at least 5 characters/i
        );
        expect(errorMessageEmail).not.toBeInTheDocument();
        expect(errorMessagePassword).not.toBeInTheDocument();
    });
    it('should display loading when form is submitted', async () => {
        const submitButton = screen.getByRole('button', {
            name: /login/i,
        });

        await userEvent.click(submitButton);

        const submitButtonLoading = screen.getByRole('button', {
            name: /loading.../i,
        });

        expect(submitButtonLoading).toBeInTheDocument();
    });
    it('should display an error notification when server returns 401', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    message: 'email or password is incorrect',
                    success: false,
                }),
                { status: 401 }
            )
        );

        const emailInput = screen.getByPlaceholderText(/Email/i);
        await userEvent.type(emailInput, 'maria@mail.com');
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        await userEvent.type(passwordInput, 'The Burning Phoenix');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);

        const notif = await screen.findByText('email or password is incorrect');
        expect(notif).toBeInTheDocument();
    });
    it('should display an error notification when network fails', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
            new Error('Network error')
        );
        const emailInput = screen.getByPlaceholderText(/Email/i);
        await userEvent.type(emailInput, 'maria@mail.com');
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        await userEvent.type(passwordInput, 'The Burning Phoenix');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);

        const notif = await screen.findByText(
            'Network error, please try again.'
        );
        expect(notif).toBeInTheDocument();
    });
    it('should display a success notification when server returns 200', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
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

        const emailInput = screen.getByPlaceholderText(/Email/i);
        await userEvent.type(emailInput, 'maria@mail.com');
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        await userEvent.type(passwordInput, 'The Burning Phoenix');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);

        const notif = await screen.findByText(
            'You have successfully logged in.'
        );
        expect(notif).toBeInTheDocument();
    });
    it('should disable submit button when form is submitted', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
            () => new Promise((_resolve, _reject) => undefined)
        );
        const emailInput = screen.getByPlaceholderText(/Email/i);
        await userEvent.type(emailInput, 'maria@mail.com');
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        await userEvent.type(passwordInput, 'The Burning Phoenix');

        const buttonSubmit = screen.getByRole('button', {
            name: /login/i,
        });
        await userEvent.click(buttonSubmit);
        expect(buttonSubmit).toBeDisabled();
    });
});
