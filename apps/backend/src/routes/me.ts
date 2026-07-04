import express from 'express';
import { me } from '../controllers/me.ts';

const router = express.Router();

router.get('/me', me);

export default router;
