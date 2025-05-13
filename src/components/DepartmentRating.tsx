import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RatingButton } from '../components/RatingButton';
import { Rating, ratingColors } from '../types/rating';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #004A8D;
  margin-bottom: 2rem;
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
`;

interface DepartmentRatingProps {
  department: string;
  onRatingSelect: (rating: Rating) => void;
}

const DepartmentRating: React.FC<DepartmentRatingProps> = ({ department, onRatingSelect }) => {
  const navigate = useNavigate();

  const handleRating = (rating: Rating) => {
    onRatingSelect(rating);
    
    // Armazenar avaliação no localStorage
    const currentRatings = JSON.parse(localStorage.getItem('departmentRatings') || '{}');
    const updatedRatings = {
      ...currentRatings,
      [department]: rating
    };
    localStorage.setItem('departmentRatings', JSON.stringify(updatedRatings));

    // Navegar para próximo departamento ou página de agradecimento
    const departments = ['Recepção', 'Enfermagem', 'Médicos', 'Limpeza', 'Alimentação'];
    const currentIndex = departments.indexOf(department);
    
    if (currentIndex < departments.length - 1) {
      navigate(`/avaliar/${departments[currentIndex + 1].toLowerCase()}`);
    } else {
      navigate('/obrigado');
    }
  };

  return (
    <Container>
      <Title>Como você avalia o setor de {department}?</Title>
      <ButtonsContainer>
        <RatingButton onClick={() => handleRating('Excelente')} rating="Excelente" color={ratingColors.Excelente} />
        <RatingButton onClick={() => handleRating('Bom')} rating="Bom" color={ratingColors.Bom} />
        <RatingButton onClick={() => handleRating('Regular')} rating="Regular" color={ratingColors.Regular} />
        <RatingButton onClick={() => handleRating('Ruim')} rating="Ruim" color={ratingColors.Ruim} />
      </ButtonsContainer>
    </Container>
  );
};

export default DepartmentRating; 