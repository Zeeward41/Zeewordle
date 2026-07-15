import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { ModalWrapper } from '../ModalWrapper/ModalWrapper';
import { useState } from 'react';

export const Navbar = () => {
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);

    const handlerModal = () => {
        setOpenModal(!openModal);
    };

    return (
        <div className="navbar__wrapper">
            <div className="navbar">
                <div className="navbar__left">
                    <a href="/" className="navbar__link">
                        <img
                            src="/pen-Zeewordle.png"
                            alt="logo website"
                            className="navbar__logo"
                        />
                    </a>
                    <a href="/" className="navbar__apidoc">
                        API DOC
                    </a>
                </div>
                <span className="navbar__title">Zeewordle</span>
                <div className="navbar__right">
                    {user === null ? (
                        <>
                            <a href="/auth/login" className="navbar__login">
                                Login
                            </a>
                            <a href="/auth/register" className="navbar__signup">
                                Sign up
                            </a>
                        </>
                    ) : (
                        <button className="navbar__profile">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
                            >
                                <path d="M17.925 20.056a6 6 0 0 0-11.851.001" />
                                <circle cx="12" cy="11" r="4" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </button>
                    )}
                    <button onClick={handlerModal} className="navbar__menu">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-menu-icon lucide-menu"
                        >
                            <path d="M4 5h16" />
                            <path d="M4 12h16" />
                            <path d="M4 19h16" />
                        </svg>
                    </button>
                    {openModal && (
                        <ModalWrapper onClose={() => setOpenModal(false)} />
                    )}
                </div>
            </div>
        </div>
    );
};
