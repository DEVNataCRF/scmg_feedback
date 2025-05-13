import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { Suggestion } from '../models/Suggestion';
import { env } from './env';

const commonOptions = {
  entities: [User, Feedback, Suggestion],
  subscribers: [],
  migrations: [],
  synchronize: true,
  logging: false,
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  poolSize: 20,
  maxQueryExecutionTime: 1000,
  extra: {
    statement_timeout: 30000,
    idle_in_transaction_session_timeout: 30000,
  },
  ...commonOptions,
}); 