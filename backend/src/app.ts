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
import exportPdfRoutes from './routes/exportPdf';
import exportExcelRoutes from './routes/exportExcel';

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/suggestion', suggestionRoutes);
app.use('/api', exportPdfRoutes);
app.use('/api', exportExcelRoutes);

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
