import { expect, it, describe, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type * as reactRouter from '@tanstack/react-router';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useNotification } from '../../../hooks/useNotifications.ts';

import { Game } from '../../../pages/Game/Game.tsx';

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

describe('game', () => {
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

        render(<Game />);

        const loadingElement = screen.getByText(/LOADING.../i);

        expect(loadingElement).toBeInTheDocument();
    });

    it('should redirect to login page if user is not logged in', () => {
        vi.mocked(useAuth).mockReturnValueOnce({
            ...defaultAuth,
            user: null,
        });

        render(<Game />);

        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    it('should display the game when the user is authenticated', () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        status: 'IN_PROGRESS',
                        guesses: [],
                    },
                }),
                { status: 200 }
            )
        );

        render(<Game />);

        const cancelButton = screen.getByRole('button', {
            name: /Cancel/i,
        });

        expect(cancelButton).toBeInTheDocument();
    });

    it('should fetch the current game when the component is mounted', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        status: 'IN_PROGRESS',
                        guesses: [],
                    },
                }),
                { status: 200 }
            )
        );

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });
    });

    it('should display the current game guesses returned by the API', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        status: 'IN_PROGRESS',
                        guesses: [
                            [
                                { letter: 'C', status: 'correct' },
                                { letter: 'R', status: 'wrong' },
                                { letter: 'A', status: 'wrong' },
                                { letter: 'N', status: 'wrong' },
                                { letter: 'E', status: 'correct' },
                            ],
                        ],
                    },
                }),
                { status: 200 }
            )
        );

        render(<Game />);

        await waitFor(() => {
            expect(screen.getByText('C')).toBeInTheDocument();
            expect(screen.getByText('R')).toBeInTheDocument();
            expect(screen.getByText('A')).toBeInTheDocument();
            expect(screen.getByText('N')).toBeInTheDocument();
            expect(screen.getByText('E')).toBeInTheDocument();
        });
    });

    it('should display a notification when the game API returns an error', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    message: 'Game not found',
                }),
                { status: 404 }
            )
        );

        render(<Game />);

        await waitFor(() => {
            expect(defaultNotification.showNotification).toHaveBeenCalledOnce();
        });
    });

    it('should display a notification when the game API response fails validation', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    invalid: 'response',
                }),
                { status: 200 }
            )
        );

        render(<Game />);

        await waitFor(() => {
            expect(defaultNotification.showNotification).toHaveBeenCalledOnce();
        });
    });

    it('should display a notification when a network error occurs while fetching the game', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
            new Error('Network Error')
        );

        render(<Game />);

        await waitFor(() => {
            expect(defaultNotification.showNotification).toHaveBeenCalledOnce();
        });
    });

    it('should add a letter to the current row when a valid letter is pressed', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        status: 'IN_PROGRESS',
                        guesses: [],
                    },
                }),
                { status: 200 }
            )
        );

        const user = userEvent.setup();

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });

        await user.keyboard('A');

        expect(screen.getByText('A')).toBeInTheDocument();
    });
    it('should display an error notification when Enter is pressed with a word shorter than 5 letters', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        userId: 2,
                        status: 'IN_PROGRESS',
                        maxAttempts: 5,
                        wordToGuess: 'CODE',
                        guesses: [],
                        createdAt: '2026-01-01T00:00:00.000Z',
                        updatedAt: '2026-01-01T00:00:00.000Z',
                    },
                }),
                { status: 200 }
            )
        );

        const user = userEvent.setup();

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });

        await user.click(screen.getByRole('button', { name: 'A' }));
        await user.click(screen.getByRole('button', { name: 'B' }));
        await user.click(screen.getByRole('button', { name: 'C' }));
        await user.click(screen.getByRole('button', { name: '⏎' }));

        expect(defaultNotification.showNotification).toHaveBeenCalledWith({
            status: 'error',
            message: 'Le mot doit contenir 5 lettres.',
        });
    });

    it('should submit the current word when Enter is pressed with 5 letters', async () => {
        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        game: {
                            id: '550e8400-e29b-41d4-a716-446655440000',
                            userId: 2,
                            status: 'IN_PROGRESS',
                            maxAttempts: 5,
                            wordToGuess: 'CODE',
                            guesses: [],
                            createdAt: '2026-01-01T00:00:00.000Z',
                            updatedAt: '2026-01-01T00:00:00.000Z',
                        },
                    }),
                    { status: 200 }
                )
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        game: {
                            id: '550e8400-e29b-41d4-a716-446655440000',
                            userId: 2,
                            status: 'IN_PROGRESS',
                            maxAttempts: 5,
                            wordToGuess: 'CODE',
                            guesses: [],
                            createdAt: '2026-01-01T00:00:00.000Z',
                            updatedAt: '2026-01-01T00:00:00.000Z',
                        },
                    }),
                    { status: 200 }
                )
            );

        const user = userEvent.setup();

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });

        await user.click(screen.getByRole('button', { name: 'C' }));
        await user.click(screen.getByRole('button', { name: 'R' }));
        await user.click(screen.getByRole('button', { name: 'A' }));
        await user.click(screen.getByRole('button', { name: 'N' }));
        await user.click(screen.getByRole('button', { name: 'E' }));

        await user.click(screen.getByRole('button', { name: '⏎' }));

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(2);
        });

        expect(globalThis.fetch).toHaveBeenLastCalledWith(
            expect.anything(),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ word: 'CRANE' }),
            })
        );
    });

    it('should display the victory modal when the game status is WON', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        userId: 2,
                        status: 'WON',
                        maxAttempts: 5,
                        wordToGuess: 'CODE',
                        guesses: [],
                        createdAt: '2026-01-01T00:00:00.000Z',
                        updatedAt: '2026-01-01T00:00:00.000Z',
                    },
                }),
                { status: 200 }
            )
        );

        render(<Game />);

        await waitFor(() => {
            expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
        });
    });
    it('should display the game over modal when the game status is LOST', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        userId: 2,
                        status: 'LOST',
                        maxAttempts: 5,
                        wordToGuess: 'CODE',
                        guesses: [],
                        createdAt: '2026-01-01T00:00:00.000Z',
                        updatedAt: '2026-01-01T00:00:00.000Z',
                    },
                }),
                { status: 200 }
            )
        );

        render(<Game />);

        expect(await screen.findByText(/Game Over!/i)).toBeInTheDocument();
    });

    it('should open the confirmation modal when Cancel is clicked', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        status: 'IN_PROGRESS',
                        guesses: [],
                    },
                }),
                { status: 200 }
            )
        );

        const user = userEvent.setup();

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });

        await user.click(
            screen.getByRole('button', {
                name: /Cancel/i,
            })
        );

        expect(
            screen.getByText(/Are you sure you want to abandon this game/i)
        ).toBeInTheDocument();
    });
    it('should close the confirmation modal when No, continue is clicked', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    game: {
                        status: 'IN_PROGRESS',
                        guesses: [],
                    },
                }),
                { status: 200 }
            )
        );

        const user = userEvent.setup();

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });

        // Ouvre le modal
        await user.click(
            screen.getByRole('button', {
                name: /Cancel/i,
            })
        );

        const modalContent = screen.getByText(
            /Are you sure you want to abandon this game/i
        ).parentElement?.parentElement;

        expect(modalContent).toBeInTheDocument();
        if (!modalContent) {
            throw new Error('Modal content not found');
        }
        const continueButton = within(modalContent).getByRole('button', {
            name: /No, continue/i,
        });

        await user.click(continueButton);

        expect(
            screen.queryByText(/Are you sure you want to abandon this game/i)
        ).not.toBeInTheDocument();
    });
    it('should navigate to the home page when Yes, give up is clicked', async () => {
        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        game: {
                            id: '550e8400-e29b-41d4-a716-446655440000',
                            userId: 2,
                            status: 'IN_PROGRESS',
                            maxAttempts: 5,
                            wordToGuess: 'CODE',
                            guesses: [],
                            createdAt: '2026-01-01T00:00:00.000Z',
                            updatedAt: '2026-01-01T00:00:00.000Z',
                        },
                    }),
                    { status: 200 }
                )
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        game: {
                            id: '550e8400-e29b-41d4-a716-446655440000',
                            userId: 2,
                            status: 'ABANDONED',
                            maxAttempts: 5,
                            wordToGuess: 'CODE',
                            guesses: [],
                            createdAt: '2026-01-01T00:00:00.000Z',
                            updatedAt: '2026-01-01T00:00:00.000Z',
                        },
                    }),
                    { status: 200 }
                )
            );

        const user = userEvent.setup();

        render(<Game />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledOnce();
        });

        await user.click(
            screen.getByRole('button', {
                name: /Cancel/i,
            })
        );

        const modalContent = screen.getByText(
            /Are you sure you want to abandon this game/i
        ).parentElement?.parentElement;

        expect(modalContent).toBeInTheDocument();
        if (!modalContent) {
            throw new Error('Modal content not found');
        }

        const giveUpButton = within(modalContent).getByRole('button', {
            name: /Yes, give up/i,
        });

        await user.click(giveUpButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/',
            });
        });
    });
});
