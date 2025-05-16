import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Container, Header, Table, Badge } from "../styles/ReportStyles";
const ReportPDF = () => {
    const feedbacks = [
        { date: "12/05/2025, 14:10:09", department: "Alimentação", status: "Regular" },
        { date: "12/05/2025, 14:10:08", department: "Limpeza", status: "Ruim" },
        { date: "12/05/2025, 14:10:06", department: "Médicos", status: "Regular" },
        { date: "12/05/2025, 14:10:05", department: "Enfermagem", status: "Excelente" },
        { date: "12/05/2025, 14:10:03", department: "Recepção", status: "Excelente" },
    ];
    const suggestions = [{ date: "12/05/2025, 14:10:13", suggestion: "asdasdasd" }];
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Feedbacks e Sugestões", 10, 10);
        doc.autoTable({
            head: [["Data", "Departamento", "Avaliação"]],
            body: feedbacks.map(f => [f.date, f.department, f.status]),
        });
        doc.autoTable({
            head: [["Data", "Sugestão"]],
            body: suggestions.map(s => [s.date, s.suggestion]),
        });
        doc.save("Relatorio_Pesquisa_Satisfacao.pdf");
    };
    return (_jsxs(Container, { children: [_jsxs(Header, { children: [_jsx("h1", { children: "Relat\u00F3rio de Feedbacks e Sugest\u00F5es" }), _jsx("p", { children: "Data de Gera\u00E7\u00E3o: 15/05/2025" })] }), _jsx("h2", { children: "Feedbacks dos Pacientes" }), _jsxs(Table, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Data" }), _jsx("th", { children: "Departamento" }), _jsx("th", { children: "Avalia\u00E7\u00E3o" })] }) }), _jsx("tbody", { children: feedbacks.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { children: item.date }), _jsx("td", { children: item.department }), _jsx("td", { children: _jsx(Badge, { status: item.status, children: item.status }) })] }, index))) })] }), _jsx("h2", { children: "Sugest\u00F5es dos Pacientes" }), _jsxs(Table, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Data" }), _jsx("th", { children: "Sugest\u00E3o" })] }) }), _jsx("tbody", { children: suggestions.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { children: item.date }), _jsx("td", { children: item.suggestion })] }, index))) })] }), _jsx("button", { onClick: generatePDF, children: "Exportar para PDF" })] }));
};
export default ReportPDF;
