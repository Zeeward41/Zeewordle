import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './config/development.env' });

const pool = new pg.Pool({
    host: process.env['DB_HOST'],
    port: Number(process.env['DB_PORT']),
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
});

export default pool;
