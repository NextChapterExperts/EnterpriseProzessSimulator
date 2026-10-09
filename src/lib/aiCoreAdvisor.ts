import { CognitivePrimitive, AutomationArchetype, OODAPhase } from '@/types/process';
import { Language } from '@/i18n/translations';
import { AI_CORE_MODELS, AI_CORE_TEMPLATES, ORCHESTRATION_RATES } from '@/data/sapAiCoreCatalog';

export interface AiCoreStepCostBreakdown {
  modelCuPerTx: number;
  orchestrationCuPerTx: number;
  totalCostPerTxCu: number;
  monthlyCostCu: number;
  monthlyVolumeUsed: number;
  formulaDescription: string;
  formattedCostPerTx: string;
  formattedMonthlyCost: string;
  isDeterministicFree: boolean;
  tokensInUsed: number;
  tokensOutUsed: number;
  modelInputCuRatePer1k: number;
  modelOutputCuRatePer1k: number;
  orchestrationDetails: {
    dataMaskingCu: number;
    contentFilterCu: number;
    groundingCu: number;
    observabilityCu: number;
    translationCu: number;
  };
}

export interface AiCoreStepRecommendation {
  primitive: CognitivePrimitive;
  archetype: AutomationArchetype;
  recommendedModelKey: string | null;
  recommendedModelName: string;
  recommendedProvider: string;
  estimatedCostPerTxCu: number;
  costBreakdown: AiCoreStepCostBreakdown;
  orchestration: {
    dataMasking: boolean;
    contentFilter: boolean;
    grounding: boolean;
    translation: boolean;
    observability: boolean;
  };
  matchingTemplatePreset: string;
  matchingTemplateTitle: string;
  badge: 'OPTIMAL' | 'ACCEPTABLE' | 'OVERKILL' | 'RISKY' | 'DETERMINISTIC_SAFE';
  badgeLabel: string;
  badgeColorClass: string;
  summary: string;
  tradeOffs: {
    latency: 'low' | 'medium' | 'high';
    tokenHunger: 'none' | 'low' | 'medium' | 'high' | 'extreme';
    complianceAudit: 'safe' | 'masked' | 'needs_review' | 'critical_unsupervised';
  };
  whyThisSetting: string;
}

export function formatCuNumber(val: number): string {
  if (val === 0) return '0 CU';
  if (val < 0.0001) return '<0.0001 CU';
  if (val < 0.01) {
    return `${Number(val.toFixed(5))} CU`;
  }
  if (val < 1) {
    return `${Number(val.toFixed(4))} CU`;
  }
  return `${val.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} CU`;
}

export function formatMonthlyCu(val: number, volume?: number): string {
  if (val === 0) return '0 CU / Mo';
  const valStr = val < 0.01 ? '<0.01' : val < 1 ? val.toFixed(2) : Math.round(val).toLocaleString('de-DE');
  if (volume !== undefined && volume > 0) {
    const volStr = volume >= 1000 ? `${(volume / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })}k` : volume.toString();
    return `~${valStr} CU/Mo (bei ${volStr})`;
  }
  return `~${valStr} CU / Mo`;
}

export function findAiCoreModel(keyOrName: string | null): (typeof AI_CORE_MODELS)[number] | undefined {
  if (!keyOrName) return undefined;
  const target = keyOrName.toLowerCase().replace(/[-_\s.]/g, '');

  let found = AI_CORE_MODELS.find((m) => {
    const k = m.key.toLowerCase().replace(/[-_\s.]/g, '');
    const n = m.name.toLowerCase().replace(/[-_\s.]/g, '');
    return k === target || n === target;
  });
  if (found) return found;

  found = AI_CORE_MODELS.find((m) => {
    const k = m.key.toLowerCase().replace(/[-_\s.]/g, '');
    const n = m.name.toLowerCase().replace(/[-_\s.]/g, '');
    const d = m.displayName.toLowerCase().replace(/[-_\s.]/g, '');
    return k.includes(target) || target.includes(k) || n.includes(target) || target.includes(n) || d.includes(target);
  });
  if (found) return found;

  if (target.includes('sonnet')) {
    return AI_CORE_MODELS.find((m) => m.key.includes('sonnet') || m.name.includes('sonnet'));
  }
  if (target.includes('luna')) {
    return AI_CORE_MODELS.find((m) => m.key.includes('Luna') || m.name.includes('luna'));
  }
  if (target.includes('terra')) {
    return AI_CORE_MODELS.find((m) => m.key.includes('Terra') || m.name.includes('terra'));
  }
  if (target.includes('flash')) {
    return AI_CORE_MODELS.find((m) => m.key.includes('flash') || m.name.includes('flash'));
  }

  return undefined;
}

