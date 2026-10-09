import { AI_CORE_MODELS, AI_CORE_TEMPLATES, ORCHESTRATION_RATES, AiCoreModel, AiCoreTemplate } from './catalogData';

export type CognitivePrimitive =
  | 'Filter / Gatekeeper'
  | 'Extractor / Transformer'
  | 'Matcher / Enricher'
  | 'Evaluator / Reasoner'
  | 'Executor / Actuator'
  | 'Generator / Synthesizer';

export type AutomationArchetype =
  | 'deterministic'
  | 'classic_ml'
  | 'copilot'
  | 'autopilot'
  | 'agentic';

export interface RecommendationResult {
  primitive: CognitivePrimitive;
  archetype: AutomationArchetype;
  recommendedModel: {
    key: string | null;
    name: string;
    provider: string;
    inputTokensCostPer1kCu: number;
    outputTokensCostPer1kCu: number;
  };
  orchestration: {
    dataMasking: boolean;
    contentFilter: boolean;
    grounding: boolean;
    translation: boolean;
    observability: boolean;
  };
  matchingTemplate: {
    preset: string;
    title: string;
    approxMonthlyCu: number | null;
  };
  badge: 'OPTIMAL' | 'ACCEPTABLE' | 'OVERKILL' | 'RISKY' | 'DETERMINISTIC_SAFE';
  badgeLabel: string;
  summary: string;
  rationale: string;
  tradeOffs: {
    latency: 'low' | 'medium' | 'high';
    tokenHunger: 'none' | 'low' | 'medium' | 'high' | 'extreme';
    compliance: 'safe' | 'masked' | 'needs_review' | 'critical_unsupervised';
  };
}

