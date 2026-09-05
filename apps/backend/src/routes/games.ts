import express from 'express';
import { gameCurrent, gameStop, gameGuess } from '../controllers/games.ts';
import { requireAuth } from '../middlewares/requireAuth.ts';

const router = express.Router();

router.get('/current', requireAuth, gameCurrent);
router.post('/stop', requireAuth, gameStop);
router.post('/guess', requireAuth, gameGuess);

export default router;
