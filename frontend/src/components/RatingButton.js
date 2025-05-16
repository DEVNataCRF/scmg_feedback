import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
const StyledButton = styled.button `
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
export const RatingButton = ({ rating, color, onClick }) => {
    return (_jsx(StyledButton, { color: color, onClick: onClick, children: rating }));
};
