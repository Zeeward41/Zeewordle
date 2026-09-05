import './Grid.css';
import CellComponent from '../Cell/Cell.jsx';
import type { WordleRow, Cell, GridProps } from '../../types/game.types.tsx';

const GridComponent = ({ allLetters }: GridProps) => {
    return (
        <div className="grid" role="grid">
            {allLetters.map((word: WordleRow, rowIndex: number) => (
                <div className="grid__row" key={rowIndex}>
                    {word.map((cell: Cell, colIndex: number) => (
                        <CellComponent
                            key={colIndex}
                            letter={cell.letter}
                            status={cell.status}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GridComponent;
