'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { RadarChallenges } from '@/components/Cockpit/RadarChallenges';
import { CostBreakdown } from '@/components/Cockpit/CostBreakdown';
import { MessageEditorModal } from '@/components/Modals/MessageEditorModal';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  Sliders,
  Gauge,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingDown,
  Layers,
  Edit3,
} from 'lucide-react';

export const CockpitTab: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const {
    config,
    metrics,
    setMonthlyVolume,
    setDataNoiseRate,
    setHourlyWageEur,
    runParetoOptimization,
    language,
    selectedMessageQuality,
    setMessageQuality,
    customMessageText,
  } = useSimulatorStore();

  const isEn = language === 'en';
  const t = TRANSLATIONS[language];
  const isCustom = customMessageText !== null;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/90 dark:bg-[#080d1a] overflow-y-auto p-4 sm:p-6 select-none transition-colors duration-150">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* 1. Header mit Pareto Callout */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-lg">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Executive TCO & Advisory Cockpit</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEn
              ? 'Real-time calculation of Total Cost of Automation (TCA), SAP BTP Sizing, and Risk Profile'
              : 'Echtzeit-Berechnung der Total Cost of Automation (TCA), SAP BTP Sizing und Risikoprofil'}
          </p>
        </div>

        <button
          onClick={() => runParetoOptimization()}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition transform hover:scale-105 active:scale-95 border border-amber-300/60"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{isEn ? '★ Calculate Pareto Optimum' : '★ Pareto-Optimum berechnen'}</span>
        </button>
      </div>

      {/* 2. Globale Stellschrauben & Testdaten (Slider Bar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow">
        {/* Slider 1: Monatsvolumen */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">
              {isEn ? 'Monthly Volume:' : 'Monatsvolumen:'}
            </span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
              {config.monthlyVolume.toLocaleString(isEn ? 'en-US' : 'de-DE')} {isEn ? 'docs / month' : 'Belege / Monat'}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={250000}
            step={1000}
            value={config.monthlyVolume}
            onChange={(e) => setMonthlyVolume(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0A6ED1]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>1.000</span>
            <span>100.000</span>
            <span>250.000</span>
          </div>
        </div>

        {/* Slider 2: Data Noise */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">
              {isEn ? 'Data Noise Level:' : 'Data Noise Level:'}
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
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
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Simulates incomplete fields & OCR noise'
              : 'Simuliert unvollständige Felder & OCR-Rauschen'}
          </div>
        </div>

        {/* Slider 3: Stundensatz */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">
              {isEn ? 'Human Clerk Hourly Rate:' : 'Stundensatz Klärfall (Human):'}
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {config.hourlyWageEur} €/h
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={120}
            step={5}
            value={config.hourlyWageEur}
            onChange={(e) => setHourlyWageEur(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Cost basis for manual clerk review'
              : 'Kostenbasis für manuelle Sachbearbeitung'}
          </div>
        </div>

        {/* Box 4: Eingangsnachricht-Qualität & Editor */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">
              {isEn ? 'Inbound Test Message:' : 'Eingangsnachricht-Test:'}
            </span>
            <span className="font-mono text-xs font-bold">
              {isCustom ? (
                <span className="text-amber-600 dark:text-amber-400">{isEn ? 'Custom' : 'Editiert'}</span>
              ) : selectedMessageQuality === 'good' ? (
                <span className="text-emerald-600 dark:text-emerald-400">{isEn ? 'Best Practice' : 'Optimal'}</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">{isEn ? 'Noisy' : 'Verrauscht'}</span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="flex-1 grid grid-cols-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-[10.5px] gap-1">
              <button
                type="button"
                onClick={() => setMessageQuality('good')}
                className={`py-1 rounded font-semibold transition text-center ${
                  selectedMessageQuality === 'good' && !isCustom
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isEn ? 'Clean message with full IDs' : 'Vollständige Nachricht mit IDs'}
              >
                {t.btnQualityGood}
              </button>
              <button
                type="button"
                onClick={() => setMessageQuality('poor')}
                className={`py-1 rounded font-semibold transition text-center ${
                  selectedMessageQuality === 'poor' && !isCustom
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isEn ? 'Noisy message with missing fields' : 'Verrauschte Nachricht mit fehlenden Feldern'}
              >
                {t.btnQualityPoor}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-semibold border transition shadow shrink-0 ${
                isCustom
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900'
              }`}
              title={isEn ? 'Edit raw inbound text in modal' : 'Eingangstext im Editor anpassen'}
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{isCustom ? t.btnTextModified : (isEn ? 'Edit' : 'Editieren')}</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Training mode: switch between clean & noisy test emails'
              : 'Schulungsmodus: Testdaten zwischen Clean & Rauschen umschalten'}
          </div>
        </div>
      </div>

      {/* 3. Große KPI-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Cost of Automation</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {metrics.totalCostOfAutomationEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isEn ? 'monthly total cost' : 'monatliche Gesamtkosten'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow">
          <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{isEn ? 'Savings vs. Manual' : 'Ersparnis vs. Manuell'}</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {metrics.monthlySavingsVsManualEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isEn ? 'per month' : 'pro Monat'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow">
          <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5" />
            <span>SAP BTP Capacity Units</span>
          </div>
          <div className="text-2xl font-black text-sky-700 dark:text-sky-300 mt-1 font-mono">
            {metrics.sapCapacityUnits.toLocaleString(isEn ? 'en-US' : 'de-DE')}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            ~{metrics.sapCuCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €/{isEn ? 'mo' : 'M'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow">
          <div className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lights-Out Rate</span>
          </div>
          <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1 font-mono">
            {metrics.lightsOutAutomationRate} %
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isEn ? 'Straight-through dark processing' : 'Dunkelverarbeitung'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow">
          <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clean Core Score</span>
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1 font-mono">
            {metrics.cleanCoreScore} %
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">S/4HANA Index</div>
        </div>
      </div>

        {/* 4. Detaillierte Deep Dives nebeneinander */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RadarChallenges />
          <CostBreakdown />
        </div>
      </div>

      {/* Schulungs-Editor Modal für Eingangsnachrichten */}
      <MessageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};
