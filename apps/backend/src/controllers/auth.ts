import type { Request, Response, NextFunction } from 'express';
import { createUser } from '../models/user.model.ts';
import type { RegisterBody, UserRecord } from '../types/auth.types.ts';
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
    const request = req.body as RegisterBody;
    const username = request.username;
    const email = request.email;
    const password = request.password;

    const factor = 12;
    const passwordHash = await bcrypt.hash(password, factor);

    try {
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
