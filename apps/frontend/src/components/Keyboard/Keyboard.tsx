import './Keyboard.css';
import { useState } from 'react';
import KeyboardKey from '../KeyboardKey/KeyboardKey.tsx';
import type { CellStatus } from '../../types/game.types.tsx';

// 1. Définition des types pour les layouts et les props
type LayoutType = 'azerty' | 'qwerty';

interface KeyboardProps {
    handleKey: (letter: string) => void;
    // Dictionnaire optionnel contenant le statut de chaque lettre jouée (ex: { A: "correct", B: "absent" })
    keyStatuses?: Record<string, CellStatus>;
}

const LAYOUT_CONFIG: Record<LayoutType, string[]> = {
    azerty: ['azertyuiop', 'qsdfghjklm', 'wxcvbn'],
    qwerty: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
};

const Keyboard = ({ handleKey, keyStatuses = {} }: KeyboardProps) => {
    const [keyboardLayout] = useState<LayoutType>('azerty');
    const currentLayout = LAYOUT_CONFIG[keyboardLayout];

    return (
        <div className="keyboard__container">
            {currentLayout.map((line, lineIndex) => (
                <div
                    className={`keyboard__line keyboard__line--${lineIndex + 1}`}
                    key={lineIndex}
                >
                    {/* Touche Entrée sur la 3ème ligne */}
                    {lineIndex === 2 && (
                        <KeyboardKey
                            letter="ENTER"
                            className="keyboardKey__special keyboardKey__special--enter"
                            handleKey={handleKey}
                        >
                            ⏎
                        </KeyboardKey>
                    )}

                    {/* Lettres alphabétiques */}
                    {[...line].map(letter => {
                        const upperLetter = letter.toUpperCase();
                        const status = keyStatuses[upperLetter] ?? '';

                        return (
                            <KeyboardKey
                                key={letter}
                                letter={upperLetter}
                                className={
                                    status ? `keyboardKey--${status}` : ''
                                }
                                handleKey={handleKey}
                            />
                        );
                    })}

                    {lineIndex === 2 && (
                        <KeyboardKey
                            letter="BACKSPACE"
                            className="keyboardKey__special keyboardKey__special--backspace"
                            handleKey={handleKey}
                        >
                            ⌫
                        </KeyboardKey>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
