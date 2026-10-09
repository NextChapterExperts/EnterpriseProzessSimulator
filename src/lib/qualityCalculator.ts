import {
  ProcessStep,
  SimulationConfig,
  AutomationArchetype,
} from '@/types/process';
import { calculateStepMetrics, CU_FACTORS } from './tcaCalculator';
import type { Language } from '@/i18n/translations';

export interface StepQualityMetrics {
  semanticRecognitionRate: number; // in % (z. B. 98.4)
  hallucinationRisk: number; // in % (z. B. 0.8)
  groundingScore: number; // in % (z. B. 95.0)
  firstPassYield: number; // in % (z. B. 92.5)
  verdict: string;
  verdictEn: string;
  explanation: string;
  explanationEn: string;
  whyRecognitionDe: string;
  whyRecognitionEn: string;
  whyHallucinationDe: string;
  whyHallucinationEn: string;
  whyFpyDe: string;
  whyFpyEn: string;
  whyGroundingDe: string;
  whyGroundingEn: string;
}

export interface ArchetypeComparisonItem {
  archetype: AutomationArchetype;
  name: string;
  nameEn: string;
  recognitionRate: number;
  hallucinationRisk: number;
  stpRate: number;
  latencyMs: number;
  costPerTx: number;
  monthlyCostEur: number;
  verdict: string;
  verdictEn: string;
  badge: 'sweetspot' | 'solid' | 'risk' | 'anti_pattern';
  isSelected: boolean;
}

/**
 * Berechnet detaillierte Qualitätskriterien für einen Einzelschritt basierend auf Eingangsdaten,
 * Entropie, Rauschen und dem gewählten Archetyp.
 */
