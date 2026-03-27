import express from 'express';
import ChannelController from '../controllers/channelController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

import multer from 'multer';
import { validate } from '../middlewares/validationMiddleware.js';
import { updateChannelSchema } from '../validations/channelValidation.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/my', requireAuth, (req, res) => ChannelController.getMyChannel(req, res));
router.patch('/me', requireAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), validate(updateChannelSchema), (req, res) => ChannelController.update(req, res));
router.get('/subscriptions', requireAuth, (req, res) => ChannelController.getSubscribedChannels(req, res));
router.get('/feed', requireAuth, (req, res) => ChannelController.getSubscriptionFeed(req, res));
router.get('/:id', (req, res) => ChannelController.getChannelById(req, res));
router.post('/', requireAuth, (req, res) => ChannelController.create(req, res));

export default router;
