import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';
import {
    getActiveGameByUserId,
    createGame,
    updateGameStatus,
    addGuessToGame,
} from '../models/game.model';
import { getRandomWord } from '../utils/dictionary.ts';
import type {
    GuessRequestBody,
    GameStatus,
    WordGuess,
} from '../types/game.types.ts';
import { evaluateGuess } from '../utils/gameUtils.ts';

// @desc        current Game
// @route       GET /api/v1/game/current
// @access      Private
export const gameCurrent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }

        let game;
        game = await getActiveGameByUserId(userId);
        if (!game) {
            const wordToGuess = getRandomWord();
            if (!wordToGuess) {
                throw new ErrorResponse('no words Available!!', 500);
            }
            game = await createGame(userId, wordToGuess);
        }

        res.status(200).json({ game });
    } catch (err) {
        next(err);
    }
};

// @desc        Stop Game
// @route       POST /api/v1/game/stop
// @access      Private
export const gameStop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }

        const activeGame = await getActiveGameByUserId(userId);
        if (!activeGame) {
            throw new ErrorResponse('Game not found', 404);
        }

        const game = await updateGameStatus(activeGame.id, 'ABANDONED');

        res.status(200).json({ game });
    } catch (err) {
        next(err);
    }
};

// @desc        Guess Game
// @route       POST /api/v1/game/guess
// @access      Private
export const gameGuess = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }

        const activeGame = await getActiveGameByUserId(userId);
        if (!activeGame) {
            throw new ErrorResponse('Game not found', 404);
        }
        const request = req.body as GuessRequestBody;
        const wordGuess = request.word;

        if (!wordGuess) {
            throw new ErrorResponse('Word is required', 400);
        } else if (wordGuess.length !== 5) {
            throw new ErrorResponse('Word must be 5 letters', 400);
        }

        const resultGuess = evaluateGuess(wordGuess, activeGame.wordToGuess);

        const guess: WordGuess = {
            word: wordGuess,
            evaluations: resultGuess,
            submittedAt: new Date().toISOString(),
        };
        await addGuessToGame(activeGame.id, guess);

        // 1. Check if WIN
        const isWon = resultGuess.every(item => item.status === 'CORRECT');

        // Check if user can do a new guess
        const isLost =
            !isWon && activeGame.guesses.length + 1 >= activeGame.maxAttempts;

        // Check is the status is WIN or LOST
        let newStatus: GameStatus = 'IN_PROGRESS';
        if (isWon) {
            newStatus = 'WON';
        } else if (isLost) {
            newStatus = 'LOST';
        }
        const game = await updateGameStatus(activeGame.id, newStatus);

        res.status(200).json({ game });
    } catch (err) {
        next(err);
    }
};
