import { Feedback } from '../contexts/FeedBackContext';

export interface FeedbacksResponse {
  feedbacks: Feedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const getFeedbacks = async (): Promise<FeedbacksResponse> => {
  const response = await fetch(`${API_URL}/api/feedback`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Erro HTTP ${response.status}`
    );
  }
  return response.json();
};

export const createFeedback = async (
  department: string,
  rating: string,
  suggestion?: string,
  recomendacao?: number
): Promise<Feedback> => {
  const response = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ department, rating, suggestion, recomendacao }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Erro HTTP ${response.status}`
    );
  }
  return response.json();
};

export const createSuggestion = async (suggestion: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/suggestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ suggestion }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Erro HTTP ${response.status}`
    );
  }
  return response.json();
};

export const getSuggestions = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/api/suggestion`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Erro HTTP ${response.status}`
    );
  }
  const data = await response.json();
  return data.suggestions || [];
};