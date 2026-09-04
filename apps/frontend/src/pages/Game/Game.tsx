import './Game.css';
import Keyboard from '../../components/Keyboard/Keyboard';
import GridComponent from '../../components/Grid/Grid';
import type { CellStatus } from '../../types/game.types.tsx';
import { useState, useEffect, useCallback } from 'react';
import type { requestStateType } from '../../types/request.types.tsx';
import { API_ROUTES } from '../../config/api.ts';
import { errorResponseSchema } from '../../schemas/auth.schema.ts';
import { useNotification } from '../../hooks/useNotifications.ts';
import type { WordleRow, WordleGrid } from '../../types/game.types.tsx';
import { apiResponseSchema } from '../../schemas/game.schema.ts';
import { ModalWrapper } from '../../components/ModalWrapper/ModalWrapper.tsx';
import { useNavigate } from '@tanstack/react-router';

const emptyGuess: WordleRow = [
    { letter: '', status: 'empty' },
    { letter: '', status: 'empty' },
    { letter: '', status: 'empty' },
    { letter: '', status: 'empty' },
    { letter: '', status: 'empty' },
];

export const Game = () => {
    const { showNotification } = useNotification();
    const [guess, setGuess] = useState<WordleGrid>([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const navigate = useNavigate();
    const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
    const [gameStatus, setGameStatus] = useState<string>('in_progress');
    const [_getGameRequest, setGetGameRequest] = useState<requestStateType>({
        status: 'loading',
        message: '',
    });

    const fetchGame = useCallback(
        async (signal: AbortSignal | null = null): Promise<void> => {
            try {
                const response = await fetch(API_ROUTES.gameCurrent, {
                    method: 'GET',
                    credentials: 'include',
                    ...(signal ? { signal } : {}),
                });
                const json = (await response.json()) as unknown;

                if (!response.ok) {
                    const data = errorResponseSchema.parse(json);
                    const notifErr = {
                        status: 'error' as const,
                        message: `${data.message}`,
                    };
                    setGetGameRequest(notifErr);
                    showNotification(notifErr);
                    return;
                }

                const result = apiResponseSchema.safeParse(json);

                if (!result.success) {
                    const zodErr = {
                        status: 'error' as const,
                        message: `Validation Error Zod`,
                    };
                    setGetGameRequest(zodErr);
                    showNotification(zodErr);
                    console.error(
                        'Erreur de validation Zod :',
                        result.error.format()
                    );
                    return;
                }

                setGameStatus(result.data.game.status);

                const fetchedGrid: WordleGrid = [];

                for (let i = 0; i < 5; i++) {
                    const currentGuess: WordleRow =
                        result.data.game.guesses[i] ?? emptyGuess;
                    fetchedGrid.push(currentGuess);
                }

                setGuess(fetchedGrid);

                const firstEmptyIndex = fetchedGrid.findIndex(
                    row => row[0]?.status === 'empty' && row[0]?.letter === ''
                );
                setCurrentRowIndex(
                    firstEmptyIndex !== -1 ? firstEmptyIndex : 5
                );
            } catch (err) {
                if ((err as Error).name === 'AbortError') return;
                const notifErrNet = {
                    status: 'error' as const,
                    message: 'Network error, please try again.',
                };
                setGetGameRequest(notifErrNet);
                showNotification(notifErrNet);
            }
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            await fetchGame(controller.signal);
        };

        void loadData();

        return () => {
            controller.abort();
        };
    }, [fetchGame]);

    const SubmitGuess = async (submittedWord: string): Promise<void> => {
        try {
            const response = await fetch(API_ROUTES.gameGuess, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: submittedWord }),
            });
            const json = (await response.json()) as unknown;
            if (!response.ok) {
                const data = errorResponseSchema.parse(json);

                const notifErr = {
                    status: 'error' as const,
                    message: `${data.message}`,
                };
                setGetGameRequest(notifErr);
                showNotification(notifErr);
                return;
            }
            const result = apiResponseSchema.safeParse(json);

            if (!result.success) {
                const zodErr = {
                    status: 'error' as const,
                    message: `Validation Error Zod`,
                };
                setGetGameRequest(zodErr);
                showNotification(zodErr);
                console.error(
                    'Erreur de validation Zod :',
                    result.error.format()
                );
                return;
            }
            setGameStatus(result.data.game.status);
            const fetchedGrid: WordleGrid = [];

            for (let i = 0; i < 5; i++) {
                const currentGuess: WordleRow =
                    result.data.game.guesses[i] ?? emptyGuess;
                fetchedGrid.push(currentGuess);
            }

            setGuess(fetchedGrid);
            const firstEmptyIndex = fetchedGrid.findIndex(
                row => row[0]?.status === 'empty' && row[0]?.letter === ''
            );
            setCurrentRowIndex(firstEmptyIndex !== -1 ? firstEmptyIndex : 5);
        } catch {
            const notifErrNet = {
                status: 'error' as const,
                message: 'Network error, please try again.',
            };
            setGetGameRequest(notifErrNet);
            showNotification(notifErrNet);
        }
    };

    const handleKey = (key: string) => {
        const isGameOver = gameStatus !== 'IN_PROGRESS';
        if (isGameOver || currentRowIndex >= 5 || !guess[currentRowIndex])
            return;

        const keyUpper = key.toUpperCase();

        const currentRow = guess[currentRowIndex];

        const currentWord = currentRow.map(cell => cell.letter).join('');

        if (keyUpper === 'ENTER') {
            if (currentWord.length < 5) {
                showNotification({
                    status: 'error',
                    message: 'Le mot doit contenir 5 lettres.',
                });
                return;
            }
            void SubmitGuess(currentWord);
            return;
        }

        if (keyUpper === 'BACKSPACE' || keyUpper === 'DELETE') {
            if (currentWord.length === 0) return;

            const updatedWord = currentWord.slice(0, -1);

            setGuess(prevGrid => {
                const nextGrid = [...prevGrid];
                const newRow: WordleRow = emptyGuess.map((_cell, index) => ({
                    letter: updatedWord[index] ?? '',
                    status: 'empty',
                })) as unknown as WordleRow;

                nextGrid[currentRowIndex] = newRow;
                return nextGrid;
            });
            return;
        }

        if (currentWord.length < 5 && /^[A-Z]$/.test(keyUpper)) {
            const updatedWord = currentWord + keyUpper;

            setGuess(prevGrid => {
                const nextGrid = [...prevGrid];
                const newRow: WordleRow = emptyGuess.map((_cell, index) => ({
                    letter: updatedWord[index] ?? '',
                    status: 'empty',
                })) as unknown as WordleRow;

                nextGrid[currentRowIndex] = newRow;
                return nextGrid;
            });
        }
    };

    const mockKeyStatuses: Record<string, CellStatus> = {
        C: 'correct',
        O: 'correct',
        E: 'correct',
        D: 'correct',
        R: 'wrong',
        A: 'wrong',
        T: 'wrong',
        S: 'wrong',
    };

    const handleConfirmCancel = async () => {
        setShowCancelModal(false);
        try {
            const response = await fetch(API_ROUTES.gameStop, {
                method: 'POST',
                credentials: 'include',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                // body: '{}',
            });
            const json = (await response.json()) as unknown;
            if (!response.ok) {
                const data = errorResponseSchema.parse(json);

                const notifErr = {
                    status: 'error' as const,
                    message: `${data.message}`,
                };
                setGetGameRequest(notifErr);
                showNotification(notifErr);
                return;
            }
            const result = apiResponseSchema.safeParse(json);

            if (!result.success) {
                const zodErr = {
                    status: 'error' as const,
                    message: `Validation Error Zod`,
                };
                setGetGameRequest(zodErr);
                showNotification(zodErr);
                console.error(
                    'Erreur de validation Zod :',
                    result.error.format()
                );
                return;
            }
            setGameStatus(result.data.game.status);
            const fetchedGrid: WordleGrid = [];

            for (let i = 0; i < 5; i++) {
                const currentGuess: WordleRow =
                    result.data.game.guesses[i] ?? emptyGuess;
                fetchedGrid.push(currentGuess);
            }

            setGuess(fetchedGrid);
            const firstEmptyIndex = fetchedGrid.findIndex(
                row => row[0]?.status === 'empty' && row[0]?.letter === ''
            );
            setCurrentRowIndex(firstEmptyIndex !== -1 ? firstEmptyIndex : 5);
        } catch {
            const notifErrNet = {
                status: 'error' as const,
                message: 'Network error, please try again.',
            };
            setGetGameRequest(notifErrNet);
            showNotification(notifErrNet);
        }
        await navigate({ to: '/' });
    };

    return (
        <div className="game__container">
            <div className="game">
                <button
                    className="game__cancel"
                    onClick={() => setShowCancelModal(true)}
                >
                    {' '}
                    Cancel{' '}
                </button>
                <GridComponent allLetters={guess} />
                <Keyboard handleKey={handleKey} keyStatuses={mockKeyStatuses} />
            </div>
            {/*  Victory Modal */}
            {gameStatus === 'WON' && (
                <ModalWrapper onClose={() => {}}>
                    <div className="modalGame__content modalGame__content--win">
                        <h2 className="modalGame__title">
                            🏆 Congratulations !
                        </h2>
                        <p className="modalGame__text">You found the word !</p>
                        <button
                            className="modalGame__btn modalGame__btn--primary"
                            onClick={() => void fetchGame()}
                        >
                            Play Again
                        </button>
                    </div>
                </ModalWrapper>
            )}
            {/*  Lost Modal */}
            {gameStatus === 'LOST' && (
                <ModalWrapper onClose={() => {}}>
                    <div className="modalGame__content modalGame__content--lost">
                        <h2 className="modalGame__title">💀 Game Over!</h2>
                        <p className="modalGame__text">
                            You did not find the mystery word.
                        </p>
                        <button
                            className="modalGame__btn modalGame__btn--primary"
                            onClick={() => void fetchGame()}
                        >
                            Play Again
                        </button>
                    </div>
                </ModalWrapper>
            )}
            {/* Modal stop */}
            {showCancelModal && (
                <ModalWrapper onClose={() => setShowCancelModal(false)}>
                    <div className="modalGame__content modalGame__content--confirm">
                        <h2 className="modalGame__title">⚠️ Give up?</h2>
                        <p className="modalGame__text">
                            Are you sure you want to abandon this game?
                        </p>
                        <div className="modalGame__actions">
                            <button
                                className="modalGame__btn modalGame__btn--secondary"
                                onClick={() => setShowCancelModal(false)}
                            >
                                No, continue
                            </button>
                            <button
                                className="modalGame__btn modalGame__btn--danger"
                                onClick={handleConfirmCancel}
                            >
                                Yes, give up
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
};
