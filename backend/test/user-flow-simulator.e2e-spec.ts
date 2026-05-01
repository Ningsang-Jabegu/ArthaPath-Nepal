import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Flow: Simulator Workflow (E2E)', () => {
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
    userEmail = `simulator-test-${Date.now()}@example.com`;
    const registerRes = await request
      .post('/auth/register')
      .send({
        email: userEmail,
        password: 'SimulatorTest123!',
        name: 'Simulator Test User',
      });

    authToken = registerRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Simulator Initial State', () => {
    it('should run initial simulator calculation', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: 300000,
          monthlyContribution: 5000,
          duration: 5,
          riskTolerance: 'LOW',
          liquidityNeed: 'HIGH',
          emergencyFund: false,
        })
        .expect(201);

      expect(response.body).toHaveProperty('riskProfile');
      expect(response.body).toHaveProperty('allocation');
      expect(response.body).toHaveProperty('projection');
    });
  });

  describe('Simulator Calculation - Scenario 1: Conservative', () => {
    it('should calculate conservative allocation', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: 300000,
          monthlyContribution: 5000,
          duration: 5,
          riskTolerance: 'LOW',
          liquidityNeed: 'HIGH',
          emergencyFund: false,
        })
        .expect(201);

      expect(response.body.riskProfile).toBe('CONSERVATIVE');
      expect(response.body.allocation).toBeDefined();
      expect(response.body.projection).toBeDefined();
    });
  });

  describe('Simulator Calculation - Scenario 2: Balanced', () => {
    it('should calculate balanced allocation', async () => {
      const response = await request
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

      expect(response.body.riskProfile).toBe('BALANCED');
      expect(response.body.allocation).toBeDefined();
      expect(response.body.projection).toBeDefined();

      // Verify total allocation sums to 100%
      const totalAllocation = response.body.allocation.reduce(
        (sum: number, item: any) => sum + (item.percentage || item.allocation || 0),
        0,
      );
      expect(totalAllocation).toBeCloseTo(100, 0);
    });
  });

  describe('Simulator Calculation - Scenario 3: Aggressive', () => {
    it('should calculate aggressive allocation', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: 1000000,
          monthlyContribution: 30000,
          duration: 25,
          riskTolerance: 'HIGH',
          liquidityNeed: 'LOW',
          emergencyFund: true,
        })
        .expect(201);

      expect(response.body.riskProfile).toBe('AGGRESSIVE');
      expect(response.body.allocation).toBeDefined();
      expect(response.body.projection).toBeDefined();
    });
  });

  describe('Simulator Projection Accuracy', () => {
    it('should return realistic 3-scenario projections', async () => {
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

      const projection = response.body.projection;

      expect(projection.conservative).toBeDefined();
      expect(projection.expected).toBeDefined();
      expect(projection.optimistic).toBeDefined();

      // Verify hierarchy: conservative <= expected <= optimistic
      expect(projection.conservative.futureValue).toBeLessThanOrEqual(
        projection.expected.futureValue,
      );
      expect(projection.expected.futureValue).toBeLessThanOrEqual(
        projection.optimistic.futureValue,
      );
    });
  });

  describe('Simulator Adjustment & Recalculation', () => {
    it('should recalculate on parameter changes', async () => {
      // First calculation
      const firstRes = await request
        .post('/simulator/run')
        .send({
          capital: 200000,
          monthlyContribution: 5000,
          duration: 10,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      const firstValue = firstRes.body.projection.expected.futureValue;

      // Adjust capital higher
      const secondRes = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 5000,
          duration: 10,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      const secondValue = secondRes.body.projection.expected.futureValue;

      // Higher capital should result in higher future value
      expect(secondValue).toBeGreaterThan(firstValue);
    });

    it('should show impact of duration change on projections', async () => {
      // 10-year projection
      const tenYearRes = await request
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

      const tenYearValue = tenYearRes.body.projection.expected.futureValue;

      // 20-year projection
      const twentyYearRes = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 20,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      const twentyYearValue = twentyYearRes.body.projection.expected.futureValue;

      // Longer duration should result in higher value (compound interest)
      expect(twentyYearValue).toBeGreaterThan(tenYearValue);
    });

    it('should show impact of risk tolerance on allocation', async () => {
      const lowRiskRes = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 10,
          riskTolerance: 'LOW',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      const highRiskRes = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 10000,
          duration: 10,
          riskTolerance: 'HIGH',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        })
        .expect(201);

      // Both should have allocations
      expect(lowRiskRes.body.allocation).toBeDefined();
      expect(highRiskRes.body.allocation).toBeDefined();
    });
  });

  describe('Simulator Error Handling', () => {
    it('should reject invalid capital (negative)', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: -100000,
          monthlyContribution: 5000,
          duration: 10,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should reject invalid duration (too high)', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          monthlyContribution: 5000,
          duration: 100,
          riskTolerance: 'MEDIUM',
          liquidityNeed: 'MEDIUM',
          emergencyFund: true,
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should handle missing required fields', async () => {
      const response = await request
        .post('/simulator/run')
        .send({
          capital: 500000,
          // Missing other required fields
        });

      expect([400, 422]).toContain(response.status);
    });
  });
});

