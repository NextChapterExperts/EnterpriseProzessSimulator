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

// EUR-Wechselkurs für 1 SAP AI Unit (offizieller Listenpreis: ~1.00 USD -> 0.92 EUR)
const EUR_PER_AIU = 0.92;

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

    // Typ-Gewichtung: Autonome Agenten bevorzugen
    if (item.type === 'ai_agent') score += 6;
    else if (item.type === 'ai_agent_partner') score += 4;
    else if (item.type === 'ai_assistant') score += 3;

    // Spezifische Namens- und Domänentreffer
    for (const t of tokens) {
      if (itemName.includes(t)) score += 5;
      else if (itemDesc.includes(t)) score += 2;
      else if (itemProducts.includes(t)) score += 1.5;
    }

    // Gezielte Heuristiken für SAP Kernprozesse
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
 * Erstellt das SapAgentMatch-Objekt aus einem Katalogeintrag
 */
function buildSapAgentMatch(
  item: CatalogItem,
  monthlyVolume: number,
  lang: Language = 'de',
  isDeterministicStep: boolean = false
): SapAgentMatch {
  const isEn = lang === 'en';
  const detail = catalogDetails[item.id] || {};
  let pricePerBlock = 0.02; // Standard SAP AIU pro Agent Action
  let metricName = 'ai_agent_actions';
  let blockSize = 1;

  if (detail.entitlementRulesList && detail.entitlementRulesList.length > 0) {
    const ratePlan = detail.entitlementRulesList[0]?.ratePlans?.[0];
    const blockRate = ratePlan?.blockRateList?.[0];
    if (blockRate) {
      pricePerBlock = parseFloat(blockRate.pricePerBlock || '0.02');
      blockSize = parseInt(blockRate.blockSize || '1', 10);
      metricName = blockRate.metricId || metricName;
    }
  }

  // Bei deterministischen Fast-Path Schritten fallen nur für Ausnahmen AIU an (z. B. 10% Ausnahme-Volumen)
  const effectiveVolume = isDeterministicStep ? Math.round(monthlyVolume * 0.10) : monthlyVolume;
  const monthlyAiu = (effectiveVolume / blockSize) * pricePerBlock;
  const monthlyEur = monthlyAiu * EUR_PER_AIU;

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
    pricePerBlockAiu: pricePerBlock,
    blockSize,
    monthlyAiuEstimated: Math.round(monthlyAiu * 100) / 100,
    monthlyCostEurEstimated: Math.round(monthlyEur * 100) / 100,
    isBillable: item.isBillable !== false,
    discoveryCenterUrl: `https://discovery-center.cloud.sap/ai-catalog/?id=${item.id}`,
    jarvisId: item.jarvisId,
    isGap: false,
  };
}

/**
 * Ermittelt für einen gegebenen Prozessschritt den am besten passenden
 * SAP Business AI Agenten / Assistenten aus dem Live-Katalog des SAP Discovery Centers.
 */
