"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const database_1 = require("../config/database");
const Feedback_1 = require("../models/Feedback");
const logger_1 = __importDefault(require("../config/logger"));
class FeedbackController {
    async create(req, res) {
        var _a;
        try {
            const { department, rating, suggestion, recomendacao } = req.body;
            if (!department || !rating) {
                return res.status(400).json({ error: 'Departamento e avaliação são obrigatórios.' });
            }
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            logger_1.default.info('Recebendo novo feedback', { department, rating, userId, recomendacao });
            const feedbackRepository = database_1.AppDataSource.getRepository(Feedback_1.Feedback);
            const feedbackData = {
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
            const savedFeedback = await feedbackRepository.save(feedback);
            if (Array.isArray(savedFeedback)) {
                logger_1.default.error('Erro: save retornou um array, mas deveria ser um objeto único!');
                return res.status(500).json({ error: 'Erro interno ao salvar feedback' });
            }
            const feedbackObj = savedFeedback;
            logger_1.default.info('Feedback salvo com sucesso', {
                feedbackId: feedbackObj.id,
                recomendacao: feedbackObj.recomendacao,
            });
            return res.status(201).json(feedbackObj);
        }
        catch (error) {
            logger_1.default.error('Erro ao criar feedback', { error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async list(req, res) {
        try {
            const feedbackRepository = database_1.AppDataSource.getRepository(Feedback_1.Feedback);
            const { month, year, page = 1, limit = 1500 } = req.query;
            logger_1.default.info('Listando feedbacks', { month, year, page, limit });
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
                query = query.where('EXTRACT(MONTH FROM feedback.createdAt) = :month AND EXTRACT(YEAR FROM feedback.createdAt) = :year', { month, year });
            }
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 10;
            const [feedbacks, total] = await query
                .orderBy('feedback.createdAt', 'DESC')
                .skip((pageNum - 1) * limitNum)
                .take(limitNum)
                .getManyAndCount();
            logger_1.default.info('Feedbacks listados', { quantidade: feedbacks.length, total });
            return res.json({
                feedbacks,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao listar feedbacks', { error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async getStats(req, res) {
        try {
            const feedbackRepository = database_1.AppDataSource.getRepository(Feedback_1.Feedback);
            const { month, year } = req.query;
            logger_1.default.info('Obtendo estatísticas de feedbacks', { month, year });
            let query = feedbackRepository
                .createQueryBuilder('feedback')
                .select('feedback.rating', 'rating')
                .addSelect('COUNT(*)', 'count');
            if (month && year) {
                query = query.where('EXTRACT(MONTH FROM feedback.createdAt) = :month AND EXTRACT(YEAR FROM feedback.createdAt) = :year', { month, year });
            }
            const stats = await query.groupBy('feedback.rating').getRawMany();
            const total = stats.reduce((acc, curr) => acc + parseInt(curr.count), 0);
            const formattedStats = stats.map((stat) => ({
                rating: stat.rating,
                count: parseInt(stat.count),
                percentage: ((parseInt(stat.count) / total) * 100).toFixed(1),
            }));
            logger_1.default.info('Estatísticas de feedbacks obtidas', { total });
            return res.json({
                stats: formattedStats,
                total,
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter estatísticas de feedbacks', { error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.FeedbackController = FeedbackController;
