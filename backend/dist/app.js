"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/../.env' });
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const suggestion_1 = __importDefault(require("./routes/suggestion"));
const logger_1 = __importDefault(require("./config/logger"));
const exportPdf_1 = __importDefault(require("./routes/exportPdf"));
const exportExcel_1 = __importDefault(require("./routes/exportExcel"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'https://scmg-feedback.onrender.com',
        'http://localhost:3000'
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/feedback', feedback_1.default);
app.use('/api/suggestion', suggestion_1.default);
app.use('/api', exportPdf_1.default);
app.use('/api', exportExcel_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});
app.use((err, req, res, next) => {
    logger_1.default.error('Erro não tratado', { error: err });
    res.status(500).json({ error: 'Erro interno do servidor' });
});
exports.default = app;
