import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createFeedback } from '../services/api';
import logoSantaCasa from '../assets/200px.png';
const Container = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 32px 16px 24px 16px;
  text-align: center;

  @media (max-width: 600px) {
    max-width: 99vw;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;
    padding: 12px 2px;
  }
`;
const Title = styled.h1 `
  font-size: 2rem;
  margin-bottom: 18px;
  color: #19984b;
  font-weight: bold;
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 12px;
  }
`;
const Text = styled.p `
  font-size: 1.1rem;
  margin-bottom: 24px;
  color: #444;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    font-size: 0.98rem;
    margin-bottom: 16px;
  }
`;
const FeedbackContainer = styled.div `
  width: 100%;
  max-width: 500px;
  margin-bottom: 32px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    max-width: 99vw;
    margin-bottom: 18px;
  }
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
  min-height: 90px;
  padding: 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 12px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;

  &:focus {
    outline: none;
    border-color: #19984b;
    box-shadow: 0 0 0 2px rgba(25, 152, 75, 0.15);
  }

  @media (max-width: 600px) {
    font-size: 0.98rem;
    min-height: 70px;
    padding: 8px;
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
  background-color: ${props => props.$primary ? '#4CAF50' : '#2196F3'};
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
    padding: 14px 8px;
    font-size: 16px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 12px 4px;
    font-size: 15px;
    max-width: 100%;
  }
`;
const emojiList = [
    { emoji: '😡', value: 0 },
    { emoji: '😠', value: 1 },
    { emoji: '😕', value: 2 },
    { emoji: '😐', value: 3 },
    { emoji: '😶', value: 4 },
    { emoji: '🙂', value: 5 },
    { emoji: '😊', value: 6 },
    { emoji: '😃', value: 7 },
    { emoji: '😁', value: 8 },
    { emoji: '😄', value: 9 },
    { emoji: '🤩', value: 10 },
];
const EmojiRow = styled.div `
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    gap: 6px;
    font-size: 1.3rem;
    max-width: 99vw;
  }
`;
const EmojiButton = styled.button `
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
  transition: transform 0.1s;
  transform: ${({ selected }) => (selected ? 'scale(1.2)' : 'scale(1)')};
  filter: ${({ selected }) => (selected ? 'drop-shadow(0 0 6px #2196F3)' : 'none')};
`;
const EmojiTitle = styled.div `
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 10px;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;
function ThankYouPage() {
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [recomendacao, setRecomendacao] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (recomendacao === null) {
                setError('Por favor, selecione uma nota de recomendação.');
                setLoading(false);
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
            await createFeedback('geral', 'Excelente', feedback, recomendacao);
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
    const handleExit = async () => {
        if (recomendacao === null) {
            setError('Por favor, selecione uma nota de recomendação.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await createFeedback('geral', 'Excelente', '', recomendacao);
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
    return (_jsxs(Container, { children: [_jsx("img", { src: logoSantaCasa, alt: "Santa Casa de Gua\u00E7u\u00ED", style: { width: 180, marginBottom: 24, maxWidth: '80vw' } }), _jsx(Title, { children: "A Santa Casa de Miseric\u00F3rdia de Gua\u00E7u\u00ED agradece sua avalia\u00E7\u00E3o" }), _jsx(Text, { children: "Sua opini\u00E3o \u00E9 muito importante para continuarmos melhorando nossos servi\u00E7os. Agradecemos sua participa\u00E7\u00E3o" }), _jsx(EmojiTitle, { children: "De 0 a 10, quanto voc\u00EA recomendaria o nosso Hospital para seus amigos e familiares?" }), _jsx(EmojiRow, { children: emojiList.map(({ emoji, value }) => (_jsxs(EmojiButton, { type: "button", selected: recomendacao === value, onClick: () => setRecomendacao(value), "aria-label": `Nota ${value}`, children: [emoji, _jsx("div", { style: { fontSize: '0.9rem', color: '#444' }, children: value })] }, value))) }), _jsxs(FeedbackContainer, { children: [_jsx(FeedbackLabel, { children: "Deixe aqui sua sugest\u00E3o:" }), _jsx(FeedbackTextarea, { value: feedback, onChange: (e) => setFeedback(e.target.value), placeholder: "Deixe aqui sua sugest\u00E3o:", maxLength: 1000 }), _jsxs("div", { style: { textAlign: 'right', color: '#888', fontSize: 14 }, children: [feedback.length, "/1000 caracteres"] })] }), _jsxs(ButtonContainer, { children: [_jsx(Button, { "$primary": true, onClick: handleSubmit, disabled: loading, children: loading ? 'Enviando...' : 'Enviar sugestão' }), _jsx(Button, { "$primary": false, onClick: handleExit, disabled: loading, children: "Sair sem sugest\u00E3o" })] }), error && _jsx("p", { style: { color: 'red', marginTop: 16 }, children: error }), success && _jsx("p", { style: { color: 'green', marginTop: 16 }, children: "Sugest\u00E3o enviada com sucesso!" })] }));
}
export default ThankYouPage;
