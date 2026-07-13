import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Register } from '../../../pages/Register/Register.tsx';
import { userEvent } from '@testing-library/user-event';
import {
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterProvider,
} from '@tanstack/react-router';
import { NotificationsProvider } from '../../../providers/notificationsProvider.tsx';
import { Notifications } from '../../../components/Notifications/Notifications.tsx';

const MockRegister = () => {
    const rootRoute = createRootRoute({ component: Register });
    const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory(),
    });
    return (
        <NotificationsProvider>
            <Notifications />
            <RouterProvider router={router} />;
        </NotificationsProvider>
    );
};

describe('register', () => {
    beforeEach(() => {
        render(<MockRegister />);
    });
    afterEach(() => {
        cleanup();
    });

    it('should update email field when user types', async () => {
        const emailInput = await screen.findByRole('textbox', {
            name: /email/i,
        });
        await userEvent.type(emailInput, 'test@mail.com');

        expect(emailInput).toHaveValue('test@mail.com');
    });
    it('should update username field when user types', async () => {
        const usernameInput = await screen.findByRole('textbox', {
            name: /username/i,
        });
        await userEvent.type(usernameInput, 'Maria');

        expect(usernameInput).toHaveValue('Maria');
    });
    it('should update password field when user types', async () => {
        const passwordInput = await screen.findByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'the burning phoenix');

        expect(passwordInput).toHaveValue('the burning phoenix');
    });
    it('should update passwordConfirm field when user types', async () => {
        const passwordConfirmInput =
            await screen.findByLabelText(/Confirm password/i);
        await userEvent.type(passwordConfirmInput, 'the burning phoenix');

        expect(passwordConfirmInput).toHaveValue('the burning phoenix');
    });
    it('should display an error message when email is invalid', async () => {
        const emailInput = await screen.findByRole('textbox', {
            name: /email/i,
        });
        await userEvent.type(emailInput, 'not-an@email');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(/invalid email format/i);

        expect(errorMessage).toBeInTheDocument();
    });
    it('should display an error message when username is too short', async () => {
        //The username must be at least 5 characters
        const usernameInput = await screen.findByRole('textbox', {
            name: /username/i,
        });
        await userEvent.type(usernameInput, 'a');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(
            /The username must be at least 5 characters/i
        );

        expect(errorMessage).toBeInTheDocument();
    });
    it('should display an error message when username is too long', async () => {
        //The username must be at least 5 characters
        const usernameInput = await screen.findByRole('textbox', {
            name: /username/i,
        });
        await userEvent.type(usernameInput, 'aaaaaaaaaaaaaaaaaaaaa');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(
            /The username must have a maximum of 15 characters/i
        );

        expect(errorMessage).toBeInTheDocument();
    });
    it('should display an error message when password is too short', async () => {
        const passwordInput = await screen.findByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'a');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(
            /The password must be at least 5 characters/i
        );

        expect(errorMessage).toBeInTheDocument();
    });
    it('should display an error message when password is empty', async () => {
        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(
            /The password must be at least 5 characters/i
        );

        expect(errorMessage).toBeInTheDocument();
    });
    it('should display an error message when passwords do not match', async () => {
        const passwordInput = await screen.findByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'phoenix');

        const confirmPasswordInput =
            await screen.findByLabelText(/confirm password/i);
        await userEvent.type(confirmPasswordInput, 'phoenixx');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(/Password do not match/i);

        expect(errorMessage).toBeInTheDocument();
    });
    it('should not display any error message when all fields are valid', async () => {
        const emailInput = await screen.findByRole('textbox', {
            name: /email/i,
        });
        await userEvent.type(emailInput, 'vanille@mail.com');

        const usernameInput = await screen.findByRole('textbox', {
            name: /username/i,
        });
        await userEvent.type(usernameInput, 'Maria');

        const passwordInput = await screen.findByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'phoenix');

        const confirmPasswordInput =
            await screen.findByLabelText(/confirm password/i);
        await userEvent.type(confirmPasswordInput, 'phoenix');
        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });
        await userEvent.click(submitButton);

        const errorMessageConfirmPassword = screen.queryByText(
            /Password do not match/i
        );
        const errorMessagePassword = screen.queryByText(
            /The password must be at least 5 characters/i
        );
        const errorMessageEmail = screen.queryByText(/invalid email format/i);
        const errorMessageUsernameShort = screen.queryByText(
            /The username must be at least 5 characters/i
        );
        const errorMessageUsernameLong = screen.queryByText(
            /The username must have a maximum of 15 characters/i
        );

        expect(errorMessageConfirmPassword).not.toBeInTheDocument();
        expect(errorMessagePassword).not.toBeInTheDocument();
        expect(errorMessageEmail).not.toBeInTheDocument();
        expect(errorMessageUsernameShort).not.toBeInTheDocument();
        expect(errorMessageUsernameLong).not.toBeInTheDocument();
    });
    it('should display loading when form is submitted', async () => {
        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });

        await userEvent.click(submitButton);

        const submitButtonLoading = await screen.findByRole('button', {
            name: /loading/i,
        });

        expect(submitButtonLoading).toBeInTheDocument();
    });
    it('should display an error notification when server returns 409', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    message: 'Account already exists',
                    success: false,
                }),
                { status: 409 }
            )
        );
        const emailInput = await screen.findByRole('textbox', {
            name: /email/i,
        });
        await userEvent.type(emailInput, 'vanille@mail.com');
        const usernameInput = screen.getByLabelText(/username/i);
        await userEvent.type(usernameInput, 'vanille');
        const passwordInput = screen.getByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'phoenix');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        await userEvent.type(confirmPasswordInput, 'phoenix');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });

        await userEvent.click(submitButton);

        const notif = await screen.findByText('Account already exists');
        expect(notif).toBeInTheDocument();
    });
    it('should display a success notification when server returns 201', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    user: {
                        id: 135,
                        email: 'vanille@mail.com',
                        username: 'vanille',
                        role: ['user'],
                    },
                }),
                { status: 201 }
            )
        );
        const emailInput = await screen.findByRole('textbox', {
            name: /email/i,
        });
        await userEvent.type(emailInput, 'vanille@mail.com');
        const usernameInput = screen.getByLabelText(/username/i);
        await userEvent.type(usernameInput, 'vanille');
        const passwordInput = screen.getByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'phoenix');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        await userEvent.type(confirmPasswordInput, 'phoenix');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });

        await userEvent.click(submitButton);

        const notif = await screen.findByText(
            'You have successfully logged in.'
        );
        expect(notif).toBeInTheDocument();
    });
    it('should display an error notification when network fails', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
            new Error('Network error')
        );
        const emailInput = await screen.findByRole('textbox', {
            name: /email/i,
        });
        await userEvent.type(emailInput, 'vanille@mail.com');
        const usernameInput = screen.getByLabelText(/username/i);
        await userEvent.type(usernameInput, 'vanille');
        const passwordInput = screen.getByLabelText(/new password/i);
        await userEvent.type(passwordInput, 'phoenix');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        await userEvent.type(confirmPasswordInput, 'phoenix');

        const submitButton = await screen.findByRole('button', {
            name: /Sign Up/i,
        });

        await userEvent.click(submitButton);

        const notif = await screen.findByText(
            'Network error, please try again.'
        );
        expect(notif).toBeInTheDocument();
    });
});
