import { ProcessStep, SimulationConfig, AutomationArchetype, CleanCoreIndex, SapAgentMatchResult } from '@/types/process';
import { calculateOverallMetrics } from './tcaCalculator';
import { Language } from '@/i18n/translations';
import { matchAllStepsToSapAgents } from './sapAiCatalogMatcher';

export interface ParetoOptimizationResult {
  optimizedSteps: ProcessStep[];
  previousTcaEur: number;
  optimizedTcaEur: number;
  savingsEur: number;
  savingsPercentage: number;
  changesSummary: Array<{
    stepId: string;
    stepName: string;
    oldArchetype: AutomationArchetype;
    newArchetype: AutomationArchetype;
    oldConfidence: number;
    newConfidence: number;
    reason: string;
  }>;
  sapAgentMatches?: SapAgentMatchResult[];
  totalMonthlyAiu?: number;
  totalMonthlyAiuCostEur?: number;
  gapCount?: number;
  standardAgentCount?: number;
}

export class ParetoSolver {
  /**
   * Berechnet die Pareto-optimale Konfiguration für die Prozesskette
   * basierend auf den 4 OODA-Phasen und den 6 kognitiven Primitives:
   * 1. Filter / Gatekeeper -> Deterministisch (Fast-Path, 0 Tokens, 100% STP)
   * 2. Extractor / Transformer -> Assistant (Klassisches ML / SAP DOX Dunkelverarbeitung)
   * 3. Matcher / Enricher -> Assistant (SAP HANA Trigram & Fuzzy Search, 0 Halluzination)
   * 4. Evaluator / Reasoner -> Deterministisch (SAP BRFplus Decision Tables, audit-proof)
   * 5. Executor / Actuator -> Deterministisch (S/4HANA Clean Core RAP / OData BAPI)
   * 6. Generator / Synthesizer -> Assistant (SAP BTP Output Management im Hintergrund)
   */
  public static solve(
    steps: ProcessStep[],
    config: SimulationConfig,
    lang: Language = 'de'
  ): ParetoOptimizationResult {
    const isEn = lang === 'en';
    const beforeMetrics = calculateOverallMetrics(steps, config);
    const changesSummary: ParetoOptimizationResult['changesSummary'] = [];

    const optimizedSteps: ProcessStep[] = steps.map((step) => {
      let targetArchetype: AutomationArchetype = step.currentArchetype;
      let targetConfidence = step.confidenceGate;
      let targetCleanCore: CleanCoreIndex = step.cleanCoreIndex;
      let reason = isEn ? 'Already at optimum' : 'Bereits im Optimum';

      switch (step.primitive) {
        case 'Filter / Gatekeeper':
          // 1. Observe: Vorfilter / Filter / Gatekeeper
          // Deterministischer Fast-Path (Event Mesh, Header-Regex, MIME/Sender-Filter)
          // 0 Tokens, 0 CU Inferenz, 100% Dunkelverarbeitung (STP)
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'Deterministic triage filter (Event Mesh / Regex / Header): 100% straight-through processing (STP), 0 tokens, 0 inference cost'
            : 'Deterministischer Triage-Filter (Event Mesh / Regex / Header): 100% Dunkelverarbeitung (STP), 0 Tokens, 0 Inferenzkosten';
          break;

        case 'Extractor / Transformer':
          // 2. Observe: Extractor / Transformer
          // Assistant (SAP DOX / Klassisches ML / LLM JSON-Mode im Hintergrund)
          // Dunkelverarbeitung ohne manuelles Abtippen, 100% STP
          targetArchetype = 'classic_ml';
          targetConfidence = 92;
          reason = isEn
            ? 'Assistant (SAP DOX / Classic ML background extraction): Automated straight-through extraction without manual typing (100% STP)'
            : 'Assistant (SAP DOX / Klassisches ML im Hintergrund): Automatisierte Dunkelverarbeitung ohne manuelles Abtippen (100% STP)';
          break;

        case 'Matcher / Enricher':
          // 3. Orient: Matcher / Enricher
          // SAP HANA Trigram & Fuzzy Search gegen KNA1/MARA/KNMT
          // < 70ms Latenz, 0 CU Inferenz, Null Halluzinationsrisiko
          targetArchetype = 'classic_ml';
          targetConfidence = 95;
          reason = isEn
            ? 'SAP HANA Trigram & Fuzzy Search: Sub-millisecond master data reconciliation (0 CU inference, zero hallucination risk)'
            : 'SAP HANA Trigram & Fuzzy Search: Fehlertoleranter Stammdaten-Abgleich im Millisekundenbereich (0 CU Inferenz, Null Halluzinationsrisiko)';
          break;

        case 'Evaluator / Reasoner':
          // 4. Decide: Evaluator / Reasoner
          // SAP BRFplus / Decision Tables / Credit Management
          // 100% rechtssichere, deterministische Regelausführung, 0 CU Inferenz
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'SAP BRFplus Decision Tables: 100% audit-proof deterministic business rules execution (0 CU inference, zero hallucination)'
            : 'SAP BRFplus Decision Tables: 100% rechtssichere, deterministische Regelausführung (0 CU Inferenz, Null Halluzinationsrisiko)';
          break;

        case 'Executor / Actuator':
          // 5. Act: Executor / Actuator
          // S/4HANA Clean Core RAP / OData / BAPI Verbuchung
          // Atomare Verbuchung nach GoBD/SOX, Clean-Core compliant
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          targetCleanCore = 'COMPLIANT';
          reason = isEn
            ? 'S/4HANA Clean Core RAP / OData: Fully automated straight-through posting compliant with Clean Core & GoBD/SOX standards'
            : 'S/4HANA Clean Core RAP / OData: Vollautomatische Dunkelverbuchung nach Clean-Core- & GoBD/SOX-Standards';
          break;

        case 'Generator / Synthesizer':
          // 6. Act: Generator / Synthesizer
          // Assistant / SAP BTP Output Management
          // Automatisierte Beleg- und Benachrichtigungsgenerierung im Hintergrund ohne Sachbearbeiter-Blockade
          targetArchetype = 'classic_ml';
          targetConfidence = 92;
          reason = isEn
            ? 'Assistant (SAP BTP Output Management): Automated background document & notification generation (100% STP, no clerk halt)'
            : 'Assistant (SAP BTP Output Management): Automatisierte Beleg- und Benachrichtigungsgenerierung im Hintergrund (100% STP, kein Sachbearbeiter-Stopp)';
          break;

        default:
          // Fallback basierend auf OODA-Phase
          if (step.oodaPhase === 'Observe') {
            targetArchetype = 'deterministic';
            targetConfidence = 98;
            reason = isEn ? 'Deterministic input validation filter' : 'Deterministischer Eingangsvalidierungs-Filter';
          } else if (step.oodaPhase === 'Orient') {
            targetArchetype = 'classic_ml';
            targetConfidence = 94;
            reason = isEn ? 'SAP HANA Trigram & Fuzzy Search' : 'SAP HANA Trigram & Fuzzy Search';
          } else if (step.oodaPhase === 'Decide') {
            targetArchetype = 'deterministic';
            targetConfidence = 99;
            reason = isEn ? 'SAP BRFplus Decision Tables' : 'Deterministische BRFplus Entscheidungstabellen';
          } else {
            targetArchetype = 'deterministic';
            targetConfidence = 99;
            targetCleanCore = 'COMPLIANT';
            reason = isEn ? 'S/4HANA Clean Core posting' : 'S/4HANA Clean Core Verbuchung';
          }
          break;
      }

      if (
        targetArchetype !== step.currentArchetype ||
        targetConfidence !== step.confidenceGate ||
        targetCleanCore !== step.cleanCoreIndex
      ) {
        changesSummary.push({
          stepId: step.id,
          stepName: step.name,
          oldArchetype: step.currentArchetype,
          newArchetype: targetArchetype,
          oldConfidence: step.confidenceGate,
          newConfidence: targetConfidence,
          reason,
        });
      }

      return {
        ...step,
        currentArchetype: targetArchetype,
        confidenceGate: targetConfidence,
        cleanCoreIndex: targetCleanCore,
      };
    });

    const afterMetrics = calculateOverallMetrics(optimizedSteps, config);
    const savingsEur = Math.max(0, beforeMetrics.totalCostOfAutomationEur - afterMetrics.totalCostOfAutomationEur);
    const savingsPercentage = beforeMetrics.totalCostOfAutomationEur > 0
      ? Number(((savingsEur / beforeMetrics.totalCostOfAutomationEur) * 100).toFixed(1))
      : 0;

    // SAP Discovery Center AI Catalog Matching (Enterprise Edition)
    const agentMatching = matchAllStepsToSapAgents(optimizedSteps, config.monthlyVolume, lang);
    const stepsWithMatches = optimizedSteps.map((step) => {
      const match = agentMatching.matches.find((m) => m.stepId === step.id);
      return {
        ...step,
        sapAgentMatch: match,
      };
    });

    return {
      optimizedSteps: stepsWithMatches,
      previousTcaEur: beforeMetrics.totalCostOfAutomationEur,
      optimizedTcaEur: afterMetrics.totalCostOfAutomationEur,
      savingsEur,
      savingsPercentage,
      changesSummary,
      sapAgentMatches: agentMatching.matches,
      totalMonthlyAiu: agentMatching.totalMonthlyAiu,
      totalMonthlyAiuCostEur: agentMatching.totalMonthlyAiuCostEur,
      gapCount: agentMatching.gapCount,
      standardAgentCount: agentMatching.standardAgentCount,
    };
  }
}
