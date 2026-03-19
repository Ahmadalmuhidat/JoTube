import express from 'express';
import VideoController from '../controllers/videoController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import StoregeStrategy from '../providers/stoargeStrategy.js';
import GoogleStorage from '../providers/googleStorage.js';

const router = express.Router();
const storageStrategy = new StoregeStrategy();
storageStrategy.setStorage(new GoogleStorage());
const videoController = new VideoController(storageStrategy);

router.get('/feed', videoController.feed);
router.post('/', requireAuth, videoController.create);
router.delete('/:id', requireAuth, videoController.delete);

export default router;
