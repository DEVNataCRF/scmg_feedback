"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const userExists = await userRepository.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
            const user = userRepository.create({ name, email, password });
            await user.hashPassword();
            await userRepository.save(user);
            const signOptions = { expiresIn: env_1.env.JWT_EXPIRES_IN || '1d' };
            const token = jsonwebtoken_1.default.sign({ id: user.id }, env_1.env.JWT_SECRET, signOptions);
            return res.status(201).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
                token,
            });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async login(req, res) {
        var _a;
        try {
            const { email, password } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { email } });
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (!user) {
                logger_1.default.info('Tentativa de login falhou', { email, ip, resultado: 'Usuário não encontrado' });
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }
            const isValidPassword = await user.checkPassword(password);
            if (!isValidPassword) {
                logger_1.default.info('Tentativa de login falhou', { email, ip, resultado: 'Senha inválida' });
                return res.status(400).json({ error: 'Senha inválida' });
            }
            logger_1.default.info('Login realizado com sucesso', { email, ip, resultado: 'Sucesso', isAdmin: user.isAdmin });
            const signOptions = { expiresIn: env_1.env.JWT_EXPIRES_IN || '1d' };
            const token = jsonwebtoken_1.default.sign({ id: user.id }, env_1.env.JWT_SECRET, signOptions);
            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
                token,
            });
        }
        catch (error) {
            console.log(error);
            logger_1.default.error('Erro interno ao tentar login', { email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email, error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async changePassword(req, res) {
        var _a;
        try {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                try {
                    const token = authHeader.replace('Bearer ', '').trim();
                    const data = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
                    const { id } = data;
                    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                    const adminUser = await userRepository.findOne({ where: { id } });
                    if (adminUser) {
                        req.user = adminUser;
                    }
                }
                catch (err) {
                }
            }
            const { email, senhaAtual, novaSenha } = req.body;
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }
            if (req.user && req.user.isAdmin && (!senhaAtual || senhaAtual === '')) {
                user.password = novaSenha;
                await user.hashPassword();
                user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;
                await userRepository.save(user);
                return res.json({ message: 'Senha alterada com sucesso (admin).' });
            }
            if (req.user && req.user.id === user.id) {
                if ((user.passwordChangeCount || 0) >= 1) {
                    return res.status(403).json({ error: 'Apenas administradores podem alterar a senha novamente.' });
                }
                const isValidPassword = await user.checkPassword(senhaAtual);
                if (!isValidPassword) {
                    return res.status(400).json({ error: 'Senha atual inválida.' });
                }
                user.password = novaSenha;
                await user.hashPassword();
                user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;
                await userRepository.save(user);
                return res.json({ message: 'Senha alterada com sucesso.' });
            }
            if (!req.user) {
                if (user.isAdmin) {
                    return res.status(403).json({ error: 'Apenas administradores autenticados podem alterar a senha de admin.' });
                }
                if ((user.passwordChangeCount || 0) >= 1) {
                    return res.status(403).json({ error: 'Apenas administradores podem alterar a senha novamente.' });
                }
                const isValidPassword = await user.checkPassword(senhaAtual);
                if (!isValidPassword) {
                    return res.status(400).json({ error: 'Senha atual inválida.' });
                }
                user.password = novaSenha;
                await user.hashPassword();
                user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;
                await userRepository.save(user);
                return res.json({ message: 'Senha alterada com sucesso.' });
            }
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        catch (error) {
            logger_1.default.error('Erro interno ao tentar alterar senha', { email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email, error });
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.AuthController = AuthController;
