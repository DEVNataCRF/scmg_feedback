import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/200px.png';
import { useFeedback } from '../contexts/FeedBackContext';
import { createSuggestion } from '../services/api';
/* global HTMLTextAreaElement */
const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
`;
const Content = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;
const Logo = styled.img `
  width: 140px;
  margin-bottom: 18px;
`;
const Title = styled.h1 `
  color: #00923f;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  text-align: center;
`;
const Message = styled.p `
  color: #222;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  text-align: center;
`;
const BottomBox = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-top: auto;
  margin-bottom: 0;
`;
const SuggestionBox = styled.textarea `
  width: 100%;
  min-height: 90px;
  max-height: 300px;
  padding: 1rem;
  border: 1.5px solid #bdbdbd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;

  &:focus {
    outline: none;
    border-color: #00923f;
  }
`;
const CharCount = styled.div `
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: right;
  width: 100%;
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: 16px;
  justify-content: center;
`;
const HomeButton = styled.button `
  padding: 1rem 2rem;
  background-color: #00923f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }
`;
const ExitButton = styled.button `
  padding: 1rem 2rem;
  background-color: #bdbdbd;
  color: #222;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 500;

  &:hover {
    opacity: 0.85;
  }
`;
const MAX_CHARS = 1000;
const ThankYou = () => {
    const navigate = useNavigate();
    const [suggestion, setSuggestion] = useState('');
    const { feedbacks, addFeedback } = useFeedback();
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setDots(prev => prev.length < 3 ? prev + '.' : '');
            }, 300);
            return () => clearInterval(interval);
        }
        else {
            setDots('');
        }
    }, [loading]);
    const handleSuggestionChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARS) {
            setSuggestion(value);
        }
    };
    // Adicionar uma nova sugestão
    const handleSendSuggestion = async () => {
        if (suggestion.trim()) {
            setLoading(true);
            await createSuggestion(suggestion);
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 1000);
        }
        else {
            navigate('/');
        }
    };
    // Apenas ir para a página inicial sem salvar sugestão
    const handleExit = () => {
        navigate('/');
    };
    return (_jsx(Container, { children: _jsxs(Content, { children: [_jsx(Logo, { src: logo, alt: "Santa Casa Logo" }), _jsx(Title, { children: "A Santa Casa de Gua\u00E7u\u00ED agradece sua avalia\u00E7\u00E3o" }), _jsx(Message, { children: "Sua opini\u00E3o \u00E9 muito importante para continuarmos melhorando nossos servi\u00E7os. Agradecemos sua participa\u00E7\u00E3o" }), _jsxs(BottomBox, { children: [_jsx(SuggestionBox, { id: "suggestion", placeholder: "Deixe aqui sua sugest\u00E3o:", value: suggestion, onChange: handleSuggestionChange, maxLength: MAX_CHARS }), _jsxs(CharCount, { children: [suggestion.length, "/", MAX_CHARS, " caracteres"] }), _jsxs(ButtonGroup, { children: [_jsx(HomeButton, { onClick: handleSendSuggestion, disabled: loading, children: loading ? `Enviando${dots}` : 'Enviar sugestão' }), _jsx(ExitButton, { onClick: handleExit, children: "Sair sem sugest\u00E3o" })] })] })] }) }));
};
export default ThankYou;