export function matchProcessStepToSapAgent(
  step: ProcessStep,
  monthlyVolume: number = 10000,
  lang: Language = 'de'
): SapAgentMatchResult {
  const isEn = lang === 'en';

  // Textbasis für Ähnlichkeitsabgleich aufbauen
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

  // Relevante Suchbegriffe isolieren
  const tokens = stepText
    .replace(/[^\w\säöüÄÖÜß]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const { item: bestMatch, score: bestScore } = findBestCatalogMatch(stepText, tokens);

  // 1. Deterministische Schritte (Clean Core Fast-Path):
  // 80-95% STP ohne Tokens, aber mit Agenten-Zuweisung für Ausnahmen!
  if (step.currentArchetype === 'deterministic') {
    const exceptionAgent = bestMatch && bestScore >= 12
      ? buildSapAgentMatch(bestMatch, monthlyVolume, lang, true)
      : undefined;

    return {
      stepId: step.id,
      stepName: step.name,
      recommendationType: 'DETERMINISTIC_FAST_PATH',
      explanation: isEn
        ? 'Clean Core Fast-Path (0 Tokens, 0 € BTP costs for standard volume). Runs directly via SAP S/4HANA Event Mesh, CDS Views or BRFplus.'
        : 'Clean Core Fast-Path (0 Tokens, 0 € BTP-Kosten für Standardvolumen). Läuft direkt über SAP S/4HANA Event Mesh, CDS Views oder BRFplus.',
      deterministicDetails: {
        engine: step.sapGoldenPathTool || 'SAP S/4HANA Event Mesh / ABAP CDS / BRFplus',
        stpRatePercent: step.confidenceGate || 95,
        tokenCostEur: 0,
      },
      matchedAgent: exceptionAgent,
      exceptionAgent,
    };
  }

  // 2. Kein fundierter Treffer -> Strategischer weißer Fleck (Gap)
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
          : 'Kein schlüsselfertiger Agent im SAP Discovery Center gelistet. Maßgeschneiderter NCE-Microservice / BTP-Erweiterung empfohlen.',
        worksWith: ['Custom BTP Kyma / Cloud Foundry'],
        metric: 'custom_code',
        pricePerBlockAiu: 0,
        blockSize: 1,
        monthlyAiuEstimated: 0,
        monthlyCostEurEstimated: 0,
        isBillable: false,
        discoveryCenterUrl: 'https://discovery-center.cloud.sap/ai-catalog/',
        isGap: true,
        gapReason: isEn
          ? 'SAP provides no pre-built agent for this specific business step. Opportunity for tailored competitive advantage.'
          : 'SAP bietet für diesen spezifischen Prozessschritt keinen Standard-Agenten. Chance zur Differenzierung durch Eigenentwicklung.',
      },
      explanation: isEn
        ? 'Strategic White-Spot: No standard agent exists in the SAP catalog for this logic.'
        : 'Strategischer weißer Fleck: Kein Standard-Agent im SAP-Katalog für diesen Schritt gelistet.',
    };
  }

  // 3. SAP Standard oder Partner Agent gefunden
  const matchedAgent = buildSapAgentMatch(bestMatch, monthlyVolume, lang, false);
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
      ? `Matched to ${bestMatch.name} (${matchedAgent.typeLabel}) via SAP Discovery Center catalog.`
      : `Zugeordnet zu ${bestMatch.name} (${matchedAgent.typeLabel}) aus dem SAP Discovery Center Katalog.`,
  };
}

/**
 * Führt das Discovery Center Matching für alle Prozessschritte durch
 * und summiert die monatlichen SAP AI Unit Kosten.
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
    totalMonthlyAiu: Math.round(totalMonthlyAiu * 100) / 100,
    totalMonthlyAiuCostEur: Math.round(totalMonthlyAiuCostEur * 100) / 100,
    gapCount,
    standardAgentCount,
  };
}

/**
 * Findet den ganzheitlichen SAP Joule Prozess-Assistenten für eine gesamte Vorlage / Fachdomäne.
 */
export function findProcessAssistant(
  template: { scopeCode?: string; businessArea?: string; name?: string; domainCategory?: string },
  lang: Language = 'de'
): SapAgentMatch {
  const isEn = lang === 'en';
  const scope = (template.scopeCode || '').toUpperCase();
  const name = (template.name || '').toLowerCase();
  const category = template.domainCategory;

  let assistantId = '10cc5d3d-d756-43ff-9a96-e1535635613a'; // Sales Operations Assistant by default

  if (category === 'O2C' || scope === 'BD9' || scope === 'BD3' || scope === '1EZ' || name.includes('order') || name.includes('auftrag')) {
    if (name.includes('billing') || name.includes('faktura') || scope === '1EZ') {
      assistantId = 'c2af7b30-3f8b-4651-b63b-3f193d0dc05d'; // Billing Assistant
    } else {
      assistantId = '10cc5d3d-d756-43ff-9a96-e1535635613a'; // Sales Operations Assistant
    }
  } else if (category === 'P2P' || scope === '2F1' || scope === '2B6' || name.includes('rechnung') || name.includes('invoice') || name.includes('payable')) {
    assistantId = '1842edfd-d3f3-46c3-9154-cc7af440830f'; // Accounts Payable Assistant
  } else if (scope === 'J45' || scope === '2TX' || scope === '1A0' || name.includes('procure') || name.includes('einkauf') || name.includes('sourcing')) {
    assistantId = 'd71c2437-3a59-4f01-86b4-2e11943df581'; // Purchasing Assistant
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
  } else if (scope === 'BJ5' || scope === '1GA' || name.includes('manufacturing') || name.includes('fertigung') || name.includes('production')) {
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
    metric: 'included_in_joule_base',
    pricePerBlockAiu: 0,
    blockSize: 1,
    monthlyAiuEstimated: 0,
    monthlyCostEurEstimated: 0,
    isBillable: false,
    discoveryCenterUrl: `https://discovery-center.cloud.sap/ai-catalog/?id=${rawItem.id}`,
    isGap: false,
  };
}
