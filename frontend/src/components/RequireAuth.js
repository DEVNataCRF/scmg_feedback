import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em ms
const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    if (!token) {
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    }
    if (loginTime && Date.now() - Number(loginTime) > SESSION_TIMEOUT) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default RequireAuth;
