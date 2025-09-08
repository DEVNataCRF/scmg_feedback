import { Router, Request, Response, NextFunction } from 'express';
import { SuggestionController } from '../controllers/SuggestionController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const suggestionController = new SuggestionController();

router.post(
  '/',
  [
    body('suggestion')
      .notEmpty()
      .withMessage('Sugestão é obrigatória')
      .bail()
      .isString()
      .trim()
      .escape(),
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
  suggestionController.create
);
router.get('/', authMiddleware, suggestionController.list);

export default router; 