export function calculateCostBreakdown(
  archetype: AutomationArchetype,
  modelKey: string | null,
  orchestration: {
    dataMasking: boolean;
    contentFilter: boolean;
    grounding: boolean;
    translation: boolean;
    observability: boolean;
  },
  stepContext?: { baseTokensIn?: number; baseTokensOut?: number },
  monthlyVolume: number = 25000
): AiCoreStepCostBreakdown {
  if (archetype === 'deterministic' || !modelKey) {
    return {
      modelCuPerTx: 0,
      orchestrationCuPerTx: 0,
      totalCostPerTxCu: 0,
      monthlyCostCu: 0,
      monthlyVolumeUsed: monthlyVolume,
      formulaDescription: '0 CU (Native SAP S/4HANA Clean Core / Event Mesh)',
      formattedCostPerTx: '0 CU',
      formattedMonthlyCost: '0 CU / Mo',
      isDeterministicFree: true,
      tokensInUsed: 0,
      tokensOutUsed: 0,
      modelInputCuRatePer1k: 0,
      modelOutputCuRatePer1k: 0,
      orchestrationDetails: {
        dataMaskingCu: 0,
        contentFilterCu: 0,
        groundingCu: 0,
        observabilityCu: 0,
        translationCu: 0,
      },
    };
  }

  const model = findAiCoreModel(modelKey);
  const version = model?.version?.[0];
  const inputRate = version?.inputTokensCost ?? 0.00039;
  const outputRate = version?.outputTokensCost ?? 0.00278;

  const defaultTokensIn = archetype === 'classic_ml' ? 400 : archetype === 'copilot' ? 1200 : archetype === 'autopilot' ? 2000 : 3500;
  const defaultTokensOut = archetype === 'classic_ml' ? 100 : archetype === 'copilot' ? 300 : archetype === 'autopilot' ? 500 : 800;

  const tokensIn = (stepContext?.baseTokensIn && stepContext.baseTokensIn > 0) ? stepContext.baseTokensIn : defaultTokensIn;
  const tokensOut = (stepContext?.baseTokensOut && stepContext.baseTokensOut > 0) ? stepContext.baseTokensOut : defaultTokensOut;

  const modelCuPerTx = (tokensIn / 1000) * inputRate + (tokensOut / 1000) * outputRate;

  const dataMaskingCu = orchestration.dataMasking ? ORCHESTRATION_RATES.dataMasking.external : 0;
  const contentFilterCu = orchestration.contentFilter ? ORCHESTRATION_RATES.contentFilter.external : 0;
  const groundingCu = orchestration.grounding ? ORCHESTRATION_RATES.grounding.external : 0;
  const observabilityCu = orchestration.observability ? ORCHESTRATION_RATES.inferenceObservability.external : 0;
  const translationCu = orchestration.translation ? ORCHESTRATION_RATES.translation.external : 0;

  const orchestrationCuPerTx = dataMaskingCu + contentFilterCu + groundingCu + observabilityCu + translationCu;
  const totalCostPerTxCu = modelCuPerTx + orchestrationCuPerTx;
  const monthlyCostCu = totalCostPerTxCu * monthlyVolume;
  const formulaDescription = `${formatCuNumber(totalCostPerTxCu)} / Beleg × ${monthlyVolume.toLocaleString('de-DE')} Belege = ${formatCuNumber(monthlyCostCu)} / Monat`;
  const formattedMonthlyCost = `~${Math.round(monthlyCostCu).toLocaleString('de-DE')} CU/Mo (bei ${monthlyVolume.toLocaleString('de-DE')} Tx)`;

  return {
    modelCuPerTx,
    orchestrationCuPerTx,
    totalCostPerTxCu,
    monthlyCostCu,
    monthlyVolumeUsed: monthlyVolume,
    formulaDescription,
    formattedCostPerTx: formatCuNumber(totalCostPerTxCu),
    formattedMonthlyCost,
    isDeterministicFree: false,
    tokensInUsed: tokensIn,
    tokensOutUsed: tokensOut,
    modelInputCuRatePer1k: inputRate,
    modelOutputCuRatePer1k: outputRate,
    orchestrationDetails: {
      dataMaskingCu,
      contentFilterCu,
      groundingCu,
      observabilityCu,
      translationCu,
    },
  };
}

