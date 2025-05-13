#!/bin/bash

# Caminho do backup
dir="$(dirname "$0")/backups"
mkdir -p "$dir"

# Nome do arquivo de backup
file="$dir/backup_$(date +%Y-%m-%d_%H-%M-%S).sql"

# URL do banco
DB_URL="${1:-$DATABASE_URL}"

if [ -z "$DB_URL" ]; then
  echo "Uso: $0 <DATABASE_URL> ou defina a variável de ambiente DATABASE_URL"
  exit 1
fi

# Executa o backup
PGPASSWORD=$(echo $DB_URL | sed -n 's/.*:.*:\/\/(.*):(.*)@.*/\2/p') \
pg_dump "$DB_URL" > "$file"

if [ $? -eq 0 ]; then
  echo "Backup realizado com sucesso: $file"
else
  echo "Erro ao realizar backup."
  exit 2
fi 