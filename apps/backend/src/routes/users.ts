import express from 'express';
import { getProfile, deleteAccount } from '../controllers/users.ts';

const router = express.Router();

router.get('/profile', getProfile);
router.delete('/', deleteAccount);

export default router;
