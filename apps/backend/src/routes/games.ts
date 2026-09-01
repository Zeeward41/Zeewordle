import express from 'express';
import { gameCurrent, gameStop, gameGuess } from '../controllers/games.ts';

const router = express.Router();

router.get('/current', gameCurrent);
router.post('/stop', gameStop);
router.post('/guess', gameGuess);

export default router;
