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

import {
    zeewordle_game_guess_duration_seconds,
    zeewordle_game_guess_requests_total,
    zeewordle_game_guess_unauthorized_total,
    zeewordle_game_guess_not_found_total,
    zeewordle_game_guess_invalid_input_total,
    zeewordle_game_guess_submitted_total,
    zeewordle_game_outcomes_total,
    zeewordle_game_winning_attempts,
} from '../metrics/gameGuess.metrics.ts';

import {
    zeewordle_game_stop_duration_seconds,
    zeewordle_game_stop_requests_total,
    zeewordle_game_stop_unauthorized_total,
    zeewordle_game_stop_not_found_total,
    zeewordle_game_abandoned_total,
} from '../metrics/gameStop.metrics.ts';

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
    const endStopTimer = zeewordle_game_stop_duration_seconds.startTimer();
    zeewordle_game_stop_requests_total.inc();
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
        zeewordle_game_abandoned_total.inc();

        endStopTimer({ status: '200', reason: 'success' });
        res.status(200).json({ game });
    } catch (err) {
        if (err instanceof ErrorResponse) {
            if (err.statusCode === 401 && err.message === 'Unauthorized!!') {
                zeewordle_game_stop_unauthorized_total.inc();
                endStopTimer({ status: '401', reason: 'Unauthorized' });
            } else if (
                err.statusCode === 404 &&
                err.message === 'Game not found'
            ) {
                zeewordle_game_stop_not_found_total.inc();
                endStopTimer({ status: '404', reason: 'Game_not_found' });
            }
        } else {
            endStopTimer({ status: 500, reason: 'failure' });
        }
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
    const endGuessTimer = zeewordle_game_guess_duration_seconds.startTimer();
    zeewordle_game_guess_requests_total.inc();
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
            zeewordle_game_outcomes_total.inc({ status: 'WON' });
            zeewordle_game_winning_attempts.observe(
                activeGame.guesses.length + 1
            );
            newStatus = 'WON';
        } else if (isLost) {
            zeewordle_game_outcomes_total.inc({ status: 'LOST' });
            newStatus = 'LOST';
        }
        const game = await updateGameStatus(activeGame.id, newStatus);
        zeewordle_game_guess_submitted_total.inc();
        endGuessTimer({ status: '200', reason: 'success' });
        res.status(200).json({ game });
    } catch (err) {
        if (err instanceof ErrorResponse) {
            if (err.statusCode === 401 && err.message === 'Unauthorized!!') {
                zeewordle_game_guess_unauthorized_total.inc();
                endGuessTimer({ status: '401', reason: 'unauthorized' });
            } else if (
                err.statusCode === 400 &&
                err.message === 'Word is required'
            ) {
                zeewordle_game_guess_invalid_input_total.inc();
                endGuessTimer({ status: '400', reason: 'Word_is_required' });
            } else if (
                err.statusCode === 400 &&
                err.message === 'Word must be 5 letters'
            ) {
                zeewordle_game_guess_invalid_input_total.inc();
                endGuessTimer({
                    status: '400',
                    reason: 'Word_must_be_5_letters',
                });
            } else if (
                err.statusCode === 404 &&
                err.message === 'Game not found'
            ) {
                zeewordle_game_guess_not_found_total.inc();
                endGuessTimer({
                    status: '404',
                    reason: 'Game_not_found',
                });
            }
        } else {
            endGuessTimer({ status: 500, reason: 'failure' });
        }
        next(err);
    }
};
