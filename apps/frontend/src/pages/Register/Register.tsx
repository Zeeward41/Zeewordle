import './Register.css';
import { Link } from '@tanstack/react-router';

export const Register = () => {
    return (
        <div className="register-container">
            <div className="register">
                <p className="register__title">Sign Up</p>
                <p className="register__message">
                    Just a few quick things to get started
                </p>
                <form className="register-form">
                    <label
                        htmlFor="email"
                        className="register-form__label--email register-form__label"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        className="register-form__input--email register-form__input"
                        placeholder="Enter Email ID"
                        type="email"
                    />
                    <span className="register-form__error register-form__error--email">
                        {' '}
                        Ceci nest pas un mail
                    </span>

                    <label
                        htmlFor="password"
                        className="register-form__label--password register-form__label"
                    >
                        New Password
                    </label>
                    <input
                        id="password"
                        className="register-form__input--password register-form__input"
                        placeholder="Enter New Password"
                        type="password"
                    />
                    <span className="register-form__error register-form__error--password">
                        {' '}
                        Ceci nest pas un password
                    </span>

                    <label
                        htmlFor="passwordConfirm"
                        className="register-form__label--passwordConfirm register-form__label"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="passwordConfirm"
                        className="register-form__input--passwordConfirm register-form__input"
                        placeholder="Enter Confirm Password"
                        type="password"
                    />
                    <span className="register-form__error register-form__error--passwordConfirm">
                        {' '}
                        Le password ne match pas
                    </span>

                    <button
                        type="submit"
                        className="register-form__button register-form__button--submit"
                    >
                        Sign Up{' '}
                    </button>
                </form>
                <div className="register__separator">
                    <span>Or</span>
                </div>
                <button type="button" className="register-google-btn">
                    <img
                        src="/google.svg"
                        alt=""
                        aria-hidden="true"
                        className="register-google-btn__logo logo"
                    />
                    <span className="register-google-btn__label">Google</span>
                </button>
                <div className="register-login">
                    <p className="register-login__message">
                        Already have an account?
                    </p>
                    <Link className="register-login__login" to="/auth/login">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};
