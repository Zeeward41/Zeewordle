import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import errorHandler from '../../middlewares/error.ts';
import ErrorResponse from '../../utils/errorResponse.ts';

describe('errorHandler middleware', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {} as Request;
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        next = vi.fn();
    });

    it('should handle custom ErrorResponse', () => {
        const err = new ErrorResponse('Not Found', 404);

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Not Found',
        });
    });

    it('should handle express-openapi-validator error', () => {
        const openApiErr = {
            name: 'BadRequest',
            status: 400,
            errors: [
                {
                    path: '/body/email',
                    message: 'must be a valid email',
                    errorCode: 'format.openapi',
                },
            ],
        };

        errorHandler(openApiErr, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'body/email: must be a valid email',
        });
    });
});
