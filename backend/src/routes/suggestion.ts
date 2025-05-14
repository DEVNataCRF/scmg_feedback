import { Router } from 'express';
import { SuggestionController } from '../controllers/SuggestionController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
const { body } = require('express-validator');

const router = Router();
const suggestionController = new SuggestionController();

router.post(
  '/',
  [body('suggestion').isString().trim().escape().notEmpty().withMessage('Sugestão é obrigatória')],
  suggestionController.create
);
router.get('/', authMiddleware, suggestionController.list);

export default router; 