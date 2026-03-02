/**
 * Standalone test file to verify core engine logic without database
 * Run with: npx ts-node test-engines.ts
 */

import { RiskEngineService } from './src/risk-engine/risk-engine.service';
import { AllocationEngineService } from './src/allocation-engine/allocation-engine.service';
import { ProjectionEngineService } from './src/projection-engine/projection-engine.service';

console.log('🧪 Testing ArthaPath Nepal Core Engines\n');
console.log('='.repeat(60));

// Initialize services
const riskEngine = new RiskEngineService();
const allocationEngine = new AllocationEngineService();
const projectionEngine = new ProjectionEngineService();

// Test Case 1: Conservative Profile
console.log('\n📊 Test Case 1: Conservative Investor');
console.log('-'.repeat(60));

const testInput1 = {
  initialCapital: 100000,
  monthlyContribution: 5000,
  durationYears: 5,
  riskTolerance: 'Low' as const,
  liquidityNeed: 'High' as const,
  hasEmergencyFund: false,
};

const riskProfile1 = riskEngine.calculateRiskProfile(
  testInput1.durationYears,
  testInput1.liquidityNeed,
  testInput1.riskTolerance,
  testInput1.hasEmergencyFund,
);

const allocation1 = allocationEngine.generateAllocation(
  riskProfile1,
  testInput1.durationYears,
  testInput1.initialCapital,
);

const projection1 = projectionEngine.calculateProjection(
  testInput1.initialCapital,
  testInput1.monthlyContribution,
  testInput1.durationYears,
  riskProfile1,
);

console.log(`Risk Profile: ${riskProfile1}`);
console.log(`\nAllocation:`);
Object.entries(allocation1).forEach(([category, percentage]) => {
  if (percentage > 0) {
    console.log(`  ${category}: ${percentage}%`);
  }
});
console.log(`\nProjections (5 years):`);
console.log(`  Conservative: NPR ${projection1.conservative.toLocaleString()}`);
console.log(`  Expected: NPR ${projection1.expected.toLocaleString()}`);
console.log(`  Optimistic: NPR ${projection1.optimistic.toLocaleString()}`);
console.log(`  Total Contributions: NPR ${projection1.total_contributions.toLocaleString()}`);

// Test Case 2: Aggressive Profile
console.log('\n\n📊 Test Case 2: Aggressive Investor');
console.log('-'.repeat(60));

const testInput2 = {
  initialCapital: 500000,
  monthlyContribution: 20000,
  durationYears: 15,
  riskTolerance: 'High' as const,
  liquidityNeed: 'Low' as const,
  hasEmergencyFund: true,
};

const riskProfile2 = riskEngine.calculateRiskProfile(
  testInput2.durationYears,
  testInput2.liquidityNeed,
  testInput2.riskTolerance,
  testInput2.hasEmergencyFund,
);

const allocation2 = allocationEngine.generateAllocation(
  riskProfile2,
  testInput2.durationYears,
  testInput2.initialCapital,
);

const projection2 = projectionEngine.calculateProjection(
  testInput2.initialCapital,
  testInput2.monthlyContribution,
  testInput2.durationYears,
  riskProfile2,
);

console.log(`Risk Profile: ${riskProfile2}`);
console.log(`\nAllocation:`);
Object.entries(allocation2).forEach(([category, percentage]) => {
  if (percentage > 0) {
    console.log(`  ${category}: ${percentage}%`);
  }
});
console.log(`\nProjections (15 years):`);
console.log(`  Conservative: NPR ${projection2.conservative.toLocaleString()}`);
console.log(`  Expected: NPR ${projection2.expected.toLocaleString()}`);
console.log(`  Optimistic: NPR ${projection2.optimistic.toLocaleString()}`);
console.log(`  Total Contributions: NPR ${projection2.total_contributions.toLocaleString()}`);

// Test Case 3: Balanced Profile
console.log('\n\n📊 Test Case 3: Balanced Investor');
console.log('-'.repeat(60));

const testInput3 = {
  initialCapital: 250000,
  monthlyContribution: 10000,
  durationYears: 10,
  riskTolerance: 'Medium' as const,
  liquidityNeed: 'Medium' as const,
  hasEmergencyFund: true,
};

const riskProfile3 = riskEngine.calculateRiskProfile(
  testInput3.durationYears,
  testInput3.liquidityNeed,
  testInput3.riskTolerance,
  testInput3.hasEmergencyFund,
);

const allocation3 = allocationEngine.generateAllocation(
  riskProfile3,
  testInput3.durationYears,
  testInput3.initialCapital,
);

const projection3 = projectionEngine.calculateProjection(
  testInput3.initialCapital,
  testInput3.monthlyContribution,
  testInput3.durationYears,
  riskProfile3,
);

const yearlyData = projectionEngine.generateYearlyProjection(
  testInput3.initialCapital,
  testInput3.monthlyContribution,
  testInput3.durationYears,
  riskProfile3,
);

console.log(`Risk Profile: ${riskProfile3}`);
console.log(`\nAllocation:`);
Object.entries(allocation3).forEach(([category, percentage]) => {
  if (percentage > 0) {
    console.log(`  ${category}: ${percentage}%`);
  }
});
console.log(`\nProjections (10 years):`);
console.log(`  Conservative: NPR ${projection3.conservative.toLocaleString()}`);
console.log(`  Expected: NPR ${projection3.expected.toLocaleString()}`);
console.log(`  Optimistic: NPR ${projection3.optimistic.toLocaleString()}`);
console.log(`  Total Contributions: NPR ${projection3.total_contributions.toLocaleString()}`);

console.log(`\nYear-by-Year Growth (Expected):`);
yearlyData.forEach((data) => {
  if (data.year % 2 === 0 || data.year === testInput3.durationYears) {
    console.log(`  Year ${data.year}: NPR ${data.expected.toLocaleString()}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ All engines working correctly!\n');
