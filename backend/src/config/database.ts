import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { Suggestion } from '../models/Suggestion';
import { AddSuggestionToFeedback1747321795528 } from '../migrations/1747321795528-addSuggestionToFeedback';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // conexão completa
  synchronize: !isProduction,
  logging: false,
  entities: [User, Feedback, Suggestion],
  migrations: [AddSuggestionToFeedback1747321795528],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
