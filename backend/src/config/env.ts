// src/config/env.ts
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3001'),
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  NODE_ENV: z.string().default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Erro na validação das variáveis de ambiente:', _env.error.format());
  process.exit(1); // Encerra a aplicação caso alguma variável esteja inválida
}

export const env = _env.data;