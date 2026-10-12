import {
  ProcessStep,
  SimulationConfig,
  StepCalculatedMetrics,
  OverallSimulationMetrics,
  AutomationArchetype,
} from '@/types/process';

export const CU_FACTORS: Record<AutomationArchetype, { cuPerTx: number; latencyMs: number; multiplierTokenIn: number; multiplierTokenOut: number }> = {
  deterministic: { cuPerTx: 0.0, latencyMs: 35, multiplierTokenIn: 0, multiplierTokenOut: 0 },
  classic_ml: { cuPerTx: 0.0005, latencyMs: 85, multiplierTokenIn: 0.2, multiplierTokenOut: 0.1 },
  copilot: { cuPerTx: 0.02, latencyMs: 650, multiplierTokenIn: 1.0, multiplierTokenOut: 1.0 },
  autopilot: { cuPerTx: 0.08, latencyMs: 1450, multiplierTokenIn: 1.8, multiplierTokenOut: 1.5 },
  agentic: { cuPerTx: 0.40, latencyMs: 3800, multiplierTokenIn: 4.5, multiplierTokenOut: 3.8 },
};

export function calculateStepMetrics(step: ProcessStep, config: SimulationConfig): StepCalculatedMetrics {
  const { monthlyVolume, dataNoiseRate, hourlyWageEur, resolutionTimeMinutes, cuPriceFactorEur } = config;
  const archetype = step.currentArchetype;
  const cuProfile = CU_FACTORS[archetype];

  // 1. SAP Capacity Units
  const capacityUnits = monthlyVolume * cuProfile.cuPerTx;
  const cuCostEur = capacityUnits * cuPriceFactorEur;

  // 2. Automationsgrad & Human Escalation
  let rawAutomationRate = (step.confidenceGate / 100);

  // Einfluss des Archetyps und des Inputs
  if (archetype === 'deterministic') {
    if (step.isUnstructuredInput) {
      // Unstrukturierter Freitext: Deterministischer Parser bricht fast immer ab!
      // Wenn es ein einfacher Filter ist, schafft Regex vielleicht 30-40%, aber echter Freitext scheitert.
      if (step.primitive === 'Filter / Gatekeeper') {
        rawAutomationRate = Math.max(0.10, 0.40 - dataNoiseRate * 0.30);
      } else {
        rawAutomationRate = Math.max(0.05, 0.18 - dataNoiseRate * 0.20);
      }
    } else {
      // Strukturierte Daten (BOM, BRFplus, ATP, BAPI): extrem robust
      const baseConf = (step.confidenceGate / 100);
      rawAutomationRate = Math.max(0.85, baseConf - dataNoiseRate * 0.05);
    }
  } else if (archetype === 'classic_ml') {
    // SAP Document AI / HANA Fuzzy Search
    const conf = step.confidenceGate / 100;
    rawAutomationRate = Math.max(0.60, conf - dataNoiseRate * 0.15);
  } else if (archetype === 'copilot') {
    // Mensch autorisiert immer aktiv mit (Teil-Klärung ca. 20% Zeit)
    const conf = step.confidenceGate / 100;
    rawAutomationRate = Math.max(0.50, conf - dataNoiseRate * 0.12);
  } else if (archetype === 'autopilot') {
    const conf = step.confidenceGate / 100;
    rawAutomationRate = Math.max(0.40, conf - dataNoiseRate * 0.22);
  } else if (archetype === 'agentic') {
    // Hohe Ambiguitätstoleranz, aber bei hohem Noise neigt es zu Loops
    rawAutomationRate = Math.max(0.45, 0.92 - dataNoiseRate * 0.30);
  }

  const effectiveAutomationRate = Math.min(0.999, Math.max(0.02, rawAutomationRate));
  const escalationRate = 1 - effectiveAutomationRate;

  // Zeitaufwand Mensch: bei Copilot kurze Freigabezeit auch bei Erfolg, bei Eskalation volle Klärzeit
  const minutesPerEscalation = resolutionTimeMinutes;
  const copilotReviewMinutes = archetype === 'copilot' ? 1.5 : 0;
  
  const humanHoursSpent =
    (monthlyVolume * escalationRate * (minutesPerEscalation / 60)) +
    (monthlyVolume * effectiveAutomationRate * (copilotReviewMinutes / 60));
  const humanResolutionCostEur = humanHoursSpent * hourlyWageEur;

  // 3. Risikokosten (Blast Radius)
  // Fehlerrate ist unentdeckter Fehler (Silent Failure) oder Fehlbuchung
  let undetectedErrorRate = 0;
  if (archetype === 'deterministic') {
    undetectedErrorRate = 0.0001; // Bei deterministischer Validierung fast null
  } else if (archetype === 'classic_ml') {
    // Kalibriert: Bei SAP DOX / HANA Fuzzy Search mit Confidence Gate (z.B. 92-95%)
    // fängt das Gate unsichere Fälle ab. Unentdeckte Fehler liegen im Promille-Bereich.
    const gateSafetyFactor = (100 - step.confidenceGate) / 100;
    undetectedErrorRate = (0.0005 + 0.005 * gateSafetyFactor) * (1 + dataNoiseRate);
  } else if (archetype === 'copilot') {
    undetectedErrorRate = 0.001; // Mensch fängt fast alles ab
  } else if (archetype === 'autopilot') {
    undetectedErrorRate = 0.015 * (1 + dataNoiseRate * 1.5);
  } else if (archetype === 'agentic') {
    undetectedErrorRate = 0.040 * (1 + dataNoiseRate * 2.0);
  }

  const reversibilityFactor = step.reversibility / 5;
  const riskCostEur = monthlyVolume * undetectedErrorRate * step.damageAmountEur * reversibilityFactor;

  // 4. Latenz
  const latencyMs = Math.round(step.baseLatencyMs * (cuProfile.latencyMs / 1000 + 0.2));

  // 5. Challenges & Schutzplanken-Prüfung
  const triggeredChallengeIds: string[] = [];
  let guardrailViolation = false;
  let guardrailMessage: string | undefined = undefined;
  let guardrailMessageEn: string | undefined = undefined;

  // Prüfungen
  if (step.isUnstructuredInput && archetype === 'deterministic' && step.primitive !== 'Filter / Gatekeeper') {
    triggeredChallengeIds.push('CH_01'); // Schema Divergence
  }
  if (step.oodaPhase === 'Orient' && (archetype === 'autopilot' || archetype === 'agentic')) {
    triggeredChallengeIds.push('CH_04'); // Halluzination bei Stammdaten
  }
  if (archetype === 'agentic') {
    triggeredChallengeIds.push('CH_07'); // Non-Deterministic Routing Loops
    triggeredChallengeIds.push('CH_12'); // Runaway Reasoning Tokens
    triggeredChallengeIds.push('CH_13'); // API Throttling & Thread Lock
  }
  if (step.reversibility >= 4) {
    if (archetype === 'autopilot' || archetype === 'agentic') {
      triggeredChallengeIds.push('CH_05'); // Flaky Tool Calls
      triggeredChallengeIds.push('CH_10'); // SOX / GoBD Break
      triggeredChallengeIds.push('CH_11'); // Privileged Escalation
      guardrailViolation = true;
      guardrailMessage = `SCHUTZPLANKEN-VERLETZUNG: Schritt hat Reversibilität ${step.reversibility} (Blast Radius). Autonome Verbuchung ohne Human-in-the-Loop oder deterministisches Gate verletzt GoBD/SOX Compliance!`;
      guardrailMessageEn = `GUARDRAIL VIOLATION: Step has Reversibility ${step.reversibility} (Blast Radius). Autonomous posting without Human-in-the-Loop or deterministic validation gate violates GoBD/SOX compliance!`;
    }
  }
  if (step.isUnstructuredInput && (archetype === 'autopilot' || archetype === 'agentic')) {
    triggeredChallengeIds.push('CH_08'); // Direct Prompt Injection
  }

  const totalCostEur = cuCostEur + humanResolutionCostEur + riskCostEur;

  return {
    stepId: step.id,
    archetype,
    capacityUnits,
    cuCostEur,
    humanResolutionCostEur,
    riskCostEur,
    totalCostEur,
    effectiveAutomationRate,
    latencyMs,
    triggeredChallengeIds,
    guardrailViolation,
    guardrailMessage,
    guardrailMessageEn,
  };
}

