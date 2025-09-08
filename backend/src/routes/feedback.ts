import { Router, Request, Response, NextFunction } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const feedbackController = new FeedbackController();

router.post(
  '/',
  [
    body('departmentId')
      .notEmpty()
      .withMessage('Departamento é obrigatório')
      .bail()
      .isString()
      .trim()
      .escape(),
    body('rating')
      .notEmpty()
      .withMessage('Avaliação é obrigatória')
      .bail()
      .isString()
      .trim()
      .escape(),
    body('suggestion').optional().isString().trim(),
    body('recomendacao')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Recomendação deve ser um número entre 0 e 10'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((error: any) => ({
          field: error.path ?? error.param,
          message: error.msg,
        })),
      });
    }
    next();
  },
  feedbackController.create
);
router.get('/', authMiddleware, feedbackController.list);
router.get('/stats', authMiddleware, feedbackController.getStats);

export default router; 
