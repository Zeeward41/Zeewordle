import './KeyboardKey.css';

interface KeyboardKeyProps {
    letter: string;
    handleKey: (letter: string) => void;
    className?: string;
    children?: React.ReactNode;
}

const KeyboardKey = ({
    letter,
    handleKey,
    className = '',
    children,
}: KeyboardKeyProps) => {
    return (
        <button
            type="button"
            onClick={() => handleKey(letter)}
            className={`keyboardKey ${className}`.trim()}
        >
            {children ?? letter}
        </button>
    );
};

export default KeyboardKey;
