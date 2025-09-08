import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { body } from 'express-validator';

const router = Router();
const feedbackController = new FeedbackController();

router.post(
  '/',
  [
    body('departmentId').isString().trim().escape().notEmpty().withMessage('Departamento é obrigatório'),
    body('rating').isString().trim().escape().notEmpty().withMessage('Avaliação é obrigatória'),
    body('suggestion').optional().isString().trim(),
    body('recomendacao')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Recomendação deve ser um número entre 0 e 10'),
  ],
  feedbackController.create
);
router.get('/', authMiddleware, feedbackController.list);
router.get('/stats', authMiddleware, feedbackController.getStats);

export default router; 
