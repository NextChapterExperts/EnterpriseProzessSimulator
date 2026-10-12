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

      // 1. Primitive & Input Aware Assignment
      if (step.isUnstructuredInput) {
        // Unstrukturierter Input: Benötigt SAP Document AI / Classic ML
        // Deterministisch bricht hier bei Freitext mit hohem Klärungsaufwand ab.
        if (step.primitive === 'Filter / Gatekeeper') {
          targetArchetype = 'classic_ml';
          targetConfidence = 92;
          reason = isEn
            ? 'SAP Document AI / Text Classifier: Automated unstructured triage & classification (reduces clerk triage time)'
            : 'SAP Document AI / Textklassifikator: Automatisierte Vorfilterung unstrukturierter Meldungen';
        } else if (step.primitive === 'Extractor / Transformer') {
          targetArchetype = 'classic_ml';
          targetConfidence = 95;
          reason = isEn
            ? 'Assistant (SAP Document AI background extraction): Automated straight-through extraction without manual typing'
            : 'Assistant (SAP Document AI im Hintergrund): Automatisierte Belegextraktion ohne manuelles Abtippen';
        } else if (step.primitive === 'Evaluator / Reasoner') {
          targetArchetype = 'classic_ml';
          targetConfidence = 92;
          reason = isEn
            ? 'Assistant (SAP Business AI / Automated Invoice & Claim Match): Discrepancy resolution with confidence gate'
            : 'Assistant (SAP Business AI Rechnungs- & Reklamationsprüfung): Fehlertolerante Vorprüfung mit Konfidenzgatter';
        } else {
          targetArchetype = 'classic_ml';
          targetConfidence = 92;
          reason = isEn
            ? 'Assistant (SAP Business AI): Unstructured data processing'
            : 'Assistant (SAP Business AI): Verarbeitung unstrukturierter Daten';
        }
      } else {
        // Strukturierter Input:
        // In SAP S/4HANA Clean Core bleibt strukturierte Verarbeitung standardmäßig DETERMINISTISCH!
        if (step.primitive === 'Matcher / Enricher') {
          // Fehlertoleranter Stammdatenabgleich gegen KNA1/MARA/KNMT via HANA Trigram/Fuzzy Engine
          targetArchetype = 'classic_ml';
          targetConfidence = 95;
          reason = isEn
            ? 'SAP HANA Trigram & Fuzzy Search: Sub-millisecond master data reconciliation (0 CU inference, zero hallucination risk)'
            : 'SAP HANA Trigram & Fuzzy Search: Fehlertoleranter Stammdaten-Abgleich im Millisekundenbereich (0 CU Inferenz, Null Halluzinationsrisiko)';
        } else if (step.primitive === 'Filter / Gatekeeper') {
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'Deterministic triage filter (Event Mesh / Header Regex): 100% straight-through processing (STP), 0 tokens'
            : 'Deterministischer Triage-Filter (Event Mesh / Header-Regex): 100% Dunkelverarbeitung (STP), 0 Tokens';
        } else if (step.primitive === 'Evaluator / Reasoner') {
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'SAP BRFplus Decision Tables: 100% audit-proof deterministic business rules execution (0 CU inference)'
            : 'SAP BRFplus Decision Tables: 100% rechtssichere, deterministische Regelausführung (0 CU Inferenz)';
        } else if (step.primitive === 'Executor / Actuator') {
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          targetCleanCore = 'COMPLIANT';
          reason = isEn
            ? 'S/4HANA Clean Core RAP / OData: Fully automated straight-through posting compliant with Clean Core & GoBD/SOX standards'
            : 'S/4HANA Clean Core RAP / OData: Vollautomatische Dunkelverbuchung nach Clean-Core- & GoBD/SOX-Standards';
        } else if (step.primitive === 'Generator / Synthesizer') {
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'SAP BTP Output Management: Deterministic spool & document generation'
            : 'SAP BTP Output Management: Deterministische Beleg- und Spoolgenerierung';
        } else {
          // Extractor / Transformer auf strukturierten Daten (z.B. Stücklistenauflösung, Barcode-Scan)
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'Deterministic structured transformation (ABAP CDS / BAPI table mapping)'
            : 'Deterministische Strukturtransformation (ABAP CDS / BAPI Tabellenmapping)';
        }
      }

      // 2. STRIKTE SCHUTZPLANKEN (Guardrails):
      // Reversibilität >= 4 (Blast Radius) darf NIEMALS Autopilot/Agentic sein!
      if (step.reversibility >= 4) {
        const unsafeArchetypes: AutomationArchetype[] = ['autopilot', 'agentic'];
        if (unsafeArchetypes.includes(targetArchetype)) {
          targetArchetype = 'deterministic';
          targetConfidence = 99;
          reason = isEn
            ? 'Compliance guardrail: High blast radius (Reversibility >= 4) requires deterministic execution or human approval'
            : 'Schutzplanke: Hoher Blast Radius (Reversibilität >= 4) erfordert deterministische Verbuchung';
        }
      }

      // 3. MATHEMATISCHE PARETO-KONTROLLE (Step-Level Guard):
      // Teste, ob die vorgeschlagene Änderung tatsächlich die Kosten senkt oder gleichhält!
      const candidateStep: ProcessStep = {
        ...step,
        currentArchetype: targetArchetype,
        confidenceGate: targetConfidence,
        cleanCoreIndex: targetCleanCore,
      };

      const costOriginal = calculateOverallMetrics([step], config).totalCostOfAutomationEur;
      const costCandidate = calculateOverallMetrics([candidateStep], config).totalCostOfAutomationEur;

      let finalStep = candidateStep;
      let finalReason = reason;

      if (costCandidate <= costOriginal) {
        finalStep = candidateStep;
      } else {
        // Falls Kandidat teurer wäre, prüfe ob deterministische Optimierung mit maximalem Gate greift:
        const tunedDeterministic: ProcessStep = {
          ...step,
          confidenceGate: Math.max(step.confidenceGate, 99),
          cleanCoreIndex: targetCleanCore,
        };
        const costTuned = calculateOverallMetrics([tunedDeterministic], config).totalCostOfAutomationEur;
        if (costTuned <= costOriginal) {
          finalStep = tunedDeterministic;
          finalReason = isEn
            ? 'Optimized deterministic parameter gate'
            : 'Optimiertes deterministisches Konfidenzgatter';
        } else {
          finalStep = step;
          finalReason = isEn ? 'Baseline retained (already optimal)' : 'Baseline beibehalten (bereits optimal)';
        }
      }

      if (
        finalStep.currentArchetype !== step.currentArchetype ||
        finalStep.confidenceGate !== step.confidenceGate ||
        finalStep.cleanCoreIndex !== step.cleanCoreIndex
      ) {
        changesSummary.push({
          stepId: step.id,
          stepName: step.name,
          oldArchetype: step.currentArchetype,
          newArchetype: finalStep.currentArchetype,
          oldConfidence: step.confidenceGate,
          newConfidence: finalStep.confidenceGate,
          reason: finalReason,
        });
      }

      return finalStep;
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
