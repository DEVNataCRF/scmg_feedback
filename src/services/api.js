function getToken() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
        console.warn('Token ausente no localStorage!');
    }
    else {
        console.info('Token enviado:', token);
    }
    return token;
}
const API_URL = import.meta.env.VITE_API_URL || '';
export const getFeedbacks = async () => {
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
export const createFeedback = async (department, rating, suggestion, recomendacao) => {
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
export const createSuggestion = async (suggestion) => {
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
export const getSuggestions = async () => {
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
