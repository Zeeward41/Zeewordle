import type { Request, Response, NextFunction } from 'express';
import {
    createUser,
    getUserByEmail,
    linkGoogleAccount,
    findUserByEmail,
    getUserByGoogleId,
} from '../models/user.model.ts';
import { OAuth2Client } from 'google-auth-library';

import dotenv from 'dotenv';
import type {
    RegisterBody,
    UserRecord,
    LoginBodyByEmail,
} from '../types/auth.types.ts';

import type { TokenPayload } from 'google-auth-library';
import { googleAuthSchema } from '../schemas/auth.schema.ts';
import type { GoogleAuthRequest } from '../schemas/auth.schema.ts';
import ErrorResponse from '../utils/errorResponse.ts';
import bcrypt from 'bcryptjs';

import {
    zeewordle_register_request_duration_seconds,
    zeewordle_register_duplicate_attempts_total,
    zeewordle_register_success_total,
    zeewordle_register_dependency_failures_total,
    zeewordle_login_success_total,
    zeewordle_login_failures_total,
    zeewordle_login_dependency_failures_total,
    zeewordle_login_duration_seconds,
    zeewordle_login_db_lookup_duration_seconds,
    zeewordle_logout_success_total,
    zeewordle_logout_unauthorized_total,
    zeewordle_logout_dependency_failures_total,
    zeewordle_logout_duration_seconds,
    zeewordle_google_auth_db_lookup_duration_seconds,
    zeewordle_google_auth_dependency_failures_total,
    zeewordle_google_auth_duration_seconds,
    zeewordle_google_auth_invalid_token_total,
    zeewordle_google_auth_success_total,
} from '../metrics/auth.metrics.ts';

dotenv.config({ path: '../../config/development.env' });
const googleClient = new OAuth2Client(process.env['GOOGLE_CLIENT_ID']);

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access      Public
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const endTimer = zeewordle_register_request_duration_seconds.startTimer();

    try {
        const request = req.body as RegisterBody;
        const { username, email, password, google_id } = request;

        let passwordHash: string | null = null;
        if (password) {
            const factor = 12;
            passwordHash = await bcrypt.hash(password, factor);
        }

        const user: UserRecord = await createUser(
            email,
            username,
            passwordHash,
            google_id ?? null
        );
        zeewordle_register_success_total.inc();
        endTimer({ status: '201', reason: 'success' });
        res.status(201).json({ user });
    } catch (err) {
        if (err instanceof Error && 'code' in err && err.code === '23505') {
            zeewordle_register_duplicate_attempts_total.inc();
            endTimer({ status: '409', reason: 'already_exists' });
            next(new ErrorResponse('Account already exists', 409));
            return;
        }
        zeewordle_register_dependency_failures_total.inc();
        endTimer({ status: '500', reason: 'fail' });
        next(err);
    }
};

// @desc        Login User
// @route       POST /api/v1/auth/login
// @access      Public
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const request = req.body as LoginBodyByEmail;
        const endDbTimer =
            zeewordle_login_db_lookup_duration_seconds.startTimer();
        let result;
        try {
            result = await getUserByEmail(request.email);
        } finally {
            endDbTimer();
        }

        if (!result.password_hash) {
            zeewordle_login_failures_total.inc();
            next(
                new ErrorResponse(
                    'This account uses Google Login. Please sign in with Google.',
                    401
                )
            );
            return;
        }

        const { id, email, username, role } = result;

        const endBcryptTimer = zeewordle_login_duration_seconds.startTimer();
        let comparaison = false;
        try {
            comparaison = await bcrypt.compare(
                request.password,
                result.password_hash
            );
        } finally {
            endBcryptTimer();
        }

        if (comparaison) {
            const user = {
                id,
                email,
                username,
                role,
            };

            zeewordle_login_success_total.inc();
            req.session.userId = user.id;
            res.status(200).json(user);
        } else {
            zeewordle_login_failures_total.inc();
            next(new ErrorResponse('email or password is incorrect', 401));
        }
    } catch (err) {
        if (err instanceof ErrorResponse && err.statusCode === 401) {
            zeewordle_login_failures_total.inc();
        } else {
            zeewordle_login_dependency_failures_total.inc();
        }
        next(err);
    }
};

