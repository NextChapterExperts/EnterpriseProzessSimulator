import { create } from 'zustand';
import {
  ProcessStep,
  ProcessTemplate,
  SimulationConfig,
  OverallSimulationMetrics,
  AutomationArchetype,
  CleanCoreIndex,
  DryRunExecutionResult,
  WorkflowLayer,
} from '@/types/process';
import { PROCESS_TEMPLATES, getProcessTemplates } from '@/data/templates';
import { calculateOverallMetrics } from '@/lib/tcaCalculator';
import { ParetoSolver, ParetoOptimizationResult } from '@/lib/paretoSolver';
import { DryRunEngine } from '@/lib/dryRunEngine';
import { Language, TRANSLATIONS } from '@/i18n/translations';
import { matchAllStepsToSapAgents } from '@/lib/sapAiCatalogMatcher';


function enrichStepsWithSapAgents(steps: ProcessStep[], monthlyVolume: number, lang: Language): ProcessStep[] {
  const matching = matchAllStepsToSapAgents(steps, monthlyVolume, lang);
  return steps.map((s) => {
    const match = matching.matches.find((m) => m.stepId === s.id);
    return {
      ...s,
      sapAgentMatch: match,
    };
  });
}

export type ViewTab = 'canvas' | 'cockpit' | 'blueprint';