function getRawAiCoreStepRecommendation(
  primitive: CognitivePrimitive,
  archetype: AutomationArchetype,
  oodaPhase: OODAPhase,
  lang: Language = 'de'
): Omit<AiCoreStepRecommendation, 'costBreakdown'> {
  const isEn = lang === 'en';

  // 1. FILTER / GATEKEEPER
  if (primitive === 'Filter / Gatekeeper') {
    if (archetype === 'deterministic') {
      return {
        primitive,
        archetype,
        recommendedModelKey: null,
        recommendedModelName: isEn ? 'None (Event Mesh / Regex)' : 'Kein LLM (Event Mesh / Regex)',
        recommendedProvider: 'SAP BTP',
        estimatedCostPerTxCu: 0,
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'baseline-fastpath',
        matchingTemplateTitle: isEn ? 'Deterministic Fast-Path' : 'Deterministischer Fast-Path',
        badge: 'DETERMINISTIC_SAFE',
        badgeLabel: isEn ? 'Optimal & 0 CU' : 'Optimal & 0 CU',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Fast-path triage on headers & subject regex. 100% straight-through, 0 tokens, 0 inference cost.'
          : 'Fast-Path-Triage auf E-Mail-Header & Betreff-Regex. 100% Dunkelverarbeitung, 0 Tokens, 0 Inferenzkosten.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'An LLM at the gatekeeper stage is wasteful if 95%+ of incoming traffic can be classified by header rules.'
          : 'Ein LLM an der Pforte ist Ressourcenverschwendung, wenn 95%+ des Eingangsverkehrs per Header-Regeln klassifiziert werden können.',
      };
    }

    if (archetype === 'classic_ml') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gemini-3.5-flash-lite',
        recommendedModelName: 'Gemini 3.5 Flash Lite (Google)',
        recommendedProvider: 'Google Vertex AI',
        estimatedCostPerTxCu: 0.00045,
        orchestration: { dataMasking: false, contentFilter: true, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'ai-small',
        matchingTemplateTitle: 'Document Q&A / Lightweight Triage',
        badge: 'OPTIMAL',
        badgeLabel: isEn ? 'Smart SLM' : 'Smartes SLM',
        badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        summary: isEn
          ? 'Lightweight SLM for semantic inbound triage. Separates spam, order intent, and inquiries at sub-millisecond rates.'
          : 'Leichtgewichtiges SLM für semantische Triage. Trennt Spam, Bestellabsicht und Reklamationen bei extrem geringen Kosten.',
        tradeOffs: { latency: 'low', tokenHunger: 'low', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Gemini 3.5 Flash Lite costs only 0.00039 CU/1k tokens, providing semantic understanding without high token footprint.'
          : 'Gemini 3.5 Flash Lite kostet nur 0.00039 CU/1k Tokens und bietet semantisches Verständnis ohne großen Footprint.',
      };
    }

    if (archetype === 'copilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-luna',
        recommendedModelName: 'GPT 5.6 Luna (Azure OpenAI)',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.002,
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'AI-Enhanced App',
        badge: 'OVERKILL',
        badgeLabel: isEn ? 'HITL Bottleneck' : 'HITL-Engpass',
        badgeColorClass: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
        summary: isEn
          ? 'Caution: Copilot halts every inbound email at Step 1 waiting for manual review, destroying throughput.'
          : 'Achtung: Copilot hält jede eingehende E-Mail bei Schritt 1 an und wartet auf manuelle Sichtung. Zerstört den Durchsatz.',
        tradeOffs: { latency: 'high', tokenHunger: 'medium', complianceAudit: 'needs_review' },
        whyThisSetting: isEn
          ? 'Only use Copilot on Step 1 as a temporary training brake during initial go-live adoption.'
          : 'Copilot an Schritt 1 nur als temporäre Stützräder in den ersten Wochen des Produktivstarts einsetzen.',
      };
    }

    // autopilot / agentic
    return {
      primitive,
      archetype,
      recommendedModelKey: 'claude-3.5-sonnet',
      recommendedModelName: 'Claude 3.5 Sonnet (Anthropic)',
      recommendedProvider: 'Anthropic',
      estimatedCostPerTxCu: 0.015,
      orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
      matchingTemplatePreset: 'ai-large',
      matchingTemplateTitle: 'Multi-Agent Platform',
      badge: 'OVERKILL',
      badgeLabel: isEn ? 'Severe Overkill' : 'Kosten-Overkill',
      badgeColorClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      summary: isEn
        ? 'High token cost & latency. Using reasoning swarms for email triage is an architectural anti-pattern.'
        : 'Hoher Tokenverbrauch & Latenz. Multi-Agenten-Reasoning für E-Mail-Triage ist ein architektonisches Anti-Pattern.',
      tradeOffs: { latency: 'high', tokenHunger: 'extreme', complianceAudit: 'needs_review' },
      whyThisSetting: isEn
        ? 'A full reasoning model costs 40x more than a deterministic filter without delivering superior business outcomes.'
        : 'Ein Reasoning-Modell kostet das 40-fache eines deterministischen Filters ohne betriebswirtschaftlichen Mehrwert.',
    };
  }

  // 2. EXTRACTOR / TRANSFORMER
  if (primitive === 'Extractor / Transformer') {
    if (archetype === 'deterministic') {
      return {
        primitive,
        archetype,
        recommendedModelKey: null,
        recommendedModelName: isEn ? 'Deterministic Parser (EDI/IDoc)' : 'Deterministischer Parser (EDI/IDoc)',
        recommendedProvider: 'SAP S/4HANA',
        estimatedCostPerTxCu: 0,
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'baseline-fastpath',
        matchingTemplateTitle: 'Baseline Parser',
        badge: 'RISKY',
        badgeLabel: isEn ? 'Brittle' : 'Fehleranfällig',
        badgeColorClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
        summary: isEn
          ? 'Breaks on layout variances and free-text formatting changes. Schema divergence risk.'
          : 'Bricht bei minimalen Layout-Abweichungen und Freitexten ab. Hohes Risiko für Schemadivergenz.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Deterministic parsers are only viable for strictly formatted EDI/IDoc files, not arbitrary PDFs.'
          : 'Deterministische Parser sind nur für feste EDI/IDoc-Formate geeignet, nicht für beliebige PDF-Lieferantenrechnungen.',
      };
    }

    if (archetype === 'classic_ml') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gemini-3.5-flash-lite',
        recommendedModelName: 'Gemini 3.5 Flash Lite / SAP DOX',
        recommendedProvider: 'Google Vertex AI / SAP BTP',
        estimatedCostPerTxCu: 0.0014,
        orchestration: { dataMasking: true, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'ai-small',
        matchingTemplateTitle: 'Document Q&A (High-Speed Extraction)',
        badge: 'OPTIMAL',
        badgeLabel: isEn ? 'Pareto-Optimum' : 'Pareto-Optimum',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Fast, structured JSON extraction in background. Data Masking protects GDPR privacy before cloud inference.'
          : 'Schnelle, strukturierte JSON-Extraktion im Hintergrund. Data Masking schützt DSGVO-Daten vor der Inferenz.',
        tradeOffs: { latency: 'low', tokenHunger: 'low', complianceAudit: 'masked' },
        whyThisSetting: isEn
          ? 'Structured entity extraction needs JSON-mode precision, not creative writing. Flash Lite delivers 98% accuracy at minimal cost.'
          : 'Strukturierte Extraktion benötigt JSON-Präzision, keine Kreativität. Flash Lite liefert 98% Genauigkeit bei minimalen Kosten.',
      };
    }

    if (archetype === 'copilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-terra',
        recommendedModelName: 'GPT 5.6 Terra (Azure OpenAI)',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.008,
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'AI-Enhanced App (Joule Review)',
        badge: 'ACCEPTABLE',
        badgeLabel: isEn ? 'HITL Review' : 'Sachbearbeiter-Review',
        badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        summary: isEn
          ? 'Joule Copilot pre-fills the extracted invoice/order fields; clerk validates before dispatch.'
          : 'Joule Copilot befüllt Belegdaten vor; Sachbearbeiter validiert vor der Verbuchung.',
        tradeOffs: { latency: 'medium', tokenHunger: 'medium', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Legitimate use-case for complex, multi-page bespoke PDFs requiring four-eyes review.'
          : 'Legitimer Einsatz bei komplexen, mehrseitigen Sonder-PDFs mit Vier-Augen-Prinzip.',
      };
    }

    if (archetype === 'autopilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gemini-3.5-flash-lite',
        recommendedModelName: 'Gemini 3.5 Flash Lite (Autonomous JSON Pipeline)',
        recommendedProvider: 'Google Vertex AI',
        estimatedCostPerTxCu: 0.0018,
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplatePreset: 'ai-small',
        matchingTemplateTitle: 'Document Q&A / Automated Extraction',
        badge: 'OPTIMAL',
        badgeLabel: isEn ? 'Autonomous Extraction' : 'Autonome Extraktion',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Fast, autonomous JSON extraction directly in background with schema validation.'
          : 'Schnelle, autonome JSON-Extraktion direkt im Hintergrund mit Schema-Validierung und Observability.',
        tradeOffs: { latency: 'low', tokenHunger: 'low', complianceAudit: 'masked' },
        whyThisSetting: isEn
          ? 'Full straight-through processing without human review queues, maximizing throughput.'
          : '100% Dunkelverarbeitung ohne Sachbearbeiter-Warteschlangen bei maximalem Durchsatz.',
      };
    }

    if (archetype === 'agentic') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'claude-3.5-sonnet',
        recommendedModelName: 'Claude 3.5 Sonnet + GPT-Nano',
        recommendedProvider: 'Anthropic & OpenAI',
        estimatedCostPerTxCu: 0.045,
        orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
        matchingTemplatePreset: 'ai-large',
        matchingTemplateTitle: 'Multi-Agent Platform (Self-Healing)',
        badge: 'ACCEPTABLE',
        badgeLabel: isEn ? 'Self-Healing Swarm' : 'Selbstheilungs-Swarm',
        badgeColorClass: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
        summary: isEn
          ? 'Autonomous reconstruction for messy documents. Queries predecessor documents to self-heal missing fields.'
          : 'Autonome Rekonstruktion bei unvollständigen Belegen. Fragt Vorbelege ab und heilt fehlende Felder selbstständig.',
        tradeOffs: { latency: 'high', tokenHunger: 'high', complianceAudit: 'masked' },
        whyThisSetting: isEn
          ? 'Ideal when incoming order texts lack article numbers and require historical cross-checking.'
          : 'Ideal, wenn Freitextbestellungen keine Artikelnummern enthalten und Voraufträge abgeglichen werden müssen.',
      };
    }

    // fallback
    return {
      primitive,
      archetype,
      recommendedModelKey: null,
      recommendedModelName: isEn ? 'Deterministic Parser' : 'Deterministischer Parser',
      recommendedProvider: 'SAP S/4HANA',
      estimatedCostPerTxCu: 0,
      orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
      matchingTemplatePreset: 'baseline-fastpath',
      matchingTemplateTitle: 'Baseline Parser',
      badge: 'RISKY',
      badgeLabel: isEn ? 'Brittle' : 'Fehleranfällig',
      badgeColorClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      summary: isEn
        ? 'Breaks on layout variances and free-text formatting changes. Schema divergence risk.'
        : 'Bricht bei minimalen Layout-Abweichungen und Freitexten ab. Hohes Risiko für Schemadivergenz.',
      tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
      whyThisSetting: isEn
        ? 'Deterministic parsers are only viable for strictly formatted EDI/IDoc files, not arbitrary PDFs.'
        : 'Deterministische Parser sind nur für feste EDI/IDoc-Formate geeignet, nicht für beliebige PDF-Lieferantenrechnungen.',
    };
  }

  // 3. MATCHER / ENRICHER
  if (primitive === 'Matcher / Enricher') {
    if (archetype === 'deterministic') {
      return {
        primitive,
        archetype,
        recommendedModelKey: null,
        recommendedModelName: 'SAP S/4HANA SQL Exact Match (KNA1 / MARA)',
        recommendedProvider: 'SAP S/4HANA',
        estimatedCostPerTxCu: 0,
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'baseline-fastpath',
        matchingTemplateTitle: isEn ? 'Deterministic Exact Match' : 'Deterministischer SQL-Abgleich',
        badge: 'DETERMINISTIC_SAFE',
        badgeLabel: isEn ? 'Exact Match (0 CU)' : 'Exakter Match (0 CU)',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Exact primary key lookup in SAP database. Zero tokens, zero AI Core cost.'
          : 'Exakter Primärschlüssel-Abgleich in der SAP-Datenbank. 0 Tokens, 0 AI Core Kosten.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'When customers provide exact SAP material or account numbers, relational SQL lookup is 0 CU and 100% reliable.'
          : 'Wenn Kunden exakte Material- oder Debitorennummern angeben, ist SQL-Lookup kostenlos und 100% verlässlich.',
      };
    }

    if (archetype === 'classic_ml') {
      return {
        primitive,
        archetype,
        recommendedModelKey: null,
        recommendedModelName: 'SAP HANA Cloud Trigram & Fuzzy Search',
        recommendedProvider: 'SAP HANA Cloud',
        estimatedCostPerTxCu: 0,
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'compute-small',
        matchingTemplateTitle: 'In-Memory Master Data Search',
        badge: 'OPTIMAL',
        badgeLabel: isEn ? 'Zero Hallucination' : 'Null Halluzination',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Sub-millisecond master data lookup in HANA (KNA1 / MARA). Zero tokens, zero hallucination risk.'
          : 'Stammdaten-Abgleich im Millisekundenbereich in SAP HANA (KNA1 / MARA). 0 Tokens, 0 Halluzinationsrisiko.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Master data reconciliation should never be delegated to generative LLMs; in-memory database search is 100x faster and deterministic.'
          : 'Stammdaten-Matching darf niemals generativen LLMs überlassen werden; In-Memory-Datenbanksuche ist 100x schneller und sicher.',
      };
    }

    if (archetype === 'copilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-luna',
        recommendedModelName: 'GPT 5.6 Luna / Joule Match Disambiguation',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.002,
        orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'AI-Assisted Master Data Search',
        badge: 'ACCEPTABLE',
        badgeLabel: isEn ? 'Disambiguation Review' : 'Sachbearbeiter-Klärung',
        badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        summary: isEn
          ? 'Joule Copilot suggests the top 3 matching customers/materials; clerk confirms ambiguous records.'
          : 'Joule Copilot schlägt die 3 wahrscheinlichsten Debitoren/Materialien vor; Sachbearbeiter wählt aus.',
        tradeOffs: { latency: 'medium', tokenHunger: 'low', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Optimal when fuzzy matching score is between 70% and 85%.'
          : 'Optimal bei zweideutigen Treffern mit Ähnlichkeits-Score zwischen 70% und 85%.',
      };
    }

    return {
      primitive,
      archetype,
      recommendedModelKey: 'claude-3.5-sonnet',
      recommendedModelName: 'Claude 3.5 Sonnet (Tool Calling & Vector RAG)',
      recommendedProvider: 'Anthropic',
      estimatedCostPerTxCu: 0.02,
      orchestration: { dataMasking: true, contentFilter: true, grounding: true, translation: false, observability: true },
      matchingTemplatePreset: 'ai-medium',
      matchingTemplateTitle: 'Autonomous Agent (Vector Grounding)',
      badge: 'ACCEPTABLE',
      badgeLabel: isEn ? 'Semantic RAG' : 'Semantisches RAG',
      badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
      summary: isEn
        ? 'Vector grounding across unstructured catalog notes when exact material keys do not exist.'
        : 'Vektor-Grounding über unstrukturierte Produktnotizen, wenn keine exakten Materialnummern vorliegen.',
      tradeOffs: { latency: 'medium', tokenHunger: 'medium', complianceAudit: 'needs_review' },
      whyThisSetting: isEn
        ? 'Use semantic vector search only when standard HANA trigram search fails to find matches.'
        : 'Semantische Vektorsuche nur als Fallback nutzen, wenn das Standard-Trigram-Matching fehlschlägt.',
    };
  }

  // 4. EVALUATOR / REASONER
  if (primitive === 'Evaluator / Reasoner') {
    if (archetype === 'deterministic') {
      return {
        primitive,
        archetype,
        recommendedModelKey: null,
        recommendedModelName: 'SAP BRFplus / Decision Tables',
        recommendedProvider: 'SAP Build Process Automation',
        estimatedCostPerTxCu: 0,
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'baseline-fastpath',
        matchingTemplateTitle: 'Audit-Proof Business Rules',
        badge: 'DETERMINISTIC_SAFE',
        badgeLabel: isEn ? 'GoBD Compliant' : 'GoBD-Konform',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? '100% audit-proof business rule execution (credit limit, ATP checks) compliant with GoBD/SOX.'
          : '100% rechtssichere Regelausführung (Kreditlimit, ATP-Prüfung) nach GoBD- und SOX-Vorgaben.',
        tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Business rules and financial risk tolerances must be auditable and reproducible without statistical variance.'
          : 'Kredit- und Risikoentscheidungen müssen für Wirtschaftsprüfer reproduzierbar ohne stochastische Abweichungen sein.',
      };
    }

    if (archetype === 'copilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-terra',
        recommendedModelName: 'GPT 5.6 Terra / Joule Risk Explainer',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.006,
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'AI-Enhanced App (Risk Review)',
        badge: 'ACCEPTABLE',
        badgeLabel: isEn ? 'Joule Policy Review' : 'Joule Richtlinienprüfung',
        badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        summary: isEn
          ? 'Joule Copilot summarizes complex policy violations; business clerk approves exceptions.'
          : 'Joule Copilot fasst komplexe Kreditlimit- oder Lieferabweichungen zusammen; Sachbearbeiter entscheidet über Ausnahmen.',
        tradeOffs: { latency: 'medium', tokenHunger: 'medium', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Reduces manual checking time while keeping humans accountable for financial risk decisions.'
          : 'Reduziert manuelle Prüfzeit, behält aber die menschliche Verantwortung bei Kredit- und Risikoentscheidungen.',
      };
    }

    return {
      primitive,
      archetype,
      recommendedModelKey: 'gpt-5.4',
      recommendedModelName: 'GPT-5.4 (Autonomous Decision)',
      recommendedProvider: 'Azure OpenAI',
      estimatedCostPerTxCu: 0.012,
      orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
      matchingTemplatePreset: 'ai-medium',
      matchingTemplateTitle: 'Autonomous Agent',
      badge: 'RISKY',
      badgeLabel: isEn ? 'Policy Risk' : 'Compliance-Risiko',
      badgeColorClass: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
      summary: isEn
        ? 'Warning: Autonomous decision-making by generative models on financial limits requires strict guardrails.'
        : 'Warnung: Autonome Entscheidungen durch generative Modelle bei Kreditgrenzen erfordern strikte Schutzplanken.',
      tradeOffs: { latency: 'medium', tokenHunger: 'medium', complianceAudit: 'needs_review' },
      whyThisSetting: isEn
        ? 'If using AI for decisioning, configure automated fallback gates whenever confidence is below 98%.'
        : 'Wenn KI für Entscheidungen genutzt wird, muss ein automatischer Fallback auf den Menschen bei Konfidenz < 98% greifen.',
    };
  }

  // 5. EXECUTOR / ACTUATOR
  if (primitive === 'Executor / Actuator') {
    if (archetype === 'deterministic') {
      return {
        primitive,
        archetype,
        recommendedModelKey: null,
        recommendedModelName: 'S/4HANA Clean Core RAP / OData BAPI',
        recommendedProvider: 'SAP S/4HANA Cloud',
        estimatedCostPerTxCu: 0,
        orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
        matchingTemplatePreset: 'baseline-fastpath',
        matchingTemplateTitle: 'Clean Core ERP Booking',
        badge: 'DETERMINISTIC_SAFE',
        badgeLabel: isEn ? 'Clean Core RAP' : 'Clean Core RAP',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Atomic, transactional ERP posting via Clean Core ABAP Cloud RESTful Application Programming (RAP).'
          : 'Atomare, transaktionale Verbuchung über Clean Core ABAP Cloud RAP (Reversibilität 5, Blast Radius geschützt).',
        tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Persistent state mutations in ERP must be performed deterministically by verified API services.'
          : 'Schreibende Zustandsänderungen im ERP-Kern dürfen nur durch verifizierte API-Dienste deterministisch erfolgen.',
      };
    }

    if (archetype === 'copilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-luna',
        recommendedModelName: 'GPT 5.6 Luna (Summary Generator)',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.0015,
        orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'AI-Enhanced App',
        badge: 'ACCEPTABLE',
        badgeLabel: isEn ? 'HITL Commit' : 'Menschlicher Commit',
        badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        summary: isEn
          ? 'Joule Copilot summarizes the posting payload; human clerk triggers the final commit.'
          : 'Joule Copilot fasst den Buchungsbeleg zusammen; Sachbearbeiter löst den finalen Commit aus.',
        tradeOffs: { latency: 'medium', tokenHunger: 'low', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Essential for high-value orders (> 100k €) or first-time customers where human confirmation is mandatory.'
          : 'Unverzichtbar bei Großaufträgen (> 100k €) oder Neukunden, bei denen das Vier-Augen-Prinzip gesetzlich gefordert ist.',
      };
    }

    return {
      primitive,
      archetype,
      recommendedModelKey: 'claude-3.5-sonnet',
      recommendedModelName: 'Claude 3.5 Sonnet (Tool Call)',
      recommendedProvider: 'Anthropic',
      estimatedCostPerTxCu: 0.02,
      orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: true },
      matchingTemplatePreset: 'ai-medium',
      matchingTemplateTitle: 'Autonomous Agent',
      badge: 'RISKY',
      badgeLabel: isEn ? 'Blast Radius Violation' : 'Blast-Radius Verletzung',
      badgeColorClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      summary: isEn
        ? 'GUARDRAIL ALERT: Reversibility 5. Autonomous LLM posting without human approval violates SOX compliance!'
        : 'SCHUTZPLANKEN-WARNUNG: Reversibilität 5. Autonome Verbuchung durch KI verletzt SOX- und GoBD-Vorgaben!',
      tradeOffs: { latency: 'high', tokenHunger: 'high', complianceAudit: 'critical_unsupervised' },
      whyThisSetting: isEn
        ? 'Never allow autonomous agentic tool-calling directly on mutating financial transactions without approval gates.'
        : 'Niemals autonome Agenten direkt schreibend auf finanzrelevante Transaktionen loslassen ohne harte Schutzplanken.',
    };
  }

  // 6. GENERATOR / SYNTHESIZER
  if (primitive === 'Generator / Synthesizer') {
    if (archetype === 'classic_ml') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gemini-3.5-flash-lite',
        recommendedModelName: 'Gemini 3.5 Flash Lite / BTP Output Mgt.',
        recommendedProvider: 'Google Vertex AI',
        estimatedCostPerTxCu: 0.0006,
        orchestration: { dataMasking: false, contentFilter: true, grounding: false, translation: true, observability: false },
        matchingTemplatePreset: 'ai-small',
        matchingTemplateTitle: 'Document Q&A / Customer Notification',
        badge: 'OPTIMAL',
        badgeLabel: isEn ? 'Automated Dispatch' : 'Dunkel-Versand',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Automated background order confirmation dispatch with dynamic multi-language translation.'
          : 'Automatisierte Generierung und Versand der Auftragsbestätigung im Hintergrund inklusive Mehrsprachigkeit.',
        tradeOffs: { latency: 'low', tokenHunger: 'low', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Sending confirmations should run dark in background without blocking human queues.'
          : 'Bestätigungs-Mails sollten dunkel im Hintergrund laufen, ohne Sachbearbeiter-Warteschlangen zu blockieren.',
      };
    }

    if (archetype === 'copilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-terra',
        recommendedModelName: 'GPT 5.6 Terra / Joule Copilot',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.006,
        orchestration: { dataMasking: false, contentFilter: true, grounding: false, translation: true, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'AI-Enhanced App',
        badge: 'ACCEPTABLE',
        badgeLabel: isEn ? 'Personalized Review' : 'Personalisierte Prüfung',
        badgeColorClass: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        summary: isEn
          ? 'Copilot drafts personalized customer email; clerk reviews tone and approves.'
          : 'Copilot entwirft personalisiertes Kundenanschreiben; Sachbearbeiter prüft Tonalität und gibt frei.',
        tradeOffs: { latency: 'medium', tokenHunger: 'medium', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? 'Suitable for VIP key accounts where standardized emails are deemed insufficient.'
          : 'Sinnvoll bei VIP-Schlüsselkunden, bei denen standardisierte Beleg-Mails unerwünscht sind.',
      };
    }

    if (archetype === 'autopilot') {
      return {
        primitive,
        archetype,
        recommendedModelKey: 'gpt-5.6-luna',
        recommendedModelName: 'GPT 5.6 Luna / Autonomous Dispatch',
        recommendedProvider: 'Azure OpenAI',
        estimatedCostPerTxCu: 0.0035,
        orchestration: { dataMasking: false, contentFilter: true, grounding: false, translation: true, observability: true },
        matchingTemplatePreset: 'both-small',
        matchingTemplateTitle: 'Autonomous Notification Synthesis',
        badge: 'OPTIMAL',
        badgeLabel: isEn ? 'Autonomous Dispatch' : 'Autonomer Dunkel-Versand',
        badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
        summary: isEn
          ? 'Autonomous dynamic generation of personalized confirmation emails with automated multi-language translation and output dispatch.'
          : 'Vollautomatische, personalisierte E-Mail-Generierung mit dynamischer Mehrsprachigkeit und direktem Versand ohne Sachbearbeiter-Stopp.',
        tradeOffs: { latency: 'low', tokenHunger: 'medium', complianceAudit: 'safe' },
        whyThisSetting: isEn
          ? '100% straight-through output generation combining high throughput with personalized customer context.'
          : '100% Dunkelverarbeitung: Verbindet hohen Durchsatz und personalisierte Kundenansprache ohne manuelle Freigabe.',
      };
    }

    return {
      primitive,
      archetype,
      recommendedModelKey: null,
      recommendedModelName: 'SAP Forms by Adobe / BTP Output',
      recommendedProvider: 'SAP BTP',
      estimatedCostPerTxCu: 0,
      orchestration: { dataMasking: false, contentFilter: false, grounding: false, translation: false, observability: false },
      matchingTemplatePreset: 'baseline-fastpath',
      matchingTemplateTitle: 'Static PDF Template',
      badge: 'DETERMINISTIC_SAFE',
      badgeLabel: isEn ? 'Standard Template (0 CU)' : 'Standard-Formular (0 CU)',
      badgeColorClass: 'bg-slate-800 text-slate-300 border-slate-700',
      summary: isEn ? 'Standardized Adobe PDF output without generative variations.' : 'Klassischer PDF-Belegversand ohne generative Floskeln.',
      tradeOffs: { latency: 'low', tokenHunger: 'none', complianceAudit: 'safe' },
      whyThisSetting: isEn ? 'Zero token cost, exact corporate branding.' : '0 Tokenkosten, exakte Einhaltung des Corporate Brandings per Adobe Forms.',
    };
  }

  // Fallback
  return {
    primitive,
    archetype,
    recommendedModelKey: 'gemini-3.5-flash-lite',
    recommendedModelName: 'Gemini 3.5 Flash Lite',
    recommendedProvider: 'Google Vertex AI',
    estimatedCostPerTxCu: 0.0005,
    orchestration: { dataMasking: true, contentFilter: true, grounding: false, translation: false, observability: false },
    matchingTemplatePreset: 'ai-small',
    matchingTemplateTitle: 'Document Q&A',
    badge: 'OPTIMAL',
    badgeLabel: 'Optimal',
    badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    summary: 'Standard AI Core Inferenz im Hintergrund.',
    tradeOffs: { latency: 'low', tokenHunger: 'low', complianceAudit: 'safe' },
    whyThisSetting: 'Solide Basiskonfiguration für SAP BTP AI Core.',
  };
}

export function getAiCoreStepRecommendation(
  primitive: CognitivePrimitive,
  archetype: AutomationArchetype,
  oodaPhase: OODAPhase,
  lang: Language = 'de',
  stepContext?: { baseTokensIn?: number; baseTokensOut?: number },
  monthlyVolume: number = 25000
): AiCoreStepRecommendation {
  const base = getRawAiCoreStepRecommendation(primitive, archetype, oodaPhase, lang);
  const costBreakdown = calculateCostBreakdown(
    archetype,
    base.recommendedModelKey,
    base.orchestration,
    stepContext,
    monthlyVolume
  );

  return {
    ...base,
    estimatedCostPerTxCu: costBreakdown.totalCostPerTxCu,
    costBreakdown,
  };
}

