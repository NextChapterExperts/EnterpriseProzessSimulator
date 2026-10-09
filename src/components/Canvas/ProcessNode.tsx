'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ProcessStep, AutomationArchetype, CleanCoreIndex } from '@/types/process';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { RISK_CHALLENGES } from '@/data/challenges';
import {
  AlertTriangle,
  Cpu,
  Clock,
  ShieldAlert,
  Flame,
  UserCheck,
  Bot,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface ProcessNodeData {
  step: ProcessStep;
  stepIndex: number;
}

const PHASE_THEMES: Record<string, { badge: string; border: string; glow: string; text: string }> = {
  Observe: { badge: 'bg-cyan-900/60 text-cyan-300 border-cyan-600/60', border: 'border-cyan-500/60', glow: 'shadow-cyan-500/20', text: 'text-cyan-400' },
  Orient: { badge: 'bg-purple-900/60 text-purple-300 border-purple-600/60', border: 'border-purple-500/60', glow: 'shadow-purple-500/20', text: 'text-purple-400' },
  Decide: { badge: 'bg-amber-900/60 text-amber-300 border-amber-600/60', border: 'border-amber-500/60', glow: 'shadow-amber-500/20', text: 'text-amber-400' },
  Act: { badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-600/60', border: 'border-emerald-500/60', glow: 'shadow-emerald-500/20', text: 'text-emerald-400' },
};

const ARCHETYPE_ICONS: Record<AutomationArchetype, React.ReactNode> = {
  deterministic: <Cpu className="w-3.5 h-3.5 text-blue-400" />,
  classic_ml: <Search className="w-3.5 h-3.5 text-emerald-400" />,
  copilot: <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
  autopilot: <Bot className="w-3.5 h-3.5 text-indigo-400" />,
  agentic: <Flame className="w-3.5 h-3.5 text-orange-400" />,
};

export const ProcessNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { step, stepIndex } = data as unknown as ProcessNodeData;
  const {
    config,
    simulationStepIndex,
    isSimulating,
    dryRunResult,
    updateStepArchetype,
    updateStepConfidence,
    updateStepCleanCore,
    openChallengeDrawer,
    setSelectedStepId,
  } = useSimulatorStore();

  const metrics = calculateStepMetrics(step, config);
  const phaseTheme = PHASE_THEMES[step.oodaPhase] || PHASE_THEMES.Observe;
  const isCurrentSimStep = simulationStepIndex === stepIndex;
  const stepTrace = dryRunResult?.traces?.find((t) => t.stepId === step.id);
  const escalationPercent = Math.round((1 - metrics.effectiveAutomationRate) * 100);

  return (
    <div
      onClick={() => setSelectedStepId(step.id)}
      className={`relative w-80 rounded-xl bg-slate-900/95 border-2 transition-all duration-200 select-none ${
        isCurrentSimStep
          ? 'border-sky-400 ring-4 ring-sky-500/40 shadow-2xl shadow-sky-500/30 scale-105 z-30'
          : metrics.guardrailViolation
          ? 'border-red-500 shadow-xl shadow-red-950/60'
          : selected
          ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-lg'
          : `${phaseTheme.border} shadow-md`
      } p-3.5 text-slate-100 backdrop-blur-md`}
    >
      {/* Target Handle links */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-sky-400 !border-2 !border-slate-900 shadow"
      />

      {/* Header mit Step-Index, Phase & Clean-Core-Selector */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            #{stepIndex + 1}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${phaseTheme.badge}`}>
            {step.oodaPhase}
          </span>
        </div>

        {/* Clean Core Badge */}
        <select
          value={step.cleanCoreIndex}
          onChange={(e) => updateStepCleanCore(step.id, e.target.value as CleanCoreIndex)}
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border cursor-pointer ${
            step.cleanCoreIndex === 'COMPLIANT'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
              : step.cleanCoreIndex === 'LEGACY'
              ? 'bg-amber-950/90 text-amber-300 border-amber-700'
              : 'bg-red-950/90 text-red-300 border-red-700'
          }`}
          title="Clean Core Index"
        >
          <option value="COMPLIANT">CLEAN CORE</option>
          <option value="LEGACY">LEGACY BAPI</option>
          <option value="VIOLATION">VIOLATION</option>
        </select>
      </div>

      {/* Step Name & Subtitel */}
      <div className="py-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white tracking-tight truncate pr-1">
            {step.name}
          </h4>
          {stepTrace && (
            <span title={`Status im Beleglauf: ${stepTrace.status}`}>
              {stepTrace.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {stepTrace.status === 'escalation' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {stepTrace.status === 'error' && <XCircle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />}
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-sky-300/80 truncate mt-0.5" title={step.sapReference}>
          {step.sapReference}
        </p>
      </div>

      {/* Archetyp Dropdown */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 font-medium">Archetyp:</span>
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {ARCHETYPE_ICONS[step.currentArchetype]}
            <select
              value={step.currentArchetype}
              onChange={(e) => updateStepArchetype(step.id, e.target.value as AutomationArchetype)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="deterministic" className="bg-slate-900">1. Deterministisch</option>
              <option value="classic_ml" className="bg-slate-900">2. Klassisches ML</option>
              <option value="copilot" className="bg-slate-900">3. Copilot (Joule)</option>
              <option value="autopilot" className="bg-slate-900">4. Autopilot</option>
              <option value="agentic" className="bg-slate-900">5. Multi-Agent</option>
            </select>
          </div>
        </div>

        {/* Confidence Gate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Konfidenz-Gate:</span>
            <span className="font-mono font-bold text-sky-400">{step.confidenceGate} %</span>
          </div>
          <input
            type="range"
            min={50}
            max={99}
            step={1}
            value={step.confidenceGate}
            onChange={(e) => updateStepConfidence(step.id, Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#0A6ED1]"
          />
        </div>

        {/* Integrierte Human-Escalation & Blast Radius Zeile */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
          <span
            className={`px-1.5 py-0.5 rounded font-bold ${
              escalationPercent > 15 ? 'text-amber-400 bg-amber-950/60' : 'text-slate-400 bg-slate-800/80'
            }`}
          >
            {escalationPercent}% Human Review
          </span>
          <span
            className={`px-1.5 py-0.5 rounded font-bold ${
              step.reversibility >= 4 ? 'text-red-400 bg-red-950/80 border border-red-800' : 'text-slate-400 bg-slate-800'
            }`}
          >
            Blast Rev {step.reversibility}/5
          </span>
          <span className="text-sky-300 font-bold">
            {Math.round(metrics.totalCostEur).toLocaleString('de-DE')} €/M
          </span>
        </div>
      </div>

      {/* Reactive Audit Badges */}
      {metrics.triggeredChallengeIds.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
          {metrics.triggeredChallengeIds.map((cId) => {
            const challenge = RISK_CHALLENGES[cId];
            if (!challenge) return null;
            return (
              <button
                key={cId}
                onClick={(e) => {
                  e.stopPropagation();
                  openChallengeDrawer(cId);
                }}
                className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-semibold border transition hover:scale-105 active:scale-95 ${
                  challenge.severity === 'critical'
                    ? 'bg-red-950/90 text-red-300 border-red-700 hover:bg-red-900'
                    : 'bg-amber-950/90 text-amber-300 border-amber-700 hover:bg-amber-900'
                }`}
                title={`Klicken für Audit-Radar Detail: ${challenge.name}`}
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{cId}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Simulation Highlight Message */}
      {isCurrentSimStep && stepTrace && (
        <div className="mt-2 p-1.5 rounded bg-sky-950/90 border border-sky-600 text-[10px] text-sky-200 animate-fadeIn">
          <span className="font-bold">Live Trace: </span>
          {stepTrace.logMessage}
        </div>
      )}

      {/* Source Handle nach rechts */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-sky-400 !border-2 !border-slate-900 shadow"
      />
    </div>
  );
};
