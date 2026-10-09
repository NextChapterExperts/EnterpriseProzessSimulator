'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { DRY_RUN_SAMPLE_ORDER } from '@/data/dryRunSample';
import {
  Mail,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCode,
  Clock,
  Cpu,
  Coins,
  ShieldAlert,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const InspectorTab: React.FC = () => {
  const { dryRunResult, steps, executeDryRun, runParetoOptimization } = useSimulatorStore();
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const activeTrace = dryRunResult?.traces?.[selectedStepIndex] || dryRunResult?.traces?.[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080d1a] overflow-hidden text-slate-100 p-6 space-y-4">
      {/* Top Banner mit Status & Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">
                Beleglauf-Inspektor: {DRY_RUN_SAMPLE_ORDER.subject}
              </h2>
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
              Absender: {DRY_RUN_SAMPLE_ORDER.sender} &bull; Beleg-ID: PO-4711-AUG &bull; Reale Maschinenbau-Bestellung
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => runParetoOptimization()}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>★ Pareto anwenden</span>
          </button>
          <button
            onClick={() => executeDryRun()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Neu simulieren</span>
          </button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Gesamtlatenz</div>
            <div className="text-sm font-bold text-white font-mono">{dryRunResult.totalLatencyMs} ms</div>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-sky-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Verbrauchte Tokens</div>
            <div className="text-sm font-bold text-white font-mono">{dryRunResult.totalTokens.toLocaleString('de-DE')}</div>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-3">
          <Coins className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">SAP BTP Capacity Units</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">{dryRunResult.totalCapacityUnits} CU</div>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Clean Core Verbuchung</div>
            <div className="text-sm font-bold text-indigo-300 font-mono">OData API_SALES_ORDER</div>
          </div>
        </div>
      </div>

      {/* 3-Spalten Workspace */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Spalte 1: Eingehende E-Mail */}
        <div className="w-1/3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 border-b border-slate-800 pb-2">
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Eingangs-Dokument (Unstrukturiert)</span>
          </div>
          <pre className="flex-1 text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {DRY_RUN_SAMPLE_ORDER.rawEmail}
          </pre>
        </div>

        {/* Spalte 2: Pipeline Navigation */}
        <div className="w-1/4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col space-y-2 overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 px-2 py-1 border-b border-slate-800">
            Pipeline Schritte ({dryRunResult.traces.length})
          </div>
          {dryRunResult.traces.map((trace, idx) => (
            <button
              key={trace.stepId}
              onClick={() => setSelectedStepIndex(idx)}
              className={`text-left p-3 rounded-lg border transition flex flex-col space-y-1 ${
                selectedStepIndex === idx
                  ? 'bg-sky-950 border-sky-500 shadow-md'
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-sky-400">
                  {trace.oodaPhase} &bull; Schritt {idx + 1}
                </span>
                {trace.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {trace.status === 'escalation' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {trace.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="text-xs font-semibold text-white truncate">{trace.stepName}</div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{trace.archetype}</span>
                <span>{trace.latencyMs} ms</span>
              </div>
            </button>
          ))}
        </div>

        {/* Spalte 3: Schritt-Ergebnis, SAP Discovery Center Agent & JSON */}
        <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden space-y-3">
          <div className="border-b border-slate-800 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-sky-400">
                  {activeTrace?.oodaPhase} &bull; {activeTrace?.primitive}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeTrace?.stepName}</h3>
              </div>
              <div className="text-right text-xs font-mono text-slate-400">
                <div>Tokens: <strong className="text-white">{activeTrace?.tokensUsed}</strong></div>
                <div>Latenz: <strong className="text-white">{activeTrace?.latencyMs} ms</strong></div>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-2 rounded border border-slate-800">
              {activeTrace?.logMessage}
            </p>
          </div>

          {/* SAP Discovery Center Agent Box */}
          {(() => {
            const currentStep = steps.find((s) => s.id === activeTrace?.stepId);
            const sapMatch = currentStep?.sapAgentMatch;
            const agent = sapMatch?.matchedAgent;

            if (!sapMatch) return null;

            return (
              <div className="bg-slate-950/80 border border-sky-900/40 rounded-xl p-3 space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                      SAP Discovery Center Matching
                    </span>
                    {sapMatch.recommendationType === 'SAP_STANDARD_AGENT' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                        Standard Agent
                      </span>
                    )}
                    {sapMatch.recommendationType === 'PARTNER_AGENT' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                        Partner Agent
                      </span>
                    )}
                    {sapMatch.recommendationType === 'JOULE_ASSISTANT' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        Joule Assistant
                      </span>
                    )}
                    {sapMatch.recommendationType === 'DETERMINISTIC_FAST_PATH' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                        Clean Core Fast-Path
                      </span>
                    )}
                    {sapMatch.recommendationType === 'CUSTOM_GAP' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        Weißer Fleck (Gap)
                      </span>
                    )}
                  </div>

                  {agent?.discoveryCenterUrl && (
                    <a
                      href={agent.discoveryCenterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10.5px] font-mono text-sky-400 hover:text-sky-300 hover:underline flex items-center space-x-1"
                    >
                      <span>Im Katalog öffnen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {agent ? (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">{agent.name}</div>
                    <div className="text-[11px] text-slate-300 leading-snug">{agent.shortDescription}</div>
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-1.5 border-t border-slate-800/80 text-[10.5px] font-mono text-slate-400">
                      <div>
                        {agent.worksWith?.length > 0 && (
                          <span>Kompatibel mit: <strong className="text-slate-200">{agent.worksWith.join(', ')}</strong></span>
                        )}
                      </div>
                      <div className="text-emerald-400 font-bold">
                        {agent.pricePerBlockAiu > 0
                          ? `${agent.pricePerBlockAiu} AIU / Aktion (~${agent.monthlyCostEurEstimated.toFixed(2)} €/Mo)`
                          : '0 AIU / Standard-Feature'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-300 leading-snug">
                    {sapMatch.explanation}
                  </div>
                )}
              </div>
            );
          })()}

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2 shrink-0">
              <span className="flex items-center space-x-1.5">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Schritt-Payload (JSON Output)</span>
              </span>
            </div>
            <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-sky-300 overflow-y-auto leading-relaxed">
              {JSON.stringify(activeTrace?.outputData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
