/**
 * goldenPathAdvisor.ts
 * =====================
 * Offizielle Auswertungs- und Empfehlungs-Engine basierend auf der
 * SAP Architecture Center Spezifikation (AI Golden Path - Graph 1 bis 4).
 *
 * Referenz: SAP/architecture-center (docs/golden-path/ai-golden-path/1-technology-overview/readme.md)
 */

import { ProcessStep, AutomationArchetype, CognitivePrimitive, OODAPhase } from '@/types/process';

export interface GoldenPathRecommendation {
  recommendedArchetype: AutomationArchetype;
  recommendedTool: string;
  graphRef: string;
  qualityBenefit: string;
}

export interface GoldenPathAssessment {
  isCompliant: boolean;
  recommendedArchetype: AutomationArchetype;
  recommendedTool: string;
  graphRef: string;
  qualityBenefit: string;
  // Wenn abweichend:
  deviationTradeOff?: {
    purchasedBenefit: string; // Was erkauft man sich mit der Abweichung?
    architecturalCost: string; // Was zahlt man dafür (Latenz, Tokens, Blast Radius)?
    severity: 'info' | 'warning' | 'critical';
  };
}

/**
 * Ermittelt die kanonische SAP Golden Path Empfehlung für einen gegebenen Schritt.
 */