interface SimulatorState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  language: Language;
  currentTemplate: ProcessTemplate;
  customTemplates: ProcessTemplate[];
  steps: ProcessStep[];
  config: SimulationConfig;
  metrics: OverallSimulationMetrics;
  selectedStepId: string | null;
  activeChallengeId: string | null;
  activeZwingmannInfo: AutomationArchetype | null;
  activeViewTab: ViewTab;
  activeMainTab: 'simulator' | 'matrix';
  activeWorkflowLayer: WorkflowLayer;
  setActiveWorkflowLayer: (layer: WorkflowLayer) => void;
  dryRunResult: DryRunExecutionResult;
  lastParetoResult: ParetoOptimizationResult | null;
  previousStepsBeforePareto: ProcessStep[] | null;
  isParetoModalOpen: boolean;
  isBlueprintOpen: boolean;
  isDryRunOpen: boolean;
  isCalculatorOpen: boolean;
  selectedMessageQuality: 'good' | 'poor';
  customMessageText: string | null;
  customSender: string | null;
  customSubject: string | null;

  // Human-in-the-Loop Entscheidungen für Copilot- & Freigabeschritte
  stepDecisions: Record<string, {
    status: 'pending' | 'approved' | 'modified' | 'rejected';
    note?: string;
    decidedAt?: string;
  }>;

  // Live Animation / Steuerung der Simulation
  isSimulating: boolean;
  simulationStepIndex: number;
  simulationSpeedMs: number;
  simulationStatusText: string;

  // Actions
  setLanguage: (lang: Language) => void;
  selectTemplate: (templateId: string) => void;
  addCustomTemplate: (template: ProcessTemplate) => void;
  setMessageQuality: (quality: 'good' | 'poor') => void;
  setCustomMessage: (text: string | null, sender?: string, subject?: string) => void;
  loadCustomIntent: (intentDescription: string) => void;
  setMonthlyVolume: (volume: number) => void;
  setDataNoiseRate: (noise: number) => void;
  setHourlyWageEur: (wage: number) => void;
  updateStepArchetype: (stepId: string, archetype: AutomationArchetype) => void;
  updateStepConfidence: (stepId: string, confidence: number) => void;
  updateStepCleanCore: (stepId: string, cleanCore: CleanCoreIndex) => void;
  setSelectedStepId: (stepId: string | null) => void;
  openChallengeDrawer: (challengeId: string) => void;
  closeChallengeDrawer: () => void;
  openZwingmannInfo: (archetype: AutomationArchetype) => void;
  closeZwingmannInfo: () => void;
  setActiveViewTab: (tab: ViewTab) => void;
  setActiveMainTab: (tab: 'simulator' | 'matrix') => void;
  isConfigModalOpen: boolean;
  toggleConfigModal: (open?: boolean) => void;
  setResolutionTimeMinutes: (mins: number) => void;
  setCuPriceFactorEur: (factor: number) => void;
  toggleBlueprint: (open?: boolean) => void;
  toggleDryRun: (open?: boolean) => void;
  toggleParetoModal: (open?: boolean) => void;
  toggleCalculatorModal: (open?: boolean) => void;
  activeStepKnowledgeId: string | null;
  openStepKnowledge: (stepId: string) => void;
  closeStepKnowledge: () => void;
  isProcessKnowledgeOpen: boolean;
  openProcessKnowledge: () => void;
  closeProcessKnowledge: () => void;
  isEvaluationMatrixOpen: boolean;
  openEvaluationMatrix: () => void;
  closeEvaluationMatrix: () => void;
  toggleEvaluationMatrix: (open?: boolean) => void;
  runParetoOptimization: () => ParetoOptimizationResult;
  revertParetoOptimization: () => void;
  executeDryRun: () => void;

  // Human-in-the-Loop Actions
  setStepDecision: (
    stepId: string,
    status: 'pending' | 'approved' | 'modified' | 'rejected',
    note?: string
  ) => void;
  approveAndContinueSimulation: (stepId: string) => void;
  resetStepDecision: (stepId: string) => void;
  
  // Live Simulator Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  stepSimulationForward: () => void;
  resetSimulation: () => void;
  setSimulationSpeed: (speedMs: number) => void;

  // AI Conversational Advisor Actions
  applyGeneratedProcess: (
    title: string,
    scopeCode: string,
    steps: ProcessStep[],
    monthlyVolume: number,
    executiveSummary?: string
  ) => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang === 'en' || urlLang === 'de') {
        localStorage.setItem('sap_simulator_lang', urlLang);
        return urlLang as Language;
      }
      const saved = localStorage.getItem('sap_simulator_lang');
      if (saved === 'en' || saved === 'de') {
        return saved as Language;
      }
    } catch {
      // ignore
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();
const initialTemplate = getProcessTemplates(initialLang)[0] || PROCESS_TEMPLATES[0];
const initialConfig: SimulationConfig = {
  monthlyVolume: 25000,
  dataNoiseRate: 0.15,
  hourlyWageEur: 55,
  resolutionTimeMinutes: 12,
  cuPriceFactorEur: 1.2,
};

let simulationTimer: NodeJS.Timeout | null = null;

function applyThemeToDocument(theme: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem('sap_simulator_theme', theme);
    } catch {
      // ignore
    }
  }
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sap_simulator_theme');
    if (saved === 'dark' || saved === 'light') {
      applyThemeToDocument(saved);
      return saved;
    }
  }
  // Default: echt hell
  applyThemeToDocument('light');
  return 'light';
};

