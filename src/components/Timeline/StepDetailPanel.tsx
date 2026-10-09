'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { RISK_CHALLENGES } from '@/data/challenges';
import { AutomationArchetype, CleanCoreIndex } from '@/types/process';
import {
  Cpu,
  Search,
  UserCheck,
  Bot,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Coins,
  FileCode,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

const ARCHETYPE_OPTIONS: Array<{
  id: AutomationArchetype;
  label: string;
  sub: string;
  latency: string;
  cu: string;
  icon: React.ReactNode;
  summary: string;
}> = [
  {
    id: 'deterministic',
    label: '1. Deterministisch',
    sub: 'BRFplus / SQL',
    latency: '< 50 ms',
    cu: '0 CU',
    icon: <Cpu className="w-3.5 h-3.5 text-blue-400" />,
    summary: 'Strikte DMN-/SQL-Regeln. 0 € Grenzkosten, < 50 ms Latenz. Ambiguitätstoleranz = 0 (nur für strukturierte Daten).',
  },
  {
    id: 'classic_ml',
    label: '2. Klassisches ML',
    sub: 'HANA Fuzzy Search',
    latency: '~ 80 ms',
    cu: '0 CU',
    icon: <Search className="w-3.5 h-3.5 text-emerald-400" />,
    summary: 'Fuzzy-Matching & Vektorsuche. Erkennt abweichende Schreibweisen von Debitoren/Materialien ohne Halluzinationsgefahr.',
  },
  {
    id: 'copilot',
    label: '3. Copilot (Joule)',
    sub: 'Human Commit',
    latency: '~ 650 ms',
    cu: '0.02 CU',
    icon: <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
    summary: 'KI generiert Entwurf oder Vorschlag. Die finale Freigabe verbleibt zwingend beim menschlichen Sachbearbeiter.',
  },
  {
    id: 'autopilot',
    label: '4. Autopilot',
    sub: 'Single Agent',
    latency: '~ 1.450 ms',
    cu: '0.08 CU',
    icon: <Bot className="w-3.5 h-3.5 text-indigo-400" />,
    summary: 'Eigenständige Ausführung mit Tool-Calling innerhalb enger Leitplanken. Bricht bei unklaren Konfidenzen ab.',
  },
  {
    id: 'agentic',
    label: '5. Multi-Agent',
    sub: 'ReAct Loops',
    latency: '~ 3.800 ms',
    cu: '0.40 CU',
    icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
    summary: 'Dynamische Multi-Agenten-Orchestrierung. Maximale Flexibilität für komplexe Freitexte, jedoch hohe Latenz & Tokenkosten.',
  },
];

export const StepDetailPanel: React.FC = () => {
  const {
    steps,
    config,
    selectedStepId,
    updateStepArchetype,
    updateStepConfidence,
    updateStepCleanCore,
    openChallengeDrawer,
    dryRunResult,
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState<'config' | 'governance' | 'payload'>('config');

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[0];
  if (!selectedStep) return null;

  const metrics = calculateStepMetrics(selectedStep, config);
  const trace = dryRunResult?.traces?.find((t) => t.stepId === selectedStep.id);
  const lightsOutPercent = Math.round(metrics.effectiveAutomationRate * 100);
  const humanReviewPercent = 100 - lightsOutPercent;
  const currentArchetypeInfo = ARCHETYPE_OPTIONS.find((a) => a.id === selectedStep.currentArchetype)!;

  return (
    <div className="flex-1 bg-[#080d1a] flex flex-col h-full overflow-hidden select-none">
      {/* 1. Kompakter Header mit Mini-KPIs */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="font-mono font-bold text-sky-400 uppercase tracking-wider">
              {selectedStep.oodaPhase}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">{selectedStep.primitive}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight mt-0.5">{selectedStep.name}</h2>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            SAP: <span className="text-sky-300">{selectedStep.sapReference}</span>
          </p>
        </div>

        {/* 3 Mini-KPI Pillen */}
        <div className="flex items-center space-x-2 font-mono">
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-center">
            <div className="text-[9px] uppercase text-slate-500 font-bold">Latenz</div>
            <div className="text-xs font-bold text-white">{metrics.latencyMs} ms</div>
          </div>
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-center">
            <div className="text-[9px] uppercase text-slate-500 font-bold">Dunkelquote</div>
            <div className="text-xs font-bold text-emerald-400">{lightsOutPercent} %</div>
          </div>
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-center">
            <div className="text-[9px] uppercase text-slate-500 font-bold">Kosten / M</div>
            <div className="text-xs font-bold text-sky-300">
              {Math.round(metrics.totalCostEur).toLocaleString('de-DE')} €
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs: Reduziert die visuelle Last drastisch */}
      <div className="px-4 pt-2 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'config'
                ? 'border-[#0A6ED1] text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Engine & Konfidenz</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'governance'
                ? 'border-[#0A6ED1] text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Clean Core & Risiken</span>
            {metrics.triggeredChallengeIds.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('payload')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'payload'
                ? 'border-[#0A6ED1] text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>3. Belegdaten (JSON)</span>
          </button>
        </div>

        {/* Live-Status Badge */}
        {trace && (
          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            Letzter Durchlauf: <strong className={trace.status === 'success' ? 'text-emerald-400' : 'text-amber-400'}>{trace.status}</strong>
          </span>
        )}
      </div>

      {/* 3. Tab-Inhalte (Kompakt und ohne Scroll-Chaos) */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {/* TAB 1: KONFIGURATION & ENGINE */}
        {activeTab === 'config' && (
          <div className="space-y-4 max-w-3xl">
            {/* Archetyp Auswahl als kompaktes horizontales Segment-Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Technischer Archetyp:
              </label>

              <div className="grid grid-cols-5 gap-2">
                {ARCHETYPE_OPTIONS.map((opt) => {
                  const isSelected = selectedStep.currentArchetype === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => updateStepArchetype(selectedStep.id, opt.id)}
                      className={`p-2.5 rounded-lg border-2 text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-sky-950/80 border-[#0A6ED1] shadow-md ring-1 ring-[#0A6ED1]'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1">
                        {opt.icon}
                        <span className="text-xs font-bold text-white truncate">{opt.label.split(' ')[1]}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">{opt.sub}</div>
                      <div className="mt-2 text-[9px] font-mono flex justify-between text-slate-500 border-t border-slate-800/80 pt-1">
                        <span>{opt.latency}</span>
                        <span className={opt.cu === '0 CU' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{opt.cu}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Kurzer dynamischer Info-Satz zur gewählten Engine */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-snug flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>{currentArchetypeInfo.summary}</span>
              </div>
            </div>

            {/* Konfidenz-Gate & Verteilung */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Konfidenz-Gate & Automationsquote
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Schwellenwert für Dunkelverarbeitung. Belege darunter gehen an den Sachbearbeiter.
                  </p>
                </div>
                <span className="text-sm font-black font-mono text-sky-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
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
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0A6ED1]"
              />

              {/* Kompakter 8px Balken */}
              <div className="space-y-1 pt-1">
                <div className="w-full h-2 bg-slate-950 rounded-full flex overflow-hidden border border-slate-800">
                  <div style={{ width: `${lightsOutPercent}%` }} className="bg-emerald-500" />
                  <div style={{ width: `${humanReviewPercent}%` }} className="bg-amber-500" />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                  <span className="text-emerald-400 font-medium">
                    ● Dunkelverarbeitung: {lightsOutPercent}% ({Math.round(metrics.cuCostEur)} € Inferenz)
                  </span>
                  <span className="text-amber-400 font-medium">
                    ● Human Review: {humanReviewPercent}% ({Math.round(metrics.humanResolutionCostEur)} € Klärzeit)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOVERNANCE, CLEAN CORE & RISIKEN */}
        {activeTab === 'governance' && (
          <div className="space-y-4 max-w-3xl">
            <div className="grid grid-cols-2 gap-4">
              {/* Clean Core Reifegrad */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Clean Core Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedStep.cleanCoreIndex === 'COMPLIANT'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : selectedStep.cleanCoreIndex === 'LEGACY'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-red-950 text-red-300 border-red-700'
                  }`}>
                    {selectedStep.cleanCoreIndex}
                  </span>
                </div>

                <div className="flex space-x-1.5 pt-1">
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

              {/* Blast Radius (Reversibilität) */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Blast Radius</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedStep.reversibility >= 4
                      ? 'bg-red-950 text-red-300 border border-red-800 font-bold'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    Stufe {selectedStep.reversibility} / 5
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {selectedStep.reversibility >= 4
                    ? 'Rechtsverbindlich / Buchungswirksam. Autonome Verbuchung erfordert zwingend Human-in-the-Loop Gate (GoBD).'
                    : 'Geringes Schadenspotenzial. Fehler können im Belegfluss vor dem Commit korrigiert werden.'}
                </p>
              </div>
            </div>

            {/* Audit-Risiken aus dem 13-Challenges-Radar */}
            {metrics.triggeredChallengeIds.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dieser Schritt ist optimal konfiguriert – keine aktiven Risikowarnungen.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{metrics.triggeredChallengeIds.length} methodische(s) Risiko(en) erkannt:</span>
                </span>

                {metrics.triggeredChallengeIds.map((cId) => {
                  const ch = RISK_CHALLENGES[cId];
                  if (!ch) return null;
                  return (
                    <div key={cId} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {cId}: {ch.name}
                        </span>
                        <button
                          onClick={() => openChallengeDrawer(cId)}
                          className="text-[10px] text-sky-400 hover:text-sky-300 underline font-semibold"
                        >
                          Detail-Analyse &rarr;
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">{ch.description}</p>
                      <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-900/50 mt-1">
                        <strong>SAP Mitigation:</strong> {ch.mitigationStrategy}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE BELEGDATEN (JSON) */}
        {activeTab === 'payload' && (
          <div className="space-y-2 max-w-3xl flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Beleglauf-Output von: Kundenbestellung_4711.eml</span>
              <span>Latenz: {trace?.latencyMs || metrics.latencyMs} ms</span>
            </div>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-sky-300 overflow-y-auto max-h-[420px] leading-relaxed">
              {JSON.stringify(trace?.outputData || { status: 'Noch nicht simuliert. Klicke auf [ ▶ Durchlauf testen ].' }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
