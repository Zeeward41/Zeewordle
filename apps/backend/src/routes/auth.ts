import express from 'express';
import { register, login, logout, googleAuth } from '../controllers/auth.ts';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);

export default router;
