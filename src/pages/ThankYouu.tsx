import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/200px.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const Logo = styled.img`
  width: 140px;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  color: #00923f;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  text-align: center;
`;

const Message = styled.p`
  color: #222;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  text-align: center;
`;

const BottomBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-top: auto;
  margin-bottom: 0;
`;

const SuggestionBox = styled.textarea`
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

const CharCount = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: right;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const HomeButton = styled.button`
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

const ExitButton = styled.button`
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

const EmojiRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const EmojiButton = styled.button<{ selected: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
  transition: transform 0.1s;
  transform: ${({ selected }) => (selected ? 'scale(1.2)' : 'scale(1)')};
  filter: ${({ selected }) => (selected ? 'drop-shadow(0 0 6px #00923f)' : 'none')};
`;

const EmojiTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 10px;
  text-align: center;
`;

const MAX_CHARS = 1000;

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

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');
  const [recomendacao, setRecomendacao] = useState<number | null>(null);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots(prev => prev.length < 3 ? prev + '.' : '');
      }, 300);
      return () => clearInterval(interval);
    } else {
      setDots('');
    }
  }, [loading]);

  const handleSuggestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setSuggestion(value);
    }
  };

  // Adicionar uma nova sugestão
  const handleSendSuggestion = async () => {
    // Aqui você pode integrar o envio da sugestão e recomendacao para o backend futuramente
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  // Apenas ir para a página inicial sem salvar sugestão
  const handleExit = () => {
    navigate('/');
  };

  return (
    <Container>
      <Content>
        <Logo src={logo} alt="Santa Casa Logo" />
        <Title>A Santa Casa de Guaçuí agradece sua avaliação</Title>
        <Message>
          Sua opinião é muito importante para continuarmos melhorando nossos serviços. Agradecemos sua participação
        </Message>
        <BottomBox>
          <EmojiTitle>De 0 a 10, quanto você recomendaria o nosso Hospital para seus amigos e familiares?</EmojiTitle>
          <EmojiRow>
            {emojiList.map(({ emoji, value }) => (
              <EmojiButton
                key={value}
                type="button"
                selected={recomendacao === value}
                onClick={() => setRecomendacao(value)}
                aria-label={`Nota ${value}`}
              >
                {emoji}
                <div style={{ fontSize: '0.9rem', color: '#444' }}>{value}</div>
              </EmojiButton>
            ))}
          </EmojiRow>
          <SuggestionBox
            id="suggestion"
            placeholder="Deixe aqui sua sugestão:"
            value={suggestion}
            onChange={handleSuggestionChange}
            maxLength={MAX_CHARS}
          />
          <CharCount>
            {suggestion.length}/{MAX_CHARS} caracteres
          </CharCount>
          <ButtonGroup>
            <HomeButton onClick={handleSendSuggestion} disabled={loading}>
              {loading ? `Enviando${dots}` : 'Enviar sugestão'}
            </HomeButton>
            <ExitButton onClick={handleExit}>Sair sem sugestão</ExitButton>
          </ButtonGroup>
        </BottomBox>
      </Content>
    </Container>
  );
};

export default ThankYou;