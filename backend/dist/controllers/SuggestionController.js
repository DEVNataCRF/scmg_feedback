"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionController = void 0;
const database_1 = require("../config/database");
const Suggestion_1 = require("../models/Suggestion");
const logger_1 = __importDefault(require("../config/logger"));
class SuggestionController {
    async create(req, res) {
        try {
            const { suggestion } = req.body;
            if (!suggestion || suggestion.trim() === '') {
                return res.status(400).json({ error: 'Sugestão é obrigatória' });
            }
            const suggestionRepository = database_1.AppDataSource.getRepository(Suggestion_1.Suggestion);
            const newSuggestion = suggestionRepository.create({
                suggestion,
            });
            await suggestionRepository.save(newSuggestion);
            logger_1.default.info('Sugestão salva com sucesso', { suggestionId: newSuggestion.id });
            return res.status(201).json(newSuggestion);
        }
        catch (error) {
            logger_1.default.error('Erro ao criar sugestão', { error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async list(req, res) {
        try {
            const suggestionRepository = database_1.AppDataSource.getRepository(Suggestion_1.Suggestion);
            const suggestions = await suggestionRepository.find({
                order: { createdAt: 'DESC' },
            });
            return res.json({ suggestions });
        }
        catch (error) {
            logger_1.default.error('Erro ao listar sugestões', { error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.SuggestionController = SuggestionController;
