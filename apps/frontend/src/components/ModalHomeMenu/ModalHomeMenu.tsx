import './ModalHomeMenu.css';
import { Link } from '@tanstack/react-router';

interface ModalHomeMenuProps {
    onClose: () => void;
    position: {
        top: number;
        left: number;
    };
}

export const ModalHomeMenu = ({ onClose, position }: ModalHomeMenuProps) => {
    return (
        <div
            className="modal-home-menu__container"
            data-testid="modal-home-menu"
            style={{ top: position.top, left: position.left }}
        >
            <Link
                to="/auth/login"
                className="modal-home-menu__link modal-home-menu__link--parameter"
                onClick={onClose}
            >
                Login
            </Link>
            <Link
                to="/auth/register"
                className="modal-home-menu__link modal-home-menu__link--stats"
                onClick={onClose}
            >
                Register
            </Link>
            <Link
                to="/api-doc"
                className="modal-home-menu__link modal-home-menu__link--new-game"
                onClick={onClose}
            >
                API DOC
            </Link>
        </div>
    );
};
