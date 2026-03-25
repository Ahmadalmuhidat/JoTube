import express from 'express';
import userRoutes from '../routes/userRoutes.js';
import videoRoutes from '../routes/videoRoutes.js';
import channelRoutes from '../routes/channelRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import searchRoutes from '../routes/searchRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/videos', videoRoutes);
router.use('/channels', channelRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);

export default router;
