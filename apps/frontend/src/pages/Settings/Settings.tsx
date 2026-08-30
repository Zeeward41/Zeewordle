import './Settings.css';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Navigate } from '@tanstack/react-router';
import type { requestStateType } from '../../types/request.types';
import { API_ROUTES } from '../../config/api';
import { useNotification } from '../../hooks/useNotifications.ts';
import { errorResponseSchema } from '../../schemas/auth.schema.ts';
import { useState } from 'react';
import { ModalWrapper } from '../../components/ModalWrapper/ModalWrapper.tsx';

export const Settings = () => {
    const { user, logout, isLoading } = useAuth();
    const [deleteState, setDeleteState] = useState<requestStateType>({
        status: 'idle',
        message: '',
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleDelete = async () => {
        setDeleteState({
            status: 'loading',
            message: '',
        });

        try {
            // Fetch
            const response = await fetch(API_ROUTES.users, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const json = (await response.json()) as unknown;
            if (!response.ok) {
                const data = errorResponseSchema.parse(json);

                const notifErr = {
                    status: 'error' as const,
                    message: `${data.message}`,
                };

                setDeleteState(notifErr);
                showNotification(notifErr);
                return;
            }

            const notifSuccess = {
                status: 'success' as const,
                message: 'You have successfully deleted your account.',
            };
            setDeleteState(notifSuccess);
            showNotification(notifSuccess);
            logout();
            await navigate({ to: '/auth/login' });
        } catch {
            const notifErrNet = {
                status: 'error' as const,
                message: 'Network error, please try again.',
            };
            setDeleteState(notifErrNet);
            showNotification(notifErrNet);
        }
    };

    if (isLoading) {
        return <div>LOADING...</div>;
    }
    if (user === null) {
        return <Navigate to="/auth/login" replace />;
    }
    return (
        <div className="settings_container">
            <div className="settings">
                <h1 className="settings__title">Settings</h1>

                <div className="settings__group">
                    <label className="settings__label" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="settings__input"
                        id="email"
                        type="email"
                        disabled
                        defaultValue={`${user.email}`}
                    />
                </div>

                <div className="settings__group">
                    <label className="settings__label" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="settings__input"
                        id="username"
                        type="text"
                        disabled
                        defaultValue={`${user.username}`}
                    />
                </div>

                <div className="settings__group">
                    <label className="settings__label" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="settings__input"
                        id="password"
                        type="password"
                        disabled
                        defaultValue="something"
                    />
                </div>

                <button
                    className="settings__button settings__button--danger"
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    Delete your Account
                </button>
            </div>
            {isDeleteModalOpen && (
                <ModalWrapper onClose={() => setIsDeleteModalOpen(false)}>
                    <div className="modal">
                        <p className="modal__title">Delete your account?</p>

                        <p className="modal__text">
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </p>

                        <div className="modal__actions">
                            <button
                                type="button"
                                className="modal__button modal__button--cancel"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="modal__button modal__button--confirm"
                                onClick={handleDelete}
                                disabled={deleteState.status === 'loading'}
                            >
                                {deleteState.status === 'loading'
                                    ? 'Deleting...'
                                    : 'Delete account'}
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
};
