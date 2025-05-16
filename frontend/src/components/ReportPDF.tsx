import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Container, Header, Table, Badge } from "../styles/ReportStyles";

const ReportPDF: React.FC = () => {
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

  return (
    <Container>
      <Header>
        <h1>Relatório de Feedbacks e Sugestões</h1>
        <p>Data de Geração: 15/05/2025</p>
      </Header>

      <h2>Feedbacks dos Pacientes</h2>
      <Table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Departamento</th>
            <th>Avaliação</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.department}</td>
              <td>
                <Badge status={item.status}>{item.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Sugestões dos Pacientes</h2>
      <Table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Sugestão</th>
          </tr>
        </thead>
        <tbody>
          {suggestions.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.suggestion}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <button onClick={generatePDF}>Exportar para PDF</button>
    </Container>
  );
};

export default ReportPDF; 