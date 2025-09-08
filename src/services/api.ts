import { Feedback } from '../contexts/FeedBackContext';

export interface FeedbacksResponse {
  feedbacks: Feedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function getToken() {
  const token = localStorage.getItem('token') || '';
  if (!token) {
    console.warn('Credenciais de autenticação ausentes.');
  }
  return token;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const getFeedbacks = async (): Promise<FeedbacksResponse> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/feedback`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Erro HTTP ${response.status}`);
  }
  return response.json();
};

export const createFeedback = async (
  department: string,
  rating: string,
  suggestion?: string,
  recomendacao?: number
): Promise<Feedback> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ department, rating, suggestion, recomendacao }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Erro HTTP ${response.status}`);
  }
  return response.json();
};

export const createSuggestion = async (suggestion: string): Promise<any> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/suggestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ suggestion }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Erro HTTP ${response.status}`);
  }
  return response.json();
};

export const getSuggestions = async (): Promise<any[]> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/suggestion`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Erro HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.suggestions || [];
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<any> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `Erro HTTP ${response.status}`);
  }
  return data;
};

export const changePassword = async (
  email: string,
  novaSenha: string
): Promise<any> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email, novaSenha }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `Erro HTTP ${response.status}`);
  }
  return data;
};