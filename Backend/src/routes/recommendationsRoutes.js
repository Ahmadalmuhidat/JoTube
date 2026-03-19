import express from 'express';
import RecommendationController from '../controllers/recommendations.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => RecommendationController.getRecommendations(req, res));

export default router;