import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  font-family: "Arial", sans-serif;
  background-color: #f9f9f9;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 24px;
    color: #4caf50;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #777;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #4caf50;
    color: white;
  }
`;

export const Badge = styled.span<{ status: string }>`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-size: 12px;

  background-color: ${({ status }) =>
    status === "Excelente" ? "#4caf50" :
    status === "Bom" ? "#2196f3" :
    status === "Regular" ? "#ffc107" : "#f44336"};
`; 