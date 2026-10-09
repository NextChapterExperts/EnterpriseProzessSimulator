'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  X,
  Calculator,
  Coins,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  getActivePayloadText,
  estimatePayloadTokens,
  calculateStepDynamicTokens,
} from '@/lib/payloadTokens';
import {
  getAiCoreStepRecommendation,
  formatCuNumber,
  formatMonthlyCu,
} from '@/lib/aiCoreAdvisor';

export const AiCoreCalculatorModal: React.FC = () => {
  const {
    isCalculatorOpen,
    toggleCalculatorModal,
    steps,
    currentTemplate,
    selectedMessageQuality,
    customMessageText,
    config,
    setMonthlyVolume,
    language,
  } = useSimulatorStore();

  const t = TRANSLATIONS[language];

  // Lokaler State für den Taschenrechner
  const [simulatedVolume, setSimulatedVolume] = useState<number>(config.monthlyVolume || 25000);
  const [cuRateEur, setCuRateEur] = useState<number>(config.cuPriceFactorEur || 1.20);
  const [testTextPreset, setTestTextPreset] = useState<'actual' | 'short' | 'standard' | 'large'>('actual');
  const [customTestText, setCustomTestText] = useState<string | null>(null);

  if (!isCalculatorOpen) return null;

  // Bestimme aktiven Text
  const baseActualText = getActivePayloadText(
    currentTemplate.id,
    selectedMessageQuality,
    customMessageText
  );

  let activeText = baseActualText;
  if (testTextPreset === 'short') {
    activeText = `Bestellung PO-9912. Bitte liefern Sie 5x Dichtungssatz Art. DI-4410 an Werk Augsburg zum 20.10.2026.`;
  } else if (testTextPreset === 'standard') {
    activeText = baseActualText;
  } else if (testTextPreset === 'large') {
    activeText = baseActualText + '\n\n' + `[ANHANG: Spezifikationsblatt & Konformitätserklärung DIN EN 10204-3.1]\n`.repeat(25) +
      `Zusätzliche Prüfvorschriften für Hochdruck-Flansche: Werkstoffprüfung, Ultraschallprüfung Stufe 2, Kerbschlagbiegeversuch bei -20°C, Oberflächenrauheit Ra <= 3.2 µm. Zeugnisbeistellung zwingend erforderlich vor Warenausgang.`;
  } else if (customTestText !== null) {
    activeText = customTestText;
  }

  const textLength = activeText.length;
  const estimatedTokens = estimatePayloadTokens(activeText);

  // Schritt-für-Schritt Berechnung
  const stepCalculations = steps.map((step, idx) => {
    const dynamicTokens = calculateStepDynamicTokens(step, activeText);
    const aiRec = getAiCoreStepRecommendation(
      step.primitive,
      step.currentArchetype,
      step.oodaPhase,
      language,
      { baseTokensIn: dynamicTokens.tokensIn, baseTokensOut: dynamicTokens.tokensOut },
      simulatedVolume
    );

    const costPerTxCu = aiRec.costBreakdown.totalCostPerTxCu;
    const monthlyCu = costPerTxCu * simulatedVolume;
    const monthlyEur = monthlyCu * cuRateEur;

    return {
      step,
      index: idx,
      dynamicTokens,
      aiRec,
      costPerTxCu,
      monthlyCu,
      monthlyEur,
    };
  });

  const totalCostPerTxCu = stepCalculations.reduce((sum, item) => sum + item.costPerTxCu, 0);
  const totalMonthlyCu = totalCostPerTxCu * simulatedVolume;
  const totalMonthlyEur = totalMonthlyCu * cuRateEur;
  const costPerTxEur = totalCostPerTxCu * cuRateEur;

  const VOLUME_PRESETS = [10, 100, 1000, 10000, 25000, 100000];

  const handleApplyToSimulation = () => {
    setMonthlyVolume(simulatedVolume);
    toggleCalculatorModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <span>{t.calcModalTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-mono">
                  {currentTemplate.name}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.calcModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleCalculatorModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700 dark:text-slate-200 text-xs">
          {/* Section 1: Inbound Payload & Token Sizing */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide font-mono">
                  {t.calcPayloadSection}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  {textLength.toLocaleString()} {t.calcChars}
                </span>
                <span className="bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 px-2 py-0.5 rounded text-indigo-800 dark:text-indigo-300 font-bold">
                  ⚡ ~{estimatedTokens.toLocaleString()} {t.calcTokens}
                </span>
              </div>
            </div>

            {/* Test Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {language === 'en' ? 'Test Size:' : 'Test-Größe:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setTestTextPreset('actual');
                  setCustomTestText(null);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition border ${
                  testTextPreset === 'actual'
                    ? 'bg-sky-600 text-white border-sky-400 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'en'
                  ? `Active Simulator Payload (${baseActualText.length} chars)`
                  : `Aktiver Simulator-Beleg (${baseActualText.length} Z)`}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestTextPreset('short');
                  setCustomTestText(null);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition border ${
                  testTextPreset === 'short'
                    ? 'bg-sky-600 text-white border-sky-400 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.calcPresetShort}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestTextPreset('large');
                  setCustomTestText(null);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition border ${
                  testTextPreset === 'large'
                    ? 'bg-sky-600 text-white border-sky-400 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.calcPresetLarge}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {t.calcExplanationText}
            </p>
          </div>

          {/* Section 2: Volume Selection */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide font-mono">
                  {t.calcVolumeSection}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{t.calcCuFactor}</span>
                <input
                  type="number"
                  step="0.10"
                  min="0.1"
                  max="10.0"
                  value={cuRateEur}
                  onChange={(e) => setCuRateEur(parseFloat(e.target.value) || 1.20)}
                  className="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">€ / CU</span>
              </div>
            </div>

            {/* Quick Volume Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {VOLUME_PRESETS.map((vol) => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => setSimulatedVolume(vol)}
                  className={`py-2 px-1 rounded-xl border text-center font-mono transition ${
                    simulatedVolume === vol
                      ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md ring-2 ring-indigo-500/40'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{vol.toLocaleString()}</div>
                  <div className="text-[9.5px] opacity-75">{language === 'en' ? 'docs/mo' : 'Vorgänge/Mo'}</div>
                </button>
              ))}
            </div>

            {/* Slider for smooth control */}
            <div className="pt-2 flex items-center space-x-4">
              <input
                type="range"
                min="10"
                max="100000"
                step="10"
                value={simulatedVolume}
                onChange={(e) => setSimulatedVolume(parseInt(e.target.value, 10))}
                className="flex-1 accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xs w-28 text-right bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                {simulatedVolume.toLocaleString()} {language === 'en' ? '/ mo' : '/ Mo'}
              </span>
            </div>
          </div>

          {/* Key Metric Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">
                {t.calcCostPerTx}
              </span>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                {formatCuNumber(totalCostPerTxCu)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {language === 'en' ? 'approx. ' : 'ca. '}<strong className="text-slate-800 dark:text-slate-200">{costPerTxEur < 0.01 ? `<0.01 €` : `${costPerTxEur.toFixed(3)} €`}</strong> {language === 'en' ? 'per document' : 'pro Vorgang'}
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-indigo-800 dark:text-indigo-300 uppercase font-mono block font-semibold">
                {t.calcMonthlyCu} ({language === 'en' ? 'at' : 'bei'} {simulatedVolume.toLocaleString()} Tx)
              </span>
              <div className="text-lg font-extrabold text-indigo-800 dark:text-indigo-300 font-mono">
                {formatMonthlyCu(totalMonthlyCu)}
              </div>
              <div className="text-[11px] text-indigo-700/80 dark:text-indigo-200/80 font-mono">
                {language === 'en' ? 'Pure AI Core capacity demand' : 'Reiner AI Core Kapazitätsbedarf'}
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-mono block font-semibold">
                {t.calcMonthlyEur} ({language === 'en' ? 'at' : 'bei'} {cuRateEur.toFixed(2)} €/CU)
              </span>
              <div className="text-lg font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
                {totalMonthlyEur.toLocaleString(language === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € / {language === 'en' ? 'month' : 'Monat'}
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 font-mono">
                {language === 'en' ? 'Full cost predictability without surprises' : 'Volle Kostentransparenz ohne Überraschung'}
              </div>
            </div>
          </div>

          {/* Section 3: Step-by-Step Breakdown Table */}
          <div className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wide">
                {t.calcStepBreakdown}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {steps.length} {language === 'en' ? 'OODA Steps' : 'OODA-Schritte'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">{t.calcColStep}</th>
                    <th className="py-2 px-3">{t.calcColModel}</th>
                    <th className="py-2 px-3 text-right">{t.calcColTokens}</th>
                    <th className="py-2 px-3 text-right">{t.calcColCuPerTx}</th>
                    <th className="py-2 px-3 text-right">{t.calcColMonthlyCu}</th>
                    <th className="py-2 px-3 text-right">{t.calcColMonthlyEur}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {stepCalculations.map((item) => (
                    <tr
                      key={item.step.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {item.index + 1}. {item.step.name}
                        </div>
                        <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-sans">
                          {item.step.primitive} &bull; <span className="text-sky-600 dark:text-sky-300">{item.step.currentArchetype}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]" title={item.aiRec.recommendedModelName}>
                          {item.aiRec.recommendedModelName}
                        </div>
                        <div className="text-[9.5px] text-slate-500">
                          {item.aiRec.matchingTemplateTitle}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {item.aiRec.costBreakdown.isDeterministicFree ? (
                          <span className="text-slate-400 dark:text-slate-500">0 / 0</span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300">
                            {item.dynamicTokens.tokensIn} / {item.dynamicTokens.tokensOut}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {item.aiRec.costBreakdown.isDeterministicFree ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 CU</span>
                        ) : (
                          <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                            {formatCuNumber(item.costPerTxCu)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {item.aiRec.costBreakdown.isDeterministicFree ? (
                          <span className="text-emerald-600 dark:text-emerald-400">0 CU</span>
                        ) : (
                          <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                            {formatMonthlyCu(item.monthlyCu)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {item.aiRec.costBreakdown.isDeterministicFree ? (
                          <span className="text-emerald-600 dark:text-emerald-400">0,00 €</span>
                        ) : (
                          <span className="text-slate-800 dark:text-slate-200">
                            {item.monthlyEur.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-950 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3 text-slate-900 dark:text-white">
                      {language === 'en' ? 'TOTAL (Workflow E2E):' : 'GESAMT (Workflow E2E):'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-indigo-700 dark:text-indigo-300">
                      {formatCuNumber(totalCostPerTxCu)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-indigo-700 dark:text-indigo-300">
                      {formatMonthlyCu(totalMonthlyCu)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-300">
                      {totalMonthlyEur.toLocaleString(language === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'en' ? 'Current simulation volume:' : 'Aktuelles Simulationsvolumen:'} <strong className="text-slate-900 dark:text-white">{config.monthlyVolume.toLocaleString()} {language === 'en' ? 'docs/month' : 'Belege/Monat'}</strong>
          </div>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => toggleCalculatorModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              {language === 'en' ? 'Close' : 'Schließen'}
            </button>
            <button
              type="button"
              onClick={handleApplyToSimulation}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition flex items-center space-x-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.calcBtnApplyVolume} ({simulatedVolume.toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
