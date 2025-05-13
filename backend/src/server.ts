import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
console.log('DB_HOST:', process.env.DB_HOST);

import { AppDataSource } from './config/database';
import { env } from './config/env';
import app from './app';

const PORT = parseInt(env.PORT);

(async () => {
  try {
    console.log('Antes do initialize');
    await AppDataSource.initialize();
    console.log('Depois do initialize');
    app.listen(PORT, () => {
      console.log('Servidor rodando!');
    });
  } catch (error) {
    console.error('Erro ao inicializar:', error);
  }
})(); 