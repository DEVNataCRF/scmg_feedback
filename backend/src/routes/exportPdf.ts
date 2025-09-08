import express from 'express';
import PDFDocument from 'pdfkit';
import { AppDataSource } from '../config/database';
import { Feedback } from '../models/Feedback';
import { Suggestion } from '../models/Suggestion';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
const router = express.Router();

function getBadgeColor(status: string) {
  if (status === 'Excelente') return '#4caf50';
  if (status === 'Bom') return '#2196f3';
  if (status === 'Regular') return '#ffc107';
  return '#f44336';
}

router.get('/export/pdf', authMiddleware, adminMiddleware, async (req, res) => {
  const user = req.user as any;
  const doc = new PDFDocument({ margin: 40 });
  const filename = 'Relatorio_Pesquisa_Satisfacao.pdf';
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  // Cabeçalho
  doc.fillColor('#4caf50').fontSize(24).text('Relatório de Feedbacks e Sugestões', { align: 'center' });
  doc.moveDown(0.2);
  doc.fillColor('#8bc34a').fontSize(12).text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
  doc.moveDown(1.5);

  // Feedbacks dos Pacientes
  doc.fillColor('#222').fontSize(18).text('Feedbacks dos Pacientes');
  doc.moveDown(0.5);

  const feedbackRepo = AppDataSource.getRepository(Feedback);
  const feedbacks = await feedbackRepo.find();

  // Tabela de Feedbacks
  const tableTop = doc.y + 10;
  const colWidths = [120, 160, 120];
  const startX = doc.page.margins.left;
  let y = tableTop;

  // Cabeçalho da tabela
  doc.rect(startX, y, colWidths.reduce((a, b) => a + b), 24).fill('#4caf50');
  doc.fillColor('white').fontSize(12)
    .text('Data', startX + 8, y + 6, { width: colWidths[0] - 8, align: 'left' })
    .text('Departamento', startX + colWidths[0] + 8, y + 6, { width: colWidths[1] - 8, align: 'left' })
    .text('Avaliação', startX + colWidths[0] + colWidths[1] + 8, y + 6, { width: colWidths[2] - 8, align: 'left' });
  y += 24;

  feedbacks.forEach(fb => {
    // Fundo da linha
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b), 22).fill('#fff');
    // Data
    doc.fillColor('#222').fontSize(11).text(new Date(fb.createdAt).toLocaleString('pt-BR'), startX + 8, y + 6, { width: colWidths[0] - 8 });
    // Departamento
    doc.text(fb.department.name, startX + colWidths[0] + 8, y + 6, { width: colWidths[1] - 8 });
    // Badge Avaliação
    const badgeColor = getBadgeColor(fb.rating);
    doc.roundedRect(startX + colWidths[0] + colWidths[1] + 8, y + 6, 60, 14, 4).fillAndStroke(badgeColor, badgeColor);
    doc.fillColor('white').fontSize(11).text(fb.rating, startX + colWidths[0] + colWidths[1] + 18, y + 8, { width: 44, align: 'left' });
    y += 22;
    // Nova página se passar do limite
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = doc.y;
    }
  });

  y += 20;
  doc.y = y;

  // Sugestões dos Pacientes
  doc.fillColor('#222').fontSize(18).text('Sugestões dos Pacientes');
  doc.moveDown(0.5);

  const suggestionRepo = AppDataSource.getRepository(Suggestion);
  const suggestions = await suggestionRepo.find();

  // Tabela de Sugestões
  y = doc.y + 10;
  // Cabeçalho
  doc.rect(startX, y, colWidths[0] + colWidths[1], 24).fill('#4caf50');
  doc.fillColor('white').fontSize(12)
    .text('Data', startX + 8, y + 6, { width: colWidths[0] - 8, align: 'left' })
    .text('Sugestão', startX + colWidths[0] + 8, y + 6, { width: colWidths[1] - 8, align: 'left' });
  y += 24;

  suggestions.forEach(s => {
    doc.rect(startX, y, colWidths[0] + colWidths[1], 22).fill('#fff');
    doc.fillColor('#222').fontSize(11).text(new Date(s.createdAt).toLocaleString('pt-BR'), startX + 8, y + 6, { width: colWidths[0] - 8 });
    doc.text(s.suggestion, startX + colWidths[0] + 8, y + 6, { width: colWidths[1] - 8 });
    y += 22;
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = doc.y;
    }
  });

  // Rodapé
  doc.fontSize(10).fillColor('#888').text(
    `Gerado por: ${user?.name || user?.email || 'Desconhecido'}`,
    startX,
    doc.page.height - 50
  );

  doc.end();
});

export default router; 