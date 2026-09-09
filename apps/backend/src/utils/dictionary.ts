import crypto from 'node:crypto';
import wordsData from '../config/words.json' with { type: 'json' };

export const getRandomWord = (): string | null => {
    const listWords: string[] = wordsData.words;

    if (listWords.length === 0) {
        return null;
    }

    // Generate a cryptographically secure random index.
    const random = crypto.randomInt(listWords.length);

    return listWords[random] ?? null;
};
