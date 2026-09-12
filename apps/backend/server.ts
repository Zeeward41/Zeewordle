import type { Application } from 'express';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './src/middlewares/error.ts';
import OpenApiValidator from 'express-openapi-validator';
import session from 'express-session';
import { myRegister } from './src/metrics/registry.ts';
import metricsMiddleware from './src/middlewares/metrics.middleware.ts';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Route files
import auth from './src/routes/auth.ts';
import me from './src/routes/me.ts';
import users from './src/routes/users.ts';
import game from './src/routes/games.ts';

// Load env vars
dotenv.config({ path: './config/development.env' });

// Check SESSION_SECRET exists
if (!process.env['SESSION_SECRET']) {
    throw new Error('SESSION_SECRET is not defined');
}

const app: Application = express();

app.set('trust proxy', 1);

// helmet
app.use(helmet());
app.disable('x-powered-by');

// prom-client
app.use(metricsMiddleware);

app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', myRegister.contentType);
    res.send(await myRegister.metrics());
});

// CORS
app.use(
    cors({
        origin: process.env['IP_FRONTEND'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-type', 'Authorization'],
    })
);

// Cookie + Session
app.use(
    session({
        secret: process.env['SESSION_SECRET'],
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            //secure: process.env['NODE_ENV'] === 'development' ? false : true,
            //secure: false,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 30, // 30 minutes
        },
    })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookie Parser
app.use(cookieParser());

if (process.env['NODE_ENV'] === 'development') {
    app.use(morgan('dev'));
}

// express-openapi-validator
app.use(
    OpenApiValidator.middleware({
        apiSpec: path.resolve('./api/openapi.yaml'),
        validateRequests: true,
        validateResponses: false,
    })
);

// Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
});

// Mount routers
app.use('/api/v1/auth', authLimiter, auth);
app.use('/api/v1/users', users);
app.use('/api/v1/game', game);
app.use('/api/v1', me);

// Error Handler
app.use(errorHandler);

const PORT: string | number = process.env['PORT'] ?? 5000;

app.listen(PORT, () => {
    const mode = process.env['NODE_ENV'] ?? 'development';

    console.log(
        `Server running in ${mode} mode on port ${String(PORT)}`.yellow
    );
});
