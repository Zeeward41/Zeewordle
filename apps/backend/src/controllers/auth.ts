import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.ts';

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access      Public
export const register = (req: Request, res: Response, next: NextFunction) => {
    try {
        throw new Error('Oups, crash de test !');

        console.log(req.body);
        res.send('OK');
    } catch (err) {
        next(new ErrorResponse('BLABLABLA', 409));
    }
};
