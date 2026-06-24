import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

interface OpenApiValidator extends Error {
    name: string;
    status: number;
    path: string;
    errors: {
        path: string;
        message: string;
        errorCode: string;
    }[];
}

const errorHandler = (
    err: ErrorResponse | OpenApiValidator,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    //Log to console for dev
    console.log(err.stack?.red);

    let statusCode = 500;
    let message = 'Server Error';

    if (err instanceof ErrorResponse) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        statusCode = err.status;
        const firstError = err.errors[0];
        if (firstError) {
            const cleanPath = firstError.path.startsWith('/')
                ? firstError.path.slice(1)
                : firstError.path;
            message = `${cleanPath}: ${firstError.message}`;
        }
    }
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorHandler;
