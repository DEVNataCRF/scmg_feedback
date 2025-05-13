import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
import 'reflect-metadata';
import cors from 'cors';
import authRoutes from './routes/auth';
import feedbackRoutes from './routes/feedback';
import suggestionRoutes from './routes/suggestion';
import logger from './config/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/suggestion', suggestionRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Middleware global de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erro não tratado', { error: err });
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app; 