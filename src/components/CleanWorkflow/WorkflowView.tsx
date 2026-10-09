'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { StepCard } from './StepCard';
import { LivePayloadMonitor } from './LivePayloadMonitor';
import { ZwingmannInfoModal } from '@/components/Modals/ZwingmannInfoModal';
import { ParetoResultModal } from '@/components/Modals/ParetoResultModal';
import { AiCoreCalculatorModal } from '@/components/Modals/AiCoreCalculatorModal';
import { StepKnowledgeModal } from '@/components/Modals/StepKnowledgeModal';
import { ProcessKnowledgeModal } from '@/components/Modals/ProcessKnowledgeModal';
import { BlueprintModal } from '@/components/Modals/BlueprintModal';
import { SimulationConfigModal } from '@/components/Modals/SimulationConfigModal';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Eye,
  Compass,
  Scale,
  Zap,
  ArrowDown,
  ArrowRight,
  Layers,
  Coins,
  ShieldAlert,
  Cpu,
  Workflow,
  Info,
} from 'lucide-react';
import { OODAPhase, WorkflowLayer } from '@/types/process';

export const WorkflowView: React.FC = () => {
  const {
    steps,
    currentTemplate,
    isSimulating,
    simulationStatusText,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    runParetoOptimization,
    activeZwingmannInfo,
    closeZwingmannInfo,
    selectedStepId,
    setSelectedStepId,
    language,
    activeWorkflowLayer,
    setActiveWorkflowLayer,
    toggleConfigModal,
    openProcessKnowledge,
  } = useSimulatorStore();

  const t = TRANSLATIONS[language];

  const phaseHeaders: Record<OODAPhase, { title: string; icon: React.ReactNode }> = {
    Observe: {
      title: language === 'en' ? 'OBSERVE (Perception & Ingestion)' : 'OBSERVE (Wahrnehmung)',
      icon: <Eye className="w-3.5 h-3.5 text-cyan-400" />,
    },
    Orient: {
      title: language === 'en' ? 'ORIENT (Grounding & Master Data)' : 'ORIENT (Grounding & Stammdaten)',
      icon: <Compass className="w-3.5 h-3.5 text-purple-400" />,
    },
    Decide: {
      title: language === 'en' ? 'DECIDE (Business Rules & Policies)' : 'DECIDE (Regeln & Richtlinien)',
      icon: <Scale className="w-3.5 h-3.5 text-amber-400" />,
    },
    Act: {
      title: language === 'en' ? 'ACT (ERP Mutation & Output)' : 'ACT (ERP-Mutation & Ausgabe)',
      icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
    },
  };

  return (
    <div className="flex-1 bg-slate-100/90 dark:bg-[#080d1a] overflow-y-auto p-4 sm:p-6 select-none transition-colors duration-150">
      <div className="w-full max-w-7xl mx-auto space-y-4">
        {/* 1. Kompakte Steuerungsleiste */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm dark:shadow flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
              {currentTemplate.name}
            </span>
            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800/60">
              {currentTemplate.scopeCode}
            </span>
            {/* Info-Button (i) für allgemeinsprachliche Beschreibung & SAP-Bedeutung */}
            <button
              onClick={openProcessKnowledge}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/90 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white border border-sky-300 dark:border-sky-800/80 text-[11px] font-semibold transition active:scale-95 shadow-sm group ml-0.5"
              title={t.tooltipProcessInfo}
            >
              <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 group-hover:text-sky-800 dark:group-hover:text-sky-200" />
              <span>Info</span>
            </button>
          </div>

          {/* Steuerungsknöpfe & aktive Live-Meldung */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {simulationStatusText && (
              <span
                className={`text-[11px] font-mono mr-2 truncate max-w-xs transition-opacity ${
                  isSimulating
                    ? 'text-sky-600 dark:text-sky-400 animate-pulse font-medium'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700'
                }`}
              >
                {simulationStatusText}
              </span>
            )}

            {/* Prozess-Parameter Button: Schneller Zugriff auf Volumen & Rauschen */}
            <button
              onClick={() => toggleConfigModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-sky-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs shadow-sm dark:shadow transition active:scale-95 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-sky-500/60"
              title={language === 'en' ? 'Configure process volume, noise, and labor costs' : 'Belegvolumen, Rauschen und Arbeitskosten konfigurieren'}
            >
              <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{language === 'en' ? 'Parameters' : 'Parameter'}</span>
            </button>

            {/* Pareto-Optimum Knopf: Immer direkt im Header sichtbar! */}
            <button
              onClick={runParetoOptimization}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition active:scale-95 border border-amber-300/60"
              title={language === 'en' ? 'Tune all steps along the Pareto efficiency frontier' : 'Optimalen Workflow nach der Pareto-Effizienzgrenze einstellen'}
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>{t.btnParetoOpt}</span>
            </button>

            {!isSimulating ? (
              <button
                onClick={startSimulation}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{t.btnTestRun}</span>
              </button>
            ) : (
              <button
                onClick={pauseSimulation}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition active:scale-95"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>{t.btnPause}</span>
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition active:scale-95 group shadow-sm"
              title={language === 'en' ? 'Reset simulation & restore initial state' : 'Simulation zurücksetzen & Ausgangszustand wiederherstellen'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:-rotate-45 transition-transform" />
              <span className="text-xs font-semibold">{t.btnReset}</span>
            </button>
          </div>
        </div>

        {/* 4-Layer Perspective Switcher */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 shadow-sm dark:shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 pl-1 shrink-0">
            <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="font-semibold text-slate-800 dark:text-white tracking-wide">{t.layerTabsTitle}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full md:w-auto flex-1 max-w-6xl">
            {/* Layer 1: Flow */}
            <button
              type="button"
              onClick={() => setActiveWorkflowLayer('flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-2 ${
                activeWorkflowLayer === 'flow'
                  ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/30'
                  : 'bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.layerFlowSub}
            >
              <Workflow className="w-4 h-4 shrink-0 text-sky-400" />
              <div className="text-left overflow-hidden">
                <span className="block leading-tight font-bold truncate">{t.layerFlow}</span>
                <span className="text-[9.5px] font-normal opacity-80 block truncate">{t.layerFlowSub}</span>
              </div>
            </button>

            {/* Layer 2: Quality */}
            <button
              type="button"
              onClick={() => setActiveWorkflowLayer('quality')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-2 ${
                activeWorkflowLayer === 'quality'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.layerQualitySub}
            >
              <Scale className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="text-left overflow-hidden">
                <span className="block leading-tight font-bold truncate">{t.layerQuality}</span>
                <span className="text-[9.5px] font-normal opacity-80 block truncate">{t.layerQualitySub}</span>
              </div>
            </button>

            {/* Layer 3: Cost */}
            <button
              type="button"
              onClick={() => setActiveWorkflowLayer('cost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-2 ${
                activeWorkflowLayer === 'cost'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.layerCostSub}
            >
              <Coins className="w-4 h-4 shrink-0 text-indigo-400" />
              <div className="text-left overflow-hidden">
                <span className="block leading-tight font-bold truncate">{t.layerCost}</span>
                <span className="text-[9.5px] font-normal opacity-80 block truncate">{t.layerCostSub}</span>
              </div>
            </button>

            {/* Layer 3: Risk */}
            <button
              type="button"
              onClick={() => setActiveWorkflowLayer('risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-2 ${
                activeWorkflowLayer === 'risk'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                  : 'bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.layerRiskSub}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <div className="text-left overflow-hidden">
                <span className="block leading-tight font-bold truncate">{t.layerRisk}</span>
                <span className="text-[9.5px] font-normal opacity-80 block truncate">{t.layerRiskSub}</span>
              </div>
            </button>

            {/* Layer 4: Architecture */}
            <button
              type="button"
              onClick={() => setActiveWorkflowLayer('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-2 ${
                activeWorkflowLayer === 'architecture'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                  : 'bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t.layerArchSub}
            >
              <Cpu className="w-4 h-4 shrink-0 text-purple-400" />
              <div className="text-left overflow-hidden">
                <span className="block leading-tight font-bold truncate">{t.layerArch}</span>
                <span className="text-[9.5px] font-normal opacity-80 block truncate">{t.layerArchSub}</span>
              </div>
            </button>
          </div>
        </div>


        {/* 2. Split Screen: Links vertikaler Ablauf, Rechts Live Payload Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Linke Spalte: Durchgehender vertikaler Ablauf mit Verbindungspfeilen */}
          <div className="lg:col-span-5 space-y-1">
            {steps.map((step, idx) => {
              const isFirstInPhase =
                idx === 0 || steps[idx - 1].oodaPhase !== step.oodaPhase;
              const phaseInfo = phaseHeaders[step.oodaPhase];
              const isLast = idx === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Phasen-Trenner bei Phasenwechsel */}
                  {isFirstInPhase && (
                    <div className="flex items-center space-x-2 pt-2.5 pb-1">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-slate-200 dark:to-slate-800" />
                      <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300 shadow-sm">
                        {phaseInfo.icon}
                        <span>{phaseInfo.title}</span>
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700 to-slate-200 dark:to-slate-800" />
                    </div>
                  )}

                  {/* Kompakte Step Card */}
                  <StepCard step={step} index={idx} />

                  {/* Sichtbarer Verbindungspfeil zum nächsten Schritt */}
                  {!isLast && (
                    <div className="flex flex-col items-center justify-center my-0.5">
                      <div className="w-[2px] h-1.5 bg-gradient-to-b from-slate-300 dark:from-slate-700 to-sky-500/60" />
                      <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-sky-400/50 dark:border-sky-500/50 flex items-center justify-center shadow-sm text-sky-600 dark:text-sky-400">
                        <ArrowDown className="w-3 h-3 animate-pulse" />
                      </div>
                      <div className="w-[2px] h-1.5 bg-gradient-to-b from-sky-500/60 to-slate-300 dark:to-slate-700" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Verbindungspfeil zur Gesamtprozess-Abschlusskarte */}
            <div className="flex flex-col items-center justify-center my-1 pt-1">
              <div className="w-[2px] h-2 bg-gradient-to-b from-slate-300 dark:from-slate-700 to-indigo-500/80" />
              <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-indigo-400/70 dark:border-indigo-500/70 flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="w-[2px] h-2 bg-gradient-to-b from-indigo-500/80 to-slate-300 dark:to-slate-700" />
            </div>

            {/* Dedizierte Gesamtprozess & End-to-End Bilanz Karte */}
            <div
              onClick={() => setSelectedStepId('process_summary')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none shadow-sm dark:shadow-lg ${
                selectedStepId === 'process_summary'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-300 dark:ring-indigo-500/50 shadow-md scale-[1.01]'
                  : 'bg-white dark:bg-slate-900/90 border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-300 dark:border-indigo-500/50 flex items-center justify-center text-sm shadow-inner">
                    📊
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white tracking-wide flex items-center space-x-1.5">
                      <span>{language === 'en' ? 'Overall Process Summary' : 'Gesamtprozess & Bilanz'}</span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 font-mono">
                        End-to-End
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'en'
                        ? `Consolidated evaluation for all ${steps.length} steps`
                        : `Aggregierte Auswertung über alle ${steps.length} Schritte`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                  <span className="text-[10px] font-mono hidden sm:inline">
                    {language === 'en' ? 'View Summary' : 'Bilanz ansehen'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Live Payload & Belegfluss Monitor */}
          <div className="lg:col-span-7 sticky top-4">
            <LivePayloadMonitor />
          </div>
        </div>
      </div>

      {/* Zwingmann Methodologie Info Modal */}
      <ZwingmannInfoModal
        archetype={activeZwingmannInfo}
        onClose={closeZwingmannInfo}
      />

      {/* Pareto Optimierungs-Ergebnis Modal */}
      <ParetoResultModal />

      {/* SAP AI Core Kosten- & Volumen-Kalkulator Modal */}
      <AiCoreCalculatorModal />

      {/* Prozess-Parameter Konfigurations-Modal */}
      <SimulationConfigModal />

      {/* Detailliertes Schritt-Erklärungs & Studenten-Guide Modal */}
      <StepKnowledgeModal />

      {/* Detailliertes Prozess-Wissen & SAP-Bedeutung Modal */}
      <ProcessKnowledgeModal />

      {/* SAP Enterprise Architecture Management Blueprint Modal */}
      <BlueprintModal />
    </div>
  );
};
