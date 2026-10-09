import { ProcessStep, SapAgentMatch, SapAgentMatchResult, SapCatalogItemType, ProcessTemplate } from '@/types/process';
import { Language } from '@/i18n/translations';
import catalogDataRaw from '@/data/sap-ai-catalog.json';

interface CatalogItem {
  id: string;
  name: string;
  type: SapCatalogItemType;
  shortDescription?: string;
  ribbons?: string;
  tags?: string;
  productCategories?: string;
  domain?: string;
  processes?: string;
  jarvisId?: string;
  products?: Array<{ productId?: string; productName?: string }>;
  isBillable?: boolean;
}

interface CatalogDetail {
  id: string;
  name: string;
  worksWith?: string;
  entitlementRulesList?: Array<{
    directBillingRelationship?: string;
    ratePlans?: Array<{
      currency?: string;
      blockRateList?: Array<{
        pricePerBlock?: string;
        blockSize?: string;
        metricId?: string;
      }>;
    }>;
  }>;
}

const catalogItems: CatalogItem[] = (catalogDataRaw as any).items || [];
const catalogDetails: Record<string, CatalogDetail> = (catalogDataRaw as any).details || {};

// EUR-Faktor pro 1 SAP BTP Capacity Unit (CU) (offizieller SAP BTP Listenpreis: ~1.20 EUR / CU)
const EUR_PER_CU = 1.20;

/**
 * Findet den optimalen Eintrag im SAP AI Catalog anhand semantischer Tokens und Heuristiken.
 */