export function calculateStepQualityMetrics(
  step: ProcessStep,
  config: SimulationConfig,
  archetypeOverride?: AutomationArchetype
): StepQualityMetrics {
  const archetype = archetypeOverride || step.currentArchetype;
  const noise = config.dataNoiseRate;
  const isUnstructured = step.isUnstructuredInput;

  let recognition = 95.0;
  let hallucination = 0.8;
  let grounding = 90.0;
  let verdictDe = '';
  let verdictEn = '';
  let explanationDe = '';
  let explanationEn = '';

  if (archetype === 'deterministic') {
    if (step.primitive === 'Filter / Gatekeeper') {
      if (isUnstructured) {
        recognition = Math.max(15, Number((25 - noise * 22).toFixed(1)));
        hallucination = 0.01;
        grounding = 100;
        verdictDe = 'Starr bei Freitext: Scheitert an Sprachvarianz';
        verdictEn = 'Rigid on free text: Fails on linguistic variance';
        explanationDe =
          'Deterministische Regeln (Regex/Keywords) brechen bei unstrukturiertem Text drastisch ein, weil menschliche Umgangssprache eine kombinatorische Explosion darstellt. Bei Standard-Headern stabil, bei Freitext entstehen bis zu 80% manuelle Klärfälle.';
        explanationEn =
          'Deterministic rules (regex/keywords) collapse on unstructured text due to linguistic combinatorial explosion. While stable for standardized headers, free text leads to up to 80% manual clarification backlog.';
      } else {
        recognition = Math.max(88, Number((99.5 - noise * 8).toFixed(1)));
        hallucination = 0.01;
        grounding = 100;
        verdictDe = 'Optimal für standardisierte Header & EDI';
        verdictEn = 'Optimal for standardized headers & EDI';
        explanationDe =
          'Bei fest vorgegebenen Schemata (EDI, Event-Mesh-Header) arbeitet das Regelsystem fehlerfrei, in Echtzeit (<15 ms) und ohne Token-Kosten.';
        explanationEn =
          'For strictly predefined schemas (EDI, Event Mesh headers), the rule system operates flawlessly, in real time (<15 ms), and with zero token costs.';
      }
    } else if (isUnstructured) {
      recognition = Math.max(10, Number((20 - noise * 20).toFixed(1)));
      hallucination = 0.01;
      grounding = 95;
      verdictDe = 'Anti-Pattern bei unstrukturiertem Text';
      verdictEn = 'Anti-pattern for unstructured text';
      explanationDe =
        'Feste Tabellen- oder Regex-Parser können freie Kundenformulierungen („bitte wie letztes Mal“) nicht semantisch decodieren. Nahezu alle Belege erfordern manuelle Nacharbeit.';
      explanationEn =
        'Fixed table or regex parsers cannot semantically decode colloquial customer phrasing ("please like last time"). Almost all documents require manual rework.';
    } else {
      // Strukturierte Tabellen / BRFplus / ATP
      recognition = Math.max(90, Number((99.9 - noise * 5).toFixed(1)));
      hallucination = 0.01;
      grounding = 100;
      verdictDe = '100% präzise & GoBD-konform';
      verdictEn = '100% precise & GoBD compliant';
      explanationDe =
        'Auf relationalen SAP-Daten ist deterministische Logik unschlagbar: Null Halluzination, exakte BRFplus-Regelprüfung und 0 Capacity Units.';
      explanationEn =
        'On relational SAP data, deterministic logic is unbeatable: zero hallucination, exact BRFplus rule checks, and 0 Capacity Units.';
    }
  } else if (archetype === 'classic_ml') {
    recognition = Math.max(80, Number((98.4 - noise * 8).toFixed(1)));
    hallucination = Number((0.8 * (1 + noise * 0.8)).toFixed(2));
    grounding = 92.0;

    if (step.primitive === 'Filter / Gatekeeper' || isUnstructured) {
      verdictDe = '🏆 Optimaler Sweetspot für Triage & Freitext';
      verdictEn = '🏆 Optimal sweet spot for triage & free text';
      explanationDe =
        'Single-Turn LLMs projizieren Freitext in semantische Vektorräume. Sie verstehen Tippfehler, Slang und Synonyme mühelos. Das Rest-Halluzinationsrisiko von ~0,8% ist bei geringer Reversibilität vernachlässigbar.';
      explanationEn =
        'Single-turn LLMs project free text into semantic vector spaces. They handle typos, slang, and synonyms effortlessly. The residual ~0.8% hallucination risk is negligible given low reversibility.';
    } else {
      verdictDe = 'Solide Erkennung mit geringem Mehraufwand';
      verdictEn = 'Solid recognition with slight overhead';
      explanationDe =
        'Versteht semantische Nuancen zuverlässig, erzeugt aber im Vergleich zu deterministischen Tabellen kleine Inferenzkosten.';
      explanationEn =
        'Understands semantic nuances reliably, but incurs small inference fees compared to deterministic tables.';
    }
  } else if (archetype === 'autopilot') {
    recognition = Math.max(75, Number((96.0 - noise * 12).toFixed(1)));
    hallucination = Number((3.5 * (1 + noise * 1.5)).toFixed(2));
    grounding = 88.0;

    if (step.reversibility >= 4) {
      verdictDe = '🚨 Hohes Risiko: Unkontrollierte ERP-Mutation';
      verdictEn = '🚨 High risk: Uncontrolled ERP mutation';
      explanationDe =
        'Autonome Tool-Agents bergen ein Restrisiko von ~3,5% für Parameter-Drift und Fehlaufrufe. Bei schreibenden ERP-Buchungen (Reversibilität >= 4) drohen SOX- und Compliance-Verletzungen!';
      explanationEn =
        'Autonomous tool agents carry a ~3.5% residual risk of parameter drift and faulty calls. For writing ERP postings (reversibility >= 4), this poses serious SOX and compliance hazards!';
    } else {
      verdictDe = 'Autonome Pipeline mit Konfidenz-Gate';
      verdictEn = 'Autonomous pipeline with confidence gate';
      explanationDe =
        'Führt Belege mit hoher Konfidenz dunkel aus und hält nur bei Grenzwerten an. Höhere Inferenzkosten durch Tool-Aufrufe.';
      explanationEn =
        'Executes high-confidence documents straight-through and halts only at boundary thresholds. Higher inference cost due to tool calls.';
    }
  } else if (archetype === 'copilot') {
    recognition = 99.8; // Mensch prüft aktiv
    hallucination = 0.10; // Mensch fängt Fehler ab
    grounding = 98.0;

    if (step.reversibility <= 2 && step.primitive === 'Filter / Gatekeeper') {
      verdictDe = '⚠️ Anti-Pattern bei Eingangstriage (0% STP)';
      verdictEn = '⚠️ Anti-pattern for inbound triage (0% STP)';
      explanationDe =
        'Bei Reversibilität 1 richtet ein Fehler keinen Schaden an. Ein Copilot stoppt jedoch jeden Beleg für menschliche Freigabe (0% Dunkelverarbeitung) und blockiert wertvolle Arbeitszeit.';
      explanationEn =
        'At reversibility 1, an error causes no damage. However, a Copilot halts every single item for human review (0% STP) and ties up expensive staff hours.';
    } else if (step.reversibility >= 4) {
      verdictDe = '🏆 Zwingend erforderlich für SOX & Compliance';
      verdictEn = '🏆 Mandatory for SOX & compliance';
      explanationDe =
        'Bei irreversiblen Buchungen und hohem finanziellem Risiko schützt der Copilot das Unternehmen: Die KI bereitet die Daten vor, der Sachbearbeiter setzt die verbindliche Signatur (Vier-Augen-Prinzip).';
      explanationEn =
        'For irreversible postings and high financial risk, the Copilot protects the enterprise: AI prepares data, clerk applies the binding signature (four-eyes principle).';
    } else {
      verdictDe = 'Garantierte Qualität durch menschliche Freigabe';
      verdictEn = 'Guaranteed quality via human sign-off';
      explanationDe =
        'Bietet maximale Sicherheit, skaliert jedoch personell und führt zu Latenzzeiten von Minuten bis Stunden.';
      explanationEn =
        'Provides maximum safety, but scales with headcount and introduces latencies of minutes to hours.';
    }
  }

  // First-Pass-Yield: Belege, die ohne Nacharbeit und ohne Fehler gelingen
  const stepMetrics = calculateStepMetrics(
    { ...step, currentArchetype: archetype },
    config
  );
  const stpRate = stepMetrics.effectiveAutomationRate * 100;
  const firstPassYield = Number(
    Math.max(0, Math.min(99.9, stpRate * (1 - hallucination / 100))).toFixed(1)
  );

  // Begründungen für die 4 Metriken je nach Archetyp und Schritt-Eigenschaften
  const whyRecognitionDe = archetype === 'deterministic'
    ? isUnstructured
      ? `Deterministische Regex/Tabellen-Logik scheitert bei Freitext an unvorhergesehenen Formulierungen (${recognition}% Treffer). ${Math.round(config.dataNoiseRate * 100)}% Rauschanteil verschärfen die Trefferquote.`
      : `Strukturierte SAP-Belege folgen starren Schemata. Regex & Tabellen matchen standardisierte Felder nahezu perfekt (${recognition}%).`
    : archetype === 'classic_ml'
    ? `Single-Turn LLM (sap-rpt-1 / Document AI) nutzt semantische Vektorräume für Synonyme & Tippfehler. Erkennung liegt bei ${recognition}% (Rauschfaktor: ${Math.round(config.dataNoiseRate * 100)}%).`
    : archetype === 'autopilot'
    ? `Multi-Step Agent führt Tool-Aufrufe mit semantischer Extraktion durch (${recognition}% Erkennung). Bei komplexen Verkettungen besteht leichte Drift-Gefahr.`
    : `Human-in-the-Loop: Menschlicher Sachbearbeiter validiert und korrigiert die Erkennung aktiv im Vier-Augen-Prinzip (${recognition}%).`;

  const whyRecognitionEn = archetype === 'deterministic'
    ? isUnstructured
      ? `Deterministic regex/table logic fails on unstructured colloquial free text (${recognition}% match). ${Math.round(config.dataNoiseRate * 100)}% data noise further degrades matching.`
      : `Structured SAP documents follow rigid schemas. Regex and table parsers match standardized fields nearly perfectly (${recognition}%).`
    : archetype === 'classic_ml'
    ? `Single-turn LLM projects text into semantic vector embeddings for synonyms and typos. Semantic recognition achieves ${recognition}% (data noise: ${Math.round(config.dataNoiseRate * 100)}%).`
    : archetype === 'autopilot'
    ? `Autonomous agent performs tool calling with semantic extraction (${recognition}%). Multi-hop chaining introduces minor variance.`
    : `Human-in-the-Loop: Human clerk actively reviews and verifies extraction accuracy (${recognition}%).`;

  const whyHallucinationDe = archetype === 'deterministic'
    ? `Reine Programmcode-Ausführung (ABAP / BRFplus). Deterministische Systeme können prinzipbedingt keine Fakten erfinden (Halluzinationsrisiko = ${hallucination}%). Entweder eine Regel greift, oder der Beleg bricht ab.`
    : archetype === 'classic_ml'
    ? `Empirischer LLM-Benchmark: Temperatur = 0 und Pydantic Schema-Constraint begrenzen das Halluzinationsrisiko auf ca. ${hallucination}%. Rauschen im Beleg erhöht das Risiko leicht.`
    : archetype === 'autopilot'
    ? `Agentische Tool-Calling-Schleife: Bei mehrstufigen Entscheidungen und freien Werkzeugaufrufen steigt das Restrisiko für Parameter-Drift und Fehlinterpretationen auf ${hallucination}%.`
    : `Menschliches Kontroll-Gate (HITL): Der Sachbearbeiter prüft Belegdaten vor der Buchung gegen die Originalnachricht. Verbleibendes Fehlerrisiko durch menschliche Unaufmerksamkeit: nur ${hallucination}%.`;

  const whyHallucinationEn = archetype === 'deterministic'
    ? `Pure code execution (ABAP / BRFplus). Deterministic engines cannot invent facts by design (hallucination risk = ${hallucination}%). Rules either match or halt.`
    : archetype === 'classic_ml'
    ? `Empirical LLM benchmark: Temperature = 0 and schema constraints limit hallucination risk to ~${hallucination}%. Document noise slightly increases variance.`
    : archetype === 'autopilot'
    ? `Agentic tool calling loop: Multi-step reasoning and dynamic tool invocations increase hallucination/parameter drift risk to ${hallucination}%.`
    : `Human verification gate (HITL): Clerk cross-checks extracted values against source document before posting. Residual human fatigue risk: ${hallucination}%.`;

  const whyFpyDe = archetype === 'copilot'
    ? `First-Pass-Yield = ${firstPassYield}%, weil bei Copilot standardmäßig JEDER Beleg einem Menschen zur Freigabe vorgelegt wird (0% Dunkelverarbeitung / STP).`
    : `First-Pass-Yield kombiniert Dunkelverarbeitungsquote (${Math.round(stpRate)}%) und Halluzinationsfreiheit. ${firstPassYield}% aller Belege laufen im ersten Anlauf ohne menschlichen Eingriff und ohne Fehler durch.`;

  const whyFpyEn = archetype === 'copilot'
    ? `First-Pass-Yield = ${firstPassYield}% because Copilot mandates human approval for EVERY transaction (0% straight-through processing).`
    : `First-Pass-Yield combines STP rate (${Math.round(stpRate)}%) and zero-error probability. ${firstPassYield}% of documents clear on first pass without human rework.`;

  const whyGroundingDe = archetype === 'deterministic'
    ? `100% Stammdaten-Verankerung: Jede Prüfung referenziert direkt SAP-Tabellen (KNA1, MARA, VBAP) über Primärschlüssel. Keine losen Assoziationen.`
    : archetype === 'classic_ml'
    ? `${grounding}% Grounding: Die LLM-Extraktion wird per OData/RFC gegen SAP-Stammdaten validiert (z. B. Materialnummer, Kundennummer).`
    : archetype === 'autopilot'
    ? `${grounding}% Grounding: Agent liest SAP-Kataloge und BAPI-Metadaten dynamisch aus. Leichte Abweichung bei unklaren Kontexten möglich.`
    : `${grounding}% Grounding: Mensch prüft SAP-Stammdaten-Treffer in der ERP-Maske ab.`;

  const whyGroundingEn = archetype === 'deterministic'
    ? `100% Master data grounding: Every check directly queries SAP tables (KNA1, MARA, VBAP) via primary keys. Zero ungrounded speculation.`
    : archetype === 'classic_ml'
    ? `${grounding}% Grounding: LLM extractions are validated against SAP master data records via OData/RFC (e.g. material & customer IDs).`
    : archetype === 'autopilot'
    ? `${grounding}% Grounding: Agent queries SAP catalogs and BAPI schemas dynamically. Slight variance on ambiguous context.`
    : `${grounding}% Grounding: Human verifies matched SAP master data records directly in the ERP view.`;

  return {
    semanticRecognitionRate: recognition,
    hallucinationRisk: hallucination,
    groundingScore: grounding,
    firstPassYield,
    verdict: verdictDe,
    verdictEn,
    explanation: explanationDe,
    explanationEn,
    whyRecognitionDe,
    whyRecognitionEn,
    whyHallucinationDe,
    whyHallucinationEn,
    whyFpyDe,
    whyFpyEn,
    whyGroundingDe,
    whyGroundingEn,
  };
}

