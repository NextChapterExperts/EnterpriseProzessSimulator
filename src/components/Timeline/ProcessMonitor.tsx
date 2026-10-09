'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  ArrowDown,
  ArrowRight,
  Clock,
  Cpu,
  Coins,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProcessMonitor: React.FC = () => {
  const { steps, selectedStepId, dryRunResult, isSimulating, simulationStepIndex } = useSimulatorStore();
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[0];
  const stepIndex = steps.findIndex((s) => s.id === selectedStep?.id);
  const trace = dryRunResult?.traces?.find((t) => t.stepId === selectedStep?.id) || dryRunResult?.traces?.[0];

  const hasError = trace?.status === 'error';
  const hasEscalation = trace?.status === 'escalation';

  return (
    <div className="w-[430px] bg-slate-900/95 border-l border-slate-800 flex flex-col h-full overflow-hidden select-none shadow-2xl">
      {/* 1. Header des Monitors */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-800/80 text-sky-400">
            <Activity className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-bold text-white tracking-tight">Live Beleg-Monitor</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 font-semibold">
                #{stepIndex + 1}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px]" title={selectedStep?.name}>
              {selectedStep?.name}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${
              hasError
                ? 'bg-red-950/90 text-red-300 border-red-800 animate-pulse'
                : hasEscalation
                ? 'bg-amber-950/90 text-amber-300 border-amber-800'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
            }`}
          >
            {hasError ? (
              <>
                <XCircle className="w-3 h-3 text-red-400" />
                <span>Fehler</span>
              </>
            ) : hasEscalation ? (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Human Task</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Erfolg</span>
              </>
            )}
          </div>

          {/* Toggle Raw / Formatted */}
          <button
            onClick={() => setViewMode(viewMode === 'formatted' ? 'raw' : 'formatted')}
            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono"
            title="Zwischen formatiertem JSON und Kompaktansicht umschalten"
          >
            {viewMode === 'formatted' ? 'JSON' : 'Kompakt'}
          </button>
        </div>
      </div>

      {/* 2. Telemetrie-Zwischenleiste (Tokens, Latenz, Engine) */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Latenz: <strong className="text-white">{trace?.latencyMs || 0} ms</strong></span>
        </span>
        <span className="flex items-center space-x-1">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span>Tokens: <strong className="text-white">{trace?.tokensUsed || 0}</strong></span>
        </span>
        <span className="flex items-center space-x-1">
          <Coins className="w-3 h-3 text-slate-500" />
          <span>Engine: <strong className="text-sky-300 uppercase">{selectedStep?.currentArchetype}</strong></span>
        </span>
      </div>

      {/* 3. Zwei-Sektionen Container: Oben INPUT, Unten OUTPUT */}
      <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
        {/* SEKTION A: INPUT (Was geht rein?) */}
        <div className="flex-1 flex flex-col bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
          <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>📥 Input (Eingangs-Payload)</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500">Quelle: Vorstufe / E-Mail</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed">
            {viewMode === 'raw' ? (
              <pre className="text-sky-300 whitespace-pre-wrap">
                {JSON.stringify(trace?.inputData || {}, null, 2)}
              </pre>
            ) : (
              <div className="space-y-1.5 text-xs font-sans">
                {Object.entries(trace?.inputData || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{key}</div>
                    <div className="text-white font-medium break-words mt-0.5">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trennpfeil nach unten */}
        <div className="flex items-center justify-center -my-1 text-slate-600">
          <div className="h-px bg-slate-800 flex-1" />
          <div className="px-2 text-[10px] font-mono text-slate-500 flex items-center space-x-1">
            <ArrowDown className="w-3 h-3 text-[#0A6ED1]" />
            <span>Transformation</span>
          </div>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* SEKTION B: OUTPUT (Was kommt raus?) */}
        <div className="flex-1 flex flex-col bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
          <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className={`w-1.5 h-1.5 rounded-full ${hasError ? 'bg-red-400' : 'bg-emerald-400'}`} />
              <span>📤 Output (Ergebnis des Schritts)</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500">Ziel: ERP / Folgeschritt</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed">
            {hasError ? (
              <div className="bg-red-950/60 border border-red-800 p-2.5 rounded text-red-200 space-y-1 font-sans text-xs">
                <div className="font-bold flex items-center space-x-1 text-red-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Ausführung blockiert / Fehler</span>
                </div>
                <div className="font-mono text-[11px] text-red-300">
                  {trace?.logMessage || 'Fehler beim Schritt-Durchlauf.'}
                </div>
                <pre className="text-[10px] font-mono text-red-300/80 bg-slate-950 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(trace?.outputData || {}, null, 2)}
                </pre>
              </div>
            ) : viewMode === 'raw' ? (
              <pre className="text-emerald-300 whitespace-pre-wrap">
                {JSON.stringify(trace?.outputData || {}, null, 2)}
              </pre>
            ) : (
              <div className="space-y-1.5 text-xs font-sans">
                {Object.entries(trace?.outputData || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{key}</div>
                    <div className="text-emerald-300 font-semibold break-words mt-0.5">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Footer mit Schritt-Erklärung */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 text-[10px] text-slate-400 leading-tight">
        <span className="font-bold text-slate-300">Schritt-Log: </span>
        <span className="italic">{trace?.logMessage || 'Bereit für Simulation.'}</span>
      </div>
    </div>
  );
};
