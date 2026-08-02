import type { Request, Response, NextFunction } from 'express';
import { getUserById, deleteUserById } from '../models/user.model.ts';
import type { UserRecord } from '../types/auth.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';

// @desc        profile User
// @route       GET /api/v1/users/profile
// @access      Private
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }
        const result = await getUserById(userId);
        if (!result) {
            throw new ErrorResponse('This id does not exist !!', 401);
        }
        const user: UserRecord = {
            id: result.id,
            email: result.email,
            username: result.username,
            role: result.role,
        };
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
};

// @desc        Delete User
// @route       DELETE /api/v1/users
// @access      Private
export const deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }
        const check = await getUserById(userId);
        if (!check) {
            throw new ErrorResponse('This id does not exist !!', 401);
        }

        await deleteUserById(userId);

        req.session.destroy(err => {
            if (err) {
                next(err);
                return;
            }

            res.clearCookie('connect.sid');

            res.status(200).json({ data: 'User deleted' });
        });
    } catch (err) {
        next(err);
    }
};
