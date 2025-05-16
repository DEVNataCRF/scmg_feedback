import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RatingButton } from '../components/RatingButton';
import { ratingColors } from '../types/rating';
const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;
const Title = styled.h1 `
  color: #004A8D;
  margin-bottom: 2rem;
  text-align: center;
`;
const ButtonsContainer = styled.div `
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
`;
const DepartmentRating = ({ department, onRatingSelect }) => {
    const navigate = useNavigate();
    const handleRating = (rating) => {
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
        }
        else {
            navigate('/obrigado');
        }
    };
    return (_jsxs(Container, { children: [_jsxs(Title, { children: ["Como voc\u00EA avalia o setor de ", department, "?"] }), _jsxs(ButtonsContainer, { children: [_jsx(RatingButton, { onClick: () => handleRating('Excelente'), rating: "Excelente", color: ratingColors.Excelente }), _jsx(RatingButton, { onClick: () => handleRating('Bom'), rating: "Bom", color: ratingColors.Bom }), _jsx(RatingButton, { onClick: () => handleRating('Regular'), rating: "Regular", color: ratingColors.Regular }), _jsx(RatingButton, { onClick: () => handleRating('Ruim'), rating: "Ruim", color: ratingColors.Ruim })] })] }));
};
export default DepartmentRating;
