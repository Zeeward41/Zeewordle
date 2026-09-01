import wordsData from '../config/words.json';

export const getRandomWord = (): string | null => {
    const listWords: string[] = wordsData.words;

    if (listWords.length === 0) {
        return null;
    }

    const random = Math.floor(Math.random() * listWords.length);
    return listWords[random] ?? null;
};
