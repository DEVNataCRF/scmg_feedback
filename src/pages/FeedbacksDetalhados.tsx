import React from 'react';
import styled from 'styled-components';
import { useFeedback } from '../contexts/FeedBackContext';
import { departments } from '../../backend/src/constants/department';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
`;
const Title = styled.h1`
  color: #2F855A;
  margin-bottom: 32px;
`;
const FeedbackList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const FeedbackItem = styled.li`
  border-bottom: 1px solid #e2e8f0;
  padding: 18px 0 12px 0;
  margin-bottom: 0;
  &:last-child { border-bottom: none; }
`;
const Label = styled.span`
  font-weight: 600;
  color: #2F855A;
`;
const DateText = styled.span`
  color: #718096;
  font-size: 13px;
  margin-left: 12px;
`;
const BackButton = styled.button`
  background: #3182CE;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 24px;
`;

const FeedbacksDetalhados: React.FC = () => {
  const { feedbacks } = useFeedback();
  const navigate = useNavigate();
  const sorted = [...feedbacks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Container>
      <BackButton onClick={() => navigate('/admin')}>Voltar ao Painel</BackButton>
      <Title>Todos os Feedbacks Detalhados</Title>
      <FeedbackList>
        {sorted.length === 0 && <li>Nenhum feedback enviado ainda.</li>}
        {sorted.map((f, idx) => (
          <FeedbackItem key={f.id || idx}>
            <div><Label>Departamento:</Label> {departments.find(d => d.id === f.department)?.name || f.department}</div>
            <div><Label>Avaliação:</Label> {f.rating}</div>
            {f.suggestion && <div><Label>Sugestão:</Label> {f.suggestion}</div>}
            {f.createdAt && !isNaN(new Date(f.createdAt).getTime()) && (
              <DateText>{new Date(f.createdAt).toLocaleString('pt-BR')}</DateText>
            )}
          </FeedbackItem>
        ))}
      </FeedbackList>
    </Container>
  );
};

export default FeedbacksDetalhados; 