'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { RISK_CHALLENGES } from '@/data/challenges';
import { ZWINGMANN_TIERS } from '@/data/zwingmann';
import { AutomationArchetype, CleanCoreIndex } from '@/types/process';
import {
  Cpu,
  Search,
  UserCheck,
  Bot,
  Flame,
  ShieldAlert,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Info,
} from 'lucide-react';

const ARCHETYPE_ICONS: Record<AutomationArchetype, React.ReactNode> = {
  deterministic: <Cpu className="w-3.5 h-3.5 text-blue-400" />,
  classic_ml: <Search className="w-3.5 h-3.5 text-emerald-400" />,
  copilot: <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
  autopilot: <Bot className="w-3.5 h-3.5 text-indigo-400" />,
  agentic: <Flame className="w-3.5 h-3.5 text-orange-400" />,
};

const ZWINGMANN_ORDER: AutomationArchetype[] = [
  'deterministic',
  'classic_ml',
  'copilot',
  'autopilot',
  'agentic',
];

export const StepAdvisorySidebar: React.FC = () => {
  const {
    steps,
    config,
    selectedStepId,
    updateStepArchetype,
    updateStepConfidence,
    updateStepCleanCore,
    openChallengeDrawer,
    openZwingmannInfo,
  } = useSimulatorStore();

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[0];
  if (!selectedStep) return null;

  const metrics = calculateStepMetrics(selectedStep, config);
  const lightsOutPercent = Math.round(metrics.effectiveAutomationRate * 100);
  const humanReviewPercent = 100 - lightsOutPercent;

  return (
    <div className="w-[360px] bg-slate-900/95 flex flex-col h-full overflow-y-auto p-4 space-y-4 select-none shrink-0 shadow-2xl">
      {/* 1. Schrittkosten & Performance Karte */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Schrittkosten (TCA)</div>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            {Math.round(metrics.totalCostEur).toLocaleString('de-DE')} €
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ M</span>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-[10px] text-slate-500">Dunkelquote</div>
          <div className="text-sm font-bold text-emerald-400">{lightsOutPercent} %</div>
        </div>
      </div>

      {/* 2. Zwingmann-Stufen Auswahl */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Zwingmann-Stufe</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Methodologie</span>
        </div>

        <div className="space-y-1.5">
          {ZWINGMANN_ORDER.map((key) => {
            const tier = ZWINGMANN_TIERS[key];
            const isSelected = selectedStep.currentArchetype === key;
            return (
              <div
                key={key}
                onClick={() => updateStepArchetype(selectedStep.id, key)}
                className={`p-2.5 rounded-lg border-2 cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/80 border-[#0A6ED1] shadow-md ring-1 ring-[#0A6ED1]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {ARCHETYPE_ICONS[key]}
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1">
                      <span>{tier.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openZwingmannInfo(key);
                        }}
                        className="text-slate-500 hover:text-sky-300 p-0.5"
                        title="Zwingmann-Definition anzeigen"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{tier.shortDesc}</div>
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-400">
                  <div>{tier.latencyText}</div>
                  <div className={tier.cuText === '0 CU' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {tier.cuText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Konfidenz-Gate & Verteilung */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Konfidenz-Gate
          </span>
          <span className="text-xs font-mono font-bold text-sky-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {selectedStep.confidenceGate} % Gate
          </span>
        </div>

        <input
          type="range"
          min={50}
          max={99}
          step={1}
          value={selectedStep.confidenceGate}
          onChange={(e) => updateStepConfidence(selectedStep.id, Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-[#0A6ED1]"
        />

        <div className="space-y-1">
          <div className="w-full h-2 bg-slate-900 rounded-full flex overflow-hidden border border-slate-800">
            <div style={{ width: `${lightsOutPercent}%` }} className="bg-emerald-500" />
            <div style={{ width: `${humanReviewPercent}%` }} className="bg-amber-500" />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span className="text-emerald-400">● Dunkel: {lightsOutPercent}%</span>
            <span className="text-amber-400">● Human: {humanReviewPercent}%</span>
          </div>
        </div>
      </div>

      {/* 4. Clean Core & Blast Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clean Core & Blast Radius</span>
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              selectedStep.reversibility >= 4 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Rev {selectedStep.reversibility}/5
          </span>
        </div>

        <div className="flex space-x-1.5">
          {(['COMPLIANT', 'LEGACY', 'VIOLATION'] as CleanCoreIndex[]).map((idx) => (
            <button
              key={idx}
              onClick={() => updateStepCleanCore(selectedStep.id, idx)}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded border transition ${
                selectedStep.cleanCoreIndex === idx
                  ? 'bg-slate-800 text-white border-sky-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {idx === 'COMPLIANT' ? 'Clean Core' : idx === 'LEGACY' ? 'Legacy BAPI' : 'Violation'}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Audit-Risiken */}
      {metrics.triggeredChallengeIds.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-600/60 rounded-xl p-3 space-y-2">
          <div className="flex items-center space-x-1.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold uppercase">
              {metrics.triggeredChallengeIds.length} methodische(s) Risiko(en)
            </span>
          </div>

          <div className="space-y-1.5">
            {metrics.triggeredChallengeIds.map((cId) => {
              const ch = RISK_CHALLENGES[cId];
              if (!ch) return null;
              return (
                <div key={cId} className="bg-slate-950/90 p-2 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {cId}: {ch.name.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => openChallengeDrawer(cId)}
                      className="text-[10px] text-sky-400 hover:text-sky-300 underline font-semibold"
                    >
                      Details &rarr;
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">{ch.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
