import './ModalUserMenu.css';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotifications';
import { errorResponseSchema } from '../../schemas/auth.schema';
import { API_ROUTES } from '../../config/api';

interface ModalUserMenuProps {
    onClose: () => void;
    position: {
        top: number;
        left: number;
    };
}

export const ModalUserMenu = ({ onClose, position }: ModalUserMenuProps) => {
    const { user, logout } = useAuth();
    const { showNotification } = useNotification();

    const handleLogout = async () => {
        try {
            const response = await fetch(API_ROUTES.logout, {
                method: 'POST',
                credentials: 'include',
            });

            const json = (await response.json()) as unknown;
            if (!response.ok) {
                const data = errorResponseSchema.parse(json);

                const notifErr = {
                    status: 'error' as const,
                    message: `${data.message}`,
                };
                showNotification(notifErr);
                return;
            }
            const data = errorResponseSchema.parse(json);
            logout();
            showNotification({
                status: 'success' as const,
                message: `${data.message}`,
            });
        } catch (err) {
            console.log(err);
        }
        onClose();
    };

    return (
        <>
            {user?.role[0] === 'user' ? (
                <div
                    className="modal-user-menu__container"
                    data-testid="modal-user-menu"
                    style={{ top: position.top, left: position.left }}
                >
                    <Link
                        to="/"
                        className="modal-user-menu__link modal-user-menu__link--parameter"
                        onClick={handleLogout}
                    >
                        Logout
                    </Link>
                    <Link
                        to="/api-doc"
                        className="modal-user-menu__link modal-user-menu__link--parameter"
                        onClick={onClose}
                    >
                        API DOC
                    </Link>
                </div>
            ) : (
                <div
                    className="modal-user-menu__container"
                    data-testid="modal-user-menu"
                    style={{ top: position.top, left: position.left }}
                >
                    <Link
                        to="/"
                        className="modal-user-menu__link modal-user-menu__link--parameter"
                        onClick={handleLogout}
                    >
                        ADMIN
                    </Link>
                </div>
            )}
        </>
    );
};
