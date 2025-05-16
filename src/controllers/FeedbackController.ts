import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Feedback } from '../models/Feedback';
import logger from '../config/logger';

export class FeedbackController {
  async create(req: Request, res: Response) {
    try {
      const { department, rating, suggestion, recomendacao } = req.body;
      if (!department || !rating) {
        return res.status(400).json({ error: 'Departamento e avaliação são obrigatórios.' });
      }
      const userId = (req as any).user?.id;

      logger.info('Recebendo novo feedback', { department, rating, userId, recomendacao });

      const feedbackRepository = AppDataSource.getRepository(Feedback);

      const feedbackData: any = {
        department,
        rating,
      };
      if (userId) {
        feedbackData.user = { id: userId };
      }
      if (suggestion) {
        feedbackData.suggestion = suggestion;
      }
      if (recomendacao !== undefined) {
        feedbackData.recomendacao = recomendacao;
      }
      const feedback = feedbackRepository.create(feedbackData);

      await feedbackRepository.save(feedback);

      logger.info('Feedback salvo com sucesso', {
        feedbackId: feedback.id,
        recomendacao: feedback.recomendacao
      });

      return res.status(201).json(feedback);
    } catch (error) {
      logger.error('Erro ao criar feedback', { error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // ... restante do controller ...
} 