export function recommendStepSetting(
  primitive: CognitivePrimitive,
  archetype: AutomationArchetype,
  lang: 'de' | 'en' = 'de'
): RecommendationResult {
  const isEn = lang === 'en';

  switch (primitive) {
    case 'Filter / Gatekeeper':
      if (archetype === 'deterministic') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: null, name: 'None (Event Mesh / Regex)', provider: 'SAP BTP', inputTokensCostPer1kCu: 0, outputTokensCostPer1kCu: 0 },
          orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
          matchingTemplate: { preset: 'baseline-fastpath', title: isEn ? 'Deterministic Fast-Path' : 'Deterministischer Fast-Path', approxMonthlyCu: 0 },
          badge: 'DETERMINISTIC_SAFE',
          badgeLabel: 'Optimal & 0 CU',
          summary: isEn ? '100% straight-through triage on headers & subject patterns.' : '100% Dunkelverarbeitung auf Header & Betreff-Regex.',
          rationale: isEn ? 'Zero token cost, sub-50ms latency.' : '0 Tokenkosten, < 50ms Latenz, keine Inferenzkosten.',
          tradeOffs: { latency: 'low', tokenHunger: 'none', compliance: 'safe' },
        };
      }
      if (archetype === 'classic_ml') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', provider: 'Google Vertex AI', inputTokensCostPer1kCu: 0.00039, outputTokensCostPer1kCu: 0.00278 },
          orchestration: { dataMasking: false, contentFilter: true, grounding: false, translation: false, observability: false },
          matchingTemplate: { preset: 'ai-small', title: 'Document Q&A', approxMonthlyCu: 8 },
          badge: 'OPTIMAL',
          badgeLabel: 'Smart SLM',
          summary: isEn ? 'Low-cost SLM classification for noisy inbound inquiries.' : 'Kostengünstige SLM-Klassifizierung für verrauschte Anfragen.',
          rationale: isEn ? 'Minimal token rate with high classification accuracy.' : 'Minimaler Tokenpreis bei hoher Klassifikationsgüte.',
          tradeOffs: { latency: 'low', tokenHunger: 'low', compliance: 'safe' },
        };
      }
      if (archetype === 'copilot') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'gpt-5.6-luna', name: 'GPT 5.6 Luna', provider: 'Azure OpenAI', inputTokensCostPer1kCu: 0.00015, outputTokensCostPer1kCu: 0.00082 },
          orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
          matchingTemplate: { preset: 'both-small', title: 'AI-Enhanced App', approxMonthlyCu: 45 },
          badge: 'OVERKILL',
          badgeLabel: 'HITL Bottleneck',
          summary: isEn ? 'Halts pipeline for clerk review at Step 1.' : 'Stoppt die Pipeline für manuelle Sichtung an der Eingangspforte.',
          rationale: isEn ? 'Avoid human review gates on triage unless in training mode.' : 'Menschliche Freigaben an der Pforte nur in der Pilotphase nutzen.',
          tradeOffs: { latency: 'high', tokenHunger: 'medium', compliance: 'needs_review' },
        };
      }
      return {
        primitive,
        archetype,
        recommendedModel: { key: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputTokensCostPer1kCu: 0.003, outputTokensCostPer1kCu: 0.015 },
        orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
        matchingTemplate: { preset: 'ai-large', title: 'Multi-Agent Platform', approxMonthlyCu: 2104 },
        badge: 'OVERKILL',
        badgeLabel: 'Cost Overkill',
        summary: isEn ? 'Multi-agent reasoning on triage is an architectural anti-pattern.' : 'Multi-Agenten-Reasoning an der Pforte ist ein Kosten-Overkill.',
        rationale: isEn ? '40x cost without business justification.' : '40-fache Kosten ohne betriebswirtschaftlichen Mehrwert.',
        tradeOffs: { latency: 'high', tokenHunger: 'extreme', compliance: 'needs_review' },
      };

    case 'Extractor / Transformer':
      if (archetype === 'classic_ml') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite / SAP DOX', provider: 'Google / SAP BTP', inputTokensCostPer1kCu: 0.00039, outputTokensCostPer1kCu: 0.00278 },
          orchestration: { dataMasking: true, contentFilter: false, grounding: false, translation: false, observability: false },
          matchingTemplate: { preset: 'ai-small', title: 'Document Q&A (Extraction)', approxMonthlyCu: 8 },
          badge: 'OPTIMAL',
          badgeLabel: 'Pareto-Optimum',
          summary: isEn ? 'Fast background structured JSON extraction with GDPR data masking.' : 'Strukturierte JSON-Extraktion im Hintergrund mit DSGVO Data-Masking.',
          rationale: isEn ? 'Extracts tables and key-values without human data entry.' : 'Extrahiert Tabellen und Pflichtfelder ohne manuelles Abtippen.',
          tradeOffs: { latency: 'low', tokenHunger: 'low', compliance: 'masked' },
        };
      }
      if (archetype === 'copilot') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'gpt-5.6-terra', name: 'GPT 5.6 Terra', provider: 'Azure OpenAI', inputTokensCostPer1kCu: 0.00141, outputTokensCostPer1kCu: 0.0081 },
          orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
          matchingTemplate: { preset: 'both-small', title: 'AI-Enhanced App (Joule Review)', approxMonthlyCu: 65 },
          badge: 'ACCEPTABLE',
          badgeLabel: 'HITL Review',
          summary: isEn ? 'Joule pre-populates fields, clerk confirms before posting.' : 'Joule befüllt Belegfelder vor; Sachbearbeiter prüft vor Verbuchung.',
          rationale: isEn ? 'Legitimate for bespoke complex documents.' : 'Legitim für komplexe Sonderbelege mit Vier-Augen-Prinzip.',
          tradeOffs: { latency: 'medium', tokenHunger: 'medium', compliance: 'safe' },
        };
      }
      if (archetype === 'agentic') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet + GPT-Nano', provider: 'Anthropic & OpenAI', inputTokensCostPer1kCu: 0.003, outputTokensCostPer1kCu: 0.015 },
          orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
          matchingTemplate: { preset: 'ai-large', title: 'Multi-Agent Platform (Self-Healing)', approxMonthlyCu: 2104 },
          badge: 'ACCEPTABLE',
          badgeLabel: 'Self-Healing Swarm',
          summary: isEn ? 'Self-heals corrupted order data via predecessor lookup.' : 'Rekonstruiert fehlende Belegpositionen autonom aus Voraufträgen.',
          rationale: isEn ? 'High token usage justifiable when avoiding manual clarification queues.' : 'Hoher Tokenbedarf lohnt sich zur Vermeidung manueller Klärfälle.',
          tradeOffs: { latency: 'high', tokenHunger: 'high', compliance: 'masked' },
        };
      }
      return {
        primitive,
        archetype,
        recommendedModel: { key: null, name: 'Deterministic Parser', provider: 'SAP S/4HANA', inputTokensCostPer1kCu: 0, outputTokensCostPer1kCu: 0 },
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplate: { preset: 'baseline-fastpath', title: 'Static Parser', approxMonthlyCu: 0 },
        badge: 'RISKY',
        badgeLabel: 'Brittle',
        summary: isEn ? 'Fails on free-form layout variances. Schema divergence risk.' : 'Bricht bei Layout-Variationen ab. Schemadivergenz-Risiko.',
        rationale: isEn ? 'Use Assistant instead for unstructured PDF inputs.' : 'Lieber Assistant (SLM) für unstrukturierte PDFs nutzen.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', compliance: 'safe' },
      };

    case 'Matcher / Enricher':
      if (archetype === 'classic_ml') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: null, name: 'SAP HANA Cloud Trigram & Fuzzy Search', provider: 'SAP HANA Cloud', inputTokensCostPer1kCu: 0, outputTokensCostPer1kCu: 0 },
          orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
          matchingTemplate: { preset: 'compute-small', title: 'In-Memory Search', approxMonthlyCu: 0 },
          badge: 'OPTIMAL',
          badgeLabel: 'Zero Hallucination',
          summary: isEn ? 'In-memory master data reconciliation (KNA1 / MARA) in milliseconds.' : 'In-Memory Stammdatenabgleich in SAP HANA in Millisekunden.',
          rationale: isEn ? '0 tokens, 0 hallucination risk.' : '0 Tokens, 0 Halluzinationsrisiko, extrem performant.',
          tradeOffs: { latency: 'low', tokenHunger: 'none', compliance: 'safe' },
        };
      }
      return {
        primitive,
        archetype,
        recommendedModel: { key: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Vector Grounding)', provider: 'Anthropic', inputTokensCostPer1kCu: 0.003, outputTokensCostPer1kCu: 0.015 },
        orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
        matchingTemplate: { preset: 'ai-medium', title: 'Autonomous Agent', approxMonthlyCu: 90 },
        badge: 'ACCEPTABLE',
        badgeLabel: 'Semantic RAG',
        summary: isEn ? 'Vector search across catalog notes when exact material IDs are missing.' : 'Vektorsuche bei ungenauen Kundenbeschreibungen ohne Artikelnummer.',
        rationale: isEn ? 'Helpful fallback when database trigrams fail.' : 'Sinnvoller Fallback bei ungenauen Freitext-Produktbezeichnungen.',
        tradeOffs: { latency: 'medium', tokenHunger: 'medium', compliance: 'needs_review' },
      };

    case 'Evaluator / Reasoner':
      if (archetype === 'deterministic') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: null, name: 'SAP BRFplus Decision Tables', provider: 'SAP Build Process Automation', inputTokensCostPer1kCu: 0, outputTokensCostPer1kCu: 0 },
          orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
          matchingTemplate: { preset: 'baseline-fastpath', title: 'BRFplus / DMN Rules', approxMonthlyCu: 0 },
          badge: 'DETERMINISTIC_SAFE',
          badgeLabel: 'GoBD Compliant',
          summary: isEn ? 'Audit-proof decisioning on credit limits and ATP availability.' : '100% rechtssichere Regelausführung für Kredit- und ATP-Prüfung.',
          rationale: isEn ? 'Compliance requires deterministic non-probabilistic rule execution.' : 'Wirtschaftsprüfung verlangt deterministische Regelausführung ohne Zufall.',
          tradeOffs: { latency: 'low', tokenHunger: 'none', compliance: 'safe' },
        };
      }
      return {
        primitive,
        archetype,
        recommendedModel: { key: 'gpt-5.4', name: 'GPT-5.4 (Autonomous Decision)', provider: 'Azure OpenAI', inputTokensCostPer1kCu: 0.002, outputTokensCostPer1kCu: 0.01 },
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplate: { preset: 'ai-medium', title: 'Autonomous Agent', approxMonthlyCu: 90 },
        badge: 'RISKY',
        badgeLabel: 'Policy Risk',
        summary: isEn ? 'Autonomous financial decisions must enforce fallback to humans on uncertainty.' : 'Autonome Kreditentscheidungen erfordern strikten Human-Fallback.',
        rationale: isEn ? 'High risk of policy drift if guardrails are not strictly coded.' : 'Gefahr von Regelbrüchen ohne harte BRFplus-Schutzplanken.',
        tradeOffs: { latency: 'medium', tokenHunger: 'medium', compliance: 'needs_review' },
      };

    case 'Executor / Actuator':
      if (archetype === 'deterministic') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: null, name: 'S/4HANA Clean Core RAP / OData BAPI', provider: 'SAP S/4HANA Cloud', inputTokensCostPer1kCu: 0, outputTokensCostPer1kCu: 0 },
          orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
          matchingTemplate: { preset: 'baseline-fastpath', title: 'Clean Core Booking', approxMonthlyCu: 0 },
          badge: 'DETERMINISTIC_SAFE',
          badgeLabel: 'Clean Core RAP',
          summary: isEn ? 'Atomic ERP posting transaction compliant with GoBD/SOX standards.' : 'Atomare Verbuchung nach Clean-Core- und GoBD-Standards.',
          rationale: isEn ? 'Reversibility 5 (Blast Radius). Mutations must be deterministic.' : 'Reversibilität 5 (Blast Radius). Schreibzugriffe müssen deterministisch sein.',
          tradeOffs: { latency: 'low', tokenHunger: 'none', compliance: 'safe' },
        };
      }
      if (archetype === 'copilot') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'gpt-5.6-luna', name: 'GPT 5.6 Luna', provider: 'Azure OpenAI', inputTokensCostPer1kCu: 0.00015, outputTokensCostPer1kCu: 0.00082 },
          orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
          matchingTemplate: { preset: 'both-small', title: 'AI-Enhanced App', approxMonthlyCu: 45 },
          badge: 'ACCEPTABLE',
          badgeLabel: 'HITL Commit',
          summary: isEn ? 'Joule summarizes booking summary; clerk triggers final commit.' : 'Joule fasst Beleg zusammen; Sachbearbeiter gibt final frei.',
          rationale: isEn ? 'Required by policy for high-value transactions.' : 'Vorgeschrieben bei Großaufträgen und Vier-Augen-Prinzip.',
          tradeOffs: { latency: 'medium', tokenHunger: 'low', compliance: 'safe' },
        };
      }
      return {
        primitive,
        archetype,
        recommendedModel: { key: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputTokensCostPer1kCu: 0.003, outputTokensCostPer1kCu: 0.015 },
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplate: { preset: 'ai-medium', title: 'Autonomous Agent', approxMonthlyCu: 90 },
        badge: 'RISKY',
        badgeLabel: 'Blast Radius Alert',
        summary: isEn ? 'GUARDRAIL VIOLATION: Autonomous mutating ERP posting without review violates SOX.' : 'SCHUTZPLANKEN-WARNUNG: Autonome Verbuchung ohne Freigabe verletzt SOX.',
        rationale: isEn ? 'Never allow autonomous agentic tool-calling on unreviewed ERP commits.' : 'Niemals autonome Agenten direkt unüberwacht buchen lassen.',
        tradeOffs: { latency: 'high', tokenHunger: 'high', compliance: 'critical_unsupervised' },
      };

    case 'Generator / Synthesizer':
      if (archetype === 'classic_ml') {
        return {
          primitive,
          archetype,
          recommendedModel: { key: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite / BTP Output', provider: 'Google Vertex AI', inputTokensCostPer1kCu: 0.00039, outputTokensCostPer1kCu: 0.00278 },
          orchestration: { dataMasking: false, contentFilter: true, grounding: false, translation: true, observability: false },
          matchingTemplate: { preset: 'ai-small', title: 'Document Q&A / Confirmation', approxMonthlyCu: 8 },
          badge: 'OPTIMAL',
          badgeLabel: 'Automated Dispatch',
          summary: isEn ? 'Fast automated background confirmation generation with multi-language support.' : 'Schnelle Generierung und Versand von Bestätigungen im Hintergrund.',
          rationale: isEn ? 'Runs dark in background without blocking human queues.' : 'Läuft dunkel im Hintergrund ohne Sachbearbeiter-Warteschlangen.',
          tradeOffs: { latency: 'low', tokenHunger: 'low', compliance: 'safe' },
        };
      }
      return {
        primitive,
        archetype,
        recommendedModel: { key: null, name: 'SAP Forms by Adobe / BTP Output', provider: 'SAP BTP', inputTokensCostPer1kCu: 0, outputTokensCostPer1kCu: 0 },
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplate: { preset: 'baseline-fastpath', title: 'Static Template', approxMonthlyCu: 0 },
        badge: 'DETERMINISTIC_SAFE',
        badgeLabel: 'Standard Template',
        summary: isEn ? 'Standardized PDF dispatch without generative text variations.' : 'Klassischer PDF-Belegversand ohne generative Floskeln.',
        rationale: isEn ? 'Zero token cost, exact corporate branding compliance.' : '0 Tokenkosten, exakte Corporate Identity.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', compliance: 'safe' },
      };
  }
}

