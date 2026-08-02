import type { Request, Response, NextFunction } from 'express';
import { getUserById } from '../models/user.model.ts';
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
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
