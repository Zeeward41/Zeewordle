import './Cell.css';
import type { Cell } from '../../types/game.types.tsx';

const CellComponent = (props: Cell) => {
    return <div className={`cell ${props.status}`}>{props.letter}</div>;
};

export default CellComponent;
