'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  Sliders,
  X,
  FileText,
  AlertTriangle,
  Clock,
  Euro,
  Cpu,
  Sparkles,
  TrendingDown,
  Building,
  Briefcase,
  Zap,
} from 'lucide-react';

export const SimulationConfigModal: React.FC = () => {
  const {
    isConfigModalOpen,
    toggleConfigModal,
    config,
    metrics,
    setMonthlyVolume,
    setDataNoiseRate,
    setHourlyWageEur,
    setResolutionTimeMinutes,
    setCuPriceFactorEur,
    language,
  } = useSimulatorStore();

  if (!isConfigModalOpen) return null;

  const isEn = language === 'en';

  // Presets für schnelle Szenario-Umschaltung
  const applyPreset = (preset: 'midmarket' | 'enterprise' | 'high_noise') => {
    if (preset === 'midmarket') {
      setMonthlyVolume(5000);
      setDataNoiseRate(0.10);
      setHourlyWageEur(50);
      setResolutionTimeMinutes(10);
      setCuPriceFactorEur(1.2);
    } else if (preset === 'enterprise') {
      setMonthlyVolume(100000);
      setDataNoiseRate(0.12);
      setHourlyWageEur(65);
      setResolutionTimeMinutes(15);
      setCuPriceFactorEur(1.0);
    } else if (preset === 'high_noise') {
      setMonthlyVolume(25000);
      setDataNoiseRate(0.35);
      setHourlyWageEur(60);
      setResolutionTimeMinutes(20);
      setCuPriceFactorEur(1.2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 1. Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <span>{isEn ? 'Simulation 1: Process Parameters' : 'Simulation 1: Prozess-Stellschrauben'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                  Live Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Dynamically adjust business volume, error noise, and labor rates to recalculate process costs.'
                  : 'Regeln Sie Belegvolumen, Fehlerraten und Stundensätze – alle Step-Kosten und CUs passen sich in Echtzeit an.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleConfigModal(false)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{isEn ? 'Quick Business Presets' : 'Schnellwahl-Szenarien'}</span>
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => applyPreset('midmarket')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-sky-500/60 transition text-left space-y-1 group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">
                  <Building className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{isEn ? 'Mid-Market' : 'Mittelstand'}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {isEn ? '5k Docs • 10% Noise • 50 €/h' : '5k Belege • 10% Noise • 50 €/h'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('enterprise')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-500/60 transition text-left space-y-1 group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{isEn ? 'Enterprise' : 'Großkonzern'}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {isEn ? '100k Docs • 12% Noise • 65 €/h' : '100k Belege • 12% Noise • 65 €/h'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('high_noise')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-amber-500/60 transition text-left space-y-1 group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{isEn ? 'High Dirty Data' : 'Hohes Rauschen'}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {isEn ? '25k Docs • 35% Noise • 20 min Esc.' : '25k Belege • 35% Noise • 20 min Klärung'}
                </div>
              </button>
            </div>
          </div>

          {/* Schieberegler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Monatliches Belegvolumen */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{isEn ? 'Monthly Document Volume (V)' : 'Monatliches Belegvolumen (V)'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {config.monthlyVolume.toLocaleString(isEn ? 'en-US' : 'de-DE')} {isEn ? 'Docs' : 'Belege'}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={250000}
                step={1000}
                value={config.monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0A6ED1]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1,000</span>
                <span>50,000</span>
                <span>250,000</span>
              </div>
            </div>

            {/* 2. Eingangs-Fehlerquote (Data Noise) */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{isEn ? 'Dirty Data Rate / Noise' : 'Dirty Data Quote / Scan-Rauschen'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {Math.round(config.dataNoiseRate * 100)} %
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={0.50}
                step={0.01}
                value={config.dataNoiseRate}
                onChange={(e) => setDataNoiseRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{isEn ? '0% (Clean EDI)' : '0% (Reine EDI)'}</span>
                <span>{isEn ? '25% (Mixed)' : '25% (Mix)'}</span>
                <span>{isEn ? '50% (Poor Scans)' : '50% (Schlechte Scans)'}</span>
              </div>
            </div>

            {/* 3. Stundensatz Sachbearbeiter */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Euro className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isEn ? 'Hourly Labor Cost (C_human)' : 'Stundensatz Sachbearbeiter (C_human)'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {config.hourlyWageEur} € / {isEn ? 'Hour' : 'Stunde'}
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={120}
                step={5}
                value={config.hourlyWageEur}
                onChange={(e) => setHourlyWageEur(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30 €/h</span>
                <span>65 €/h</span>
                <span>120 €/h</span>
              </div>
            </div>

            {/* 4. Klärzeit pro Eskalation */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{isEn ? 'Resolution Time per Escalation' : 'Klärzeit pro Ausnahme / Eskalation'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {config.resolutionTimeMinutes} {isEn ? 'Minutes' : 'Minuten'}
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={45}
                step={1}
                value={config.resolutionTimeMinutes}
                onChange={(e) => setResolutionTimeMinutes(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{isEn ? '3 min (Quick)' : '3 min (Kurzprüfung)'}</span>
                <span>15 min</span>
                <span>{isEn ? '45 min (Deep Research)' : '45 min (Tiefenrecherche)'}</span>
              </div>
            </div>
          </div>

          {/* 5. Live Bilanz-Box */}
          <div className="bg-gradient-to-r from-slate-100 dark:from-slate-950 to-indigo-50 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-indigo-700 dark:text-indigo-300 font-bold">
                <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{isEn ? 'Live Recalculation for Overall Process:' : 'Live-Neuberechnung für den Gesamtprozess:'}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {isEn ? (
                  <>
                    Based on the current volume of <strong>{config.monthlyVolume.toLocaleString('en-US')} transactions/month</strong>.
                  </>
                ) : (
                  <>
                    Basierend auf dem aktuellen Belegvolumen von <strong>{config.monthlyVolume.toLocaleString('de-DE')} Vorgängen/Monat</strong>.
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center w-full md:w-auto">
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
                <div className="text-[9.5px] uppercase font-mono text-slate-500">
                  {isEn ? 'Total Cost' : 'Gesamtkosten'}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {metrics.totalCostOfAutomationEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
                <div className="text-[9.5px] uppercase font-mono text-slate-500">
                  {isEn ? 'Automation' : 'Dunkelquote'}
                </div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {metrics.lightsOutAutomationRate} %
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
                <div className="text-[9.5px] uppercase font-mono text-slate-500">
                  {isEn ? 'Savings / M' : 'Ersparnis / M'}
                </div>
                <div className="text-sm font-bold text-sky-700 dark:text-sky-300 font-mono flex items-center justify-center space-x-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>{metrics.monthlySavingsVsManualEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            {isEn
              ? 'Changes immediately update all simulation traces and capacity units.'
              : 'Werte wirken sich sofort auf alle Simulationstraces und Capacity Units aus.'}
          </span>
          <button
            onClick={() => toggleConfigModal(false)}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition active:scale-95"
          >
            {isEn ? 'Done & Close' : 'Fertig & Schließen'}
          </button>
        </div>
      </div>
    </div>
  );
};
