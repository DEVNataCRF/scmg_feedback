"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedbackController_1 = require("../controllers/FeedbackController");
const auth_1 = require("../middlewares/auth");
const { body } = require('express-validator');
const router = (0, express_1.Router)();
const feedbackController = new FeedbackController_1.FeedbackController();
router.post('/', [
    body('department').isString().trim().escape().notEmpty().withMessage('Departamento é obrigatório'),
    body('rating').isString().trim().escape().notEmpty().withMessage('Avaliação é obrigatória'),
    body('suggestion').optional().isString().trim(),
    body('recomendacao')
        .optional()
        .isInt({ min: 0, max: 10 })
        .withMessage('Recomendação deve ser um número entre 0 e 10'),
], feedbackController.create);
router.get('/', auth_1.authMiddleware, feedbackController.list);
router.get('/stats', auth_1.authMiddleware, feedbackController.getStats);
exports.default = router;
