import './ModalUserMenu.css';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';

interface ModalUserMenuProps {
    onClose: () => void;
    position: {
        top: number;
        left: number;
    };
}

export const ModalUserMenu = ({ onClose, position }: ModalUserMenuProps) => {
    const { user } = useAuth();
    return (
        <>
            {user?.role[0] === 'user' ? (
                <div
                    className="modal-user-menu__container"
                    style={{ top: position.top, left: position.left }}
                >
                    <Link
                        to="/"
                        className="modal-user-menu__link modal-user-menu__link--parameter"
                        onClick={onClose}
                    >
                        User
                    </Link>
                </div>
            ) : (
                <div
                    className="modal-user-menu__container"
                    style={{ top: position.top, left: position.left }}
                >
                    <Link
                        to="/"
                        className="modal-user-menu__link modal-user-menu__link--parameter"
                        onClick={onClose}
                    >
                        ADMIN
                    </Link>
                </div>
            )}
        </>
    );
};
