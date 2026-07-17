import './ModalUserMenu.css';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';

interface ModalUserMenuProps {
    onClose: () => void;
}

export const ModalUserMenu = ({ onClose }: ModalUserMenuProps) => {
    const { user } = useAuth();
    return (
        <>
            {user?.role[0] === 'user' ? (
                <div className="modal-user-menu__container">
                    <Link
                        to="/"
                        className="modal-user-menu__link modal-user-menu__link--parameter"
                        onClick={onClose}
                    >
                        User
                    </Link>
                </div>
            ) : (
                <div className="modal-user-menu__container">
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
