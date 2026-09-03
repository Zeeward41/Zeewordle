import './Game.css';
import Keyboard from '../../components/Keyboard/Keyboard';
import GridComponent from '../../components/Grid/Grid';
import type { WordleGrid, CellStatus } from '../../types/game.types.tsx';

export const Game = () => {
    // 1. Mock de la grille (6 essais de 5 lettres avec différents statuts)
    const mockGrid: WordleGrid = [
        // Essai 1 : Mot "REACT" (toutes les lettres testées)
        [
            { letter: 'R', status: 'wrong' },
            { letter: 'E', status: 'correct' },
            { letter: 'A', status: 'wrong' },
            { letter: 'C', status: 'correct' },
            { letter: 'T', status: 'wrong' },
        ],
        // Essai 2 : Mot "CODES" (en cours / partiellement trouvé)
        [
            { letter: 'C', status: 'correct' },
            { letter: 'O', status: 'correct' },
            { letter: 'D', status: 'correct' },
            { letter: 'E', status: 'wrong' },
            { letter: 'S', status: 'wrong' },
        ],
        // Essai 3 : Ligne vide
        [
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
        ],
        // Essai 4 : Ligne vide
        [
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: 'T', status: 'wrong' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
        ],
        // Essai 5 : Ligne vide
        [
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
        ],
        // Essai 6 : Ligne vide
        [
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
            { letter: '', status: 'empty' },
        ],
    ];

    // 2. Mock du statut des touches du clavier
    const mockKeyStatuses: Record<string, CellStatus> = {
        C: 'correct',
        O: 'correct',
        E: 'correct',
        D: 'correct',
        R: 'wrong',
        A: 'wrong',
        T: 'wrong',
        S: 'wrong',
    };

    // 3. Handler temporaire pour tester les clics sur le clavier
    const handleKey = (letter: string) => {
        console.log('Touche cliquée :', letter);
    };

    return (
        <div className="game__container">
            <div className="game">
                <button className="game__cancel"> Cancel </button>
                <GridComponent allLetters={mockGrid} />
                <Keyboard handleKey={handleKey} keyStatuses={mockKeyStatuses} />
            </div>
        </div>
    );
};
