import express from 'express';
import UserController from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();
const userController = new UserController();

router.get('/', requireAuth, userController.getUsers);
router.post('/webhooks/clerk', userController.handleClerkWebhook);

export default router;
