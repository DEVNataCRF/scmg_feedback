# Backup e Restauração do Banco de Dados

## Backup Manual

### Windows
- Execute o script `backend/backup.bat` (clique duas vezes ou rode pelo terminal).

### Linux/macOS
- Execute o script `backend/backup.sh`:
  ```bash
  bash backend/backup.sh
  ```
- Os arquivos `.sql` serão salvos no diretório configurado no script.

## Agendamento Automático (Windows)
1. Abra o Agendador de Tarefas do Windows.
2. Crie uma nova tarefa para rodar `backup.bat` diariamente às 3h.


## Restaurando um Backup

1. Abra o terminal (cmd ou PowerShell).
2. Use o comando:
   ```bash
   psql -h localhost -U postgres -d scmg < caminho\para\backup.sql
   ```
3. Substitua `caminho\para\backup.sql` pelo caminho do arquivo desejado.

## Recomendações
- Teste a restauração periodicamente em um banco de testes.
- Mantenha os backups em local seguro e, se possível, sincronize com nuvem.
- Documente a senha do banco em local seguro (não versionar em repositório).

## Dúvidas
Em caso de dúvidas, consulte o README ou entre em contato com o responsável pelo sistema. 