function mergeTemplates(builtIn: ProcessTemplate[], custom: ProcessTemplate[]): ProcessTemplate[] {
  const map = new Map<string, ProcessTemplate>();
  builtIn.forEach((t) => map.set(t.id, t));
  custom.forEach((t) => map.set(t.id, t));
  return Array.from(map.values());
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme: 'light' | 'dark') => {
    applyThemeToDocument(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    applyThemeToDocument(next);
    set({ theme: next });
  },
  language: initialLang,
  currentTemplate: initialTemplate,
  customTemplates: [],
  steps: initialTemplate.steps,
  config: initialConfig,
  metrics: calculateOverallMetrics(initialTemplate.steps, initialConfig),
  selectedStepId: initialTemplate.steps[0].id,
  activeChallengeId: null,
  activeZwingmannInfo: null,
  activeViewTab: 'canvas',
  activeMainTab: 'simulator',
  activeWorkflowLayer: 'flow',
  setActiveWorkflowLayer: (layer: WorkflowLayer) => set({ activeWorkflowLayer: layer }),
  selectedMessageQuality: 'good',
  customMessageText: null,
  customSender: null,
  customSubject: null,
  dryRunResult: DryRunEngine.execute(initialTemplate.steps, initialTemplate.id, 'good', null, null, null),
  lastParetoResult: null,
  previousStepsBeforePareto: null,
  isParetoModalOpen: false,
  isBlueprintOpen: false,
  isDryRunOpen: false,
  isCalculatorOpen: false,
  isConfigModalOpen: false,
  activeStepKnowledgeId: null,
  isProcessKnowledgeOpen: false,
  isEvaluationMatrixOpen: false,
  stepDecisions: {},

  isSimulating: false,
  simulationStepIndex: -1,
  simulationSpeedMs: 1500,
  simulationStatusText: '',

  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sap_simulator_lang', lang);
      } catch {
        // ignore
      }
    }
    const currentTmpl = get().currentTemplate;
    const allTemplates = mergeTemplates(getProcessTemplates(lang), get().customTemplates);
    const matchedTmpl = allTemplates.find((t) => t.id === currentTmpl.id) || allTemplates[0];

    // Vorhandene Konfigurationen der Schritte (Archetyp, Konfidenz) beibehalten
    const currentSteps = get().steps;
    const updatedSteps = matchedTmpl.steps.map((templateStep) => {
      const existing = currentSteps.find((s) => s.id === templateStep.id);
      if (existing) {
        return {
          ...templateStep,
          currentArchetype: existing.currentArchetype,
          confidenceGate: existing.confidenceGate,
          cleanCoreIndex: existing.cleanCoreIndex,
        };
      }
      return templateStep;
    });

    const enrichedSteps = enrichStepsWithSapAgents(updatedSteps, get().config.monthlyVolume, lang);
    const newMetrics = calculateOverallMetrics(enrichedSteps, get().config);
    const newDryRun = DryRunEngine.execute(
      enrichedSteps,
      matchedTmpl.id,
      get().selectedMessageQuality,
      get().customMessageText,
      get().customSender,
      get().customSubject,
      lang
    );

    set({
      language: lang,
      currentTemplate: matchedTmpl,
      steps: enrichedSteps,
      metrics: newMetrics,
      dryRunResult: newDryRun,
    });
  },

  selectTemplate: (templateId: string) => {
    if (simulationTimer) clearInterval(simulationTimer);
    const lang = get().language;
    const allTemplates = mergeTemplates(getProcessTemplates(lang), get().customTemplates);
    const template = allTemplates.find((t) => t.id === templateId) || allTemplates[0];
    const enrichedSteps = enrichStepsWithSapAgents(template.steps, get().config.monthlyVolume, lang);
    const newMetrics = calculateOverallMetrics(enrichedSteps, get().config);
    const newDryRun = DryRunEngine.execute(
      enrichedSteps,
      template.id,
      get().selectedMessageQuality,
      null,
      null,
      null,
      lang
    );
    const initialSelectedStep = template.steps.length > 1 ? template.steps[1].id : template.steps[0]?.id;
    set({
      currentTemplate: template,
      steps: enrichedSteps,
      metrics: newMetrics,
      selectedStepId: initialSelectedStep || null,
      customMessageText: null,
      customSender: null,
      customSubject: null,
      dryRunResult: newDryRun,
      lastParetoResult: null,
      previousStepsBeforePareto: null,
      isParetoModalOpen: false,
      stepDecisions: {},
      isSimulating: false,
      simulationStepIndex: -1,
      simulationStatusText: '',
    });
  },

  addCustomTemplate: (template: ProcessTemplate) => {
    if (simulationTimer) clearInterval(simulationTimer);
    const lang = get().language;
    const currentCustom = get().customTemplates;
    const existingIndex = currentCustom.findIndex(
      (t) => t.id === template.id || (t.scopeCode === template.scopeCode && t.name === template.name)
    );

    let newCustomTemplates: ProcessTemplate[];
    const builtIns = getProcessTemplates(lang);
    const isBuiltIn = builtIns.some((t) => t.id === template.id);
    const wasOverwritten = existingIndex >= 0 || isBuiltIn;

    if (existingIndex >= 0) {
      newCustomTemplates = [...currentCustom];
      newCustomTemplates[existingIndex] = template;
    } else {
      newCustomTemplates = [...currentCustom, template];
    }

    const enrichedSteps = enrichStepsWithSapAgents(template.steps, get().config.monthlyVolume, lang);
    const newMetrics = calculateOverallMetrics(enrichedSteps, get().config);
    const newDryRun = DryRunEngine.execute(
      enrichedSteps,
      template.id,
      get().selectedMessageQuality,
      null,
      null,
      null,
      lang
    );
    const initialSelectedStep = template.steps.length > 1 ? template.steps[1].id : template.steps[0]?.id;
    set({
      customTemplates: newCustomTemplates,
      currentTemplate: template,
      steps: enrichedSteps,
      metrics: newMetrics,
      selectedStepId: initialSelectedStep || null,
      customMessageText: null,
      customSender: null,
      customSubject: null,
      dryRunResult: newDryRun,
      lastParetoResult: null,
      previousStepsBeforePareto: null,
      isParetoModalOpen: false,
      stepDecisions: {},
      isSimulating: false,
      simulationStepIndex: -1,
      simulationStatusText: wasOverwritten
        ? (lang === 'en'
            ? `✓ Workflow "${template.name}" updated (overwritten).`
            : `✓ Workflow "${template.name}" aktualisiert (überschrieben).`)
        : (lang === 'en'
            ? `✓ Workflow "${template.name}" loaded.`
            : `✓ Workflow "${template.name}" geladen.`),
    });
  },

  setMessageQuality: (quality: 'good' | 'poor') => {
    if (simulationTimer) clearInterval(simulationTimer);
    const state = get();
    const newDryRun = DryRunEngine.execute(
      state.steps,
      state.currentTemplate.id,
      quality,
      null,
      null,
      null,
      state.language
    );
    set({
      selectedMessageQuality: quality,
      customMessageText: null,
      customSender: null,
      customSubject: null,
      dryRunResult: newDryRun,
      stepDecisions: {},
      isSimulating: false,
      simulationStepIndex: -1,
      simulationStatusText: '',
    });
  },

  setCustomMessage: (text: string | null, sender?: string, subject?: string) => {
    if (simulationTimer) clearInterval(simulationTimer);
    const state = get();
    const newDryRun = DryRunEngine.execute(
      state.steps,
      state.currentTemplate.id,
      state.selectedMessageQuality,
      text,
      sender || state.customSender,
      subject || state.customSubject,
      state.language
    );
    set({
      customMessageText: text,
      customSender: sender !== undefined ? sender : state.customSender,
      customSubject: subject !== undefined ? subject : state.customSubject,
      dryRunResult: newDryRun,
      isSimulating: false,
      simulationStepIndex: -1,
      simulationStatusText: '',
    });
  },

  loadCustomIntent: (intentDescription: string) => {
    if (simulationTimer) clearInterval(simulationTimer);
    const lower = intentDescription.toLowerCase();
    const isService = lower.includes('service') || lower.includes('reparatur') || lower.includes('wartung') || lower.includes('repair');
    const isFinance = lower.includes('rechnung') || lower.includes('zahlung') || lower.includes('avis') || lower.includes('invoice') || lower.includes('clearing');

    const templates = getProcessTemplates(get().language);
    const baseTemplate = isService
      ? templates[1]
      : isFinance
      ? templates[2]
      : templates[0];

    const customizedTemplate: ProcessTemplate = {
      ...baseTemplate,
      id: 'custom-' + Date.now(),
      name: `Custom: ${intentDescription.slice(0, 28)}...`,
      description: intentDescription,
    };

    get().addCustomTemplate(customizedTemplate);
  },

  setMonthlyVolume: (volume: number) => {
    const newConfig = { ...get().config, monthlyVolume: volume };
    const newMetrics = calculateOverallMetrics(get().steps, newConfig);
    set({ config: newConfig, metrics: newMetrics });
  },

  setDataNoiseRate: (noise: number) => {
    const newConfig = { ...get().config, dataNoiseRate: noise };
    const newMetrics = calculateOverallMetrics(get().steps, newConfig);
    const s = get();
    const newDryRun = DryRunEngine.execute(
      s.steps,
      s.currentTemplate.id,
      s.selectedMessageQuality,
      s.customMessageText,
      s.customSender,
      s.customSubject,
      s.language
    );
    set({ config: newConfig, metrics: newMetrics, dryRunResult: newDryRun });
  },

  setHourlyWageEur: (wage: number) => {
    const newConfig = { ...get().config, hourlyWageEur: wage };
    const newMetrics = calculateOverallMetrics(get().steps, newConfig);
    set({ config: newConfig, metrics: newMetrics });
  },

  updateStepArchetype: (stepId: string, archetype: AutomationArchetype) => {
    const s = get();
    const newSteps = s.steps.map((st) => (st.id === stepId ? { ...st, currentArchetype: archetype } : st));
    const newMetrics = calculateOverallMetrics(newSteps, s.config);
    const newDryRun = DryRunEngine.execute(
      newSteps,
      s.currentTemplate.id,
      s.selectedMessageQuality,
      s.customMessageText,
      s.customSender,
      s.customSubject,
      s.language
    );
    set({ steps: newSteps, metrics: newMetrics, dryRunResult: newDryRun });
  },

  updateStepConfidence: (stepId: string, confidence: number) => {
    const newSteps = get().steps.map((s) => (s.id === stepId ? { ...s, confidenceGate: confidence } : s));
    const newMetrics = calculateOverallMetrics(newSteps, get().config);
    set({ steps: newSteps, metrics: newMetrics });
  },

  updateStepCleanCore: (stepId: string, cleanCore: CleanCoreIndex) => {
    const newSteps = get().steps.map((s) => (s.id === stepId ? { ...s, cleanCoreIndex: cleanCore } : s));
    const newMetrics = calculateOverallMetrics(newSteps, get().config);
    set({ steps: newSteps, metrics: newMetrics });
  },

  setSelectedStepId: (stepId: string | null) => {
    const stepIdx = get().steps.findIndex((s) => s.id === stepId);
    set({
      selectedStepId: stepId,
      ...(!get().isSimulating ? { simulationStepIndex: stepIdx >= 0 ? stepIdx : -1 } : {}),
    });
  },

  openChallengeDrawer: (challengeId: string) => set({ activeChallengeId: challengeId }),

  closeChallengeDrawer: () => set({ activeChallengeId: null }),

  openZwingmannInfo: (archetype: AutomationArchetype) => set({ activeZwingmannInfo: archetype }),

  closeZwingmannInfo: () => set({ activeZwingmannInfo: null }),

  setActiveViewTab: (tab: ViewTab) => set({ activeViewTab: tab }),

  setActiveMainTab: (tab: 'simulator' | 'matrix') => set({ activeMainTab: tab }),

  toggleBlueprint: (open?: boolean) =>
    set((state) => ({ isBlueprintOpen: open !== undefined ? open : !state.isBlueprintOpen })),

  toggleConfigModal: (open?: boolean) =>
    set((state) => ({ isConfigModalOpen: open !== undefined ? open : !state.isConfigModalOpen })),

  setResolutionTimeMinutes: (mins: number) => {
    const newConfig = { ...get().config, resolutionTimeMinutes: mins };
    const newMetrics = calculateOverallMetrics(get().steps, newConfig);
    set({ config: newConfig, metrics: newMetrics });
  },

  setCuPriceFactorEur: (factor: number) => {
    const newConfig = { ...get().config, cuPriceFactorEur: factor };
    const newMetrics = calculateOverallMetrics(get().steps, newConfig);
    set({ config: newConfig, metrics: newMetrics });
  },

  toggleDryRun: (open?: boolean) =>
    set((state) => ({ isDryRunOpen: open !== undefined ? open : !state.isDryRunOpen })),

  toggleParetoModal: (open?: boolean) =>
    set((state) => ({ isParetoModalOpen: open !== undefined ? open : !state.isParetoModalOpen })),

  toggleCalculatorModal: (open?: boolean) =>
    set((state) => ({ isCalculatorOpen: open !== undefined ? open : !state.isCalculatorOpen })),

  openStepKnowledge: (stepId: string) => set({ activeStepKnowledgeId: stepId }),
  closeStepKnowledge: () => set({ activeStepKnowledgeId: null }),

  openProcessKnowledge: () => set({ isProcessKnowledgeOpen: true }),
  closeProcessKnowledge: () => set({ isProcessKnowledgeOpen: false }),

  openEvaluationMatrix: () => set({ isEvaluationMatrixOpen: true }),
  closeEvaluationMatrix: () => set({ isEvaluationMatrixOpen: false }),
  toggleEvaluationMatrix: (open?: boolean) =>
    set((state) => ({ isEvaluationMatrixOpen: open !== undefined ? open : !state.isEvaluationMatrixOpen })),

  executeDryRun: () => {
    const s = get();
    const result = DryRunEngine.execute(
      s.steps,
      s.currentTemplate.id,
      s.selectedMessageQuality,
      s.customMessageText,
      s.customSender,
      s.customSubject,
      s.language
    );
    set({ dryRunResult: result });
  },

  runParetoOptimization: () => {
    const { steps, config, language } = get();
    const previousSteps = steps.map((s) => ({ ...s }));
    const result = ParetoSolver.solve(steps, config, language);
    const newMetrics = calculateOverallMetrics(result.optimizedSteps, config);
    const newDryRun = DryRunEngine.execute(
      result.optimizedSteps,
      get().currentTemplate.id,
      get().selectedMessageQuality,
      get().customMessageText,
      get().customSender,
      get().customSubject,
      language
    );

    set({
      previousStepsBeforePareto: previousSteps,
      steps: result.optimizedSteps,
      metrics: newMetrics,
      dryRunResult: newDryRun,
      lastParetoResult: result,
      isParetoModalOpen: true,
      simulationStatusText:
        language === 'en'
          ? '★ Pareto Optimum applied: Maximized straight-through processing (STP) & minimal token consumption.'
          : '★ Pareto-Optimum angewendet: Maximale Dunkelverarbeitung (STP) & minimaler Token-Verbrauch.',
    });

    return result;
  },

  revertParetoOptimization: () => {
    const prev = get().previousStepsBeforePareto;
    if (!prev) {
      set({ isParetoModalOpen: false });
      return;
    }
    const newMetrics = calculateOverallMetrics(prev, get().config);
    const newDryRun = DryRunEngine.execute(
      prev,
      get().currentTemplate.id,
      get().selectedMessageQuality,
      get().customMessageText,
      get().customSender,
      get().customSubject,
      get().language
    );
    set({
      steps: prev,
      metrics: newMetrics,
      dryRunResult: newDryRun,
      lastParetoResult: null,
      previousStepsBeforePareto: null,
      isParetoModalOpen: false,
      simulationStatusText:
        get().language === 'en'
          ? 'Reverted to previous workflow state.'
          : 'Vorheriger Workflow-Zustand wiederhergestellt.',
    });
  },

  // Human-in-the-Loop Actions
  setStepDecision: (stepId: string, status: 'pending' | 'approved' | 'modified' | 'rejected', note?: string) => {
    const current = get().stepDecisions;
    const locale = get().language === 'en' ? 'en-US' : 'de-DE';
    set({
      stepDecisions: {
        ...current,
        [stepId]: {
          status,
          note,
          decidedAt: new Date().toLocaleTimeString(locale),
        },
      },
    });
  },

  approveAndContinueSimulation: (stepId: string) => {
    get().setStepDecision(stepId, 'approved');
    const state = get();
    const t = TRANSLATIONS[state.language];
    let nextIndex = state.simulationStepIndex + 1;
    if (nextIndex >= state.steps.length) {
      set({
        isSimulating: false,
        simulationStepIndex: state.steps.length,
        selectedStepId: 'process_summary',
        simulationStatusText: t.simCompleted,
      });
      return;
    }
    set({
      simulationStepIndex: nextIndex,
      selectedStepId: state.steps[nextIndex].id,
      isSimulating: true,
      simulationStatusText: t.simApprovedNext(nextIndex + 1),
    });
    get().startSimulation();
  },

  resetStepDecision: (stepId: string) => {
    const current = { ...get().stepDecisions };
    delete current[stepId];
    set({ stepDecisions: current });
  },

  startSimulation: () => {
    if (simulationTimer) clearInterval(simulationTimer);

    const s = get();
    const freshDryRun = DryRunEngine.execute(
      s.steps,
      s.currentTemplate.id,
      s.selectedMessageQuality,
      s.customMessageText,
      s.customSender,
      s.customSubject,
      s.language
    );
    set({ dryRunResult: freshDryRun, isSimulating: true });

    let currentIndex = get().simulationStepIndex;
    if (currentIndex < 0 || currentIndex >= get().steps.length) {
      currentIndex = 0;
    }

    const runTick = () => {
      const state = get();
      if (!state.isSimulating) return;

      const stepsCount = state.steps.length;
      const t = TRANSLATIONS[state.language];

      if (currentIndex >= stepsCount) {
        if (simulationTimer) clearInterval(simulationTimer);
        const overallStatus = state.dryRunResult.overallStatus;
        let finalMessage = t.simCompleted;
        if (overallStatus === 'failed_guardrail') {
          finalMessage = t.simSecurityHalt;
        } else if (overallStatus === 'escalated_to_human') {
          finalMessage = t.simEscalated;
        }
        set({
          isSimulating: false,
          simulationStepIndex: stepsCount,
          selectedStepId: 'process_summary',
          simulationStatusText: finalMessage,
        });
        return;
      }

      const activeStep = state.steps[currentIndex];
      const trace = state.dryRunResult.traces[currentIndex];
      const statusIcon = trace?.status === 'success' ? '✓' : trace?.status === 'error' ? '❌' : '⚠️';
      const statusText = t.simStepStatus(currentIndex + 1, stepsCount, activeStep.name, activeStep.currentArchetype, statusIcon);

      set({
        simulationStepIndex: currentIndex,
        simulationStatusText: statusText,
        selectedStepId: activeStep.id,
      });

      if (trace?.status === 'error') {
        if (simulationTimer) clearInterval(simulationTimer);
        set({
          isSimulating: false,
          simulationStatusText: t.simHaltError(currentIndex + 1, trace.logMessage),
        });
        return;
      }

      // Human-in-the-Loop Gate: Wenn Copilot gewählt ist und noch keine Freigabe vorliegt
      if (activeStep.currentArchetype === 'copilot') {
        const decision = state.stepDecisions[activeStep.id]?.status || 'pending';
        if (decision === 'pending') {
          if (simulationTimer) clearInterval(simulationTimer);
          set({
            isSimulating: false,
            simulationStepIndex: currentIndex,
            selectedStepId: activeStep.id,
            simulationStatusText: t.simHaltHitl(currentIndex + 1, activeStep.name),
          });
          return;
        }
        if (decision === 'rejected') {
          if (simulationTimer) clearInterval(simulationTimer);
          set({
            isSimulating: false,
            simulationStepIndex: currentIndex,
            selectedStepId: activeStep.id,
            simulationStatusText: t.simRejected(currentIndex + 1),
          });
          return;
        }
      }

      currentIndex += 1;
    };

    runTick();
    simulationTimer = setInterval(runTick, get().simulationSpeedMs);
  },

  pauseSimulation: () => {
    if (simulationTimer) clearInterval(simulationTimer);
    set({
      isSimulating: false,
      simulationStatusText: get().language === 'en' ? 'Simulation paused.' : 'Simulation pausiert.',
    });
  },

  stepSimulationForward: () => {
    if (simulationTimer) clearInterval(simulationTimer);
    const state = get();
    const freshDryRun = DryRunEngine.execute(
      state.steps,
      state.currentTemplate.id,
      state.selectedMessageQuality,
      state.customMessageText,
      state.customSender,
      state.customSubject,
      state.language
    );
    let nextIndex = state.simulationStepIndex + 1;
    if (nextIndex >= state.steps.length) {
      nextIndex = 0;
    }
    const activeStep = state.steps[nextIndex];
    const trace = freshDryRun.traces[nextIndex];
    const statusText = `[${nextIndex + 1}/${state.steps.length}] ${activeStep.name}: ${trace?.logMessage || ''}`;

    set({
      isSimulating: false,
      simulationStepIndex: nextIndex,
      dryRunResult: freshDryRun,
      selectedStepId: activeStep.id,
      simulationStatusText: statusText,
    });
  },

  resetSimulation: () => {
    if (simulationTimer) clearInterval(simulationTimer);
    const s = get();
    const lang = s.language;
    const allTemplates = mergeTemplates(getProcessTemplates(lang), s.customTemplates);
    const baseTemplate = allTemplates.find((t) => t.id === s.currentTemplate.id) || s.currentTemplate;
    const freshSteps = JSON.parse(JSON.stringify(baseTemplate.steps));
    const newMetrics = calculateOverallMetrics(freshSteps, s.config);
    const freshDryRun = DryRunEngine.execute(
      freshSteps,
      baseTemplate.id,
      s.selectedMessageQuality,
      null,
      null,
      null,
      lang
    );
    const firstStepId = freshSteps[0]?.id || null;

    set({
      steps: freshSteps,
      metrics: newMetrics,
      dryRunResult: freshDryRun,
      isSimulating: false,
      simulationStepIndex: -1,
      selectedStepId: firstStepId,
      simulationStatusText: lang === 'en' ? 'Simulation & steps reset to initial state.' : 'Simulation & Schritte auf Ausgangszustand zurückgesetzt.',
      stepDecisions: {},
      customMessageText: null,
      customSender: null,
      customSubject: null,
      lastParetoResult: null,
      previousStepsBeforePareto: null,
    });
  },

  setSimulationSpeed: (speedMs: number) => {
    set({ simulationSpeedMs: speedMs });
    if (get().isSimulating) {
      get().pauseSimulation();
      get().startSimulation();
    }
  },
  applyGeneratedProcess: (title, scopeCode, generatedSteps, monthlyVolume, executiveSummary) => {
    const config = { ...get().config, monthlyVolume };
    const enrichedSteps = enrichStepsWithSapAgents(generatedSteps, monthlyVolume, get().language);
    const newMetrics = calculateOverallMetrics(enrichedSteps, config);
    const newTemplate: ProcessTemplate = {
      id: `ai_${Date.now()}`,
      name: title,
      scopeCode: scopeCode,
      businessArea: 'Enterprise AI Target Architecture',
      description: executiveSummary || 'KI-generierter Pareto-optimaler SAP-Zielprozess',
      steps: enrichedSteps,
    };
    const newDryRun = DryRunEngine.execute(
      enrichedSteps,
      newTemplate.id,
      'good',
      null,
      null,
      null,
      get().language
    );

    // Automatisches Pareto-Ergebnis für das Modal berechnen
    const paretoResult = ParetoSolver.solve(enrichedSteps, config, get().language);

    set({
      currentTemplate: newTemplate,
      steps: paretoResult.optimizedSteps,
      config,
      metrics: newMetrics,
      selectedStepId: paretoResult.optimizedSteps[0]?.id || null,
      dryRunResult: newDryRun,
      lastParetoResult: paretoResult,
      simulationStatusText: `✓ KI-Zielarchitektur "${title}" im Pareto-Optimum generiert.`,
    });
  },
}));
