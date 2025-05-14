import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const FeedbackContext = createContext(undefined);
export const FeedbackProvider = ({ children }) => {
    const [, setAvaliacoes] = useState([]);
    const addAvaliacao = (departamento, nota) => {
        setAvaliacoes(prev => [...prev, { departamento, nota }]);
    };
    // ... outros métodos
    return (_jsx(FeedbackContext.Provider, { value: { addAvaliacao }, children: children }));
};
export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback deve ser usado dentro de um FeedbackProvider');
    }
    return context;
};
