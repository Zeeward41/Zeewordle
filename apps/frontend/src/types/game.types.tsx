export type CellStatus = 'correct' | 'wrong' | 'empty' | 'misplaced';

export interface Cell {
    letter: string;
    status: CellStatus;
}

export type WordleRow = Cell[];

export type WordleGrid = WordleRow[];

export interface GridProps {
    allLetters: WordleGrid;
}
