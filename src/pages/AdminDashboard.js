import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useFeedback } from '../contexts/FeedBackContext';
import { departments } from '../../backend/src/constants/department';
import * as ExcelJS from 'exceljs';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { getSuggestions } from '../services/api';
import { FiUser, FiMail, FiLock, FiX } from 'react-icons/fi';
const GlobalStyle = createGlobalStyle `
  body {
    font-family: 'Inter', sans-serif;
    background-color: #F7FAFC;
    color: #2D3748;
    padding: 20px;
  }
`;
const Title = styled.h1 `
  color: #2F855A;
  margin-bottom: 30px;
  font-size: 2rem;
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
`;
const Grid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 4px;
  }
`;
const Card = styled.div `
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  font-size: 1.05rem;
  @media (max-width: 600px) {
    padding: 12px;
    font-size: 0.98rem;
  }
`;
const CardTitle = styled.h2 `
  font-size: 18px;
  margin-bottom: 10px;
  color: #2F855A;
`;
const Total = styled.div `
  font-size: 32px;
  font-weight: bold;
  color: #2D3748;
`;
const Avaliacoes = styled.div `
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
`;
const AvaliacaoButton = styled.div `
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  background-color: ${({ $tipo }) => $tipo === 'Excelente' ? '#38A169' :
    $tipo === 'Bom' ? '#3182CE' :
        $tipo === 'Regular' ? '#D69E2E' :
            $tipo === 'Ruim' ? '#E53E3E' : '#CBD5E0'};
`;
const SuggestionList = styled.ul `
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  @media (max-width: 600px) {
    max-height: 200px;
    padding: 0 2px;
  }
`;
const SuggestionItem = styled.li `
  background: #f7fafc;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  font-size: 15px;
  color: #2D3748;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  white-space: pre-wrap;
  line-height: 1.5;
`;
const SuggestionText = styled.div `
  margin-bottom: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const SuggestionDate = styled.span `
  font-size: 12px;
  color: #718096;
  margin-top: 4px;
  align-self: flex-end;
`;
const ExportButtonsContainer = styled.div `
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  justify-content: flex-end;
`;
const ExportButton = styled.button `
  padding: 6px 14px;
  background: linear-gradient(90deg, #38A169 0%, #2F855A 100%);
  color: #fff;
  border: 1px solid #2F855A;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(47,133,90,0.10);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, border 0.2s, box-shadow 0.2s;
  margin: 0;
  &:hover {
    background: linear-gradient(90deg, #2F855A 0%, #38A169 100%);
    border: 1px solid #38A169;
    box-shadow: 0 2px 8px rgba(47,133,90,0.18);
  }
  &:disabled {
    background: #CBD5E0;
    color: #A0AEC0;
    border: 1px solid #CBD5E0;
    cursor: not-allowed;
    box-shadow: none;
  }
  @media (max-width: 600px) {
    padding: 6px 8px;
    font-size: 0.90rem;
  }
`;
const FilterContainer = styled.div `
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
`;
const FilterGroup = styled.div `
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
`;
const Select = styled.select `
  padding: 8px 12px;
  border: 1px solid #2F855A;
  border-radius: 6px;
  font-size: 14px;
  color: #2D3748;
  background-color: white;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #38A169;
  }
`;
const FullWidthCard = styled(Card) `
  grid-column: 1 / -1;
`;
const ratingOptions = [
    { value: '', label: 'Todos os Tipos' },
    { value: 'Excelente', label: 'Ótimo' },
    { value: 'Bom', label: 'Bom' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Ruim', label: 'Ruim' },
];
const ModalOverlay = styled.div `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div `
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const CloseButton = styled.button `
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;
const ModalTitle = styled.h2 `
  color: #2F855A;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;
const InputGroup = styled.div `
  position: relative;
  margin-bottom: 1rem;
`;
const Icon = styled.span `
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;
const Input = styled.input `
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #3182CE;
  }
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const Button = styled.button `
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' ? `
    background: #3182CE;
    color: white;
    &:hover {
      background: #2C5282;
    }
  ` : `
    background: #CBD5E0;
    color: #2D3748;
    &:hover {
      background: #A0AEC0;
    }
  `}
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
const Message = styled.div `
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  color: ${props => props.type === 'success' ? '#38A169' : '#E53E3E'};
  background: ${props => props.type === 'success' ? '#F0FFF4' : '#FFF5F5'};
  min-height: 2.5rem;