function findBestCatalogMatch(stepText: string, tokens: string[]): { item: CatalogItem | null; score: number } {
  let bestMatch: CatalogItem | null = null;
  let bestScore = 0;

  for (const item of catalogItems) {
    let score = 0;
    const itemName = (item.name || '').toLowerCase();
    const itemDesc = (item.shortDescription || '').toLowerCase();
    const itemProducts = (item.products || []).map((p) => (p.productName || '').toLowerCase()).join(' ');

    if (item.type === 'ai_agent') score += 6;
    else if (item.type === 'ai_agent_partner') score += 4;
    else if (item.type === 'ai_assistant') score += 3;

    for (const t of tokens) {
      if (itemName.includes(t)) score += 5;
      else if (itemDesc.includes(t)) score += 2;
      else if (itemProducts.includes(t)) score += 1.5;
    }

    if (stepText.includes('pdf') || stepText.includes('extraktion') || stepText.includes('rechnung') || stepText.includes('invoice')) {
      if (itemName.includes('invoice') || itemName.includes('document extraction') || itemName.includes('payable') || itemName.includes('supplier invoice')) {
        score += 18;
      }
    }
    if (stepText.includes('order') || stepText.includes('auftrag') || stepText.includes('bestellung') || stepText.includes('confirmation')) {
      if (itemName.includes('order') || itemName.includes('sales order') || itemName.includes('purchase order')) {
        score += 16;
      }
    }
    if (stepText.includes('credit') || stepText.includes('kredit') || stepText.includes('block') || stepText.includes('limit')) {
      if (itemName.includes('credit') || itemName.includes('block')) {
        score += 20;
      }
    }
    if (stepText.includes('claim') || stepText.includes('reklamation') || stepText.includes('dispute') || stepText.includes('alert')) {
      if (itemName.includes('dispute') || itemName.includes('claim') || itemName.includes('case action') || itemName.includes('alert resolution')) {
        score += 20;
      }
    }
    if (stepText.includes('matching') || stepText.includes('abgleich') || stepText.includes('three-way') || stepText.includes('3-way') || stepText.includes('clearing')) {
      if (itemName.includes('matching') || itemName.includes('match reconciliation') || itemName.includes('clearing') || itemName.includes('cash application')) {
        score += 20;
      }
    }
    if (stepText.includes('close') || stepText.includes('abschluss') || stepText.includes('period') || stepText.includes('closing')) {
      if (itemName.includes('close') || itemName.includes('closing') || itemName.includes('accruals')) {
        score += 20;
      }
    }
    if (stepText.includes('asset') || stepText.includes('anlage') || stepText.includes('instandhaltung') || stepText.includes('maintenance')) {
      if (itemName.includes('asset') || itemName.includes('maintenance') || itemName.includes('operations')) {
        score += 20;
      }
    }
    if (stepText.includes('receiving') || stepText.includes('wareneingang') || stepText.includes('lager') || stepText.includes('warehouse')) {
      if (itemName.includes('receiving') || itemName.includes('delivery') || itemName.includes('pick') || itemName.includes('logistics')) {
        score += 18;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return { item: bestMatch, score: bestScore };
}

/**
 * Erstellt das realistische SapAgentMatch-Objekt basierend auf den
 * tatsächlichen SAP BTP Abrechnungsmetriken und dem Pareto 80/20-Prinzip.
 */
function buildSapAgentMatch(
  item: CatalogItem,
  monthlyVolume: number,
  lang: Language = 'de',
  step?: ProcessStep
): SapAgentMatch {
  const isEn = lang === 'en';
  const detail = catalogDetails[item.id] || {};

  // Differenzierte SAP BTP Capacity Unit (CU) Raten je nach Kognitivem Primitiv:
  let cuRatePerTx = 0.005;
  let metricName = 'sap_btp_capacity_units';
  let effectiveVolume = monthlyVolume;

  const primitive = step?.primitive || 'Evaluator / Reasoner';
  const archetype = step?.currentArchetype || 'autopilot';

  if (archetype === 'deterministic' || primitive === 'Filter / Gatekeeper') {
    // 100% Clean Core Fast-Path: Läuft auf S/4HANA Core / Event Mesh (0 CU)
    cuRatePerTx = 0;
    metricName = 'clean_core_event_mesh (0 CU)';
    effectiveVolume = 0;
  } else if (primitive === 'Matcher / Enricher') {
    // HANA Trigram / Vector Fuzzy Matching: In HANA Cloud Memory Compute enthalten (0 CU AI Inferenz)
    cuRatePerTx = 0;
    metricName = 'hana_fuzzy_in_memory (0 CU)';
    effectiveVolume = 0;
  } else if (primitive === 'Extractor / Transformer') {
    // SAP Document AI: Abrechnung pro Dokument/Seite (0.004 CU pro Beleg), nur für unstrukturierte Belege (ca. 20% Volumen)
    cuRatePerTx = 0.004;
    metricName = 'sap_document_ai_pages (0.004 CU)';
    effectiveVolume = Math.round(monthlyVolume * 0.20);
  } else if (primitive === 'Evaluator / Reasoner') {
    // Autonomous Risk / Decision Agent: Läuft nur für die 15% Ausnahmefälle mit Konfidenzlücken
    cuRatePerTx = 0.003;
    metricName = 'agent_decision_action (0.003 CU)';
    effectiveVolume = Math.round(monthlyVolume * 0.15);
  } else if (primitive === 'Executor / Actuator') {
    // Clean Core Verbuchung: RAP / OData BAPI (0 CU)
    cuRatePerTx = 0;
    metricName = 'clean_core_rap_commit (0 CU)';
    effectiveVolume = 0;
  } else if (primitive === 'Generator / Synthesizer' || archetype === 'copilot') {
    // Joule Copilot / Output Management: In Cloud ERP Joule Base Package enthalten (0 CU Zusatzkosten)
    cuRatePerTx = 0;
    metricName = 'joule_base_package (0 CU)';
    effectiveVolume = 0;
  }

  const monthlyCu = effectiveVolume * cuRatePerTx;
  const monthlyEur = monthlyCu * EUR_PER_CU;

  let typeLabel = 'SAP Standard Agent';
  if (item.type === 'ai_agent_partner') {
    typeLabel = 'SAP Certified Partner Agent';
  } else if (item.type === 'ai_assistant') {
    typeLabel = 'SAP Joule Assistant';
  }

  const worksWithList = detail.worksWith
    ? detail.worksWith.split(',').map((s) => s.trim())
    : (item.products || []).map((p) => p.productName || '').filter(Boolean);

  return {
    id: item.id,
    name: item.name,
    type: item.type,
    typeLabel,
    shortDescription: item.shortDescription || (isEn ? 'Standard SAP AI Agent' : 'Standard SAP Business AI Agent'),
    worksWith: worksWithList.length > 0 ? worksWithList : ['SAP S/4HANA Cloud'],
    metric: metricName,
    pricePerBlockAiu: cuRatePerTx,
    blockSize: 1,
    monthlyAiuEstimated: Math.round(monthlyCu * 10) / 10,
    monthlyCostEurEstimated: Math.round(monthlyEur * 10) / 10,
    isBillable: cuRatePerTx > 0,
    discoveryCenterUrl: `https://discovery-center.cloud.sap/ai-catalog/?search=${encodeURIComponent(item.name)}`,
    jarvisId: item.jarvisId,
    isGap: false,
  };
}

/**
 * Ermittelt für einen gegebenen Prozessschritt den passenden Agenten
 */
export function matchProcessStepToSapAgent(
  step: ProcessStep,
  monthlyVolume: number = 10000,
  lang: Language = 'de'
): SapAgentMatchResult {
  const isEn = lang === 'en';

  const stepText = [
    step.name,
    step.sapReference || '',
    step.description || '',
    step.businessIntent || '',
    step.inputDescription || '',
    step.outputDescription || '',
    step.primitive || '',
    step.sapGoldenPathTool || '',
  ].join(' ').toLowerCase();

  const tokens = stepText
    .replace(/[^\w\säöüÄÖÜß]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const { item: bestMatch, score: bestScore } = findBestCatalogMatch(stepText, tokens);

  // 1. Deterministische Schritte (Clean Core Fast-Path):
  if (step.currentArchetype === 'deterministic') {
    const exceptionAgent = bestMatch && bestScore >= 12
      ? buildSapAgentMatch(bestMatch, monthlyVolume, lang, step)
      : undefined;

    return {
      stepId: step.id,
      stepName: step.name,
      recommendationType: 'DETERMINISTIC_FAST_PATH',
      explanation: isEn
        ? 'Clean Core Fast-Path: 0 CU / 0 € inference cost. Runs directly on SAP S/4HANA Event Mesh, CDS Views or BRFplus.'
        : 'Clean Core Fast-Path: 0 CU / 0 € Inferenzkosten. Läuft direkt auf SAP S/4HANA Event Mesh, CDS Views oder BRFplus.',
      deterministicDetails: {
        engine: step.sapGoldenPathTool || 'SAP S/4HANA Event Mesh / ABAP CDS / BRFplus',
        stpRatePercent: step.confidenceGate || 95,
        tokenCostEur: 0,
      },
      matchedAgent: exceptionAgent,
      exceptionAgent,
    };
  }

  // 2. Kein fundierter Treffer -> Gap
  if (!bestMatch || bestScore < 14) {
    return {
      stepId: step.id,
      stepName: step.name,
      recommendationType: 'CUSTOM_GAP',
      matchedAgent: {
        id: `gap-${step.id}`,
        name: isEn ? 'No Standard SAP Agent Available' : 'Kein SAP Standard-Agent verfügbar',
        type: 'custom_needed' as any,
        typeLabel: isEn ? 'White Spot (Gap)' : 'Weißer Fleck (Gap)',
        shortDescription: isEn
          ? 'No ready-to-run agent in the SAP Discovery Center. Custom NCE microservice / BTP extension required.'
          : 'Kein schlüsselfertiger Agent im SAP Discovery Center gelistet. Maßgeschneiderte BTP-Erweiterung empfohlen.',
        worksWith: ['Custom BTP Kyma / Cloud Foundry'],
        metric: 'custom_code',
        pricePerBlockAiu: 0,
        blockSize: 1,
        monthlyAiuEstimated: 0,
        monthlyCostEurEstimated: 0,
        isBillable: false,
        discoveryCenterUrl: 'https://discovery-center.cloud.sap/ai-catalog/',
        isGap: true,
      },
      explanation: isEn ? 'Strategic White-Spot: No standard agent in SAP catalog.' : 'Strategischer weißer Fleck.',
    };
  }

  // 3. SAP Agent mit differenziertem CU-Preisschild
  const matchedAgent = buildSapAgentMatch(bestMatch, monthlyVolume, lang, step);
  let recommendationType: SapAgentMatchResult['recommendationType'] = 'SAP_STANDARD_AGENT';

  if (bestMatch.type === 'ai_agent_partner') {
    recommendationType = 'PARTNER_AGENT';
  } else if (bestMatch.type === 'ai_assistant' || step.currentArchetype === 'copilot') {
    recommendationType = 'JOULE_ASSISTANT';
  }

  return {
    stepId: step.id,
    stepName: step.name,
    matchedAgent,
    recommendationType,
    explanation: isEn
      ? `Matched to ${bestMatch.name} (${matchedAgent.typeLabel}) with ${matchedAgent.pricePerBlockAiu} CU / Tx.`
      : `Zugeordnet zu ${bestMatch.name} (${matchedAgent.typeLabel}) mit ${matchedAgent.pricePerBlockAiu} CU / Tx.`,
  };
}

/**
 * Führt das Discovery Center Matching für alle Prozessschritte durch
 */
export function matchAllStepsToSapAgents(
  steps: ProcessStep[],
  monthlyVolume: number = 10000,
  lang: Language = 'de'
): {
  matches: SapAgentMatchResult[];
  totalMonthlyAiu: number;
  totalMonthlyAiuCostEur: number;
  gapCount: number;
  standardAgentCount: number;
} {
  const matches = steps.map((s) => matchProcessStepToSapAgent(s, monthlyVolume, lang));

  let totalMonthlyAiu = 0;
  let totalMonthlyAiuCostEur = 0;
  let gapCount = 0;
  let standardAgentCount = 0;

  for (const m of matches) {
    if (m.recommendationType === 'DETERMINISTIC_FAST_PATH') {
      continue;
    }
    if (m.matchedAgent && !m.matchedAgent.isGap) {
      totalMonthlyAiu += m.matchedAgent.monthlyAiuEstimated;
      totalMonthlyAiuCostEur += m.matchedAgent.monthlyCostEurEstimated;
      standardAgentCount++;
    } else if (m.recommendationType === 'CUSTOM_GAP') {
      gapCount++;
    }
  }

  return {
    matches,
    totalMonthlyAiu: Math.round(totalMonthlyAiu * 10) / 10,
    totalMonthlyAiuCostEur: Math.round(totalMonthlyAiuCostEur * 10) / 10,
    gapCount,
    standardAgentCount,
  };
}

/**
 * Findet den ganzheitlichen SAP Joule Prozess-Assistenten
 */
export function findProcessAssistant(
  template: { scopeCode?: string; businessArea?: string; name?: string; domainCategory?: string },
  lang: Language = 'de'
): SapAgentMatch {
  const isEn = lang === 'en';
  const scope = (template.scopeCode || '').toUpperCase();
  const name = (template.name || '').toLowerCase();

  let assistantId = '10cc5d3d-d756-43ff-9a96-e1535635613a'; // Sales Operations Assistant by default

  if (scope === '2TX' || name.includes('services') || name.includes('dienstleistung')) {
    assistantId = '2f81c285-9835-451f-aa61-2d3d4e2c1cc7'; // Sourcing Assistant
  } else if (scope === 'J45' || name.includes('lagermaterial')) {
    assistantId = 'd71c2437-3a59-4f01-86b4-2e11943df581'; // Purchasing Assistant
  } else if (scope === '1A0' || name.includes('kontrakt') || name.includes('contract')) {
    assistantId = '80f7a5ed-db35-4d3e-9a63-f6da027dbb79'; // Procurement Contract Assistant
  } else if (scope === '2F1' || scope === '2B6' || name.includes('rechnung') || name.includes('invoice') || name.includes('payable')) {
    assistantId = '1842edfd-d3f3-46c3-9154-cc7af440830f'; // Accounts Payable Assistant
  } else if (scope === '1EZ' || name.includes('billing') || name.includes('faktura')) {
    assistantId = 'c2af7b30-3f8b-4651-b63b-3f193d0dc05d'; // Billing Assistant
  } else if (scope === 'BD9' || scope === 'BD3' || name.includes('order') || name.includes('auftrag')) {
    assistantId = '10cc5d3d-d756-43ff-9a96-e1535635613a'; // Sales Operations Assistant
  } else if (scope === 'J60' || name.includes('closing') || name.includes('abschluss')) {
    assistantId = '355d68c3-f86c-4e99-afab-7283a2e6f618'; // Financial Closing Assistant
  } else if (scope === '1GA' || scope === '1VD' || name.includes('receivable') || name.includes('debitor') || name.includes('kredit')) {
    assistantId = 'ea5ff1f9-4a6d-43a2-be69-d42a3cb76e66'; // Accounts Receivable Assistant
  } else if (scope === '1MV' || name.includes('treasury') || name.includes('cash') || name.includes('bank')) {
    assistantId = '47b652f0-94f4-4de1-a087-df1bcd0990d4'; // Cash and Treasury Assistant
  } else if (scope === '2C0' || scope === 'BJ2' || scope === '4HH' || name.includes('asset') || name.includes('instandhaltung') || name.includes('maintenance')) {
    assistantId = '9261f306-f329-43e3-a284-296fb2f42ae3'; // Asset Operations Assistant
  } else if (scope === '1B6' || scope === '1MB' || name.includes('receiving') || name.includes('wareneingang')) {
    assistantId = '2b34fe18-b81e-4844-a63d-d733ca2018f2'; // Receiving Assistant
  } else if (scope === '3BW' || name.includes('logistics') || name.includes('logistik') || name.includes('outbound')) {
    assistantId = '674e9dc6-1b69-4cd2-9ed1-76b2251dabc6'; // Logistics Assistant
  } else if (scope === 'BJ5' || name.includes('manufacturing') || name.includes('fertigung') || name.includes('production')) {
    assistantId = '071c3ce4-e11b-4dd8-bfd9-180f83d4c0f8'; // Manufacturing Assistant
  } else if (scope === '1E6' || name.includes('service') || name.includes('claim') || name.includes('reklamation')) {
    assistantId = '3950afb8-8e64-4c56-8aec-7977d834ef5e'; // Case Management Assistant
  }

  const rawItem = catalogItems.find((i) => i.id === assistantId) || catalogItems[0];
  const detail = catalogDetails[assistantId] || {};
  const worksWithList = detail.worksWith
    ? detail.worksWith.split(',').map((s) => s.trim())
    : (rawItem.products || []).map((p) => p.productName || '').filter(Boolean);

  return {
    id: rawItem.id,
    name: rawItem.name,
    type: 'ai_assistant',
    typeLabel: isEn ? 'SAP Joule End-to-End Assistant' : 'SAP Joule End-to-End Prozess-Assistent',
    shortDescription: rawItem.shortDescription || (isEn ? 'End-to-End Digital Copilot for Process Flow' : 'Ganzheitlicher digitaler Copilot für den Belegfluss'),
    worksWith: worksWithList.length > 0 ? worksWithList : ['SAP S/4HANA Cloud', 'SAP Business AI / Joule Base Package'],
    metric: 'included_in_joule_base (0 CU)',
    pricePerBlockAiu: 0,
    blockSize: 1,
    monthlyAiuEstimated: 0,
    monthlyCostEurEstimated: 0,
    isBillable: false,
    discoveryCenterUrl: `https://discovery-center.cloud.sap/ai-catalog/?search=${encodeURIComponent(rawItem.name)}`,
    isGap: false,
  };
}
