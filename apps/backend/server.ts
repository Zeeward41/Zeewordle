import type { Application } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './src/middlewares/error.ts';
import OpenApiValidator from 'express-openapi-validator';

// Route files
import auth from './src/routes/auth.ts';

// Load env vars
dotenv.config({ path: './config/development.env' });

const app: Application = express();

// CORS
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-type', 'Authorization'],
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
console.log('OpenAPI Validator chargé');
// express-openapi-validator
app.use(
    OpenApiValidator.middleware({
        apiSpec: '../../docs/api/openapi.yaml',
        validateRequests: true,
        validateResponses: false,
    })
);

console.log('OpenAPI Validator blue');

// Mount routers
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT: string | number = process.env['PORT'] ?? 5000;

app.listen(PORT, () => {
    const mode = process.env['NODE_ENV'] ?? 'development';

    console.log(
        `Server running in ${mode} mode on port ${String(PORT)}`.yellow
    );
});
