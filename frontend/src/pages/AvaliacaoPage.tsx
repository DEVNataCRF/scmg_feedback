import { useNavigate, useParams, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFeedback } from '../contexts/FeedBackContext';
import { departments, Department } from '../constants/department';
import otimoSvg from '../assets/otimo.svg.svg';
import bomSvg from '../assets/bom.svg.svg';
import regularSvg from '../assets/regular.svg.svg';
import ruimSvg from '../assets/ruim.svg.svg';
import logo from '../assets/200px.png';
import { Rating } from '../types/rating';
import { useState, useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  justify-content: center;
`;

const Logo = styled.img`
  width: 220px;
  max-width: 90vw;
  margin-top: 10px;
  margin-bottom: 18px;

  @media (max-width: 480px) {
    width: 140px;
  }
`;

const Title = styled.h2`
  text-align: center;
    margin-bottom: 24px;
  color: #00923f;
  font-weight: bold;
  font-size: 1.3rem;
`;

const Department = styled.h3`
  text-align: center;
  margin-bottom: 32px;
  color: #00923f;
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 92%;
  max-width: 500px;
`;

const Button = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  font-size: 1.2rem;
  font-weight: 400;
  background-color: ${props => props.color};
  color: #fff;
  border: none;
  border-radius: 10px;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition: filter 0.2s;
  outline: none;

  &:hover {
    filter: brightness(0.97);
  }
`;

const ButtonIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 10px;
`;

const Spinner = styled.span`
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid #fff;
  border-top: 3px solid #00923f;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-left: 10px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AvaliacaoPage = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const { addFeedback, feedbacks } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [clickedRating, setClickedRating] = useState<Rating | null>(null);
  const [dots, setDots] = useState('');

  const currentDepartment = departments.find((d: Department) => d.id === departmentId);
  const currentIndex = departments.findIndex((d: Department) => d.id === departmentId);
  const nextDepartment = departments[currentIndex + 1];

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

  const handleAvaliacao = async (nota: Rating) => {
    if (currentDepartment && !loading) {
      setLoading(true);
      setClickedRating(nota);
      await addFeedback(currentDepartment.id, nota);
      setTimeout(() => {
        setLoading(false);
        setClickedRating(null);
        if (nextDepartment) {
          navigate(`/avaliar/${nextDepartment.id}`);
        } else {
          navigate('/obrigado');
        }
      }, 1000);
    }
  };

  if (!currentDepartment) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container>
      <Logo src={logo} alt="Santa Casa Logo" />
      <Title>Como você avalia o atendimento que recebeu hoje?</Title>
      <Department>{currentDepartment.name}</Department>
      <ButtonContainer>
        <Button color="#43b04a" onClick={() => handleAvaliacao('Excelente')} disabled={loading}>
          {loading && clickedRating === 'Excelente' ? <><span>Enviando</span><Spinner /></> : <>Ótimo <ButtonIcon src={otimoSvg} alt="Ótimo" /></>}
        </Button>
        <Button color="#2196f3" onClick={() => handleAvaliacao('Bom')} disabled={loading}>
          {loading && clickedRating === 'Bom' ? <><span>Enviando</span><Spinner /></> : <>Bom <ButtonIcon src={bomSvg} alt="Bom" /></>}
        </Button>
        <Button color="#ffc107" onClick={() => handleAvaliacao('Regular')} disabled={loading}>
          {loading && clickedRating === 'Regular' ? <><span>Enviando</span><Spinner /></> : <>Regular <ButtonIcon src={regularSvg} alt="Regular" /></>}
        </Button>
        <Button color="#ef3d32" onClick={() => handleAvaliacao('Ruim')} disabled={loading}>
          {loading && clickedRating === 'Ruim' ? <><span>Enviando</span><Spinner /></> : <>Ruim <ButtonIcon src={ruimSvg} alt="Ruim" /></>}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default AvaliacaoPage; 