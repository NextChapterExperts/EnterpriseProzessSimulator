export type OODAPhase = 'Observe' | 'Orient' | 'Decide' | 'Act';

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

export const PRIMITIVE_ALLOWED_ARCHETYPES: Record<CognitivePrimitive, AutomationArchetype[]> = {
  'Filter / Gatekeeper': ['deterministic', 'classic_ml', 'autopilot', 'copilot'],
  'Extractor / Transformer': ['deterministic', 'classic_ml', 'autopilot', 'copilot'],
  'Matcher / Enricher': ['deterministic', 'classic_ml', 'autopilot', 'copilot'],
  'Evaluator / Reasoner': ['deterministic', 'classic_ml', 'autopilot', 'copilot'],
  'Executor / Actuator': ['deterministic', 'autopilot', 'copilot'],
  'Generator / Synthesizer': ['deterministic', 'classic_ml', 'autopilot', 'copilot'],
};

export type CleanCoreIndex = 'COMPLIANT' | 'LEGACY' | 'VIOLATION';

export type ReversibilityScore = 1 | 2 | 3 | 4 | 5;

export type ChallengeCluster =
  | 'DATA_CONTEXT_INTEGRITY'
  | 'RELIABILITY_DETERMINISM'
  | 'SECURITY_COMPLIANCE'
  | 'COST_PERFORMANCE_DECAY';

export interface RiskChallenge {
  id: string;
  name: string;
  cluster: ChallengeCluster;
  clusterName: string;
  description: string;
  triggerDescription: string;
  mitigationStrategy: string;
  severity: 'critical' | 'high' | 'medium';
  icon: string;
}

export type WorkflowLayer = 'flow' | 'quality' | 'cost' | 'risk' | 'architecture';

export type EuAiActRiskLevel = 'MINIMAL' | 'LIMITED' | 'HIGH';

export interface ProcessStep {
  id: string;
  name: string;
  oodaPhase: OODAPhase;
  primitive: CognitivePrimitive;
  currentArchetype: AutomationArchetype;
  confidenceGate: number; // 50 to 99 %
  cleanCoreIndex: CleanCoreIndex;
  reversibility: ReversibilityScore; // 1 to 5
  isUnstructuredInput: boolean;
  baseLatencyMs: number;
  baseTokensIn: number;
  baseTokensOut: number;
  damageAmountEur: number;
  sapReference: string;
  description: string;
  sapGoldenPathTool?: string;
  sapGoldenPathGraph?: string;
  euAiActRisk?: EuAiActRiskLevel;
  businessIntent?: string;
  inputDescription?: string;
  outputDescription?: string;
  requiredLicense?: string;
  sapAgentMatch?: SapAgentMatchResult;
}

export interface ProcessTemplate {
  id: string;
  scopeCode: string;
  name: string;
  businessArea: string;
  description: string;
  steps: ProcessStep[];
}

export interface SimulationConfig {
  monthlyVolume: number; // e.g. 10,000 to 500,000
  dataNoiseRate: number; // 0 to 1.0 (0% to 100%)
  hourlyWageEur: number; // e.g. 55 €/h
  resolutionTimeMinutes: number; // e.g. 12 min per escalation
  cuPriceFactorEur: number; // cost per Capacity Unit (e.g. 1.20 € / CU)
}

export interface StepCalculatedMetrics {
  stepId: string;
  archetype: AutomationArchetype;
  capacityUnits: number;
  cuCostEur: number;
  humanResolutionCostEur: number;
  riskCostEur: number;
  totalCostEur: number;
  effectiveAutomationRate: number; // 0.0 to 1.0
  latencyMs: number;
  triggeredChallengeIds: string[];
  guardrailViolation: boolean;
  guardrailMessage?: string;
  guardrailMessageEn?: string;
}

export interface OverallSimulationMetrics {
  totalCostOfAutomationEur: number;
  sapCapacityUnits: number;
  sapCuCostEur: number;
  humanEscalationCostEur: number;
  riskDamageCostEur: number;
  endToEndLatencySec: number;
  lightsOutAutomationRate: number; // 0 to 100 %
  cleanCoreScore: number; // 0 to 100 %
  monthlySavingsVsManualEur: number;
  baselineManualCostEur: number;
  activeViolationsCount: number;
}

export interface DryRunStepTrace {
  stepId: string;
  stepName: string;
  oodaPhase: OODAPhase;
  primitive: CognitivePrimitive;
  archetype: AutomationArchetype;
  status: 'success' | 'escalation' | 'error' | 'degraded';
  latencyMs: number;
  tokensUsed: number;
  subCalls: number;
  inputData: any;
  outputData: any;
  logMessage: string;
  triggeredChallenges: string[];
  cleanCoreStatus: CleanCoreIndex;
  confidence?: number;
  techniqueName?: string;
  techniqueMechanism?: string;
  isSelfHealed?: boolean;
}

export interface DryRunExecutionResult {
  sampleId: string;
  sampleTitle: string;
  timestamp: string;
  overallStatus: 'success' | 'escalated_to_human' | 'failed_guardrail';
  totalLatencyMs: number;
  totalTokens: number;
  totalCapacityUnits: number;
  traces: DryRunStepTrace[];
}

export type SapCatalogItemType =
  | 'ai_agent'
  | 'ai_assistant'
  | 'ai_agent_partner'
  | 'ai_feature'
  | 'ai_feature_package'
  | 'ai_agent_package';

export interface SapAgentMatch {
  id: string;
  name: string;
  type: SapCatalogItemType;
  typeLabel: string;
  shortDescription: string;
  worksWith: string[];
  metric: string;
  pricePerBlockAiu: number;
  blockSize: number;
  monthlyAiuEstimated: number;
  monthlyCostEurEstimated: number;
  isBillable: boolean;
  discoveryCenterUrl: string;
  jarvisId?: string;
  isGap?: boolean;
  gapReason?: string;
}

export interface SapAgentMatchResult {
  stepId: string;
  stepName: string;
  matchedAgent?: SapAgentMatch;
  recommendationType: 'SAP_STANDARD_AGENT' | 'PARTNER_AGENT' | 'JOULE_ASSISTANT' | 'DETERMINISTIC_FAST_PATH' | 'CUSTOM_GAP';
  explanation: string;
}
