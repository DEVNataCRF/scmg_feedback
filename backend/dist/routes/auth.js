"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middlewares/auth");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_2 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});
router.post('/register', auth_1.authMiddleware, auth_2.adminMiddleware, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/change-password', authController.changePassword);
exports.default = router;
