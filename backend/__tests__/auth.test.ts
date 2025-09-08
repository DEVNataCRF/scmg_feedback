process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/testdb';
import request from 'supertest';
import { DataSource } from 'typeorm';

// set required env vars before modules are imported
process.env.JWT_SECRET = 'testsecret';
process.env.JWT_EXPIRES_IN = '1d';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USER = 'user';
process.env.DB_PASS = 'pass';
process.env.DB_NAME = 'testdb';


// Mock database to use in-memory sqlite
jest.mock('../src/config/database', () => {
  const { DataSource } = require('typeorm');
  const { User } = require('../src/models/User');
  const { Feedback } = require('../src/models/Feedback');
  const { Suggestion } = require('../src/models/Suggestion');
  const { Department } = require('../src/models/Department');
  const ds = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [User, Feedback, Suggestion, Department],
  });
  return { AppDataSource: ds };
});

import app from '../src/app';
import { AppDataSource } from '../src/config/database';
import { User } from '../src/models/User';

beforeAll(async () => {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const user = repo.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
  });
  await user.hashPassword();
  await repo.save(user);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('POST /api/auth/login', () => {
  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('fails with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    expect(res.status).toBe(400);
  });

  it('fails when user does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nouser@example.com', password: 'password' });
    expect(res.status).toBe(400);
  });
});

