import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { loginInput } from '../../schemas/auth.schema.ts';
import {
    loginSchema,
    errorResponseSchema,
    userSummarySchema,
} from '../../schemas/auth.schema.ts';
import { z } from 'zod';
import { API_ROUTES } from '../../config/api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNotification } from '../../hooks/useNotifications.ts';
import './Login.css';

interface FormState {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}

interface FieldState {
    email: string;
    password: string;
}

export const Login = () => {
    const [form, setForm] = useState<loginInput>({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [formState, setFormState] = useState<FormState>({
        status: 'idle',
        message: '',
    });

    const [fieldState, setFieldState] = useState<FieldState>({
        email: '',
        password: '',
    });

    const handlerSubmit = async (
        e: React.SubmitEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        setFormState({
            status: 'loading',
            message: '',
        });

        setFieldState({
            email: '',
            password: '',
        });

        const rawData = loginSchema.safeParse(form);

        // check if SafeParse succeed
        if (!rawData.success) {
            setFormState({
                status: 'error' as const,
                message: `Sanitization failed`,
            });
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

            return;
        }

        // Fetch
        try {
            const response = await fetch(API_ROUTES.login, {
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
            const data = userSummarySchema.parse(json);
            login(data);
            const notifSuccess = {
                status: 'success' as const,
                message: 'You have successfully logged in.',
            };
            setFormState(notifSuccess);
            showNotification(notifSuccess);
            await navigate({ to: '/' });
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
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="login">
            <div className="login-website">
                <img
                    src="/pen-Zeewordle.png"
                    alt="Zeewordle - Login"
                    className="login-website__logo logo"
                />
                <p className="login-website__name">Zeewordle</p>
            </div>
            <h1 className="login__title">Hi There!</h1>
            <p className="login__message">Please enter required details</p>
            <button type="button" className="login-google-btn">
                <img
                    src="/google.svg"
                    alt=""
                    aria-hidden="true"
                    className="login-google-btn__logo logo"
                />
                <span className="login-google-btn__label">Google</span>
            </button>
            <span className="login__separator">Or</span>
            <form onSubmit={handlerSubmit} className="login-form">
                <input
                    className="login-form__input login-form__input--email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handlerChange}
                />
                {fieldState.email && (
                    <span className="login-form__error login-form__error--email">
                        {fieldState.email}
                    </span>
                )}
                <input
                    className="login-form__input login-form__input--password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handlerChange}
                />
                {fieldState.password && (
                    <span className="login-form__error login-form__error--password">
                        {fieldState.password}
                    </span>
                )}
                <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS"
                    className="login-form__forgot"
                >
                    Forgot Password ?
                </a>
                <button
                    className={`login-form__button ${formState.status === 'loading' ? 'login-form__button--loading' : ''}`}
                    disabled={formState.status === 'loading'}
                >
                    {formState.status === 'loading' ? 'loading...' : 'Login'}
                </button>
                <div className="login-form__signUP">
                    <p>Create an account?</p>
                    <a
                        className="login-form__button--signup"
                        href="https://developer.mozilla.org/fr/docs/Web/CSS"
                    >
                        Sign Up
                    </a>
                </div>
            </form>
        </div>
    );
};
