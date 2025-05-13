import React, { createContext, useContext, useState, useEffect } from 'react';
import { Rating } from '../types/rating';
import { getFeedbacks, createFeedback } from '../services/api';

export interface Feedback {
  comment: any;
  id: string;
  department: string;
  rating: Rating;
  timestamp: number;
  suggestion?: string;
  createdAt: string | number;
}

interface FeedbackContextData {
  feedbacks: Feedback[];
  addFeedback: (department: string, rating: Rating) => Promise<void>;
  loading: boolean;
  fetchFeedbacks: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextData>({} as FeedbackContextData);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar feedbacks do backend
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getFeedbacks();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const addFeedback = async (department: string, rating: Rating) => {
    setLoading(true);
    try {
      await createFeedback(department, rating);
      await fetchFeedbacks();
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, loading, fetchFeedbacks }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

/* global localStorage */