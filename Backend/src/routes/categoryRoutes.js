import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => CategoryController.getAll(req, res));
router.post('/', requireAuth, (req, res) => CategoryController.create(req, res));
router.delete('/:id', requireAuth, (req, res) => CategoryController.delete(req, res));

export default router;
