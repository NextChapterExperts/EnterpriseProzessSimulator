'use client';

import React, { useEffect, useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { InfoTip } from '@/components/common/InfoTip';
import {
  Sparkles,
  X,
  TrendingDown,
  CheckCircle2,
  RotateCcw,
  Play,
  ArrowRight,
  Cpu,
  ExternalLink,
  Bot,
  AlertCircle,
  ShieldCheck,
  Check,
  Layers,
  Coins,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SapAgentMatchResult } from '@/types/process';

export const ParetoResultModal: React.FC = () => {
  const {
    isParetoModalOpen,
    toggleParetoModal,
    lastParetoResult,
    revertParetoOptimization,
    startSimulation,
    language,
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState<'agents' | 'adjustments'>('agents');
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleParetoModal(false);
    };
    if (isParetoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isParetoModalOpen, toggleParetoModal]);

  if (!isParetoModalOpen || !lastParetoResult) return null;

  const {
    changesSummary,
    sapAgentMatches = [],
    totalMonthlyAiu = 0,
    totalMonthlyAiuCostEur = 0,
    standardAgentCount = 0,
    gapCount = 0,
    savingsEur,
    savingsPercentage,
  } = lastParetoResult;

  const handleKeepAndSimulate = () => {
    toggleParetoModal(false);
    startSimulation();
  };

  const getAgentBadge = (match: SapAgentMatchResult) => {
    switch (match.recommendationType) {
      case 'SAP_STANDARD_AGENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Bot className="w-3 h-3" />
            <span>SAP Standard Agent</span>
          </span>
        );
      case 'PARTNER_AGENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <Bot className="w-3 h-3" />
            <span>Zertifizierter Partner-Agent</span>
          </span>
        );
      case 'JOULE_ASSISTANT':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <Bot className="w-3 h-3" />
            <span>SAP Joule Assistant</span>
          </span>
        );
      case 'DETERMINISTIC_FAST_PATH':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <ShieldCheck className="w-3 h-3 text-sky-500" />
            <span>Clean Core Fast-Path (0 Tokens)</span>
          </span>
        );
      case 'CUSTOM_GAP':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertCircle className="w-3 h-3" />
            <span>Weißer Fleck (Custom BTP Service)</span>
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={() => toggleParetoModal(false)}
    >
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col p-5 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 my-auto relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {t.paretoModalTitle}
                  <InfoTip term="pareto" />
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  Discovery Center Live
                </span>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-mono">
                {t.paretoModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleParetoModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1 mt-3">
          {/* 1. Qualitative Effizienz-Tendenzen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Dunkelverarbeitung */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.paretoCardStpLabel}</span>
                <InfoTip term="stp" />
              </span>
              <div className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                {t.paretoCardStpValue}
              </div>
              <div className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                {t.paretoCardStpDesc}
              </div>
            </div>

            {/* Token-Bedarf */}
            <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 block font-bold flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>{t.paretoCardTokensLabel}</span>
                <InfoTip term="capacityUnits" />
              </span>
              <div className="text-xs sm:text-sm font-bold text-sky-800 dark:text-sky-300 font-mono">
                {t.paretoCardTokensValue}
              </div>
              <div className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                {t.paretoCardTokensDesc}
              </div>
            </div>

            {/* Ressourcen-Tendenz */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 block font-bold flex items-center space-x-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{t.paretoCardEffLabel}</span>
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono">
                {savingsEur > 0 ? `-${savingsPercentage}% (-${Math.round(savingsEur)} €)` : t.paretoCardEffValue}
              </div>
              <div className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                {t.paretoCardEffDesc}
              </div>
            </div>
          </div>

          {/* 2. SAP Discovery Center & BTP Pricing Strip */}
          <div className="bg-gradient-to-r from-blue-900/20 via-sky-900/20 to-indigo-900/20 border border-sky-500/30 rounded-xl p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                  SAP Discovery Center AI-Katalog & BTP-Preise (718 Positionen gescannt)
                </span>
              </div>
              <a
                href="https://discovery-center.cloud.sap/ai-catalog/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-mono"
              >
                <span>discovery-center.cloud.sap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Standard-Agenten</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {standardAgentCount} gematcht
                </span>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Weiße Flecken (Gaps)</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {gapCount} Lücken
                </span>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">BTP AI Units (AIU)</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalMonthlyAiu.toLocaleString('de-DE')} / Monat
                </span>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Monatliche BTP-Kosten</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  ~{totalMonthlyAiuCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>

          {/* 3. Umschalter: Agenten-Katalog vs. Archetypen-Änderungen */}
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'agents'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Discovery Center Agenten ({sapAgentMatches.length})
            </button>
            <button
              onClick={() => setActiveTab('adjustments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'adjustments'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Archetypen-Anpassungen ({changesSummary.length})
            </button>
          </div>

          {/* Tab 1: Discovery Center Agenten-Matching */}
          {activeTab === 'agents' && (
            <div className="space-y-2">
              {sapAgentMatches.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                  Keine Schritte zum Matching vorhanden.
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {sapAgentMatches.map((match, idx) => {
                    const agent = match.matchedAgent;
                    return (
                      <div
                        key={match.stepId || idx}
                        className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {match.stepName}
                            </span>
                          </div>
                          <div>{getAgentBadge(match)}</div>
                        </div>

                        {agent && (
                          <div className="bg-white/90 dark:bg-slate-950/80 rounded-lg p-2.5 border border-slate-200/80 dark:border-slate-800 space-y-1.5 font-sans">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-1.5">
                                  <span>{agent.name}</span>
                                </h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                                  {agent.shortDescription}
                                </p>
                              </div>
                              {agent.discoveryCenterUrl && (
                                <a
                                  href={agent.discoveryCenterUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="shrink-0 flex items-center space-x-1 px-2 py-1 rounded bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-[10.5px] font-mono transition"
                                >
                                  <span>Katalog</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>

                            {/* Works With Chips */}
                            {agent.worksWith && agent.worksWith.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {agent.worksWith.map((w, widx) => (
                                  <span
                                    key={widx}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                  >
                                    {w}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Preis & Metrik Zeile */}
                            <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
                              <div>
                                Metrik: <strong className="text-slate-800 dark:text-slate-200">{agent.metric || 'Aktionen'}</strong>
                                {agent.pricePerBlockAiu > 0 && (
                                  <span> &bull; {agent.pricePerBlockAiu} AIU pro Aktion</span>
                                )}
                              </div>
                              <div className="text-right">
                                {agent.monthlyAiuEstimated > 0 ? (
                                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                    {agent.monthlyAiuEstimated.toLocaleString('de-DE')} AIU (~{agent.monthlyCostEurEstimated.toFixed(2)} €/Mo)
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Keine separaten AIU</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Gap Explanation */}
                        {match.recommendationType === 'CUSTOM_GAP' && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg p-2.5 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                            <p className="font-semibold">{match.explanation}</p>
                            <p className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                              💡 Next Chapter Experts Lösungsansatz: Schlanker BTP Kyma Microservice oder deterministische SAP BRFplus Decision-Table.
                            </p>
                          </div>
                        )}

                        {/* Fast Path Explanation */}
                        {match.recommendationType === 'DETERMINISTIC_FAST_PATH' && (
                          <div className="bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-[11px] text-slate-600 dark:text-slate-300">
                            {match.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Archetypen-Anpassungen */}
          {activeTab === 'adjustments' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 px-0.5">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t.paretoStepAdjustments} ({changesSummary.length}):
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 inline-flex items-center">
                  {isEn ? 'Clean Core & Blast Radius Compliant' : 'Clean Core & Schutzplanken-konform'}
                  <InfoTip term="blastRadius" />
                </span>
              </div>

              {changesSummary.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mx-auto" />
                  <p className="font-medium text-slate-900 dark:text-white">{t.paretoAlreadyOptimal}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'All steps are already operating on their optimal throughput and resource balance.'
                      : 'Alle Schritte arbeiten bereits im optimalen Durchsatz- und Ressourcenverhältnis.'}
                  </p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
                  {changesSummary.map((change) => (
                    <div
                      key={change.stepId}
                      className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between font-sans">
                        <span className="font-bold text-slate-900 dark:text-white text-[11.5px] truncate">
                          {change.stepName}
                        </span>
                        <div className="flex items-center space-x-1.5 text-[10.5px] shrink-0 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                            {change.oldArchetype}
                          </span>
                          <ArrowRight className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                          <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-bold">
                            {change.newArchetype}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2 text-[10.5px] pt-1 border-t border-slate-200 dark:border-slate-800/80 font-sans">
                        <span className="text-slate-600 dark:text-slate-300 leading-snug">
                          💡 {change.reason}
                        </span>
                        <span className="text-sky-600 dark:text-sky-300 shrink-0 font-mono font-semibold inline-flex items-center">
                          Gate: {change.newConfidence}%
                          <InfoTip term="confidenceGate" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Footer Aktionen */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 mt-2 shrink-0">
          <button
            type="button"
            onClick={revertParetoOptimization}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.paretoRevert}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleParetoModal(false)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 text-xs font-medium transition"
            >
              {isEn ? 'Close' : 'Schließen'}
            </button>
            <button
              type="button"
              onClick={handleKeepAndSimulate}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t.paretoKeepAndSimulate}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

