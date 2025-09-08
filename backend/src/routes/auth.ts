import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import rateLimit from 'express-rate-limit';

const router = Router();
const authController = new AuthController();

// Limitar tentativas de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo de 10 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

  router.post('/register', authMiddleware, adminMiddleware, authController.register);
  router.post('/login', loginLimiter, authController.login);
  router.post('/change-password', authMiddleware, authController.changePassword);

export default router; 