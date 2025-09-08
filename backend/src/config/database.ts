// backend/src/config/database.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { Suggestion } from '../models/Suggestion';
import { Department } from '../models/Department';

import { AddSuggestionToFeedback1747321795528 } from '../migrations/1747321795528-addSuggestionToFeedback';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // conexão completa
  // Em produção o ideal é NÃO sincronizar automaticamente
  // (evita alterações de schema não intencionais):
  synchronize: !isProduction,
  logging: false,

  entities: [User, Feedback, Suggestion, Department],
  migrations: [AddSuggestionToFeedback1747321795528],

  // No Render/hosts gerenciados geralmente é necessário SSL.
  // Mantemos rejectUnauthorized:false para compatibilidade.
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