export function getGoldenPathRecommendation(
  primitive: CognitivePrimitive,
  phase: OODAPhase,
  isUnstructured: boolean,
  reversibility: number,
  language: 'de' | 'en' = 'de'
): GoldenPathRecommendation {
  const isEn = language === 'en';

  // 1. Executor / Actuator (Verbuchung im ERP, Transaktion, Ausführung) -> Immer Graph 1 Deterministisch
  if (primitive === 'Executor / Actuator' || (phase === 'Act' && reversibility >= 4)) {
    return {
      recommendedArchetype: 'deterministic',
      recommendedTool: 'SAP S/4HANA Clean Core RAP API / ACID Commit',
      graphRef: isEn ? 'Graph 1: Traditional Automation' : 'Graph 1: Traditionelle Automation',
      qualityBenefit: isEn
        ? '100% deterministic ACID commit. Zero hallucination risk, 0 token costs, full GoBD/SOX auditability.'
        : '100% deterministische ACID-Verbuchung. Kein Halluzinationsrisiko, 0 Token-Kosten, volle GoBD/SOX-Auditierbarkeit.',
    };
  }

  // 2. Filter / Gatekeeper (Triage, Plausibilität, Schwellwertprüfung) -> Graph 1 Deterministisch
  if (primitive === 'Filter / Gatekeeper') {
    return {
      recommendedArchetype: 'deterministic',
      recommendedTool: 'SAP Build Process Automation / BRFplus Rule Engine',
      graphRef: isEn ? 'Graph 1: Business Rules Engine' : 'Graph 1: Business Rules Engine',
      qualityBenefit: isEn
        ? 'Fast-path triage: Sub-50ms rule evaluation, 100% straight-through-processing (STP) without LLM latency.'
        : 'Fast-Path-Triage: Auswertung in <50ms, 100% Dunkelverarbeitung (STP) ohne LLM-Latenz und ohne Token-Kosten.',
    };
  }

  // 3. Matcher / Enricher (Stammdaten, Bonität, Zahlungsverzug) -> Graph 2.a (sap-rpt-1 für Tabellen)
  if (primitive === 'Matcher / Enricher') {
    if (!isUnstructured) {
      return {
        recommendedArchetype: 'classic_ml',
        recommendedTool: 'sap-rpt-1 (Relational Foundation Model)',
        graphRef: isEn ? 'Graph 2.a: Relational Foundation Model' : 'Graph 2.a: Relationales Foundation Model',
        qualityBenefit: isEn
          ? 'In-context learning over tabular ERP data. High predictive accuracy for default/churn without custom model training.'
          : 'In-Context-Learning über relationale ERP-Daten. Hohe Prognosegenauigkeit bei Zahlungsverzug/Scoring ohne teures Modelltraining.',
      };
    } else {
      return {
        recommendedArchetype: 'classic_ml',
        recommendedTool: 'SAP HANA Cloud Vector Engine + GenAI Grounding',
        graphRef: isEn ? 'Graph 2.a & RAG: Vector Search' : 'Graph 2.a & RAG: Vektorsuche',
        qualityBenefit: isEn
          ? 'Semantic embedding search over unstructured catalog data with low latency.'
          : 'Semantische Ähnlichkeitssuche über unstrukturierte Katalog- und Positionsdaten bei minimaler Latenz.',
      };
    }
  }

  // 4. Extractor / Transformer (Beleg- und Dokumentenextraktion) -> Graph 2.b & 3 (Embedded Document AI)
  if (primitive === 'Extractor / Transformer') {
    return {
      recommendedArchetype: 'classic_ml',
      recommendedTool: 'SAP Document AI (Embedded Extraction)',
      graphRef: isEn ? 'Graph 2.b & 3: Low Agency (Embedded AI)' : 'Graph 2.b & 3: Low Agency (Embedded AI)',
      qualityBenefit: isEn
        ? 'Single-turn schema-validated extraction from PDFs and invoices directly into S/4HANA document structures.'
        : 'Schema-validierte Einzelschritt-Extraktion aus PDFs und Rechnungen direkt in strukturierte S/4HANA-Belege.',
    };
  }

  // 5. Generator / Synthesizer (Avis, Belegdruck, Ausgaben) -> Graph 3 (Embedded Output / Joule Skill)
  if (primitive === 'Generator / Synthesizer') {
    return {
      recommendedArchetype: 'copilot',
      recommendedTool: 'SAP BTP Output Management + Joule Assistant',
      graphRef: isEn ? 'Graph 3: Low Agency Output Service' : 'Graph 3: Low Agency Ausgabenservice',
      qualityBenefit: isEn
        ? 'Controlled template generation with conversational review option before dispatch.'
        : 'Kontrollierte Beleggenerierung mit optionaler manueller Vorschau im Fiori Launchpad vor dem Versand.',
    };
  }

  // 6. Evaluator / Reasoner (Ausnahmebehandlung, Diskrepanzklärung, Entscheidungen)
  if (primitive === 'Evaluator / Reasoner') {
    if (reversibility >= 4) {
      // Kritische Entscheidung mit hohem Schaden -> Copilot (Human-in-the-Loop)
      return {
        recommendedArchetype: 'copilot',
        recommendedTool: 'SAP Joule Skill (Human-in-the-Loop Sign-off)',
        graphRef: isEn ? 'Graph 2.b: Conversational HITL Gate' : 'Graph 2.b: Conversational HITL Gate',
        qualityBenefit: isEn
          ? 'Governance guarantee: Critical fiscal/legal decisions require explicit human approval via Joule modal.'
          : 'Governance-Garantie: Rechts- und finanzkritische Entscheidungen erfordern zwingende Freigabe durch den Sachbearbeiter.',
      };
    } else {
      // Standard-Ausnahme mit geringem Risiko -> Process Agent (Joule Studio)
      return {
        recommendedArchetype: 'agentic',
        recommendedTool: 'Joule Studio Process Agent + MCP Knowledge Graph',
        graphRef: isEn ? 'Graph 4: Autonomous Process Agent' : 'Graph 4: Autonomer Process Agent',
        qualityBenefit: isEn
          ? 'Multi-step autonomous resolution: Queries SAP Knowledge Graph via MCP to resolve discrepancies autonomously within guardrails.'
          : 'Mehrstufige autonome Bereinigung: Befragt den SAP Knowledge Graph via MCP, um Diskrepanzen innerhalb von Schutzplanken autonom zu lösen.',
      };
    }
  }

  // Fallback
  return {
    recommendedArchetype: 'deterministic',
    recommendedTool: 'SAP Build Process Automation',
    graphRef: isEn ? 'Graph 1: Deterministic Standard' : 'Graph 1: Deterministischer Standard',
    qualityBenefit: isEn
      ? 'Standard automated business flow conforming to Clean Core.'
      : 'Standardisierter Verbuchungsablauf konform zum Clean Core.',
  };
}

/**
 * Bewertet einen bestehenden Schritt und prüft auf Golden-Path-Konformität und Trade-Offs.
 */
