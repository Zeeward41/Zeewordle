import { it, describe, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { gameCurrent, gameStop, gameGuess } from '../../controllers/games';
import { evaluateGuess } from '../../utils/gameUtils.ts';
import type { Game, LetterEvaluation } from '../../types/game.types.ts';
import {
    getActiveGameByUserId,
    createGame,
    updateGameStatus,
    addGuessToGame,
} from '../../models/game.model';
import { getRandomWord } from '../../utils/dictionary';

vi.mock('../../models/game.model.ts', () => ({
    getActiveGameByUserId: vi.fn(),
    createGame: vi.fn(),
    updateGameStatus: vi.fn(),
    addGuessToGame: vi.fn(),
}));

vi.mock('../../utils/dictionary.ts', () => ({
    getRandomWord: vi.fn(),
}));

vi.mock('../../utils/gameUtils.ts', () => ({
    evaluateGuess: vi.fn(),
}));

// -----------
// gameCurrent route
// -----------

describe('gameCurrent route', () => {
    let res: Response;
    let next: NextFunction;
    let req: Request;
    let game: Game;

    beforeEach(() => {
        vi.clearAllMocks();

        // RESPONSE
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        // NEXT
        next = vi.fn() as NextFunction;

        // Request
        req = {
            session: {
                userId: 122,
            },
        } as unknown as Request;

        // Game
        game = {
            id: '612f7d39-8660-4042-8311-6c0c678bb8e1',
            userId: 122,
            status: 'IN_PROGRESS',
            wordToGuess: 'apple',
            maxAttempts: 6,
            guesses: [],
            createdAt: new Date('2026-08-31T16:09:50.811Z'),
            updatedAt: new Date('2026-08-31T16:09:50.811Z'),
        };
    });
    it('should have a function gameCurrent', () => {
        expect(typeof gameCurrent).toBe('function');
    });
    it('should have 3 arguments', () => {
        expect(gameCurrent).toHaveLength(3);
    });
    it('should proceed and return 200 when user is authenticated', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(game);
        await gameCurrent(req, res, next);

        expect(getActiveGameByUserId).toHaveBeenCalledWith(122);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ game });
        expect(next).not.toHaveBeenCalled();
    });
    it('should throw ErrorResponse 401 if user is not authenticated', async () => {
        req = {
            session: {
                userId: null,
            },
        } as unknown as Request;
        await gameCurrent(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Unauthorized!!',
                statusCode: 401,
            })
        );
    });
    it('should return error 500 if no words are available', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(null);
        vi.mocked(getRandomWord).mockReturnValue(null);
        await gameCurrent(req, res, next);

        expect(getActiveGameByUserId).toHaveBeenCalledWith(122);
        expect(getRandomWord).toHaveBeenCalledOnce();
        expect(createGame).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'no words Available!!',
                statusCode: 500,
            })
        );
    });
    it('should return a game', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(null);
        vi.mocked(getRandomWord).mockReturnValue('apple');
        vi.mocked(createGame).mockResolvedValue(game);

        await gameCurrent(req, res, next);

        expect(getActiveGameByUserId).toHaveBeenCalledWith(122);
        expect(getRandomWord).toHaveBeenCalledOnce();
        expect(createGame).toHaveBeenCalledWith(122, 'apple');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(next).not.toHaveBeenCalled();
    });
});

// -----------
// gameStop route
// -----------

describe('gameStop route', () => {
    let res: Response;
    let next: NextFunction;
    let req: Request;
    let game: Game;
    let gameAbandoned: Game;

    beforeEach(() => {
        vi.clearAllMocks();

        // RESPONSE
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        // NEXT
        next = vi.fn() as NextFunction;

        // Request
        req = {
            session: {
                userId: 122,
            },
        } as unknown as Request;

        // Game
        game = {
            id: '612f7d39-8660-4042-8311-6c0c678bb8e1',
            userId: 122,
            status: 'IN_PROGRESS',
            wordToGuess: 'apple',
            maxAttempts: 6,
            guesses: [],
            createdAt: new Date('2026-08-31T16:09:50.811Z'),
            updatedAt: new Date('2026-08-31T16:09:50.811Z'),
        };

        gameAbandoned = {
            id: '612f7d39-8660-4042-8311-6c0c678bb8e1',
            userId: 122,
            status: 'ABANDONED',
            wordToGuess: 'apple',
            maxAttempts: 6,
            guesses: [],
            createdAt: new Date('2026-08-31T16:09:50.811Z'),
            updatedAt: new Date('2026-08-31T16:09:50.811Z'),
        };
    });
    it('should have a function gameCurrent', () => {
        expect(typeof gameStop).toBe('function');
    });
    it('should have 3 arguments', () => {
        expect(gameStop).toHaveLength(3);
    });
    it('should proceed and return 200 when user is authenticated', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(game);
        vi.mocked(updateGameStatus).mockResolvedValue(gameAbandoned);
        await gameStop(req, res, next);

        expect(getActiveGameByUserId).toHaveBeenCalledWith(122);
        expect(updateGameStatus).toHaveBeenCalledWith(game.id, 'ABANDONED');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ game: gameAbandoned });
        expect(next).not.toHaveBeenCalled();
    });
    it('should throw ErrorResponse 401 if user is not authenticated', async () => {
        req = {
            session: {
                userId: null,
            },
        } as unknown as Request;
        await gameStop(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Unauthorized!!',
                statusCode: 401,
            })
        );
    });
    it('should return ErrorResponse 404 if no active game is found', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(null);
        await gameStop(req, res, next);

        expect(getActiveGameByUserId).toHaveBeenCalledWith(122);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Game not found',
                statusCode: 404,
            })
        );
    });
});

