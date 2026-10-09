import { ProcessStep, SapAgentMatch, SapAgentMatchResult, SapCatalogItemType } from '@/types/process';
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
 * Ermittelt für einen gegebenen Prozessschritt den am besten passenden
 * SAP Business AI Agenten / Assistenten aus dem Live-Katalog des SAP Discovery Centers.
 */
export function matchProcessStepToSapAgent(
  step: ProcessStep,
  monthlyVolume: number = 10000,
  lang: Language = 'de'
): SapAgentMatchResult {
  const isEn = lang === 'en';

  // 1. Deterministische Schritte benötigen kein LLM / Agenten
  if (step.currentArchetype === 'deterministic') {
    return {
      stepId: step.id,
      stepName: step.name,
      recommendationType: 'DETERMINISTIC_FAST_PATH',
      explanation: isEn
        ? '100% Straight-Through Processing (STP). No AI model needed (0 Tokens, 0 AIU costs). Runs directly in SAP S/4HANA Clean Core / BRFplus.'
        : '100% Dunkelverarbeitung (STP). Kein KI-Modell erforderlich (0 Tokens, 0 AIU Kosten). Ausführung direkt im SAP S/4HANA Clean Core / BRFplus.',
    };
  }

  // 2. Textbasis für Ähnlichkeitsabgleich aufbauen
  const stepText = [
    step.name,
    step.sapReference || '',
    step.description || '',
    step.businessIntent || '',
    step.inputDescription || '',
    step.outputDescription || '',
    step.primitive || '',
  ].join(' ').toLowerCase();

  // Relevante Suchbegriffe isolieren
  const tokens = stepText
    .replace(/[^\w\säöüÄÖÜß]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  let bestMatch: CatalogItem | null = null;
  let bestScore = 0;

  for (const item of catalogItems) {
    let score = 0;
    const itemName = (item.name || '').toLowerCase();
    const itemDesc = (item.shortDescription || '').toLowerCase();
    const itemProducts = (item.products || []).map((p) => (p.productName || '').toLowerCase()).join(' ');

    // Typ-Gewichtung: Volle autonome Agenten bevorzugen
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
      if (itemName.includes('invoice') || itemName.includes('document extraction') || itemName.includes('payable')) {
        score += 15;
      }
    }
    if (stepText.includes('order') || stepText.includes('auftrag') || stepText.includes('bestellung') || stepText.includes('confirmation')) {
      if (itemName.includes('order') || itemName.includes('sales order') || itemName.includes('purchase order')) {
        score += 15;
      }
    }
    if (stepText.includes('credit') || stepText.includes('kredit') || stepText.includes('block') || stepText.includes('limit')) {
      if (itemName.includes('credit') || itemName.includes('block')) {
        score += 20;
      }
    }
    if (stepText.includes('claim') || stepText.includes('reklamation') || stepText.includes('dispute') || stepText.includes('alert')) {
      if (itemName.includes('dispute') || itemName.includes('claim') || itemName.includes('alert resolution')) {
        score += 20;
      }
    }
    if (stepText.includes('matching') || stepText.includes('abgleich') || stepText.includes('three-way') || stepText.includes('3-way')) {
      if (itemName.includes('matching') || itemName.includes('match reconciliation') || itemName.includes('clearing')) {
        score += 20;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  // Schwellenwert für fundierten Match (unter 15 Punkten ist es ein Gap)
  if (!bestMatch || bestScore < 15) {
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

  // Detail-Daten anreichern falls vorhanden
  const detail = catalogDetails[bestMatch.id] || {};
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

  // Monatliche Kostenhochrechnung
  const monthlyAiu = (monthlyVolume / blockSize) * pricePerBlock;
  const monthlyEur = monthlyAiu * EUR_PER_AIU;

  let typeLabel = 'SAP Standard Agent';
  let recommendationType: SapAgentMatchResult['recommendationType'] = 'SAP_STANDARD_AGENT';

  if (bestMatch.type === 'ai_agent_partner') {
    typeLabel = 'SAP Certified Partner Agent';
    recommendationType = 'PARTNER_AGENT';
  } else if (bestMatch.type === 'ai_assistant') {
    typeLabel = 'SAP Joule Assistant';
    recommendationType = 'JOULE_ASSISTANT';
  }

  const worksWithList = detail.worksWith
    ? detail.worksWith.split(',').map((s) => s.trim())
    : (bestMatch.products || []).map((p) => p.productName || '').filter(Boolean);

  const matchedAgent: SapAgentMatch = {
    id: bestMatch.id,
    name: bestMatch.name,
    type: bestMatch.type,
    typeLabel,
    shortDescription: bestMatch.shortDescription || 'Standard SAP AI Agent',
    worksWith: worksWithList.length > 0 ? worksWithList : ['SAP S/4HANA Cloud'],
    metric: metricName,
    pricePerBlockAiu: pricePerBlock,
    blockSize,
    monthlyAiuEstimated: Math.round(monthlyAiu * 100) / 100,
    monthlyCostEurEstimated: Math.round(monthlyEur * 100) / 100,
    isBillable: bestMatch.isBillable !== false,
    discoveryCenterUrl: `https://discovery-center.cloud.sap/ai-catalog/?id=${bestMatch.id}`,
    jarvisId: bestMatch.jarvisId,
    isGap: false,
  };

  return {
    stepId: step.id,
    stepName: step.name,
    matchedAgent,
    recommendationType,
    explanation: isEn
      ? `Matched to ${bestMatch.name} (${typeLabel}) based on semantic domain and intent.`
      : `Zugeordnet zu ${bestMatch.name} (${typeLabel}) anhand fachlicher Domäne und Intent.`,
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
