import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createSuggestion } from '../services/api';
const Container = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
  text-align: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;
const Title = styled.h1 `
  font-size: 36px;
  margin-bottom: 20px;
  color: #2196F3;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;
const Text = styled.p `
  font-size: 24px;
  margin-bottom: 30px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 24px;
  }
`;
const FeedbackContainer = styled.div `
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
`;
const FeedbackLabel = styled.label `
  display: block;
  text-align: left;
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
const FeedbackTextarea = styled.textarea `
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid #2196F3;
  border-radius: 10px;
  font-size: 18px;
  margin-bottom: 20px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #1976D2;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    min-height: 120px;
  }
`;
const ButtonContainer = styled.div `
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;
const Button = styled.button `
  padding: 16px 32px;
  font-size: 18px;
  background-color: ${props => props.primary ? '#4CAF50' : '#2196F3'};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 250px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;
function ThankYouPage() {
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (feedback.trim() === '') {
                setError('Por favor, digite uma sugestão.');
                setLoading(false);
                return;
            }
            await createSuggestion(feedback);
            setSuccess(true);
            setTimeout(() => navigate('/'), 1500);
        }
        catch (e) {
            setError('Erro ao enviar sugestão. Tente novamente.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Container, { children: [_jsx(Title, { children: "Obrigado pela sua avalia\u00E7\u00E3o!" }), _jsx(Text, { children: "Sua opini\u00E3o \u00E9 muito importante para n\u00F3s." }), _jsxs(FeedbackContainer, { children: [_jsx(FeedbackLabel, { children: "Deixe aqui suas sugest\u00F5es para melhorias:" }), _jsx(FeedbackTextarea, { value: feedback, onChange: (e) => setFeedback(e.target.value), placeholder: "Digite suas sugest\u00F5es aqui..." })] }), _jsxs(ButtonContainer, { children: [_jsx(Button, { onClick: handleSubmit, primary: true, disabled: loading, children: loading ? 'Enviando...' : 'Enviar Sugestões' }), _jsx(Button, { onClick: () => navigate('/'), disabled: loading, children: "Voltar sem Sugest\u00F5es" })] }), error && _jsx("p", { style: { color: 'red', marginTop: 16 }, children: error }), success && _jsx("p", { style: { color: 'green', marginTop: 16 }, children: "Sugest\u00E3o enviada com sucesso!" })] }));
}
export default ThankYouPage;