// -----------
// gameGuess route
// -----------

describe('gameGuess route', () => {
    let res: Response;
    let next: NextFunction;
    let req: Request;
    let game: Game;
    let evalGuessValue: LetterEvaluation[];

    beforeEach(() => {
        vi.clearAllMocks();

        // RESPONSE
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        // NEXT
        next = vi.fn() as NextFunction;

        // Request
        req = {
            session: {
                userId: 122,
            },
            body: {
                word: 'apple',
            },
        } as unknown as Request;

        // Game
        game = {
            id: '612f7d39-8660-4042-8311-6c0c678bb8e1',
            userId: 122,
            status: 'IN_PROGRESS',
            wordToGuess: 'apple',
            maxAttempts: 6,
            guesses: [],
            createdAt: new Date('2026-08-31T16:09:50.811Z'),
            updatedAt: new Date('2026-08-31T16:09:50.811Z'),
        };

        evalGuessValue = [
            { letter: 'A', status: 'CORRECT' },
            { letter: 'P', status: 'CORRECT' },
            { letter: 'P', status: 'CORRECT' },
            { letter: 'L', status: 'CORRECT' },
            { letter: 'E', status: 'CORRECT' },
        ] as LetterEvaluation[];
    });
    it('should have a function gameGuess', () => {
        expect(typeof gameGuess).toBe('function');
    });
    it('should have 3 arguments', () => {
        expect(gameGuess).toHaveLength(3);
    });
    it('should pass ErrorResponse 401 to next() when user is not authenticated', async () => {
        req = {
            session: {
                userId: null,
            },
        } as unknown as Request;
        await gameGuess(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Unauthorized!!',
                statusCode: 401,
            })
        );
    });
    it('should pass ErrorResponse 404 to next() when active game is not found', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(null);

        await gameGuess(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Game not found',
                statusCode: 404,
            })
        );
    });
    it('should pass ErrorResponse 400 to next() when word is missing from request body', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(game);
        req = {
            session: {
                userId: 122,
            },
            body: {
                word: null,
            },
        } as unknown as Request;

        await gameGuess(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Word is required',
                statusCode: 400,
            })
        );
    });
    it('should pass ErrorResponse 400 to next() when word length is not 5 letters', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(game);
        req = {
            session: {
                userId: 122,
            },
            body: {
                word: 'aa',
            },
        } as unknown as Request;

        await gameGuess(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Word must be 5 letters',
                statusCode: 400,
            })
        );
    });
    it('should update status to WON when guess is correct', async () => {
        vi.mocked(getActiveGameByUserId).mockResolvedValue(game);
        vi.mocked(evaluateGuess).mockReturnValue(evalGuessValue);
        vi.mocked(updateGameStatus).mockResolvedValue({
            ...game,
            status: 'WON',
        });
        req = {
            session: {
                userId: 122,
            },
            body: {
                word: 'apple',
            },
        } as unknown as Request;

        await gameGuess(req, res, next);

        expect(evaluateGuess).toHaveBeenCalledWith('apple', game.wordToGuess);
        expect(addGuessToGame).toHaveBeenCalledWith(
            game.id,
            expect.objectContaining({ word: 'apple' })
        );
        expect(updateGameStatus).toHaveBeenCalledWith(game.id, 'WON');
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should update status to LOST when maximum attempts are reached', async () => {
        const gameWith5Attempts = {
            ...game,
            guesses: [{}, {}, {}, {}, {}], // max tries
        } as Game;
        vi.mocked(getActiveGameByUserId).mockResolvedValue(gameWith5Attempts);
        vi.mocked(evaluateGuess).mockReturnValue([
            { letter: 'W', status: 'WRONG' },
            { letter: 'R', status: 'WRONG' },
            { letter: 'O', status: 'WRONG' },
            { letter: 'N', status: 'WRONG' },
            { letter: 'G', status: 'WRONG' },
        ]);
        vi.mocked(updateGameStatus).mockResolvedValue({
            ...gameWith5Attempts,
            status: 'LOST',
        });
        req = {
            session: {
                userId: 122,
            },
            body: {
                word: 'wrong',
            },
        } as unknown as Request;

        await gameGuess(req, res, next);

        expect(updateGameStatus).toHaveBeenCalledWith(game.id, 'LOST');
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should keep status IN_PROGRESS when guess is wrong but attempts remain', async () => {
        const gameWith3Attempts = {
            ...game,
            guesses: [{}, {}, {}], // 3 tries
        } as Game;
        vi.mocked(getActiveGameByUserId).mockResolvedValue(gameWith3Attempts);
        vi.mocked(evaluateGuess).mockReturnValue([
            { letter: 'W', status: 'WRONG' },
            { letter: 'R', status: 'WRONG' },
            { letter: 'O', status: 'WRONG' },
            { letter: 'N', status: 'WRONG' },
            { letter: 'G', status: 'WRONG' },
        ]);
        vi.mocked(updateGameStatus).mockResolvedValue({
            ...gameWith3Attempts,
            status: 'IN_PROGRESS',
        });
        req = {
            session: {
                userId: 122,
            },
            body: {
                word: 'wrong',
            },
        } as unknown as Request;

        await gameGuess(req, res, next);

        expect(updateGameStatus).toHaveBeenCalledWith(game.id, 'IN_PROGRESS');
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
