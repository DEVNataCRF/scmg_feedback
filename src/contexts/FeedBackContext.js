import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { getFeedbacks, createFeedback } from '../services/api';
import { useLocation } from 'react-router-dom';
const FeedbackContext = createContext({});
export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    // Função para buscar feedbacks do backend
    const fetchFeedbacks = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Token não encontrado. Ignorando fetch de feedbacks.');
            return;
        }
        setLoading(true);
        try {
            const data = await getFeedbacks();
            setFeedbacks(data.feedbacks || []);
        }
        catch (error) {
            console.error('Erro ao buscar feedbacks:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (location.pathname.startsWith('/admin')) {
            fetchFeedbacks();
        }
    }, [location.pathname]);
    const addFeedback = async (department, rating) => {
        setLoading(true);
        try {
            await createFeedback(department, rating);
            await fetchFeedbacks();
        }
        catch (error) {
            console.error('Erro ao enviar feedback:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(FeedbackContext.Provider, { value: { feedbacks, addFeedback, loading, fetchFeedbacks }, children: children }));
};
export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};
