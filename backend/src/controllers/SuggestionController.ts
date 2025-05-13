import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Suggestion } from '../models/Suggestion';
import logger from '../config/logger';

export class SuggestionController {
  async create(req: Request, res: Response) {
    try {
      const { suggestion } = req.body;

      if (!suggestion || suggestion.trim() === '') {
        return res.status(400).json({ error: 'Sugestão é obrigatória' });
      }

      const suggestionRepository = AppDataSource.getRepository(Suggestion);
      const newSuggestion = suggestionRepository.create({
        suggestion,
      });
      await suggestionRepository.save(newSuggestion);
      logger.info('Sugestão salva com sucesso', { suggestionId: newSuggestion.id });
      return res.status(201).json(newSuggestion);
    } catch (error) {
      logger.error('Erro ao criar sugestão', { error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const suggestionRepository = AppDataSource.getRepository(Suggestion);
      const suggestions = await suggestionRepository.find({
        order: { createdAt: 'DESC' },
      });
      return res.json({ suggestions });
    } catch (error) {
      logger.error('Erro ao listar sugestões', { error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 