export function evaluateGoldenPath(step: ProcessStep, language: 'de' | 'en' = 'de'): GoldenPathAssessment {
  const isEn = language === 'en';
  const rec = getGoldenPathRecommendation(
    step.primitive,
    step.oodaPhase,
    step.isUnstructuredInput,
    step.reversibility,
    language
  );

  const isCompliant = step.currentArchetype === rec.recommendedArchetype;

  if (isCompliant) {
    return {
      isCompliant: true,
      recommendedArchetype: rec.recommendedArchetype,
      recommendedTool: rec.recommendedTool,
      graphRef: rec.graphRef,
      qualityBenefit: rec.qualityBenefit,
    };
  }

  // Abweichungsanalyse (Trade-Off): Welcher Vorteil wird erkauft, welcher Preis wird bezahlt?
  let purchasedBenefit = '';
  let architecturalCost = '';
  let severity: 'info' | 'warning' | 'critical' = 'warning';

  if (rec.recommendedArchetype === 'deterministic' && (step.currentArchetype === 'copilot' || step.currentArchetype === 'agentic')) {
    purchasedBenefit = isEn
      ? 'Maximum tolerance for unformatted text and intuitive human-like conversation.'
      : 'Erhöhte Toleranz für unformatierte Freitexte und menschlich-intuitive Dialogführung.';
    architecturalCost = isEn
      ? 'Heavy latency (+1,200ms) and token overhead for logic that BRFplus could evaluate in 20ms at zero cost.'
      : 'Signifikanter Latenzzuschlag (+1.200 ms) und Token-Verbrauch für Regeln, die BRFplus in 20 ms kostenlos verarbeitet.';
    severity = step.reversibility >= 4 ? 'critical' : 'warning';
  } else if (rec.recommendedArchetype === 'classic_ml' && step.currentArchetype === 'copilot') {
    purchasedBenefit = isEn
      ? 'Manual user reassurance before applying statistical or predictive values.'
      : 'Manuelle Rückversicherung durch Sachbearbeiter vor Übernahme statistischer Vorhersagewerte.';
    architecturalCost = isEn
      ? 'Destroys straight-through processing (STP) and creates an unnecessary user wait state.'
      : 'Zerstört die Dunkelverarbeitungsquote (STP) und erzeugt unnötigen Warteaufwand beim Sachbearbeiter.';
    severity = 'info';
  } else if (rec.recommendedArchetype === 'agentic' && step.currentArchetype === 'deterministic') {
    purchasedBenefit = isEn
      ? '100% predictable execution and zero token costs.'
      : '100% berechenbare Ausführung, absolute Revisionssicherheit und 0 Token-Kosten.';
    architecturalCost = isEn
      ? 'Rigid behavior: Any non-standard edge case will cause an unhandled process failure.'
      : 'Geringe Flexibilität: Unerwartete Sonderfälle oder Schreibweisen führen zum Abbruch statt autonomer Auflösung.';
    severity = 'info';
  } else if (rec.recommendedArchetype === 'copilot' && step.currentArchetype === 'agentic') {
    purchasedBenefit = isEn
      ? '100% dark processing (STP) without human intervention.'
      : 'Vollständige Dunkelverarbeitung ohne personellen Freigabeaufwand.';
    architecturalCost = isEn
      ? 'Elevated blast radius! Critical business or fiscal transactions execute without human confirmation.'
      : 'Erhöhter Blast Radius! Finanz- oder rechtsrelevante Belege werden ohne menschliches 4-Augen-Prinzip gebucht.';
    severity = 'critical';
  } else {
    purchasedBenefit = isEn
      ? 'Tailored operational flexibility for this specific custom environment.'
      : 'Individuelle Prozessanpassung für spezifische Kundenanforderungen.';
    architecturalCost = isEn
      ? 'Sub-optimal alignment with SAP reference architectures.'
      : 'Suboptimale Ausrichtung an den SAP-Referenzmustern.';
    severity = 'info';
  }

  return {
    isCompliant: false,
    recommendedArchetype: rec.recommendedArchetype,
    recommendedTool: rec.recommendedTool,
    graphRef: rec.graphRef,
    qualityBenefit: rec.qualityBenefit,
    deviationTradeOff: {
      purchasedBenefit,
      architecturalCost,
      severity,
    },
  };
}

/**
 * Berechnet den aggregierten Golden Path Alignment Score für den Gesamtprozess.
 */
export function calculateWorkflowGoldenPathScore(steps: ProcessStep[]): {
  score: number;
  compliantCount: number;
  totalCount: number;
  deviatingSteps: { stepId: string; name: string; assessment: GoldenPathAssessment }[];
} {
  if (!steps || steps.length === 0) {
    return { score: 100, compliantCount: 0, totalCount: 0, deviatingSteps: [] };
  }

  let compliantCount = 0;
  const deviatingSteps: { stepId: string; name: string; assessment: GoldenPathAssessment }[] = [];

  for (const step of steps) {
    const assessment = evaluateGoldenPath(step);
    if (assessment.isCompliant) {
      compliantCount++;
    } else {
      deviatingSteps.push({
        stepId: step.id,
        name: step.name,
        assessment,
      });
    }
  }

  const score = Math.round((compliantCount / steps.length) * 100);

  return {
    score,
    compliantCount,
    totalCount: steps.length,
    deviatingSteps,
  };
}
