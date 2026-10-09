'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { RadarChallenges } from './RadarChallenges';
import { CostBreakdown } from './CostBreakdown';
import {
  Sliders,
  Gauge,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  FileCheck2,
  AlertOctagon,
} from 'lucide-react';

export const ControlSidebar: React.FC = () => {
  const {
    config,
    metrics,
    setMonthlyVolume,
    setDataNoiseRate,
    setHourlyWageEur,
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState<'radar' | 'cost'>('radar');

  return (
    <aside className="w-96 bg-[#0B1120] border-l border-slate-800 text-slate-100 flex flex-col h-full overflow-y-auto shadow-2xl">
      {/* 1. Global Simulation Sliders */}
      <div className="p-4 border-b border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Sliders className="w-4 h-4 text-[#0A6ED1]" />
          <span>Globale Parameter</span>
        </div>

        {/* Slider 1: Monatsvolumen */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Monatsvolumen:</span>
            <span className="font-mono font-bold text-sky-400">
              {config.monthlyVolume.toLocaleString('de-DE')} Belege/M
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={250000}
            step={1000}
            value={config.monthlyVolume}
            onChange={(e) => setMonthlyVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0A6ED1]"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1k</span>
            <span>100k</span>
            <span>250k</span>
          </div>
        </div>

        {/* Slider 2: Data Noise Level */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Data Noise (Verschmutzung):</span>
            <span className="font-mono font-bold text-amber-400">
              {Math.round(config.dataNoiseRate * 100)} %
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={config.dataNoiseRate}
            onChange={(e) => setDataNoiseRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-500 leading-tight">
            Simuliert unvollständige Felder, OCR-Fehler & unstrukturierte Freitext-Variationen.
          </p>
        </div>

        {/* Slider 3: Stundensatz Klärfall */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Stundensatz Klärfall (Human):</span>
            <span className="font-mono font-bold text-emerald-400">{config.hourlyWageEur} €/h</span>
          </div>
          <input
            type="range"
            min={30}
            max={120}
            step={5}
            value={config.hourlyWageEur}
            onChange={(e) => setHourlyWageEur(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* 2. Live Cockpit KPIs */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <span>Live-Cockpit KPIs</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* KPI 1: TCA Gesamt */}
          <div className="col-span-2 p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
              <span>Total Cost of Automation</span>
              <span className="text-sky-400 font-mono">TCA / Monat</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 font-mono tracking-tight">
              {metrics.totalCostOfAutomationEur.toLocaleString('de-DE')} €
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Baseline (100% Manuell):</span>
              <span className="font-mono font-semibold text-slate-300">
                {metrics.baselineManualCostEur.toLocaleString('de-DE')} €
              </span>
            </div>
          </div>

          {/* KPI 2: SAP Capacity Units */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90">
            <div className="text-[10px] font-medium text-slate-400 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-sky-400" />
              <span>SAP BTP CU</span>
            </div>
            <div className="text-base font-bold text-sky-300 mt-1 font-mono">
              {metrics.sapCapacityUnits.toLocaleString('de-DE')}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              ~{metrics.sapCuCostEur.toLocaleString('de-DE')} €/M
            </div>
          </div>

          {/* KPI 3: End-to-End Latenz */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90">
            <div className="text-[10px] font-medium text-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>E2E Latenz</span>
            </div>
            <div className="text-base font-bold text-amber-300 mt-1 font-mono">
              {metrics.endToEndLatencySec} s
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              pro Durchlauf
            </div>
          </div>

          {/* KPI 4: Lights-Out Automationsgrad */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90">
            <div className="text-[10px] font-medium text-slate-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Lights-Out</span>
            </div>
            <div className="text-base font-bold text-emerald-300 mt-1 font-mono">
              {metrics.lightsOutAutomationRate} %
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              ohne Eingriff
            </div>
          </div>

          {/* KPI 5: Clean Core Score */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90">
            <div className="text-[10px] font-medium text-slate-400 flex items-center space-x-1">
              <FileCheck2 className="w-3 h-3 text-indigo-400" />
              <span>Clean Core</span>
            </div>
            <div className="text-base font-bold text-indigo-300 mt-1 font-mono">
              {metrics.cleanCoreScore} %
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              S/4HANA Index
            </div>
          </div>
        </div>

        {metrics.activeViolationsCount > 0 && (
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-[11px] leading-tight">
              Achtung: {metrics.activeViolationsCount} Schritt(e) mit Blast-Radius &ge; 4 ohne deterministisches Validierungs-Gate!
            </span>
          </div>
        )}
      </div>

      {/* 3. Deep Dive Tabs: Radar vs. Cost Breakdown */}
      <div className="p-4 flex-1 space-y-3">
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex-1 py-1.5 rounded transition ${
              activeTab === 'radar'
                ? 'bg-[#0A6ED1] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            13-Challenges Radar
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`flex-1 py-1.5 rounded transition ${
              activeTab === 'cost'
                ? 'bg-[#0A6ED1] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TCA Kostenzerlegung
          </button>
        </div>

        {activeTab === 'radar' ? <RadarChallenges /> : <CostBreakdown />}
      </div>
    </aside>
  );
};
