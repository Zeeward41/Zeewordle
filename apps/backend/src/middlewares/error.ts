import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.ts';

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
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Server Error';

    if (err instanceof ErrorResponse) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Error express-openapi-Validator
    else if (
        err &&
        typeof err === 'object' &&
        'name' in err &&
        'status' in err &&
        'errors' in err
    ) {
        const openApiErr = err as OpenApiValidator;
        statusCode = openApiErr.status;

        // Sécurisation avec le chaînage optionnel ?.
        const firstError = openApiErr.errors[0];

        if (firstError) {
            const cleanPath = firstError.path.startsWith('/')
                ? firstError.path.slice(1)
                : firstError.path;
            message = `${cleanPath}: ${firstError.message}`;
        } else {
            message = openApiErr.message || 'Validation Error';
        }
    }
    // Others Errors
    else if (err instanceof Error) {
        console.error('Server Error', err.stack);
    } else {
        console.error('Server Error (Unknown Type):', err);
    }
    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

export default errorHandler;
