import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { Suggestion } from '../models/Suggestion';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // conexão completa
  synchronize: true,
  logging: false,
  entities: [User, Feedback, Suggestion],
  ssl: {
    rejectUnauthorized: false, // necessário no Render
  },
});
