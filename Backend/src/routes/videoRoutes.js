import express from 'express';
import VideoController from '../controllers/videoController.js';
import VideoService from '../services/videoService.js';
import StorageStrategy from '../providers/storageStrategy.js';
import GoogleStorage from '../providers/googleStorage.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createVideoSchema, videoIdSchema, commentSchema } from '../validations/videoValidation.js';

const router = express.Router();

// Initialize dependencies
const storageStrategy = new StorageStrategy();
storageStrategy.setStorage(new GoogleStorage());

const videoService = new VideoService(storageStrategy);
const videoController = new VideoController(videoService);

// Routes
router.get('/feed', (req, res) => videoController.feed(req, res));
router.post('/', requireAuth, validate(createVideoSchema), (req, res) => videoController.create(req, res));
router.delete('/:id', requireAuth, (req, res) => videoController.delete(req, res));
router.post('/view', validate(videoIdSchema), (req, res) => videoController.view(req, res));
router.post('/like', requireAuth, validate(videoIdSchema), (req, res) => videoController.like(req, res));
router.post('/dislike', requireAuth, validate(videoIdSchema), (req, res) => videoController.dislike(req, res));
router.post('/subscribe', requireAuth, (req, res) => videoController.subscribe(req, res));
router.post('/unsubscribe', requireAuth, (req, res) => videoController.unsubscribe(req, res));
router.post('/comment', requireAuth, validate(commentSchema), (req, res) => videoController.comment(req, res));

export default router;
