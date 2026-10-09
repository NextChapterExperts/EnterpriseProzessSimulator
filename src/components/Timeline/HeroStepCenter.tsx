'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { ZWINGMANN_TIERS } from '@/data/zwingmann';
import {
  ArrowDown,
  Clock,
  Cpu,
  Coins,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Info,
} from 'lucide-react';
import { AutomationArchetype } from '@/types/process';

const ZWINGMANN_TIER_KEYS: AutomationArchetype[] = [
  'deterministic',
  'classic_ml',
  'copilot',
  'autopilot',
  'agentic',
];

export const HeroStepCenter: React.FC = () => {
  const {
    steps,
    selectedStepId,
    dryRunResult,
    updateStepArchetype,
    openZwingmannInfo,
  } = useSimulatorStore();
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[0];
  const stepIndex = steps.findIndex((s) => s.id === selectedStep?.id);
  const trace = dryRunResult?.traces?.find((t) => t.stepId === selectedStep?.id) || dryRunResult?.traces?.[0];

  const hasError = trace?.status === 'error';
  const hasEscalation = trace?.status === 'escalation';

  return (
    <div className="flex-1 bg-[#080d1a] flex flex-col h-full overflow-hidden select-none border-r border-slate-800">
      {/* 1. Hero Step Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="font-mono font-bold text-sky-400 uppercase tracking-wider">
              Schritt #{stepIndex + 1} &bull; {selectedStep?.oodaPhase}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-300 font-medium">{selectedStep?.primitive}</span>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight mt-0.5">{selectedStep?.name}</h2>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            SAP Schnittstelle: <span className="text-sky-300">{selectedStep?.sapReference}</span>
          </p>
        </div>

        {/* View Mode Toggle & Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border font-mono uppercase ${
              hasError
                ? 'bg-red-950/90 text-red-300 border-red-800 animate-pulse'
                : hasEscalation
                ? 'bg-amber-950/90 text-amber-300 border-amber-800'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
            }`}
          >
            {hasError ? (
              <>
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                <span>Fehlgeschlagen</span>
              </>
            ) : hasEscalation ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Human Review</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Erfolg</span>
              </>
            )}
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'formatted' ? 'raw' : 'formatted')}
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono"
          >
            {viewMode === 'formatted' ? 'JSON' : 'Kompakt'}
          </button>
        </div>
      </div>

      {/* 2. Zwingmann-Schaltleiste direkt im Hero-Step */}
      <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
          Zwingmann-Stufe:
        </span>

        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {ZWINGMANN_TIER_KEYS.map((key) => {
            const tier = ZWINGMANN_TIERS[key];
            const isActive = selectedStep?.currentArchetype === key;
            return (
              <div key={key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => updateStepArchetype(selectedStep.id, key)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    isActive
                      ? 'bg-[#0A6ED1] text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tier.name}
                </button>
                <button
                  type="button"
                  onClick={() => openZwingmannInfo(key)}
                  className="p-1 text-slate-500 hover:text-sky-300"
                  title="Definition anzeigen"
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Der visuelle Transformations-Fluss (Input -> Engine -> Output) */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col space-y-3">
        {/* KASTEN 1: 📥 INPUT (Was geht rein?) */}
        <div className="flex-1 min-h-[150px] bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-md">
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>📥 Input: Was empfängt dieser Schritt?</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Vorstufe / Beleg</span>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
            {viewMode === 'raw' ? (
              <pre className="text-sky-300 whitespace-pre-wrap">
                {JSON.stringify(trace?.inputData || {}, null, 2)}
              </pre>
            ) : (
              <div className="space-y-2 font-sans text-xs">
                {Object.entries(trace?.inputData || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{key}</div>
                    <div className="text-white font-medium break-words mt-0.5">
                      {typeof val === 'object' ? JSON.stringify(val, null, 1) : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VERBINDUNG: ⚡ INFERENZ & TELEMETRIE */}
        <div className="flex items-center justify-between py-1.5 px-4 bg-slate-900/80 rounded-xl border border-slate-800/90 text-xs font-mono">
          <div className="flex items-center space-x-2 text-sky-400 font-bold">
            <ArrowDown className="w-4 h-4" />
            <span>Stufe: {ZWINGMANN_TIERS[selectedStep.currentArchetype].name}</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Latenz: <strong className="text-white">{trace?.latencyMs || 0} ms</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span>Tokens: <strong className="text-white">{trace?.tokensUsed || 0}</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sub-Calls: <strong className="text-white">{trace?.subCalls || 1}</strong></span>
            </span>
          </div>
        </div>

        {/* KASTEN 2: 📤 OUTPUT (Was kommt raus?) */}
        <div className="flex-1 min-h-[150px] bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-md">
          <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-400' : 'bg-emerald-400'}`} />
              <span>📤 Output: Was ist das generierte Ergebnis?</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Ziel: ERP / Folgeschritt</span>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs leading-relaxed">
            {hasError ? (
              <div className="bg-red-950/70 border border-red-800 p-3 rounded-lg text-red-200 space-y-2 font-sans">
                <div className="font-bold flex items-center space-x-1.5 text-red-400 text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>Schritt abgebrochen / Validierungsfehler</span>
                </div>
                <div className="font-mono text-xs text-red-300">
                  {trace?.logMessage || 'Fehler beim Schritt-Durchlauf.'}
                </div>
                <pre className="text-[11px] font-mono text-red-300/90 bg-slate-950 p-2.5 rounded mt-1 overflow-x-auto border border-red-900/60">
                  {JSON.stringify(trace?.outputData || {}, null, 2)}
                </pre>
              </div>
            ) : viewMode === 'raw' ? (
              <pre className="text-emerald-300 whitespace-pre-wrap">
                {JSON.stringify(trace?.outputData || {}, null, 2)}
              </pre>
            ) : (
              <div className="space-y-2 font-sans text-xs">
                {Object.entries(trace?.outputData || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{key}</div>
                    <div className="text-emerald-300 font-semibold break-words mt-0.5">
                      {typeof val === 'object' ? JSON.stringify(val, null, 1) : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Footer mit Schritt-Log */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 font-mono">
        <span className="font-bold text-slate-300">Status: </span>
        <span className="text-slate-300">{trace?.logMessage || 'Bereit.'}</span>
      </div>
    </div>
  );
};
