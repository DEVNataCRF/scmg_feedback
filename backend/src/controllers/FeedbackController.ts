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
      const userId = req.user?.id;

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

      logger.info('Feedback salvo com sucesso', { feedbackId: (feedback as unknown as Feedback).id, recomendacao: feedback.recomendacao });

      return res.status(201).json(feedback);
    } catch (error) {
      logger.error('Erro ao criar feedback', { error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const feedbackRepository = AppDataSource.getRepository(Feedback);
      const { month, year, page = 1, limit = 1500 } = req.query;

      logger.info('Listando feedbacks', { month, year, page, limit });

      let query = feedbackRepository
        .createQueryBuilder('feedback')
        .leftJoinAndSelect('feedback.user', 'user')
        .select([
          'feedback.id',
          'feedback.department',
          'feedback.rating',
          'feedback.createdAt',
          'feedback.suggestion',
          'feedback.recomendacao',
          'user.id',
          'user.name',
        ]);

      if (month && year) {
        query = query.where(
          'EXTRACT(MONTH FROM feedback.createdAt) = :month AND EXTRACT(YEAR FROM feedback.createdAt) = :year',
          { month, year }
        );
      }

      // Paginação
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const [feedbacks, total] = await query
        .orderBy('feedback.createdAt', 'DESC')
        .skip((pageNum - 1) * limitNum)
        .take(limitNum)
        .getManyAndCount();

      logger.info('Feedbacks listados', { quantidade: feedbacks.length, total });

      return res.json({
        feedbacks,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      logger.error('Erro ao listar feedbacks', { error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const feedbackRepository = AppDataSource.getRepository(Feedback);
      const { month, year } = req.query;

      logger.info('Obtendo estatísticas de feedbacks', { month, year });

      let query = feedbackRepository
        .createQueryBuilder('feedback')
        .select('feedback.rating', 'rating')
        .addSelect('COUNT(*)', 'count');

      if (month && year) {
        query = query.where(
          'EXTRACT(MONTH FROM feedback.createdAt) = :month AND EXTRACT(YEAR FROM feedback.createdAt) = :year',
          { month, year }
        );
      }

      const stats = await query.groupBy('feedback.rating').getRawMany();

      const total = stats.reduce((acc, curr) => acc + parseInt(curr.count), 0);

      const formattedStats = stats.map((stat) => ({
        rating: stat.rating,
        count: parseInt(stat.count),
        percentage: ((parseInt(stat.count) / total) * 100).toFixed(1),
      }));

      logger.info('Estatísticas de feedbacks obtidas', { total });

      return res.json({
        stats: formattedStats,
        total,
      });
    } catch (error) {
      logger.error('Erro ao obter estatísticas de feedbacks', { error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}