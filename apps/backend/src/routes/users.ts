import express from 'express';
import { getProfile, deleteAccount } from '../controllers/users.ts';
import { requireAuth } from '../middlewares/requireAuth.ts';

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.delete('/', requireAuth, deleteAccount);

export default router;
