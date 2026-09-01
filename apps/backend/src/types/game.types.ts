export type GameStatus = 'IN_PROGRESS' | 'WON' | 'LOST' | 'ABANDONED';

export type LetterStatus = 'CORRECT' | 'MISPLACED' | 'WRONG';

export interface LetterEvaluation {
    letter: string;
    status: LetterStatus;
}

export interface WordGuess {
    word: string;
    evaluations: LetterEvaluation[];
    submittedAt: string;
}
export interface Game {
    id: string;
    userId: number;
    status: GameStatus;
    maxAttempts: number;
    wordToGuess: string;
    guesses: WordGuess[];
    createdAt: Date;
    updatedAt: Date;
}

export interface GuessRequestBody {
    word: string;
}
