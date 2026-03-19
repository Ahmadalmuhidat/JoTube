import express from 'express';
import PlaylistController from '../controllers/playlistController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();
const playlistController = new PlaylistController();

router.get('/', (req, res) => playlistController.getAll(req, res));
router.get('/:id', (req, res) => playlistController.getById(req, res));
router.post('/', requireAuth, (req, res) => playlistController.create(req, res));
router.put('/:id', requireAuth, (req, res) => playlistController.update(req, res));
router.delete('/:id', requireAuth, (req, res) => playlistController.delete(req, res));
router.post('/:id/video', requireAuth, (req, res) => playlistController.addVideo(req, res));
router.delete('/:id/video', requireAuth, (req, res) => playlistController.removeVideo(req, res));

export default router;
