import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { getFeedbacks, createFeedback } from '../services/api';
const FeedbackContext = createContext({});
export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    // Função para buscar feedbacks do backend
    const fetchFeedbacks = async () => {
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
        fetchFeedbacks();
    }, []);
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