/**
 * Erstellt den direkten 4-Spalten-Vergleich für einen Schritt
 */
export function calculateStepArchetypeComparison(
  step: ProcessStep,
  config: SimulationConfig,
  language: Language
): ArchetypeComparisonItem[] {
  const archetypes: AutomationArchetype[] = [
    'deterministic',
    'classic_ml',
    'autopilot',
    'copilot',
  ];

  const names: Record<AutomationArchetype, { de: string; en: string }> = {
    deterministic: { de: '1. Deterministisch', en: '1. Deterministic' },
    classic_ml: { de: '2. Single-Turn ML', en: '2. Single-Turn ML' },
    autopilot: { de: '3. Autopilot (Agent)', en: '3. Autopilot (Agent)' },
    copilot: { de: '4. Copilot (Joule)', en: '4. Copilot (Joule)' },
    agentic: { de: '5. Agentic Swarm', en: '5. Agentic Swarm' },
  };

  return archetypes.map((arch) => {
    const quality = calculateStepQualityMetrics(step, config, arch);
    const metrics = calculateStepMetrics(
      { ...step, currentArchetype: arch },
      config
    );
    const cuProfile = CU_FACTORS[arch];
    const costPerTxEur = cuProfile.cuPerTx * config.cuPriceFactorEur;

    let badge: 'sweetspot' | 'solid' | 'risk' | 'anti_pattern' = 'solid';
    if (quality.verdict.includes('🏆') || quality.verdictEn.includes('🏆')) {
      badge = 'sweetspot';
    } else if (quality.verdict.includes('🚨') || quality.verdictEn.includes('🚨')) {
      badge = 'risk';
    } else if (quality.verdict.includes('Anti-Pattern') || quality.verdictEn.includes('Anti-pattern') || quality.verdict.includes('⚠️')) {
      badge = 'anti_pattern';
    }

    return {
      archetype: arch,
      name: names[arch].de,
      nameEn: names[arch].en,
      recognitionRate: quality.semanticRecognitionRate,
      hallucinationRisk: quality.hallucinationRisk,
      stpRate: Number((metrics.effectiveAutomationRate * 100).toFixed(1)),
      latencyMs: metrics.latencyMs,
      costPerTx: costPerTxEur,
      monthlyCostEur: Math.round(metrics.totalCostEur),
      verdict: quality.verdict,
      verdictEn: quality.verdictEn,
      badge,
      isSelected: step.currentArchetype === arch,
    };
  });
}
