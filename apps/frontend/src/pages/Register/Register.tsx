import './Register.css';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { registerFieldType } from '../../schemas/auth.schema';
import {
    registerFieldSchema,
    errorResponseSchema,
} from '../../schemas/auth.schema';
import { z } from 'zod';
import { API_ROUTES } from '../../config/api';
import { useNotification } from '../../hooks/useNotifications.ts';

interface FormState {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}

export const Register = () => {
    const [field, setField] = useState<registerFieldType>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [fieldState, setFieldState] = useState<{
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
    }>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [formState, setFormState] = useState<FormState>({
        status: 'idle',
        message: '',
    });
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handlerSubmit = async (
        e: React.SubmitEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        // Init
        setFormState({
            status: 'loading',
            message: '',
        });

        // Validation des datas
        setFieldState({
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        });

        const rawData = registerFieldSchema.safeParse(field);

        // check if SafeParse succeed
        if (!rawData.success) {
            // format the errors
            const fieldErrors = z.treeifyError(rawData.error);
            // check properties exists
            if (!fieldErrors.properties) return;
            // get keys of the properties Object
            const keyError = Object.keys(fieldErrors.properties);
            // create an Object newErrors with key: string and value: string
            const newErrors: Record<string, string> = {};

            // shortcut of fieldErrors .properties -> properties with spécific type
            const properties = fieldErrors.properties as Record<
                string,
                { errors: string[] }
            >;

            for (const key of keyError) {
                const field = properties[key];
                const errorMessage = field?.errors?.[0] ?? 'Unknown error';

                newErrors[key] = errorMessage;
            }

            setFieldState(prev => ({
                ...prev,
                ...newErrors,
            }));

            setFormState({
                status: 'idle',
                message: '',
            });
            return;
        }

        try {
            // Fetch
            const response = await fetch(API_ROUTES.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rawData.data),
                credentials: 'include',
            });
            const json = (await response.json()) as unknown;
            if (!response.ok) {
                const data = errorResponseSchema.parse(json);

                const notifErr = {
                    status: 'error' as const,
                    message: `${data.message}`,
                };
                setFormState(notifErr);
                showNotification(notifErr);
                return;
            }

            const notifSuccess = {
                status: 'success' as const,
                message: 'You have successfully registered.',
            };
            setFormState(notifSuccess);
            showNotification(notifSuccess);
            await navigate({ to: '/auth/login' });
        } catch {
            const notifErrNet = {
                status: 'error' as const,
                message: 'Network error, please try again.',
            };
            setFormState(notifErrNet);
            showNotification(notifErrNet);
        }
    };

    const handlerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setField(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    return (
        <div className="register-container">
            <div className="register">
                <p className="register__title">Sign Up</p>
                <p className="register__message">
                    Just a few quick things to get started
                </p>
                <form className="register-form" onSubmit={handlerSubmit}>
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
                        name="email"
                        onChange={handlerChange}
                        value={field.email}
                    />
                    <span className="register-form__error register-form__error--email">
                        {fieldState.email}
                    </span>
                    <label
                        htmlFor="username"
                        className="register-form__label--username register-form__label"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        className="register-form__input--username register-form__input"
                        placeholder="Enter Username"
                        type="text"
                        name="username"
                        onChange={handlerChange}
                        value={field.username}
                    />
                    <span className="register-form__error register-form__error--username">
                        {fieldState.username}
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
                        name="password"
                        onChange={handlerChange}
                        value={field.password}
                    />
                    <span className="register-form__error register-form__error--password">
                        {fieldState.password}
                    </span>

                    <label
                        htmlFor="confirmPassword"
                        className="register-form__label--passwordConfirm register-form__label"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        className="register-form__input--confirmPassword register-form__input"
                        placeholder="Enter Confirm Password"
                        type="password"
                        name="confirmPassword"
                        onChange={handlerChange}
                        value={field.confirmPassword}
                    />
                    <span className="register-form__error register-form__error--passwordConfirm">
                        {fieldState.confirmPassword}
                    </span>

                    <button
                        type="submit"
                        className="register-form__button register-form__button--submit"
                        disabled={formState.status === 'loading'}
                    >
                        {formState.status === 'loading' ? 'loading' : 'Sign Up'}
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
