import client from 'prom-client';
import type { Request, Response, NextFunction } from 'express';
import { myRegister } from '../metrics/registry.ts';

// Metrics HTTP (global)
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Nombre total de requetes HTTP',
    labelNames: ['method', 'route', 'status'],
    registers: [myRegister],
});

// Middleware Express
const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        const route =
            (req.route as { path?: string } | undefined)?.path ?? req.path;

        httpRequestCounter.inc({
            method: req.method,
            route,
            status: res.statusCode.toString(),
        });
    });
    next();
};

export default metricsMiddleware;
