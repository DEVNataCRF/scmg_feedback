# Documentação do Frontend (React)

## Estrutura do Projeto
- `src/` - Código-fonte principal do frontend
- `src/components/` - Componentes reutilizáveis
- `src/pages/` - Páginas principais
- `src/services/` - Serviços de API
- `src/__tests__/` - Testes unitários e de integração

## Rodando o Frontend

```bash
cd frontend
npm install
npm start
```

## Testes Automatizados

### Unitários e de Integração
- Utilize **Jest** e **React Testing Library**
- Para rodar os testes:
  ```bash
  npm test
  npm test -- --coverage
  ```
- O relatório de cobertura será gerado na pasta `frontend/coverage`

### Exemplo de teste de componente
```jsx
import { render, screen } from '@testing-library/react';
import FeedbackForm from '../components/FeedbackForm';

test('renderiza o formulário de feedback', () => {
  render(<FeedbackForm />);
  expect(screen.getByLabelText(/departamento/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
});
```

### Testes End-to-End (opcional)
- Recomenda-se o uso do **Cypress** para testes de fluxo completo.

## Boas práticas
- Escreva testes para cada componente e página crítica.
- Mantenha a cobertura de testes alta, especialmente em fluxos de autenticação e envio de feedback.
- Documente componentes e props importantes.

## Dúvidas
Consulte o README principal ou entre em contato com o responsável pelo frontend. 