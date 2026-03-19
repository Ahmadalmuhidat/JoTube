import express from 'express';
import userRoutes from '../routes/userRoutes.js';
import videoRoutes from '../routes/videoRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/videos', videoRoutes);

export default router;
