import React from 'react';
import styled from 'styled-components';
import { Rating } from '../types/rating';

interface ButtonProps {
  color: string;
}

const StyledButton = styled.button<ButtonProps>`
  padding: 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.color};
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface RatingButtonProps {
  rating: Rating;
  color: string;
  onClick: () => void;
}

export const RatingButton: React.FC<RatingButtonProps> = ({ rating, color, onClick }) => {
  return (
    <StyledButton color={color} onClick={onClick}>
      {rating}
    </StyledButton>
  );
}; 