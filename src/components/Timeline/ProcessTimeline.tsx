'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { AutomationArchetype } from '@/types/process';

const ZWINGMANN_BUTTONS: Array<{ id: AutomationArchetype; label: string }> = [
  { id: 'deterministic', label: 'Det.' },
  { id: 'classic_ml', label: 'Assistant' },
  { id: 'copilot', label: 'Copilot' },
  { id: 'autopilot', label: 'Autopilot' },
  { id: 'agentic', label: 'Agentic' },
];

export const ProcessTimeline: React.FC = () => {
  const {
    steps,
    config,
    selectedStepId,
    setSelectedStepId,
    updateStepArchetype,
    openZwingmannInfo,
    isSimulating,
    simulationStepIndex,
    simulationStatusText,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    dryRunResult,
    language,
  } = useSimulatorStore();

  const totalSteps = steps.length;
  const isFinished = simulationStepIndex >= totalSteps;
  const hasStarted = simulationStepIndex >= 0;
  const isEn = language === 'en';

  return (
    <div className="w-[330px] bg-slate-900/95 border-r border-slate-800 flex flex-col h-full overflow-hidden select-none shrink-0 shadow-lg">
      {/* 1. Header mit Beleglauf-Button */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isEn ? 'Process Timeline' : 'Prozessablauf'}
          </span>
          <div className="flex items-center space-x-1">
            {!isSimulating ? (
              <button
                onClick={startSimulation}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95"
                title={isEn ? 'Start animated document run' : 'Startet den animierten Belegdurchlauf'}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>
                  {hasStarted && !isFinished
                    ? isEn
                      ? 'Resume'
                      : 'Fortsetzen'
                    : isEn
                    ? 'Run'
                    : 'Durchlauf'}
                </span>
              </button>
            ) : (
              <button
                onClick={pauseSimulation}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition active:scale-95"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>{isEn ? 'Pause' : 'Pause'}</span>
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95"
              title={isEn ? 'Reset simulation & restart from step 1' : 'Simulation zurücksetzen & bei Schritt 1 neu starten'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Zeile */}
        <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center space-x-1.5 truncate">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isSimulating ? 'bg-sky-400 animate-ping' : isFinished ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
          />
          <span className="truncate">{simulationStatusText}</span>
        </div>
      </div>

      {/* 2. Vertikale Liste der Schritte mit Zwingmann-Buttons direkt an jeder Box */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {steps.map((step, index) => {
          const isSelected = selectedStepId === step.id;
          const isCurrentSim = simulationStepIndex === index;
          const isPassedInSim = simulationStepIndex > index;
          const stepMetrics = calculateStepMetrics(step, config);
          const trace = dryRunResult?.traces?.find((t) => t.stepId === step.id);
          const hasError = trace?.status === 'error';

          return (
            <div
              key={step.id}
              onClick={() => setSelectedStepId(step.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border-2 space-y-2 ${
                isSelected
                  ? 'bg-slate-800/90 border-[#0A6ED1] shadow-md ring-1 ring-[#0A6ED1]'
                  : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800/80'
              } ${
                isCurrentSim
                  ? 'ring-2 ring-sky-400 border-sky-400 scale-[1.02]'
                  : ''
              }`}
            >
              {/* Zeile 1: Nummer, Name & Clean-Core Ampel */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                      hasError
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : isPassedInSim
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : isCurrentSim
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {hasError ? (
                      <XCircle className="w-3 h-3" />
                    ) : isPassedInSim ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white truncate leading-tight">{step.name}</h4>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {stepMetrics.guardrailViolation && (
                    <span title="Schutzplanke verletzt!">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    </span>
                  )}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      step.cleanCoreIndex === 'COMPLIANT'
                        ? 'bg-emerald-400'
                        : step.cleanCoreIndex === 'LEGACY'
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                    title={`Clean Core: ${step.cleanCoreIndex}`}
                  />
                </div>
              </div>

              {/* Zeile 2: ZWINGMANN-STUFEN DIREKT AN DER BOX SCHALTBAR */}
              <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
                {ZWINGMANN_BUTTONS.map((btn) => {
                  const isActive = step.currentArchetype === btn.id;
                  return (
                    <div key={btn.id} className="relative group flex items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStepArchetype(step.id, btn.id);
                        }}
                        className={`w-full py-1 text-[9px] font-bold rounded transition text-center truncate ${
                          isActive
                            ? 'bg-[#0A6ED1] text-white shadow'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                        title={`Stufe aktivieren: ${btn.label}`}
                      >
                        {btn.label}
                      </button>

                      {/* Info-Icon (ℹ️) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openZwingmannInfo(btn.id);
                        }}
                        className="absolute right-0.5 top-0.5 text-slate-500 hover:text-sky-300 p-0.5"
                        title="Zwingmann-Definition anzeigen"
                      >
                        <Info className="w-2 h-2" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Zeile 3: Direkte Auswirkung (Kosten, Latenz, Dunkelquote) */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span>{stepMetrics.latencyMs} ms</span>
                <span className="text-emerald-400">{Math.round(stepMetrics.effectiveAutomationRate * 100)}% Auto</span>
                <span className="font-bold text-slate-200">
                  {Math.round(stepMetrics.totalCostEur).toLocaleString('de-DE')} €/M
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
