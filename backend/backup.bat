@echo off
setlocal

REM Caminho do backup
set "DIR=%~dp0backups"
if not exist "%DIR%" mkdir "%DIR%"

REM Nome do arquivo de backup
for /f %%i in ('wmic os get localdatetime ^| findstr /r /c:"[0-9]"') do set datetime=%%i
set "DATE=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%-%datetime:~12,2%"
set "FILE=%DIR%\backup_%DATE%.sql"

REM URL do banco
set "DB_URL=%1"
if "%DB_URL%"=="" set "DB_URL=%DATABASE_URL%"

if "%DB_URL%"=="" (
  echo Uso: backup.bat ^<DATABASE_URL^> ou defina a variavel de ambiente DATABASE_URL
  exit /b 1
)

REM Extrai usuario, senha, host, porta e dbname da URL
for /f "tokens=1,2 delims=@" %%a in ("%DB_URL%") do set "CRED=%%a" & set "HOSTDB=%%b"
for /f "tokens=1,2 delims=:" %%a in ("%CRED%") do set "USERPASS=%%a" & set "USERPASS2=%%b"
for /f "tokens=1,2 delims=:" %%a in ("%USERPASS2%") do set "USER=%%a" & set "PASS=%%b"
for /f "tokens=1,2 delims=/" %%a in ("%HOSTDB%") do set "HOSTPORT=%%a" & set "DBNAME=%%b"
for /f "tokens=1,2 delims=:" %%a in ("%HOSTPORT%") do set "HOST=%%a" & set "PORT=%%b"

REM Executa o backup
set PGPASSWORD=%PASS%
pg_dump -h %HOST% -p %PORT% -U %USER% -d %DBNAME% -F p -f "%FILE%"
if %ERRORLEVEL%==0 (
  echo Backup realizado com sucesso: %FILE%
) else (
  echo Erro ao realizar backup.
  exit /b 2
)
endlocal 