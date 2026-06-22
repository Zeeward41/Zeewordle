import type { Request, Response, NextFunction } from 'express';

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //Log to console for dev
    console.log(err.stack?.red);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error',
    });
};

export default errorHandler;
