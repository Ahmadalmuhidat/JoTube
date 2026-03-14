import express from 'express';
import userRoutes from '../interfaces/http/routes/userRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);

export default router;
