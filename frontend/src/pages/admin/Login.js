import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import logo from '../../assets/fav.png';
const Container = styled.div `
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
`;
const Card = styled.div `
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  text-align: center;
`;
const Logo = styled.img `
  height: 48px;
  margin-bottom: 1rem;
`;
const Title = styled.h1 `
  font-size: 1.5rem;
  color: #003366;
  margin-bottom: 2rem;
`;
const InputGroup = styled.div `
  position: relative;
  margin-bottom: 1rem;
`;
const Icon = styled.div `
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #666;
`;
const Input = styled.input `
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    border-color: #003366;
    outline: none;
  }
`;
const Button = styled.button `
  width: 100%;
  background-color: #003366;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
  &:hover {
    background-color: #002244;
  }
`;
const Link = styled.a `
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #003366;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const ErrorMsg = styled.div `
  color: #dc3545;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  min-height: 1.2em;
`;
const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [changeEmail, setChangeEmail] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaNovaSenha, setConfirmaNovaSenha] = useState('');
    const [changeMsg, setChangeMsg] = useState('');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || '';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: senha })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Usuário ou senha inválidos.');
                return;
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('loginTime', Date.now().toString());
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/admin');
        }
        catch (err) {
            setError(err.message || 'Erro ao fazer login.');
        }
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setChangeMsg('');
        if (novaSenha !== confirmaNovaSenha) {
            setChangeMsg('As senhas não coincidem.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ email: changeEmail, senhaAtual, novaSenha })
            });
            const data = await response.json();
            if (!response.ok) {
                setChangeMsg(data.error || 'Erro ao alterar senha.');
            }
            else {
                setChangeMsg(data.message || 'Senha alterada com sucesso!');
                setChangeEmail('');
                setSenhaAtual('');
                setNovaSenha('');
                setConfirmaNovaSenha('');
            }
        }
        catch (err) {
            setChangeMsg('Erro ao alterar senha.');
        }
    };
    return (_jsx(Container, { children: _jsxs(Card, { children: [_jsx(Logo, { src: logo, alt: "Logo" }), _jsx(Title, { children: "Login do Administrador" }), !showChangePassword ? (_jsxs(_Fragment, { children: [_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiMail, {}) }), _jsx(Input, { type: "email", placeholder: "E-mail", value: email, onChange: e => setEmail(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Senha", value: senha, onChange: e => setSenha(e.target.value), required: true })] }), _jsxs(Button, { type: "submit", children: [_jsx(FiLogIn, {}), " Entrar"] }), _jsx(ErrorMsg, { children: error })] }), _jsx(Link, { href: "#", onClick: e => { e.preventDefault(); setShowChangePassword(true); }, children: "\uD83D\uDD10 Alterar senha" })] })) : (_jsxs(_Fragment, { children: [_jsxs("form", { onSubmit: handleChangePassword, children: [_jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiMail, {}) }), _jsx(Input, { type: "email", placeholder: "E-mail", value: changeEmail, onChange: e => setChangeEmail(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Senha atual", value: senhaAtual, onChange: e => setSenhaAtual(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Nova senha", value: novaSenha, onChange: e => setNovaSenha(e.target.value), required: true })] }), _jsxs(InputGroup, { children: [_jsx(Icon, { children: _jsx(FiLock, {}) }), _jsx(Input, { type: "password", placeholder: "Confirmar nova senha", value: confirmaNovaSenha, onChange: e => setConfirmaNovaSenha(e.target.value), required: true })] }), _jsx(Button, { type: "submit", children: "Alterar senha" }), _jsx(ErrorMsg, { children: changeMsg })] }), _jsx(Link, { href: "#", onClick: e => { e.preventDefault(); setShowChangePassword(false); }, children: "Voltar para login" })] }))] }) }));
};
export default Login;