export function calculateStepCapacityUnits(params: {
  inputTokens: number;
  outputTokens: number;
  monthlyRequests: number;
  modelKey: string;
  enableDataMasking?: boolean;
  enableContentFilter?: boolean;
  enableGrounding?: boolean;
}): {
  modelCuMonthly: number;
  orchestrationCuMonthly: number;
  totalCuMonthly: number;
} {
  const model = AI_CORE_MODELS.find(m => m.key === params.modelKey || m.name === params.modelKey);
  const version = model?.version[0];
  const inRate = version?.inputTokensCost || 0.001;
  const outRate = version?.outputTokensCost || 0.005;

  const modelCuPerTx = (params.inputTokens / 1000) * inRate + (params.outputTokens / 1000) * outRate;
  const modelCuMonthly = modelCuPerTx * params.monthlyRequests;

  let orchCuPerTx = 0;
  if (params.enableContentFilter) orchCuPerTx += ORCHESTRATION_RATES.contentFilter.external;
  if (params.enableDataMasking) orchCuPerTx += ORCHESTRATION_RATES.dataMasking.external;
  if (params.enableGrounding) orchCuPerTx += ORCHESTRATION_RATES.grounding.external;

  const orchestrationCuMonthly = orchCuPerTx * params.monthlyRequests;
  const totalCuMonthly = modelCuMonthly + orchestrationCuMonthly;

  return {
    modelCuMonthly: Number(modelCuMonthly.toFixed(2)),
    orchestrationCuMonthly: Number(orchestrationCuMonthly.toFixed(2)),
    totalCuMonthly: Number(totalCuMonthly.toFixed(2)),
  };
}
