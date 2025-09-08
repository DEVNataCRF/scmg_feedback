import dotenv from 'dotenv';
dotenv.config(); // Usar o padrão, sem caminho manual

import { AppDataSource } from './config/database';
import { env } from './config/env';
import app from './app';

// Garante que a porta padrão seja 3000 se não informada
const PORT = parseInt(env.PORT || '3000');

(async () => {
  try {
    console.log('🌐 Iniciando conexão com o banco...');
    await AppDataSource.initialize();
    if (process.env.NODE_ENV === 'production') {
      await AppDataSource.runMigrations();
    }
    console.log('✅ Conectado ao banco com sucesso!');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar:', error);
  }
})();