`;
const AdminDashboard = () => {
    const { feedbacks, loading, fetchFeedbacks } = useFeedback();
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showRegister, setShowRegister] = useState(false);
    const [nomeNovo, setNomeNovo] = useState('');
    const [emailNovo, setEmailNovo] = useState('');
    const [senhaNovo, setSenhaNovo] = useState('');
    const [confirmaSenhaNovo, setConfirmaSenhaNovo] = useState('');
    const [registerMsg, setRegisterMsg] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const modalRef = useRef(null);
    const [bgLoading, setBgLoading] = useState(false);
    const [loadingExport, setLoadingExport] = useState(false);
    const [loadingExportPDF, setLoadingExportPDF] = useState(false);
    const [exportError, setExportError] = useState('');
    const [exportSuccess, setExportSuccess] = useState('');
    const [showChangeUserPassword, setShowChangeUserPassword] = useState(false);
    const [changeUserEmail, setChangeUserEmail] = useState('');
    const [changeUserNewPassword, setChangeUserNewPassword] = useState('');
    const [changeUserConfirmPassword, setChangeUserConfirmPassword] = useState('');
    const [changeUserMsg, setChangeUserMsg] = useState('');
    const [changeUserLoading, setChangeUserLoading] = useState(false);
    // Buscar sugestões gerais ao carregar o dashboard
    useEffect(() => {
        getSuggestions().then(setSuggestions).catch(() => setSuggestions([]));
    }, []);
    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter(f => {
            const matchesDepartment = !departmentFilter || f.department === departmentFilter;
            const matchesRating = !ratingFilter || f.rating === ratingFilter;
            const created = new Date(f.createdAt).getTime();
            const matchesStart = !startDate || created >= new Date(startDate).setHours(0, 0, 0, 0);
            const matchesEnd = !endDate || created <= new Date(endDate).setHours(23, 59, 59, 999);
            return matchesDepartment && matchesRating && matchesStart && matchesEnd;
        });
    }, [feedbacks, departmentFilter, ratingFilter, startDate, endDate]);
    // Função para obter o primeiro e último dia do mês selecionado
    const getMonthRange = (monthStr) => {
        if (monthStr === 'all')
            return { start: 0, end: Date.now() };
        const [year, month] = monthStr.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1).getTime();
        const endDate = new Date(year, month, 0).getTime();
        return { start: startDate, end: endDate };
    };
    // Gerar opções de meses para o select
    const monthOptions = useMemo(() => {
        const options = [{ value: 'all', label: 'Todos os meses' }];
        const currentYear = new Date().getFullYear();
        // Adiciona todos os meses do ano atual
        for (let month = 0; month < 12; month++) {
            const date = new Date(currentYear, month, 1);
            const monthStr = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
            options.push({
                value: monthStr,
                label: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
            });
        }
        return options;
    }, []);
    // Contagem total
    const totalFeedbacks = filteredFeedbacks.length;
    // Contagem por departamento e tipo
    const getStats = (depId) => {
        return {
            Excelente: filteredFeedbacks.filter(f => f.department === depId && f.rating === 'Excelente').length,
            Bom: filteredFeedbacks.filter(f => f.department === depId && f.rating === 'Bom').length,
            Regular: filteredFeedbacks.filter(f => f.department === depId && f.rating === 'Regular').length,
            Ruim: filteredFeedbacks.filter(f => f.department === depId && f.rating === 'Ruim').length,
        };
    };
    // Unir sugestões do modelo Feedback e Suggestion
    const allSuggestions = [
        ...filteredFeedbacks
            .filter(f => f.suggestion && f.suggestion.trim() !== '')
            .map(f => ({
            createdAt: f.createdAt,
            suggestion: f.suggestion
        })),
        ...suggestions.map(s => ({
            createdAt: s.createdAt,
            suggestion: s.suggestion
        }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Função otimizada para exportar todos os feedbacks em lotes
    async function exportarTodosFeedbacksExcel() {
        setLoadingExport(true);
        setExportError('');
        setExportSuccess('');
        try {
            let page = 1;
            const limit = 500;
            let todosFeedbacks = [];
            let totalPages = 1;
            const token = localStorage.getItem('token');
            do {
                const res = await fetch(`/api/feedback?page=${page}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                todosFeedbacks = todosFeedbacks.concat(data.feedbacks);
                totalPages = data.totalPages;
                page++;
            } while (page <= totalPages);
            // Criar uma nova planilha
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Relatório');
            // Definir larguras das colunas
            worksheet.columns = [
                { header: 'Data', key: 'data', width: 20 },
                { header: 'Departamento', key: 'departamento', width: 15 },
                { header: 'Avaliação', key: 'avaliacao', width: 80 }
            ];
            // Estilizar cabeçalho
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2F855A' }
            };
            worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } };
            // Adicionar dados dos feedbacks
            todosFeedbacks.forEach(feedback => {
                worksheet.addRow({
                    data: new Date(feedback.createdAt).toLocaleString('pt-BR'),
                    departamento: departments.find(d => d.id === feedback.department)?.name || feedback.department,
                    avaliacao: feedback.rating
                });
            });
            // Adicionar linha em branco
            worksheet.addRow({});
            // Adicionar cabeçalho para sugestões
            const suggestionHeaderRow = worksheet.addRow({
                data: '',
                departamento: '',
                avaliacao: 'Sugestões Gerais'
            });
            suggestionHeaderRow.font = { bold: true };
            suggestionHeaderRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3182CE' }
            };
            suggestionHeaderRow.font = { color: { argb: 'FFFFFFFF' } };
            // Adicionar sugestões
            allSuggestions.forEach(s => {
                worksheet.addRow({
                    data: new Date(s.createdAt).toLocaleString('pt-BR'),
                    departamento: '',
                    avaliacao: s.suggestion
                });
            });
            // Estilizar células
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle', wrapText: true };
                });
            });
            // Gerar arquivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Relatorio_Feedbacks_e_Sugestoes.xlsx';
            link.click();
            window.URL.revokeObjectURL(url);
            setExportSuccess('Exportação para Excel concluída!');
        }
        catch (err) {
            setExportError('Erro ao exportar para Excel. Tente novamente.');
        }
        setLoadingExport(false);
    }
    // Função otimizada para exportar todos os feedbacks em lotes para PDF
    async function exportarTodosFeedbacksPDF() {
        setLoadingExportPDF(true);
        setExportError('');
        setExportSuccess('');
        try {
            let page = 1;
            const limit = 500;
            let todosFeedbacks = [];
            let totalPages = 1;
            const token = localStorage.getItem('token');
            do {
                const res = await fetch(`/api/feedback?page=${page}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                todosFeedbacks = todosFeedbacks.concat(data.feedbacks);
                totalPages = data.totalPages;
                page++;
            } while (page <= totalPages);
            const doc = new jsPDF();
            // Avaliações
            const feedbackTable = todosFeedbacks.map(feedback => ([
                ((feedback.createdAt && !isNaN(new Date(feedback.createdAt).getTime())
                    ? new Date(feedback.createdAt).toLocaleString('pt-BR') : '') || '') + '',
                (departments.find(d => d.id === feedback.department)?.name || feedback.department || '') + '',
                (feedback.rating || '') + ''
            ]));
            autoTable(doc, {
                head: [['Data', 'Departamento', 'Avaliação']],
                body: feedbackTable,
                startY: 10,
                margin: { top: 10 },
                styles: { fontSize: 10 },
                didDrawPage: (data) => {
                    doc.setFontSize(14);
                    doc.text('Relatório de Feedbacks', data.settings.margin.left, 6);
                }
            });
            // Espaço e título para sugestões gerais
            let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 20;
            doc.setFontSize(12);
            doc.text('Sugestões dos pacientes', 14, finalY + 10);
            // Sugestões gerais (todas)
            const suggestionTable = allSuggestions.map(s => ([
                String(new Date(s.createdAt).toLocaleString('pt-BR')),
                String(s.suggestion)
            ]));
            autoTable(doc, {
                head: [['Data', 'Sugestão']],
                body: suggestionTable,
                startY: finalY + 15,
                styles: { fontSize: 10 }
            });
            // Adicionar rodapé com usuário responsável
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const nomeUsuario = user.name || user.email || 'Desconhecido';
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`USUÁRIO: ${nomeUsuario}`, 14, doc.internal.pageSize.height - 10);
            }
            doc.save('Relatorio_Feedbacks_e_Sugestoes.pdf');
            setExportSuccess('Exportação para PDF concluída!');
        }
        catch (err) {
            setExportError('Erro ao exportar para PDF. Tente novamente.');
        }
        setLoadingExportPDF(false);
    }
    const exportToCSV = () => {
        const data = filteredFeedbacks.map(feedback => ({
            Data: new Date(feedback.createdAt).toLocaleString('pt-BR'),
            Departamento: departments.find(d => d.id === feedback.department)?.name || feedback.department,
            Avaliação: feedback.rating,
            Sugestão: feedback.suggestion || '-'
        }));
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'feedbacks.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        navigate('/admin/login');
    };
    // Fechar modal ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (showRegister && modalRef.current && !modalRef.current.contains(event.target)) {
                setShowRegister(false);
                setRegisterMsg('');
            }
        }
        if (showRegister) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRegister]);
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterMsg('');
        if (!nomeNovo || !emailNovo || !senhaNovo) {
            setRegisterMsg('Todos os campos são obrigatórios.');
            return;
        }
        if (senhaNovo !== confirmaSenhaNovo) {
            setRegisterMsg('As senhas não coincidem.');
            return;
        }
        setRegisterLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ name: nomeNovo, email: emailNovo, password: senhaNovo })
            });
            const data = await response.json();
            if (!response.ok) {
                setRegisterMsg(data?.error || data?.message || 'Erro ao cadastrar usuário.');
            }
            else {
                setRegisterMsg('Usuário cadastrado com sucesso!');
                setNomeNovo('');
                setEmailNovo('');
                setSenhaNovo('');
                setConfirmaSenhaNovo('');
                setTimeout(() => {
                    setShowRegister(false);
                    setRegisterMsg('');
                }, 1500);
            }
        }
        catch (err) {
            setRegisterMsg('Erro ao cadastrar usuário.');
        }
        finally {
            setRegisterLoading(false);
        }
    };
    // Atualização em background a cada 60s (sem recarregar visualmente)
    useEffect(() => {
        const interval = setInterval(async () => {
            setBgLoading(true);
            await fetchFeedbacks();
            setBgLoading(false);
        }, 60000); // 60 segundos
        return () => clearInterval(interval);
    }, [fetchFeedbacks]);
    // Atualização manual pelo botão
    const handleManualUpdate = async () => {
        setBgLoading(true);
        await fetchFeedbacks();
        try {
            const novasSugestoes = await getSuggestions();
            setSuggestions(novasSugestoes);
        }
        catch {
            setSuggestions([]);
        }
        setBgLoading(false);
    };
    useEffect(() => {
        if (showRegister && modalRef.current) {
            modalRef.current.focus();
        }
    }, [showRegister]);
    // Verificar se o usuário logado é admin
    const isAdmin = useMemo(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.isAdmin === true;
        }
        catch {
            return false;
        }
    }, []);
    // Função para alterar senha de outro usuário (admin)
    const handleChangeUserPassword = async (e) => {
        e.preventDefault();
        setChangeUserMsg('');
        if (!changeUserEmail || !changeUserNewPassword) {
            setChangeUserMsg('Preencha todos os campos.');
            return;
        }
        if (changeUserNewPassword !== changeUserConfirmPassword) {
            setChangeUserMsg('As senhas não coincidem.');
            return;
        }
        setChangeUserLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ email: changeUserEmail, novaSenha: changeUserNewPassword })
            });
            const data = await response.json();
            if (!response.ok) {
                setChangeUserMsg(data?.error || data?.message || 'Erro ao alterar senha.');
            }
            else {
                setChangeUserMsg('Senha alterada com sucesso!');
                setChangeUserEmail('');
                setChangeUserNewPassword('');
                setChangeUserConfirmPassword('');
                setTimeout(() => {
                    setShowChangeUserPassword(false);
                    setChangeUserMsg('');
                }, 1500);
            }
        }
        catch (err) {
            setChangeUserMsg('Erro ao alterar senha.');
        }
        finally {
            setChangeUserLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(GlobalStyle, {}), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, children: [_jsx(Title, { children: "Painel Administrativo - Feedbacks" }), _jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsx("button", { onClick: () => setShowRegister(true), style: {
                                    background: '#3182CE',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '8px 18px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginLeft: 0
                                }, children: "Novo Usu\u00E1rio" }), isAdmin && (_jsx("button", { onClick: () => setShowChangeUserPassword(true), style: {
                                    background: '#ECC94B',
                                    color: '#2D3748',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '8px 18px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginLeft: 0
                                }, children: "Alterar senha de usu\u00E1rio" })), _jsx("button", { onClick: handleLogout, style: {
                                    background: '#E53E3E',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '8px 18px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginLeft: 0
                                }, children: "Sair" })] })] }), showRegister && (_jsx(ModalOverlay, { children: _jsxs(ModalContent, { ref: modalRef, role: "dialog", "aria-modal": "true", tabIndex: -1, children: [_jsx(CloseButton, { onClick: () => { setShowRegister(false); setRegisterMsg(''); }, title: "Fechar", children: _jsx(FiX, {}) }), _jsx(ModalTitle, { children: "Cadastrar Novo Usu\u00E1rio" }), _jsxs("form", { onSubmit: handleRegister, children: [_jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiUser, {}) }), _jsx(Input, { type: "text", placeholder: "Nome", value: nomeNovo, onChange: e => setNomeNovo(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiMail, {}) }), _jsx(Input, { type: "email", placeholder: "E-mail", value: emailNovo, onChange: e => setEmailNovo(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Senha", value: senhaNovo, onChange: e => setSenhaNovo(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Confirmar senha", value: confirmaSenhaNovo, onChange: e => setConfirmaSenhaNovo(e.target.value), required: true })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { type: "submit", variant: "primary", disabled: registerLoading, children: registerLoading ? 'Cadastrando...' : 'Cadastrar' }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => { setShowRegister(false); setRegisterMsg(''); }, children: "Cancelar" })] }), registerMsg && (_jsx(Message, { type: registerMsg.includes('sucesso') ? 'success' : 'error', children: registerMsg }))] })] }) })), showChangeUserPassword && (_jsx(ModalOverlay, { children: _jsxs(ModalContent, { ref: modalRef, role: "dialog", "aria-modal": "true", tabIndex: -1, children: [_jsx(CloseButton, { onClick: () => { setShowChangeUserPassword(false); setChangeUserMsg(''); }, title: "Fechar", children: _jsx(FiX, {}) }), _jsx(ModalTitle, { children: "Alterar senha de usu\u00E1rio" }), _jsxs("form", { onSubmit: handleChangeUserPassword, children: [_jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiMail, {}) }), _jsx(Input, { type: "email", placeholder: "E-mail do usu\u00E1rio", value: changeUserEmail, onChange: e => setChangeUserEmail(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Nova senha", value: changeUserNewPassword, onChange: e => setChangeUserNewPassword(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Confirmar nova senha", value: changeUserConfirmPassword, onChange: e => setChangeUserConfirmPassword(e.target.value), required: true })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { type: "submit", variant: "primary", disabled: changeUserLoading, children: changeUserLoading ? 'Alterando...' : 'Alterar senha' }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => { setShowChangeUserPassword(false); setChangeUserMsg(''); }, children: "Cancelar" })] }), changeUserMsg && (_jsx(Message, { type: changeUserMsg.includes('sucesso') ? 'success' : 'error', children: changeUserMsg }))] })] }) })), _jsxs(ExportButtonsContainer, { children: [_jsx(ExportButton, { "aria-label": "Exportar para Excel", onClick: () => exportarTodosFeedbacksExcel(), disabled: loadingExport || filteredFeedbacks.length === 0 && suggestions.length === 0, children: loadingExport ? 'Exportando...' : 'Exportar para Excel' }), _jsx(ExportButton, { "aria-label": "Exportar para PDF", onClick: () => exportarTodosFeedbacksPDF(), disabled: loadingExportPDF || filteredFeedbacks.length === 0 && suggestions.length === 0, children: loadingExportPDF ? 'Exportando...' : 'Exportar para PDF' }), _jsx(ExportButton, { onClick: handleManualUpdate, style: { background: '#3182CE', border: '1px solid #3182CE' }, children: bgLoading ? 'Atualizando...' : 'Atualizar' })] }), exportError && _jsx("div", { style: { color: 'red', marginTop: 8 }, children: exportError }), exportSuccess && _jsx("div", { style: { color: 'green', marginTop: 8 }, children: exportSuccess }), _jsx(FilterContainer, { children: _jsxs(FilterGroup, { children: [_jsxs(Select, { value: departmentFilter, onChange: e => setDepartmentFilter(e.target.value), children: [_jsx("option", { value: "", children: "Todos os Departamentos" }), departments.map(dep => (_jsx("option", { value: dep.id, children: dep.name }, dep.id)))] }), _jsx(Select, { value: ratingFilter, onChange: e => setRatingFilter(e.target.value), children: ratingOptions.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), _jsx("input", { type: "date", value: startDate, onChange: e => setStartDate(e.target.value), style: { padding: '8px', borderRadius: '6px', border: '1px solid #2F855A' }, placeholder: "Data inicial" }), _jsx("input", { type: "date", value: endDate, onChange: e => setEndDate(e.target.value), style: { padding: '8px', borderRadius: '6px', border: '1px solid #2F855A' }, placeholder: "Data final" })] }) }), loading ? (_jsx("div", { style: { margin: '40px 0', fontSize: 20, color: '#2F855A', textAlign: 'center' }, children: "Carregando feedbacks..." })) : (_jsxs(Grid, { children: [_jsxs(Card, { children: [_jsx(CardTitle, { children: "Total de Feedbacks" }), _jsx(Total, { children: totalFeedbacks })] }), departments.map(dep => {
                        const stats = getStats(dep.id);
                        return (_jsxs(Card, { children: [_jsx(CardTitle, { children: dep.name }), _jsxs(Avaliacoes, { children: [_jsxs(AvaliacaoButton, { "$tipo": "Excelente", children: ["\u00D3timo ", stats.Excelente] }), _jsxs(AvaliacaoButton, { "$tipo": "Bom", children: ["Bom ", stats.Bom] }), _jsxs(AvaliacaoButton, { "$tipo": "Regular", children: ["Regular ", stats.Regular] }), _jsxs(AvaliacaoButton, { "$tipo": "Ruim", children: ["Ruim ", stats.Ruim] })] })] }, dep.id));
                    }), _jsxs(FullWidthCard, { children: [_jsx(CardTitle, { children: "Sugest\u00F5es dos pacientes" }), _jsxs(SuggestionList, { children: [allSuggestions.length === 0 && (_jsx(SuggestionItem, { children: "Nenhuma sugest\u00E3o geral enviada ainda." })), allSuggestions
                                        .map((s, idx) => (_jsxs(SuggestionItem, { children: [_jsx(SuggestionText, { children: s.suggestion }), s.createdAt && !isNaN(new Date(s.createdAt).getTime()) && (_jsx(SuggestionDate, { style: { margin: '4px 0 8px 0', display: 'block' }, children: new Date(s.createdAt).toLocaleString('pt-BR') }))] }, idx)))] })] })] }))] }));
};
export default AdminDashboard;
