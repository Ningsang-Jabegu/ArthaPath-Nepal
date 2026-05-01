import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Flow: Save Plan Workflow (E2E)', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let authToken: string;
  let userEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());

    // Setup: Create and login test user
    userEmail = `save-plan-test-${Date.now()}@example.com`;
    const registerRes = await request
      .post('/auth/register')
      .send({
        email: userEmail,
        password: 'SavePlanTest123!',
        name: 'Save Plan Test User',
      });

    authToken = registerRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Save Plan: Initial State', () => {
    it('should retrieve empty saved plans on first access', async () => {
      const response = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Save Plan: Create & Retrieve', () => {
    let planId: string;

    it('should save a plan with custom name', async () => {
      // First generate a simulation
      const calcRes = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 15,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      // Save the plan
      const response = await request
        .post('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'My First Investment Plan',
          description: 'Initial plan',
          simulationData: calcRes.body,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('My First Investment Plan');
      planId = response.body.id;
    });

    it('should retrieve all saved plans', async () => {
      const response = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should retrieve specific saved plan by ID', async () => {
      // Get list of plans
      const listRes = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listRes.body.length > 0) {
        const id = listRes.body[0].id;

        const response = await request
          .get(`/saved-plans/${id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.id).toBe(id);
      }
    });
  });

  describe('Save Plan: Multiple Plans', () => {
    it('should save multiple plans', async () => {
      const plans = ['Conservative Plan', 'Balanced Plan', 'Aggressive Plan'];

      for (const name of plans) {
        const calcRes = await request.post('/simulator/run').send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 15,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        });

        await request
          .post('/saved-plans')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: name,
            description: 'Test plan',
            simulationData: calcRes.body,
          })
          .expect(201);
      }

      const listRes = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(listRes.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Save Plan: Update & Rename', () => {
    it('should update plan name', async () => {
      // Get a saved plan
      const listRes = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listRes.body.length > 0) {
        const planId = listRes.body[0].id;
        const newName = `Updated Plan - ${Date.now()}`;

        const response = await request
          .patch(`/saved-plans/${planId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: newName })
          .expect(200);

        expect(response.body.name).toBe(newName);
      }
    });
  });

  describe('Save Plan: Delete', () => {
    it('should delete saved plan', async () => {
      // Create a new plan
      const calcRes = await request
        .post('/simulator/run')
        .send({
          capital: 400000,
          monthlyContribution: 8000,
          duration: 12,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      const saveRes = await request
        .post('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Plan to Delete',
          description: 'Test',
          simulationData: calcRes.body,
        })
        .expect(201);

      const planId = saveRes.body.id;

      // Count before
      const countBefore = (
        await request
          .get('/saved-plans')
          .set('Authorization', `Bearer ${authToken}`)
      ).body.length;

      // Delete
      await request
        .delete(`/saved-plans/${planId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Count after
      const countAfter = (
        await request
          .get('/saved-plans')
          .set('Authorization', `Bearer ${authToken}`)
      ).body.length;

      expect(countAfter).toBe(countBefore - 1);
    });
  });

  describe('Save Plan: Error Handling', () => {
    it('should reject plan save without authorization', async () => {
      const response = await request.post('/saved-plans').send({
        name: 'Unauthorized Plan',
        simulationData: {},
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent plan', async () => {
      const response = await request
        .get('/saved-plans/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Save Plan: Isolation (User Data Privacy)', () => {
    it('should not retrieve other users plans', async () => {
      // Create another user
      const otherEmail = `other-user-${Date.now()}@example.com`;
      const otherRegRes = await request
        .post('/auth/register')
        .send({
          email: otherEmail,
          password: 'OtherUser123!',
          name: 'Other User',
        });

      const otherToken = otherRegRes.body.access_token;

      // Other user should see only their plans (empty)
      const otherPlans = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(200);

      // Original user plans
      const originalPlans = await request
        .get('/saved-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(otherPlans.body.length).toBe(0);
      expect(originalPlans.body.length).toBeGreaterThan(0);
    });
  });
});
