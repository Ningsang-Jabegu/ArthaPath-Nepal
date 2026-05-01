import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Education API E2E Tests', () => {
  let app: INestApplication;
  let requestAgent: ReturnType<typeof request>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    requestAgent = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /education/articles returns a paginated payload with article data', async () => {
    const response = await requestAgent.get('/education/articles').expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('GET /education/articles/filter returns an array payload filtered by category', async () => {
    const response = await requestAgent
      .get('/education/articles/filter')
      .query({ category: 'General' })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.every((article: { category: string }) => article.category === 'General')).toBe(true);
  });
});
