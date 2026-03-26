import express from 'express';
import multer from 'multer';
import VideoController from '../controllers/videoController.js';
import VideoService from '../services/videoService.js';
import StorageStrategy from '../providers/storageStrategy.js';
import GoogleStorage from '../providers/googleStorage.js';
import { requireAuth, optionalAuth } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createVideoSchema, videoIdSchema, commentSchema } from '../validations/videoValidation.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize dependencies
const storageStrategy = new StorageStrategy();
storageStrategy.setStorage(new GoogleStorage());

const videoService = new VideoService(storageStrategy);
const videoController = new VideoController(videoService);

// Routes
router.get('/', (req, res) => videoController.feed(req, res));
router.get('/history', requireAuth, (req, res) => videoController.history(req, res));
router.get('/suggestions/:id', (req, res) => videoController.suggestions(req, res));
router.get('/search/:query', (req, res) => videoController.search(req, res));
router.get('/:id', optionalAuth, (req, res) => videoController.getById(req, res));
router.post('/', requireAuth, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), validate(createVideoSchema), (req, res) => videoController.create(req, res));
router.delete('/:id', requireAuth, (req, res) => videoController.delete(req, res));
router.post('/view', optionalAuth, validate(videoIdSchema), (req, res) => videoController.view(req, res));
router.post('/like', requireAuth, validate(videoIdSchema), (req, res) => videoController.like(req, res));
router.post('/dislike', requireAuth, validate(videoIdSchema), (req, res) => videoController.dislike(req, res));
router.post('/subscribe', requireAuth, (req, res) => videoController.subscribe(req, res));
router.post('/unsubscribe', requireAuth, (req, res) => videoController.unsubscribe(req, res));
router.post('/comment', requireAuth, validate(commentSchema), (req, res) => videoController.comment(req, res));
router.delete('/comment/:id', requireAuth, (req, res) => videoController.deleteComment(req, res));

export default router;
