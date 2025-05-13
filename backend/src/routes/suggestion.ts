import { Router } from 'express';
import { SuggestionController } from '../controllers/SuggestionController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import * as expressValidator from 'express-validator';
const { body } = expressValidator;

const router = Router();
const suggestionController = new SuggestionController();

router.post(
  '/',
  authMiddleware,
  [body('suggestion').isString().trim().escape().notEmpty().withMessage('Sugestão é obrigatória')],
  suggestionController.create
);
router.get('/', authMiddleware, suggestionController.list);

export default router; 