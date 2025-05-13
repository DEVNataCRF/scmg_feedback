import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useFeedback } from '../contexts/FeedBackContext';
import type { Feedback } from '../contexts/FeedBackContext';

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 20px;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: #666;
  margin-bottom: 10px;
  font-size: 16px;
`;

const StatValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: var(--primary);
`;

const FeedbackList = styled.div`
  display: grid;
  gap: 20px;
`;

const FeedbackCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FeedbackDate = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const RatingBadge = styled.div<{ rating: string }>`
  padding: 10px;
  border-radius: 5px;
  background-color: ${props => {
    switch (props.rating) {
      case 'excellent': return 'var(--success)';
      case 'good': return 'var(--primary)';
      case 'regular': return 'var(--warning)';
      case 'poor': return 'var(--danger)';
      default: return 'var(--light)';
    }
  }};
  color: white;
  font-weight: 600;
`;

const Comment = styled.p`
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
  margin-top: 10px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--primary);
  border-radius: 5px;
  font-size: 16px;
  color: var(--primary);

  &:focus {
    outline: none;
    border-color: var(--secondary);
  }
`;

const departments = {
  reception: 'Recepção',
  nursing: 'Enfermagem',
  doctors: 'Médicos',
  hygiene: 'Higiene',
  food: 'Serviço de Alimentação',
  geral: 'Geral'
};

const ratingLabels = {
  excellent: 'Ótimo',
  good: 'Bom',
  regular: 'Regular',
  poor: 'Ruim'
};

const Admin: React.FC = () => {
  const { feedbacks } = useFeedback();
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => {
      const departmentMatch = departmentFilter === 'all' || feedback.department === departmentFilter;
      const ratingMatch = ratingFilter === 'all' || feedback.rating === ratingFilter;
      return departmentMatch && ratingMatch;
    });
  }, [feedbacks, departmentFilter, ratingFilter]);

  const stats = useMemo(() => {
    const total = filteredFeedbacks.length;
    const byDepartment = {} as Record<string, number>;
    const byRating = {
      excellent: 0,
      good: 0,
      regular: 0,
      poor: 0
    };

    filteredFeedbacks.forEach(feedback => {
      byDepartment[feedback.department] = (byDepartment[feedback.department] || 0) + 1;
      byRating[feedback.rating as keyof typeof byRating]++;
    });

    return {
      total,
      byDepartment,
      byRating
    };
  }, [filteredFeedbacks]);

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo - Feedbacks</Title>
        <FilterContainer>
          <Select 
            value={departmentFilter} 
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">Todos os Departamentos</option>
            {Object.entries(departments).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Select 
            value={ratingFilter} 
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Todas as Avaliações</option>
            {Object.entries(ratingLabels).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
        </FilterContainer>
      </Header>

      <Stats>
        <StatCard>
          <StatTitle>Total de Feedbacks</StatTitle>
          <StatValue>{stats.total}</StatValue>
        </StatCard>
        {Object.entries(stats.byDepartment).map(([dep, count]) => (
          <StatCard key={dep}>
            <StatTitle>{departments[dep as keyof typeof departments]}</StatTitle>
            <StatValue>{count}</StatValue>
          </StatCard>
        ))}
      </Stats>

      <FeedbackList>
        {filteredFeedbacks.map((feedback: Feedback) => (
          <FeedbackCard key={feedback.id}>
            <FeedbackDate>
              Recebido em: {new Date(feedback.timestamp).toLocaleString('pt-BR')}
            </FeedbackDate>
            <RatingBadge rating={feedback.rating}>
              {departments[feedback.department as keyof typeof departments]}: {ratingLabels[feedback.rating as keyof typeof ratingLabels]}
            </RatingBadge>
            {feedback.comment && <Comment>{feedback.comment}</Comment>}
          </FeedbackCard>
        ))}
      </FeedbackList>
    </Container>
  );
};

export default Admin; 