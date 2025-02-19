import express from 'express';
import { body } from 'express-validator';
import * as urlController from '../controllers/urlController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', [
  auth,
  body('url').isURL().withMessage('Invalid URL'),
], urlController.analyzeUrlEndpoint);

router.get('/history', auth, urlController.getHistory);

export default router;