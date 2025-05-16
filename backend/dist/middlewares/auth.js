"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = authorization.replace('Bearer', '').trim();
    try {
        const data = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const { id } = data;
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        req.user = user;
        return next();
    }
    catch (_a) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    return next();
};
exports.adminMiddleware = adminMiddleware;
