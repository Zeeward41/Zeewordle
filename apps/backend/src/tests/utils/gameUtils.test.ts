import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../../utils/gameUtils.ts';

describe('evaluateGuess', () => {
    it('should mark correct letters as CORRECT', () => {
        const result = evaluateGuess('CRANE', 'CRANE');

        expect(result).toEqual([
            { letter: 'C', status: 'CORRECT' },
            { letter: 'R', status: 'CORRECT' },
            { letter: 'A', status: 'CORRECT' },
            { letter: 'N', status: 'CORRECT' },
            { letter: 'E', status: 'CORRECT' },
        ]);
    });

    it('should mark misplaced letters as MISPLACED', () => {
        const result = evaluateGuess('EARTH', 'HEART');

        expect(result).toEqual([
            { letter: 'E', status: 'MISPLACED' },
            { letter: 'A', status: 'MISPLACED' },
            { letter: 'R', status: 'MISPLACED' },
            { letter: 'T', status: 'MISPLACED' },
            { letter: 'H', status: 'MISPLACED' },
        ]);
    });

    it('should mark absent letters as WRONG', () => {
        const result = evaluateGuess('ZZZZZ', 'CRANE');

        expect(result).toEqual([
            { letter: 'Z', status: 'WRONG' },
            { letter: 'Z', status: 'WRONG' },
            { letter: 'Z', status: 'WRONG' },
            { letter: 'Z', status: 'WRONG' },
            { letter: 'Z', status: 'WRONG' },
        ]);
    });
});
