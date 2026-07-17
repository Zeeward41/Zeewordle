import './ModalHomeMenu.css';
import { Link } from '@tanstack/react-router';

interface ModalHomeMenuProps {
    onClose: () => void;
}

export const ModalHomeMenu = ({ onClose }: ModalHomeMenuProps) => {
    return (
        <div className="modal-home-menu__container">
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
                to="/"
                className="modal-home-menu__link modal-home-menu__link--new-game"
                onClick={onClose}
            >
                API DOC
            </Link>
        </div>
    );
};
