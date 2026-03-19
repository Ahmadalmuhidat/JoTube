import express from 'express';
import ChannelController from '../controllers/channelController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my', requireAuth, (req, res) => ChannelController.getMyChannel(req, res));
router.get('/subscriptions', requireAuth, (req, res) => ChannelController.getSubscribedChannels(req, res));
router.get('/feed', requireAuth, (req, res) => ChannelController.getSubscriptionFeed(req, res));
router.get('/:id', (req, res) => ChannelController.getChannelById(req, res));
router.post('/', requireAuth, (req, res) => ChannelController.create(req, res));

export default router;
