import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { FeedbackProvider } from './contexts/FeedBackContext';
import AvaliacaoPage from './pages/AvaliacaoPage';
import ThankYouPage from './pages/ThankYouPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/admin/Login';
import { createGlobalStyle } from 'styled-components';
import RequireAuth from './components/RequireAuth';
import FeedbacksDetalhados from './pages/FeedbacksDetalhados';
import ReportPDF from './components/ReportPDF';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    background-color: #f8f9fa;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <FeedbackProvider>
        <AppContainer>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/avaliar/recepcao" replace />} 
            />
            <Route 
              path="/avaliar/:departmentId" 
              element={<AvaliacaoPage />} 
            />
            <Route path="/obrigado" element={<ThankYouPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/feedbacks-detalhados" element={<RequireAuth><FeedbacksDetalhados /></RequireAuth>} />
            <Route path="/admin/relatorio" element={<RequireAuth><ReportPDF /></RequireAuth>} />
          </Routes>
        </AppContainer>
      </FeedbackProvider>
    </Router>
  );
};

export default App; 