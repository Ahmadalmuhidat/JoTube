import express from 'express';
import StudioController from '../controllers/studioController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();
const studioController = new StudioController();

router.get('/stats', requireAuth, (req, res) => studioController.getStats(req, res));
router.get('/videos', requireAuth, (req, res) => studioController.getVideos(req, res));

export default router;
