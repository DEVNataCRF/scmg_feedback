# SCMG - Sistema de Feedback

## Visão Geral
Sistema de feedbacks/avaliações para a Santa Casa de Guaçuí, com backend em Node.js/Express/TypeORM e frontend em React. Permite avaliações, sugestões, exportação de dados, controle de usuários/admins, backup e alta segurança.

## Requisitos
- Node.js 18+
- PostgreSQL 12+

## Instalação e Execução

```bash
cd backend
npm install
npm run dev
```

## Variáveis de Ambiente
Crie um arquivo `.env` baseado em `.env.example`:

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=scmg
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d
```

## Rodando os Testes

```bash
npm test
npm test -- --coverage
```
- Relatório de cobertura: `backend/coverage/lcov-report/index.html`

## Backup do Banco de Dados

- **Linux/macOS:**
  ```bash
  ./backup.sh "postgres://usuario:senha@localhost:5432/nome_do_banco"
  ```
  ou defina a variável de ambiente `DATABASE_URL`:
  ```bash
  export DATABASE_URL="postgres://usuario:senha@localhost:5432/nome_do_banco"
  ./backup.sh
  ```
  O backup será salvo em `backend/backups/backup_YYYY-MM-DD_HH-MM-SS.sql`

- **Windows:**
  ```
  backup.bat "postgres://usuario:senha@localhost:5432/nome_do_banco"
  ```
  ou defina a variável de ambiente `DATABASE_URL` e rode:
  ```
  set DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
  backup.bat
  ```
  O backup será salvo em `backend\backups\backup_YYYY-MM-DD_HH-MM-SS.sql`

### Restaurando um backup
```bash
psql -h localhost -U postgres -d scmg < caminho\para\backup.sql
```

### Agendamento automático (Windows)
Agende o `backup.bat` pelo Agendador de Tarefas para rodar diariamente às 3h.

## Estrutura de Pastas
- `src/` - Código-fonte principal
- `src/controllers/` - Controllers das rotas
- `src/models/` - Models do TypeORM
- `src/routes/` - Rotas Express
- `logs/` - Logs do sistema
- `backups/` - (opcional) Backups locais

## Segurança
- Apenas admins podem cadastrar novos usuários
- Limite de tentativas de login
- Senhas criptografadas
- Variáveis sensíveis em `.env`
- Logger com rotação de logs

## Deploy
- Recomenda-se uso de Docker, ambiente seguro e backup automatizado
- Certifique-se de não enviar arquivos de teste, logs ou scripts temporários para produção
- Crie a pasta `logs/` vazia no servidor de produção
- Configure as variáveis de ambiente corretamente no ambiente de produção

---

## Frontend

```bash
cd ../
npm install
npm run dev
```
- O frontend estará disponível em `http://localhost:3000`
- Configure o proxy para `/api` se necessário (veja `package.json` do frontend)

## Autenticação e Permissões
- O sistema utiliza autenticação JWT.
- Apenas admins podem cadastrar novos usuários e alterar senha de outros usuários.
- Usuários comuns podem acessar o dashboard, visualizar feedbacks/sugestões e exportar dados.
- O rodapé do PDF exportado mostra o nome ou e-mail do usuário responsável pela exportação.

## Exportação de Dados
- É possível exportar todos os feedbacks e sugestões em Excel ou PDF.
- O PDF gerado inclui no rodapé: `USUÁRIO: [nome ou e-mail do usuário exportador]`.

## Contato
Dúvidas ou sugestões: [devnatacfig@hotmail.com] 