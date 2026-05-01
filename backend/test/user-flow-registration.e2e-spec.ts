import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Flow: Registration → Input → Dashboard (E2E)', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userId: number;
  let authToken: string;
  let userEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Step 1: User Registration', () => {
    it('should register a new user successfully', async () => {
      userEmail = `test-user-${Date.now()}@example.com`;
      const response = await request
        .post('/auth/register')
        .send({
          email: userEmail,
          password: 'TestPassword123!',
          name: 'Test User Flow',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userEmail);
      userId = response.body.user.id;
      authToken = response.body.access_token;
    });
  });

  describe('Step 2: User Submits Investment Input', () => {
    it('should accept investment input and calculate risk profile', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 10,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('riskProfile');
      expect(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE']).toContain(
        response.body.riskProfile,
      );
      expect(response.body).toHaveProperty('allocation');
      expect(response.body).toHaveProperty('projection');
    });
  });

  describe('Step 3: Dashboard Data Retrieval', () => {
    it('should retrieve user profile', async () => {
      const response = await request
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', userEmail);
    });
  });

  describe('Step 4: Save Plan', () => {
    it('should save investment plan to dashboard', async () => {
      const calcRes = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 10,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        });

      const response = await request
        .post('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'My First Plan',
          description: 'Initial investment plan',
          simulationData: calcRes.body,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('My First Plan');
    });

    it('should retrieve saved plans for dashboard', async () => {
      const response = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
