import type { Request, Response, NextFunction } from 'express';
import { createUser, getUserByEmail } from '../models/user.model.ts';
import type {
    RegisterBody,
    UserRecord,
    LoginBodyByEmail,
} from '../types/auth.types.ts';
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
} from '../metrics/auth.metrics.ts';

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
        const username = request.username;
        const email = request.email;
        const password = request.password;

        const factor = 12;
        const passwordHash = await bcrypt.hash(password, factor);
        const user: UserRecord = await createUser(
            email,
            username,
            passwordHash
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
                next(new ErrorResponse('fail destroy session', 500));
                return;
            }
            zeewordle_logout_success_total.inc();
            res.clearCookie('connect.sid');
            endTimer({ status: '200', reason: 'success' });
            res.status(200).json({
                success: true,
                message: 'Logout user',
            });
        });
    } catch (err) {
        if (err instanceof ErrorResponse) {
            if (err.statusCode === 401 && err.message === 'Unauthorized!!') {
                zeewordle_logout_unauthorized_total.inc();
                endTimer({ status: '401', reason: 'unauthorized' });
            } else if (
                err.statusCode === 500 &&
                err.message === 'fail destroy session'
            ) {
                zeewordle_logout_dependency_failures_total.inc();
                endTimer({ status: '500', reason: 'fail_destroy_session' });
            }
        } else {
            zeewordle_logout_dependency_failures_total.inc();
            endTimer({ status: '500', reason: 'fail' });
        }
        next(err);
    }
};
