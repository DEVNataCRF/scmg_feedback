"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exceljs_1 = __importDefault(require("exceljs"));
const database_1 = require("../config/database");
const Feedback_1 = require("../models/Feedback");
const Suggestion_1 = require("../models/Suggestion");
const router = express_1.default.Router();
router.get('/export/excel', async (req, res) => {
    const user = req.user;
    const feedbackRepo = database_1.AppDataSource.getRepository(Feedback_1.Feedback);
    const suggestionRepo = database_1.AppDataSource.getRepository(Suggestion_1.Suggestion);
    const feedbacks = await feedbackRepo.find();
    const sugestoes = await suggestionRepo.find();
    const workbook = new exceljs_1.default.Workbook();
    const sheet = workbook.addWorksheet('Relatório');
    sheet.mergeCells('A1:E1');
    sheet.getCell('A1').value = 'Santa Casa de Misericórdia de Guaçuí';
    sheet.getCell('A1').font = { size: 18, bold: true };
    sheet.mergeCells('A2:E2');
    sheet.getCell('A2').value = 'Relatório de Feedbacks e Sugestões';
    sheet.getCell('A2').font = { size: 14, bold: true };
    sheet.mergeCells('A3:E3');
    sheet.getCell('A3').value = `Data de geração: ${new Date().toLocaleString('pt-BR')}`;
    sheet.mergeCells('A4:E4');
    sheet.getCell('A4').value = `Responsável: ${(user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.email) || 'Desconhecido'}`;
    let row = 6;
    sheet.getCell(`A${row}`).value = 'Feedbacks por Departamento';
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
    const departamentos = Array.from(new Set(feedbacks.map(f => f.department)));
    for (const dep of departamentos) {
        sheet.getCell(`A${row}`).value = dep;
        sheet.getCell(`A${row}`).font = { bold: true, color: { argb: 'FF19984B' } };
        row++;
        feedbacks.filter(f => f.department === dep).forEach(fb => {
            sheet.getCell(`A${row}`).value = new Date(fb.createdAt).toLocaleString('pt-BR');
            sheet.getCell(`B${row}`).value = fb.rating;
            row++;
        });
    }
    row++;
    sheet.getCell(`A${row}`).value = 'Recomendações 0 a 10';
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
    const recomendacoes = feedbacks.filter(f => typeof f.recomendacao === 'number');
    for (const r of recomendacoes) {
        let emoji = '😐';
        const nota = r.recomendacao;
        if (nota !== undefined && nota !== null) {
            if (nota >= 9)
                emoji = '😄';
            else if (nota >= 7)
                emoji = '🙂';
            else if (nota >= 5)
                emoji = '😐';
            else if (nota >= 3)
                emoji = '😕';
            else
                emoji = '😡';
        }
        sheet.getCell(`A${row}`).value = new Date(r.createdAt).toLocaleString('pt-BR');
        sheet.getCell(`B${row}`).value = `Nota: ${nota}`;
        sheet.getCell(`C${row}`).value = emoji;
        row++;
    }
    row++;
    sheet.getCell(`A${row}`).value = 'Emoji Summary';
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
    if (recomendacoes.length > 0) {
        const media = recomendacoes.reduce((a, b) => a + (b.recomendacao || 0), 0) / recomendacoes.length;
        let emoji = '😐', label = 'Neutro';
        if (media >= 9) {
            emoji = '😄';
            label = 'Muito satisfeito';
        }
        else if (media >= 7) {
            emoji = '🙂';
            label = 'Satisfeito';
        }
        else if (media >= 5) {
            emoji = '😐';
            label = 'Neutro';
        }
        else if (media >= 3) {
            emoji = '😕';
            label = 'Insatisfeito';
        }
        else {
            emoji = '😡';
            label = 'Muito insatisfeito';
        }
        sheet.getCell(`A${row}`).value = `Média das notas: ${media.toFixed(1)} / 10`;
        sheet.getCell(`B${row}`).value = emoji;
        sheet.getCell(`C${row}`).value = label;
        row++;
    }
    else {
        sheet.getCell(`A${row}`).value = 'Sem recomendações registradas.';
        row++;
    }
    row++;
    sheet.getCell(`A${row}`).value = 'Sugestões dos Pacientes';
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
    if (sugestoes.length === 0) {
        sheet.getCell(`A${row}`).value = 'Nenhuma sugestão registrada.';
        row++;
    }
    else {
        for (const s of sugestoes) {
            sheet.getCell(`A${row}`).value = new Date(s.createdAt).toLocaleString('pt-BR');
            sheet.getCell(`B${row}`).value = s.suggestion;
            row++;
        }
    }
    sheet.getCell(`A${row + 2}`).value = 'Santa Casa de Misericórdia de Guaçuí';
    sheet.getCell(`A${row + 3}`).value = `Período: completo até ${new Date().toLocaleString('pt-BR')}`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Relatorio_Feedbacks.xlsx');
    await workbook.xlsx.write(res);
    res.end();
});
exports.default = router;
