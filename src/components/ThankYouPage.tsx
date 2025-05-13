import { createContext, useContext, useState, ReactNode } from 'react';

interface FeedbackContextData {
  addAvaliacao: (departamento: string, nota: string) => void;
  // ... outros métodos e estados do contexto, se houver
}

const FeedbackContext = createContext<FeedbackContextData | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [, setAvaliacoes] = useState<{ departamento: string; nota: string }[]>([]);

  const addAvaliacao = (departamento: string, nota: string) => {
    setAvaliacoes(prev => [...prev, { departamento, nota }]);
  };

  // ... outros métodos

  return (
    <FeedbackContext.Provider value={{ addAvaliacao }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser usado dentro de um FeedbackProvider');
  }
  return context;
};