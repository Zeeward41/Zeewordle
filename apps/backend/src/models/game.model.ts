import pool from '../config/db.ts';
import type { Game, WordGuess, GameStatus } from '../types/game.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';

export const createGame = async (
    userId: number,
    wordToGuess: string
): Promise<Game> => {
    const result = await pool.query<Game>(
        `INSERT INTO games (user_id, word_to_guess)
         VALUES ($1, $2)
         RETURNING 
            id, 
            user_id AS "userId", 
            status, 
            word_to_guess AS "wordToGuess",
            max_attempts AS "maxAttempts", 
            guesses, 
            created_at AS "createdAt", 
            updated_at AS "updatedAt"`,
        [userId, wordToGuess]
    );

    const game = result.rows[0];
    if (!game) throw new ErrorResponse('Game creation failed', 400);

    return game;
};

export const getActiveGameByUserId = async (
    userId: number
): Promise<Game | null> => {
    const result = await pool.query<Game>(
        `SELECT 
            id, 
            user_id AS "userId", 
            status, 
            max_attempts AS "maxAttempts", 
            word_to_guess AS "wordToGuess",
            guesses, 
            created_at AS "createdAt", 
            updated_at AS "updatedAt"
         FROM games 
         WHERE user_id = $1 AND status = 'IN_PROGRESS'
         LIMIT 1`,
        [userId]
    );

    // Retourne la partie si elle existe, sinon null
    return result.rows[0] ?? null;
};

export const addGuessToGame = async (
    gameId: string,
    guess: WordGuess
): Promise<Game> => {
    const result = await pool.query<Game>(
        `UPDATE games
         SET guesses = guesses || $1::jsonb,
             updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [JSON.stringify(guess), gameId]
    );

    const game = result.rows[0];
    if (!game) {
        throw new ErrorResponse('Game not found', 404);
    }
    return game;
};

export const updateGameStatus = async (
    gameId: string,
    newStatus: GameStatus
): Promise<Game> => {
    const result = await pool.query<Game>(
        `UPDATE games
         SET 
            status = $1,
            updated_at = NOW()
         WHERE id = $2
         RETURNING 
            id, 
            user_id AS "userId", 
            status, 
            max_attempts AS "maxAttempts", 
            word_to_guess AS "wordToGuess",
            guesses, 
            created_at AS "createdAt", 
            updated_at AS "updatedAt"`,
        [newStatus, gameId]
    );

    const game = result.rows[0];
    if (!game) {
        throw new ErrorResponse('Game not found or status update failed', 404);
    }

    return game;
};