export function calculateOverallMetrics(steps: ProcessStep[], config: SimulationConfig): OverallSimulationMetrics {
  const stepMetrics = steps.map((s) => calculateStepMetrics(s, config));

  const totalCostOfAutomationEur = stepMetrics.reduce((acc, m) => acc + m.totalCostEur, 0);
  const sapCapacityUnits = stepMetrics.reduce((acc, m) => acc + m.capacityUnits, 0);
  const sapCuCostEur = stepMetrics.reduce((acc, m) => acc + m.cuCostEur, 0);
  const humanEscalationCostEur = stepMetrics.reduce((acc, m) => acc + m.humanResolutionCostEur, 0);
  const riskDamageCostEur = stepMetrics.reduce((acc, m) => acc + m.riskCostEur, 0);

  // E2E Latenz in Sekunden
  const totalLatencyMs = stepMetrics.reduce((acc, m) => acc + m.latencyMs, 0);
  const endToEndLatencySec = Number((totalLatencyMs / 1000).toFixed(2));

  // Lights-Out Automationsgrad: Wahrscheinlichkeit, dass Transaktion ALLE Schritte ohne Mensch durchläuft
  const lightsOutRateDecimal = stepMetrics.reduce((acc, m) => acc * m.effectiveAutomationRate, 1.0);
  const lightsOutAutomationRate = Number((lightsOutRateDecimal * 100).toFixed(1));

  // Clean Core Score (100% minus Abzüge für LEGACY und VIOLATION)
  let cleanCoreTotal = 0;
  steps.forEach((s) => {
    if (s.cleanCoreIndex === 'COMPLIANT') cleanCoreTotal += 100;
    else if (s.cleanCoreIndex === 'LEGACY') cleanCoreTotal += 60;
    else cleanCoreTotal += 10;
  });
  const cleanCoreScore = Math.round(cleanCoreTotal / (steps.length || 1));

  // Manuelle Baseline (Vollständig manuell bearbeiteter Prozess)
  // Annahme: Typischer SAP-Prozess benötigt insgesamt ~18 Minuten manuelle Sachbearbeiter-Arbeit
  const avgManualMinutesTotal = 18;
  const baselineManualCostEur = config.monthlyVolume * (avgManualMinutesTotal / 60) * config.hourlyWageEur;
  const monthlySavingsVsManualEur = Math.max(0, baselineManualCostEur - totalCostOfAutomationEur);

  const activeViolationsCount = stepMetrics.filter((m) => m.guardrailViolation).length;

  return {
    totalCostOfAutomationEur: Math.round(totalCostOfAutomationEur),
    sapCapacityUnits: Math.round(sapCapacityUnits),
    sapCuCostEur: Math.round(sapCuCostEur),
    humanEscalationCostEur: Math.round(humanEscalationCostEur),
    riskDamageCostEur: Math.round(riskDamageCostEur),
    endToEndLatencySec,
    lightsOutAutomationRate,
    cleanCoreScore,
    monthlySavingsVsManualEur: Math.round(monthlySavingsVsManualEur),
    baselineManualCostEur: Math.round(baselineManualCostEur),
    activeViolationsCount,
  };
}
