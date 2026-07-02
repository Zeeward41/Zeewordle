import type { Request, Response, NextFunction } from 'express';
import { createUser, getUserByEmail } from '../models/user.model.ts';
import type {
    RegisterBody,
    UserRecord,
    LoginBodyByEmail,
} from '../types/auth.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';
import bcrypt from 'bcrypt';

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access      Public
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
        res.status(201).json({ user });
    } catch (err) {
        if (err instanceof Error && 'code' in err && err.code === '23505') {
            next(new ErrorResponse('Account already exists', 409));
            return;
        }
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
        const result = await getUserByEmail(request.email);
        const { id, email, username, role } = result;
        const comparaison = await bcrypt.compare(
            request.password,
            result.password_hash
        );
        if (comparaison) {
            const user = {
                id,
                email,
                username,
                role,
            };
            res.status(200).json(user);
        } else {
            next(new ErrorResponse('email or password is incorrect', 401));
        }
    } catch (err) {
        next(err);
    }
};
