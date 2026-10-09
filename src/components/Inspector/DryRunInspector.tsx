'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { DRY_RUN_SAMPLE_ORDER } from '@/data/dryRunSample';
import {
  X,
  Play,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileCode,
  Clock,
  Coins,
  Cpu,
  Mail,
  RefreshCw,
} from 'lucide-react';

export const DryRunInspector: React.FC = () => {
  const { isDryRunOpen, toggleDryRun, dryRunResult, executeDryRun } = useSimulatorStore();
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  if (!isDryRunOpen || !dryRunResult) return null;

  const currentTrace = dryRunResult.traces[activeStepTab] || dryRunResult.traces[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B132B] border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/80">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Dry-Run Payload-Inspektor: Kundenbestellung_4711.eml
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                    dryRunResult.overallStatus === 'success'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : dryRunResult.overallStatus === 'failed_guardrail'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  Status: {dryRunResult.overallStatus.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Simulation mit realem Maschinenbau-Auftragseingang (DIN 2633 Flansche)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={executeDryRun}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Simulation neu berechnen</span>
            </button>
            <button
              onClick={() => toggleDryRun(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Run Telemetry Bar */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Gesamtlatenz: <strong className="text-white">{dryRunResult.totalLatencyMs} ms</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Tokens Gesamt: <strong className="text-white">{dryRunResult.totalTokens.toLocaleString('de-DE')}</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>SAP BTP CU: <strong className="text-white">{dryRunResult.totalCapacityUnits}</strong></span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Beleg: PO-4711-AUG | Debitor: KUNNR 0000100420
          </div>
        </div>

        {/* Main Content Area: Left Raw Email, Center Step Pipeline, Right Step Trace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Spalte 1: Raw Inbound E-Mail */}
          <div className="w-72 bg-slate-950/80 border-r border-slate-800/80 p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Inbound Dokument</span>
            </div>
            <div className="text-[11px] space-y-1 mb-3 text-slate-400 border-b border-slate-800/80 pb-2">
              <div><strong className="text-slate-300">Von:</strong> {DRY_RUN_SAMPLE_ORDER.sender}</div>
              <div><strong className="text-slate-300">Betreff:</strong> {DRY_RUN_SAMPLE_ORDER.subject}</div>
              <div><strong className="text-slate-300">Format:</strong> RFC 822 (.eml unstrukturiert)</div>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 bg-slate-900/90 p-2.5 rounded border border-slate-800 flex-1 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {DRY_RUN_SAMPLE_ORDER.rawEmail}
            </pre>
          </div>

          {/* Spalte 2: Step Pipeline Navigation */}
          <div className="w-64 bg-slate-900/50 border-r border-slate-800/80 p-3 flex flex-col space-y-2 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Pipeline Schritte:</span>
            {dryRunResult.traces.map((trace, idx) => (
              <button
                key={trace.stepId}
                onClick={() => setActiveStepTab(idx)}
                className={`text-left p-2.5 rounded-lg border transition flex flex-col space-y-1 ${
                  activeStepTab === idx
                    ? 'bg-sky-950/70 border-sky-600 text-white'
                    : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Schritt {idx + 1}: {trace.oodaPhase}
                  </span>
                  {trace.status === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  {trace.status === 'escalation' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {trace.status === 'error' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                </div>
                <span className="text-xs font-semibold truncate">{trace.stepName}</span>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{trace.archetype}</span>
                  <span>{trace.latencyMs} ms</span>
                </div>
              </button>
            ))}
          </div>

          {/* Spalte 3: Active Step Deep Dive Trace & Payload */}
          <div className="flex-1 p-5 flex flex-col overflow-y-auto space-y-4">
            {/* Step Header */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {currentTrace.oodaPhase} &bull; {currentTrace.primitive}
                  </span>
                  <h4 className="text-sm font-bold text-white">{currentTrace.stepName}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentTrace.logMessage}</p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Latenz:</span> {currentTrace.latencyMs} ms
                </div>
                <div>
                  <span className="text-slate-500">Tokens:</span> {currentTrace.tokensUsed}
                </div>
                <div>
                  <span className="text-slate-500">Sub-Calls:</span> {currentTrace.subCalls}
                </div>
              </div>
            </div>

            {/* Warnings or Guardrail Alerts in this step */}
            {currentTrace.triggeredChallenges.length > 0 && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-xs text-red-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Ausgelöste Audit-Risiken: </strong>
                  {currentTrace.triggeredChallenges.join(', ')}
                  <p className="text-[11px] text-red-300/80 mt-0.5">
                    Schrittkonfiguration erfordert zwingend deterministische Validierung oder Human-in-the-Loop Gate.
                  </p>
                </div>
              </div>
            )}

            {/* JSON Output Payload */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>Schritt-Output JSON (Ergebnis des Archetyps)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">application/json</span>
              </div>
              <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed shadow-inner">
                {JSON.stringify(currentTrace.outputData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
