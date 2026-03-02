import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let request: ReturnType<typeof supertest>;

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

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request
        .post('/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('name', 'Test User');
    });

    it('should fail with weak password', async () => {
      await request
        .post('/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should fail with duplicate email', async () => {
      const email = `duplicate${Date.now()}@example.com`;

      // First registration
      await request
        .post('/auth/register')
        .send({
          email,
          password: 'password123',
          name: 'Test User',
        })
        .expect(201);

      // Second registration with same email
      await request
        .post('/auth/register')
        .send({
          email,
          password: 'password123',
          name: 'Test User',
        })
        .expect(409); // Conflict
    });
  });

  describe('POST /auth/login', () => {
    const testEmail = `login${Date.now()}@example.com`;
    const testPassword = 'password123';

    beforeAll(async () => {
      // Register a user first
      await request
        .post('/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          name: 'Login Test User',
        });
    });

    it('should login successfully', async () => {
      const response = await request
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      accessToken = response.body.access_token;
    });

    it('should fail with wrong password', async () => {
      await request
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with non-existent email', async () => {
      await request
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should get current user profile', async () => {
      const response = await request
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
    });

    it('should fail without token', async () => {
      await request.get('/auth/me').expect(401);
    });

    it('should fail with invalid token', async () => {
      await request
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });
});
