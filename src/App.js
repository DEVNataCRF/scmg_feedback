import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const GlobalStyle = createGlobalStyle `
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
const AppContainer = styled.div `
  min-height: 100vh;
  background-color: #f8f9fa;
`;
const App = () => {
    return (_jsxs(Router, { children: [_jsx(GlobalStyle, {}), _jsx(FeedbackProvider, { children: _jsx(AppContainer, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/avaliar/recepcao", replace: true }) }), _jsx(Route, { path: "/avaliar/:departmentId", element: _jsx(AvaliacaoPage, {}) }), _jsx(Route, { path: "/obrigado", element: _jsx(ThankYouPage, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin", element: _jsx(RequireAuth, { children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/feedbacks-detalhados", element: _jsx(RequireAuth, { children: _jsx(FeedbacksDetalhados, {}) }) }), _jsx(Route, { path: "/admin/relatorio", element: _jsx(RequireAuth, { children: _jsx(ReportPDF, {}) }) })] }) }) })] }));
};
export default App;
