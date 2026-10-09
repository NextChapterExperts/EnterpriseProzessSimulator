'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const {
    isSimulating,
    simulationStepIndex,
    simulationStatusText,
    simulationSpeedMs,
    steps,
    dryRunResult,
    startSimulation,
    pauseSimulation,
    stepSimulationForward,
    resetSimulation,
    setSimulationSpeed,
    runParetoOptimization,
    language,
  } = useSimulatorStore();

  const totalSteps = steps.length;
  const isFinished = simulationStepIndex >= totalSteps;
  const hasStarted = simulationStepIndex >= 0;
  const isEn = language === 'en';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 text-slate-200">
      {/* Linke Gruppe: Play / Pause / Step / Reset Buttons */}
      <div className="flex items-center space-x-2">
        {!isSimulating ? (
          <button
            onClick={startSimulation}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
            title={isEn ? 'Start animated document run across nodes' : 'Startet den animierten Beleglauf durch alle Prozessknoten'}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>
              {hasStarted && !isFinished
                ? isEn
                  ? 'Resume'
                  : 'Fortsetzen'
                : isEn
                ? 'Start Simulation'
                : 'Simulation starten'}
            </span>
          </button>
        ) : (
          <button
            onClick={pauseSimulation}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition active:scale-95"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>{isEn ? 'Pause' : 'Pausieren'}</span>
          </button>
        )}

        <button
          onClick={stepSimulationForward}
          disabled={isSimulating}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-200 border border-slate-700 transition"
          title={isEn ? 'Executes exactly one step' : 'Führt genau einen Schritt aus'}
        >
          <SkipForward className="w-3.5 h-3.5 text-sky-400" />
          <span>{isEn ? 'Single Step' : 'Einzelschritt'}</span>
        </button>

        <button
          onClick={resetSimulation}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
          title={isEn ? 'Reset simulation & restart from step 1' : 'Simulation zurücksetzen & bei Schritt 1 neu starten'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-950 px-1.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono space-x-1">
          <span className="text-slate-500 mr-1">Speed:</span>
          {[
            { label: '1x', ms: 1500 },
            { label: '2x', ms: 800 },
            { label: '5x', ms: 300 },
          ].map((sp) => (
            <button
              key={sp.label}
              onClick={() => setSimulationSpeed(sp.ms)}
              className={`px-1.5 py-0.5 rounded font-bold ${
                simulationSpeedMs === sp.ms ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mitte: Live Simulation Ticker */}
      <div className="flex-1 max-w-2xl w-full bg-slate-950 border border-slate-800/90 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs font-mono overflow-hidden">
        <Activity className={`w-3.5 h-3.5 text-sky-400 shrink-0 ${isSimulating ? 'animate-spin' : ''}`} />
        <span className="text-slate-300 truncate" title={simulationStatusText}>
          {simulationStatusText}
        </span>
      </div>

      {/* Rechts: Quick Pareto Action */}
      <button
        onClick={() => runParetoOptimization()}
        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition active:scale-95 shrink-0"
        title={isEn ? 'Automatic Pareto optimization for minimal TCA and clean core' : 'Automatische Pareto-Optimierung für minimale TCA und Clean Core'}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        <span>{isEn ? '★ Apply Pareto' : '★ Pareto anwenden'}</span>
      </button>
    </div>
  );
};
