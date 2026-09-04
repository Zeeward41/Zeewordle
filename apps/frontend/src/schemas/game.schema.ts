import { z } from 'zod';
import type { CellStatus, Cell } from '../types/game.types';

export const cellStatusSchema = z
    .enum(['WRONG', 'MISPLACED', 'CORRECT', 'EMPTY'])
    .transform((status): CellStatus => {
        const lower = status.toLowerCase();
        return lower as CellStatus;
    });

export const cellSchema = z.object({
    letter: z.string(),
    status: cellStatusSchema,
}) satisfies z.ZodType<Cell>;

// Enums API
export const letterStatusSchema = z.enum(['WRONG', 'MISPLACED', 'CORRECT']);
export const gameStatusSchema = z.enum([
    'IN_PROGRESS',
    'WON',
    'LOST',
    'ABANDONED',
]); // Ajuste selon tes statuts possibles

// Eval Letter
export const evaluationSchema = z.object({
    letter: z.string().length(1),
    status: letterStatusSchema,
});

// guess
export const guessSchema = z
    .object({
        word: z.string(),
        evaluations: z.array(cellSchema),
        submittedAt: z.string(),
    })
    .transform(guess => guess.evaluations);

// Objet Game
export const gameSchema = z.object({
    id: z.string().uuid(),
    userId: z.number().int(),
    status: gameStatusSchema,
    maxAttempts: z.number().int().positive(),
    wordToGuess: z.string(),
    guesses: z.array(guessSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// answer api
export const apiResponseSchema = z.object({
    game: gameSchema,
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type Game = z.infer<typeof gameSchema>;
export type Guess = z.infer<typeof guessSchema>;
export type Evaluation = z.infer<typeof evaluationSchema>;