// @desc        Logout User/Admin
// @route       POST /api/v1/auth/logout
// @access      Private
export const logout = (req: Request, res: Response, next: NextFunction) => {
    const endTimer = zeewordle_logout_duration_seconds.startTimer();
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }

        req.session.destroy(err => {
            if (err) {
                zeewordle_logout_dependency_failures_total.inc();
                endTimer({ status: '500', reason: 'fail_destroy_session' });
                next(new ErrorResponse('fail destroy session', 500));
                return;
            }

            zeewordle_logout_success_total.inc();
            res.clearCookie('connect.sid');
            endTimer({ status: '200', reason: 'success' });

            return res.status(200).json({
                success: true,
                message: 'Logout user',
            });
        });
    } catch (err) {
        if (err instanceof ErrorResponse && err.statusCode === 401) {
            zeewordle_logout_unauthorized_total.inc();
            endTimer({ status: '401', reason: 'unauthorized' });
        } else {
            zeewordle_logout_dependency_failures_total.inc();
            endTimer({ status: '500', reason: 'fail' });
        }
        next(err);
    }
};

// @desc        Authenticate with Google (Login or Register automatically)
// @route       POST /api/v1/auth/google
// @access      Public
export const googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const clientId = process.env['GOOGLE_CLIENT_ID'];
    const endGoogleTimer = zeewordle_google_auth_duration_seconds.startTimer();

    if (!clientId) {
        endGoogleTimer({
            status: '500',
            reason: 'GOOGLE_CLIENT_ID is not configured',
        });
        zeewordle_google_auth_dependency_failures_total.inc({
            dependency: 'config',
        });
        next(new ErrorResponse('GOOGLE_CLIENT_ID is not configured', 500));
        return;
    }

    try {
        const result = googleAuthSchema.safeParse(req.body);

        if (!result.success) {
            endGoogleTimer({ status: '400', reason: 'Invalid request body' });
            next(new ErrorResponse('Invalid request body', 400));
            return;
        }

        const { idToken }: GoogleAuthRequest = result.data;
        let payload: TokenPayload;

        try {
            const tokenInfo = await googleClient.getTokenInfo(idToken);

            if (tokenInfo.aud !== clientId) {
                throw new Error('Token audience mismatch');
            }

            const userinfoResponse = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: { Authorization: `Bearer ${idToken}` },
                }
            );

            if (!userinfoResponse.ok) {
                throw new Error('Failed to fetch Google userinfo');
            }

            payload = (await userinfoResponse.json()) as TokenPayload;
        } catch {
            zeewordle_google_auth_invalid_token_total.inc();
            endGoogleTimer({
                status: '401',
                reason: 'Invalid or expired Google token',
            });
            next(new ErrorResponse('Invalid or expired Google token', 401));
            return;
        }

        const googleId = payload.sub;
        const email = payload.email;

        if (!email) {
            endGoogleTimer({
                status: '401',
                reason: 'Invalid or Missing Email',
            });
            next(new ErrorResponse('Invalid or Missing Email', 401));
            return;
        }

        const username = payload.name ?? email.split('@')[0];

        if (!username) {
            endGoogleTimer({ status: '401', reason: 'Invalid username' });
            next(new ErrorResponse('Invalid username', 401));
            return;
        }

        let user;
        const endDBLookupTimer =
            zeewordle_google_auth_db_lookup_duration_seconds.startTimer();
        try {
            user = await getUserByGoogleId(googleId);
        } catch (dbErr) {
            zeewordle_google_auth_dependency_failures_total.inc({
                dependency: 'database',
            });
            throw dbErr;
        } finally {
            endDBLookupTimer(); // Arrêt du timer DB
        }

        if (!user) {
            const existingEmailUser = await findUserByEmail(email);

            if (existingEmailUser) {
                user = await linkGoogleAccount(existingEmailUser.id, googleId);
            } else {
                const newUser = await createUser(
                    email,
                    username,
                    null,
                    googleId
                );

                req.session.userId = newUser.id;
                zeewordle_google_auth_success_total.inc({ type: 'register' });
                endGoogleTimer({ status: '201', reason: 'success' });

                return res.status(201).json({
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        username: newUser.username,
                        role: newUser.role,
                        has_password: false,
                    },
                });
            }
        }

        req.session.userId = user.id;
        zeewordle_google_auth_success_total.inc({ type: 'login' });
        endGoogleTimer({ status: '200', reason: 'success' });

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                has_password: Boolean(user.password_hash),
            },
        });
    } catch (err) {
        endGoogleTimer({ status: '500', reason: 'failure' });
        next(err);
        return;
    }
};
