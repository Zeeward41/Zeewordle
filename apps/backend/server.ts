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

// Route files
import auth from './src/routes/auth.ts';
import me from './src/routes/me.ts';
import users from './src/routes/users.ts';

// Load env vars
dotenv.config({ path: './config/development.env' });

// Check SESSION_SECRET exists
if (!process.env['SESSION_SECRET']) {
    throw new Error('SESSION_SECRET is not defined');
}

const app: Application = express();

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
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 30, // 30 minutes
        },
    })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1', me);

app.use(errorHandler);

const PORT: string | number = process.env['PORT'] ?? 5000;

app.listen(PORT, () => {
    const mode = process.env['NODE_ENV'] ?? 'development';

    console.log(
        `Server running in ${mode} mode on port ${String(PORT)}`.yellow
    );
});
