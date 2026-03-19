import express from 'express';
import SearchController from '../controllers/searchController.js';

const router = express.Router();

router.get('/', (req, res) => SearchController.search(req, res));

export default router;
