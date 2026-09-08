import crypto from 'node:crypto';
import wordsData from '../config/words.json';

export const getRandomWord = (): string | null => {
    const listWords: string[] = wordsData.words;

    if (listWords.length === 0) {
        return null;
    }

    const random = crypto.randomInt(listWords.length);

    return listWords[random] ?? null;
};
