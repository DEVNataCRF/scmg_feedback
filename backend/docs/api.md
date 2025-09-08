# Documentação da API SCMG

## Autenticação
- **POST** `/api/auth/login` — Login de usuário
  - Body: `{ "email": "...", "password": "..." }`
  - Resposta: `{ "token": "...", "user": { ... } }`

- **POST** `/api/auth/register` — Cadastro de usuário (apenas admin)
  - Header: `Authorization: Bearer <token_admin>`
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
  - Resposta: `{ "token": "...", "user": { ... } }`

## Feedback
- **POST** `/api/feedback` — Criar feedback
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "departmentId": "...", "rating": "Excelente|Bom|Regular|Ruim" }`
  - Resposta: `{ "id": "...", "department": { "id": "...", "name": "..." }, "rating": "...", ... }`

- **GET** `/api/feedback` — Listar feedbacks (admin)
  - Header: `Authorization: Bearer <token_admin>`
  - Query params: `?page=1&limit=20`
  - Resposta: `{ "data": [ ... ], "total": 100 }`

## Sugestão
- **POST** `/api/suggestion` — Criar sugestão
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "suggestion": "..." }`
  - Resposta: `{ "id": "...", "suggestion": "..." }`

## Troca de Senha
- **POST** `/api/auth/change-password` — Alterar senha
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "email": "...", "senhaAtual": "...", "novaSenha": "..." }`
  - Resposta: `{ "message": "..." }`

## Observações
- Todos os endpoints protegidos exigem o header `Authorization: Bearer <token>`.
- Apenas admins podem cadastrar novos usuários e listar feedbacks.
- Para mais detalhes, consulte o código-fonte ou entre em contato com o responsável. 