import { useState } from 'react';
import type { loginInput } from '../../schemas/auth.schema.ts';
import {
    loginSchema,
    errorResponseSchema,
    userSummarySchema,
} from '../../schemas/auth.schema.ts';
import { z } from 'zod';
import { API_ROUTES } from '../../config/api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import './Login.css';

export const Login = () => {
    const [form, setForm] = useState<loginInput>({ email: '', password: '' });
    const { login } = useAuth();

    interface FormState {
        status: 'idle' | 'loading' | 'success' | 'error';
        message: string;
    }
    const [formState, setFormState] = useState<FormState>({
        status: 'idle',
        message: '',
    });

    interface FieldState {
        email: string;
        password: string;
    }

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
                status: 'error',
                message: 'Sanitization failed ',
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
                setFormState({
                    status: 'error',
                    message: data.message,
                });
                return;
            }
            const data = userSummarySchema.parse(json);
            login(data);
            setFormState({
                status: 'success',
                message: 'You have successfully logged in.',
            });
        } catch {
            setFormState({
                status: 'error',
                message: 'Network error, please try again.',
            });
        }
    };
    const handlerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="login">
            <p className="login-title">Login</p>
            <form onSubmit={handlerSubmit} className="login-form">
                {fieldState.email && (
                    <span className="login-form__error login-form__error--email">
                        {fieldState.email}
                    </span>
                )}
                <input
                    className="login-form__input login-form__input--email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handlerChange}
                />
                {fieldState.password && (
                    <span className="login-form__error login-form__error--password">
                        {fieldState.password}
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
                <button className="login-form__button">Login</button>
            </form>
        </div>
    );
};
