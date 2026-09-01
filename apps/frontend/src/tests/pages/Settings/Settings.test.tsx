import { expect, it, describe, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type * as reactRouter from '@tanstack/react-router';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useNotification } from '../../../hooks/useNotifications.ts';

import { Settings } from '../../../pages/Settings/Settings.tsx';

const mockNavigate = vi.fn();

vi.mock('../../../hooks/useNotifications', () => ({
    useNotification: vi.fn(),
}));
vi.mock('../../../hooks/useAuth.ts', () => ({
    useAuth: vi.fn(),
}));
vi.mock('@tanstack/react-router', async importOriginal => {
    const actual = await importOriginal<typeof reactRouter>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Navigate: ({ to }: { to: string }) => {
            mockNavigate(to);
            return null;
        },
    };
});

const defaultNotification = {
    notification: null,
    showNotification: vi.fn(),
};

const defaultAuth = {
    logout: vi.fn(),
    user: {
        email: 'john@mail.com',
        username: 'john',
        role: ['user'] as ('user' | 'admin')[],
        id: 2,
    },
    isLoading: false,
    login: vi.fn(),
};

describe('settings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue(defaultAuth);
        vi.mocked(useNotification).mockReturnValue(defaultNotification);
    });
    it('should show a loader if authentication is loading', () => {
        vi.mocked(useAuth).mockReturnValueOnce({
            ...defaultAuth,
            isLoading: true,
        });
        render(<Settings />);

        const loadingElement = screen.getByText(/LOADING.../i);

        expect(loadingElement).toBeInTheDocument();
    });
    it('should redirect to login page if user is not logged in', () => {
        vi.mocked(useAuth).mockReturnValueOnce({
            ...defaultAuth,
            user: null,
        });
        render(<Settings />);

        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });
    it('should display user information correctly', () => {
        render(<Settings />);

        const emailElement = screen.getByLabelText(/email/i);
        const usernameElement = screen.getByLabelText(/username/i);

        expect(emailElement).toBeInTheDocument();
        expect(emailElement).toHaveValue('john@mail.com');
        expect(usernameElement).toBeInTheDocument();
        expect(usernameElement).toHaveValue('john');
    });
    it('should open and close confirmation modal on button clicks', async () => {
        render(<Settings />);

        const buttonElement = screen.getByRole('button', {
            name: /Delete your Account/i,
        });

        await userEvent.click(buttonElement);

        expect(buttonElement).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        const validationButton = screen.getByRole('button', {
            name: /Delete account/i,
        });

        expect(cancelButton).toBeInTheDocument();
        expect(validationButton).toBeInTheDocument();

        await userEvent.click(cancelButton);

        expect(cancelButton).not.toBeInTheDocument();
    });
    it('should handle successful account deletion', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(JSON.stringify({ data: 'User deleted' }), {
                status: 200,
            })
        );
        render(<Settings />);

        const buttonElement = screen.getByRole('button', {
            name: /Delete your Account/i,
        });

        await userEvent.click(buttonElement);

        expect(buttonElement).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        const validationButton = screen.getByRole('button', {
            name: /Delete account/i,
        });

        expect(cancelButton).toBeInTheDocument();
        expect(validationButton).toBeInTheDocument();

        await userEvent.click(validationButton);

        expect(defaultAuth.logout).toHaveBeenCalledOnce();
    });
    it('should handle errors returned by the API', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({ data: 'This id does not exist !!' }),
                {
                    status: 401,
                }
            )
        );
        render(<Settings />);
        const buttonElement = screen.getByRole('button', {
            name: /Delete your Account/i,
        });
        await userEvent.click(buttonElement);

        const validationButton = screen.getByRole('button', {
            name: /Delete account/i,
        });
        await userEvent.click(validationButton);

        await waitFor(() => {
            expect(defaultNotification.showNotification).toHaveBeenCalledOnce();
        });
    });
    it('handle network errors during deletion', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(JSON.stringify({ data: 'Network Error' }), {
                status: 500,
            })
        );
        render(<Settings />);
        const buttonElement = screen.getByRole('button', {
            name: /Delete your Account/i,
        });
        await userEvent.click(buttonElement);

        const validationButton = screen.getByRole('button', {
            name: /Delete account/i,
        });
        await userEvent.click(validationButton);

        await waitFor(() => {
            expect(defaultNotification.showNotification).toHaveBeenCalledOnce();
        });
    });
});
