process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/testdb';
import request from 'supertest';
import express from 'express';
import feedbackRoutes from '../src/routes/feedback';

jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: () => ({
      create: (data: any) => data,
      save: async (data: any) => ({ id: 1, ...data }),
    }),
  },
}));

describe('POST /api/feedback', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/feedback', feedbackRoutes);

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/feedback').send({});
    expect(res.status).toBe(400);
  });

  it('creates feedback when valid', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ department: 'Recepção', rating: 'Bom' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ department: 'Recepção', rating: 'Bom' });
  });
});
