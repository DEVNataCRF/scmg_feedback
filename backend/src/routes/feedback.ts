import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
const { body } = require('express-validator');

const router = Router();
const feedbackController = new FeedbackController();

router.post(
  '/',
  [
    body('department').isString().trim().escape().notEmpty().withMessage('Departamento é obrigatório'),
    body('rating').isString().trim().escape().notEmpty().withMessage('Avaliação é obrigatória'),
  ],
  feedbackController.create
);
router.get('/', authMiddleware, feedbackController.list);
router.get('/stats', authMiddleware, feedbackController.getStats);

export default router; 