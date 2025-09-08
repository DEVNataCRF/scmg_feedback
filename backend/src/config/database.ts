import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { Suggestion } from '../models/Suggestion';
import { Department } from '../models/Department';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // conexão completa
  synchronize: true,
  logging: false,
  entities: [User, Feedback, Suggestion, Department],
  ssl: {
    rejectUnauthorized: false, // necessário no Render
  },
});
