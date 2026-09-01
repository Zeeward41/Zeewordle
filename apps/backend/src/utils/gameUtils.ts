import type { LetterEvaluation } from '../types/game.types';

export const evaluateGuess = (
    guess: string,
    targetWord: string
): LetterEvaluation[] => {
    const guessArray = guess.toUpperCase().split('');
    const targetWordArray = targetWord.toUpperCase().split('');

    // Init Array with 5 "empty value"
    const result: (LetterEvaluation | undefined)[] = Array.from({
        length: guessArray.length,
    });

    // Find Correct Value
    for (let i = 0; i < guessArray.length; i++) {
        const currentLetter = guessArray[i];
        const targetLetter = targetWordArray[i];

        if (currentLetter && targetLetter && currentLetter === targetLetter) {
            result[i] = {
                letter: currentLetter,
                status: 'CORRECT',
            };
            targetWordArray[i] = '-';
        }
    }

    // Find WRONG and MISPLACED
    for (let i = 0; i < guessArray.length; i++) {
        // letter is already CORRECT, nothing to do
        if (result[i]) {
            continue;
        }

        const currentLetter = guessArray[i];
        if (!currentLetter) {
            continue;
        }
        const targetIndex = targetWordArray.indexOf(currentLetter);

        if (targetIndex !== -1) {
            result[i] = {
                letter: currentLetter,
                status: 'MISPLACED',
            };
            targetWordArray[targetIndex] = '-';
        } else {
            result[i] = {
                letter: currentLetter,
                status: 'WRONG',
            };
        }
    }

    return result as LetterEvaluation[];
};
