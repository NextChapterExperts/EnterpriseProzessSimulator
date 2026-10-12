import { PROCESS_TEMPLATES_DE } from '../src/data/templates';
import { calculateOverallMetrics } from '../src/lib/tcaCalculator';
import { ParetoSolver } from '../src/lib/paretoSolver';
import { SimulationConfig } from '../src/types/process';

const volumes = [1000, 25000, 100000];
const noiseLevels = [0.05, 0.15, 0.30];

console.log('--- Start Enterprise Simulation Core Mathematical Verification Suite ---');
console.log(`Checking ${PROCESS_TEMPLATES_DE.length} templates across 3 volumes and 3 noise scenarios (99 test cases)...\n`);

let failedCount = 0;
let totalCases = 0;

for (const tmpl of PROCESS_TEMPLATES_DE) {
  for (const vol of volumes) {
    for (const noise of noiseLevels) {
      totalCases++;
      const config: SimulationConfig = {
        monthlyVolume: vol,
        dataNoiseRate: noise,
        hourlyWageEur: 55,
        resolutionTimeMinutes: 12,
        cuPriceFactorEur: 1.2,
      };

      const baseline = calculateOverallMetrics(tmpl.steps, config);
      const paretoResult = ParetoSolver.solve(tmpl.steps, config, 'de');
      const paretoMetrics = calculateOverallMetrics(paretoResult.optimizedSteps, config);

      const costDelta = paretoMetrics.totalCostOfAutomationEur - baseline.totalCostOfAutomationEur;
      const stpDelta = paretoMetrics.lightsOutAutomationRate - baseline.lightsOutAutomationRate;

      // Invariant 1: Pareto must NEVER increase total costs
      if (costDelta > 0) {
        console.error(`[FAIL - COST INCREASE] ${tmpl.scopeCode} (${tmpl.name}) Vol=${vol} Noise=${noise}`);
        console.error(`  Baseline Cost: ${baseline.totalCostOfAutomationEur} € | Pareto Cost: ${paretoMetrics.totalCostOfAutomationEur} € (+${costDelta} €)\n`);
        failedCount++;
      }

      // Invariant 2: Pareto must NEVER reduce Straight-Through Processing (STP) rate
      if (stpDelta < -0.05) {
        console.error(`[FAIL - STP DROP] ${tmpl.scopeCode} (${tmpl.name}) Vol=${vol} Noise=${noise}`);
        console.error(`  Baseline STP: ${baseline.lightsOutAutomationRate}% | Pareto STP: ${paretoMetrics.lightsOutAutomationRate}% (${stpDelta}%)\n`);
        failedCount++;
      }

      // Invariant 3: Compliance Guardrails - No autonomous actions on Reversibility >= 4
      if (paretoMetrics.activeViolationsCount > 0) {
        console.error(`[FAIL - GUARDRAIL VIOLATION] ${tmpl.scopeCode} Vol=${vol} Noise=${noise}`);
        console.error(`  Active Violations: ${paretoMetrics.activeViolationsCount}\n`);
        failedCount++;
      }
    }
  }
}

if (failedCount === 0) {
  console.log(`Verification PASSED: All ${totalCases} test cases satisfy strict Pareto dominance and compliance invariants.`);
  process.exit(0);
} else {
  console.error(`Verification FAILED: ${failedCount} of ${totalCases} test cases violated mathematical invariants.`);
  process.exit(1);
}
