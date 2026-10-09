'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  Workflow,
  Coins,
  ShieldAlert,
  Cpu,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { calculateWorkflowGoldenPathScore } from '@/lib/goldenPathAdvisor';
import { TRANSLATIONS } from '@/i18n/translations';
import { InfoTip } from '@/components/common/InfoTip';
import { CostBreakdown } from '@/components/Cockpit/CostBreakdown';

interface KpiCardProps {
  label: string;
  term: string;
  value: React.ReactNode;
  valueClass: string;
  sub: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, term, value, valueClass, sub }) => (
  <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-w-0 shadow-sm">
    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
      <span className="truncate">{label}</span>
      <InfoTip term={term} />
    </span>
    <div className={`font-bold mt-0.5 ${valueClass}`}>{value}</div>
    <span className="text-[9.5px] text-slate-500 dark:text-slate-500 block truncate mt-0.5">{sub}</span>
  </div>
);

export const ProcessSummaryView: React.FC = () => {
  const {
    steps,
    currentTemplate,
    metrics,
    config,
    setMonthlyVolume,
    dryRunResult,
    toggleCalculatorModal,
    toggleBlueprint,
    activeWorkflowLayer,
    language,
    setSelectedStepId,
    runParetoOptimization,
  } = useSimulatorStore();

  const t = TRANSLATIONS[language];
  const isEn = language === 'en';
  const numberLocale = isEn ? 'en-US' : 'de-DE';
  const fmt = (n: number) => n.toLocaleString(numberLocale, { maximumFractionDigits: 0 });
  const goldenPathStats = calculateWorkflowGoldenPathScore(steps);
  const isGoodOutcome = dryRunResult?.overallStatus === 'success';
  const hasGuardrailBreak = dryRunResult?.overallStatus === 'failed_guardrail';
  const hasEscalation = dryRunResult?.overallStatus === 'escalated_to_human';

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 text-slate-800 dark:text-slate-200 select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-700/80 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm shadow-sm">
            📊
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                {language === 'en' ? 'Overall Process Summary & Results' : 'Gesamtprozess & End-to-End Bilanz'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800 uppercase font-semibold">
                {currentTemplate.scopeCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'en' ? 'Consolidated end-to-end evaluation across all' : 'Konsolidierte Gesamtauswertung über alle'}{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{steps.length} {language === 'en' ? 'steps' : 'Prozessschritte'}</span>
            </p>
          </div>
        </div>

        {/* Globaler Status-Badge */}
        <div className="flex items-center space-x-2">
          {isGoodOutcome && (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'en' ? 'SUCCESS' : 'ERFOLGREICH'}</span>
            </span>
          )}
          {hasGuardrailBreak && (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 text-xs font-bold font-mono">
              <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>{language === 'en' ? 'GUARDRAIL HALT' : 'SCHUTZPLANKEN-STOPP'}</span>
            </span>
          )}
          {hasEscalation && (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{language === 'en' ? 'HUMAN REVIEW' : 'SACHBEARBEITER'}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. LAYER 1: PROZESS- & BELEGFLUSS (End-to-End Kette) */}
      {activeWorkflowLayer === 'flow' && (
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider font-mono block">
              {language === 'en' ? '📥 End-to-End Document Flow Summary' : '📥 End-to-End Belegkette & Durchlauf'}
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {language === 'en'
                ? `The inbound document was processed through ${steps.length} sequential OODA stages. Below is the trace outcome for each stage:`
                : `Der Eingangsbeleg hat alle ${steps.length} sequenziellen OODA-Phasen durchlaufen. Hier ist die Statusübersicht aller Schritte:`}
            </p>
          </div>

          <div className="space-y-1.5">
            {steps.map((step, idx) => {
              const trace = dryRunResult?.traces?.find((t) => t.stepId === step.id);
              const isOk = trace?.status === 'success';
              const isErr = trace?.status === 'error';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer text-xs font-mono shadow-sm"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isErr
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                          : isOk
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {isErr ? '✕' : isOk ? '✓' : '!'}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white truncate">{idx + 1}. {step.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans hidden sm:inline truncate max-w-xs">
                      ({step.currentArchetype})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400">{trace?.latencyMs || 0} ms</span>
                    <span className="text-slate-400 dark:text-slate-600">&bull;</span>
                    <span className="text-[10.5px] text-indigo-600 dark:text-indigo-300 font-semibold">{trace?.tokensUsed || 0} tok</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono shadow-sm">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{language === 'en' ? 'Total Chain Latency:' : 'Gesamte Durchlaufzeit:'}</span>
            <span className="text-sky-700 dark:text-sky-300 font-bold text-sm">{metrics.endToEndLatencySec} s</span>
          </div>
        </div>
      )}

      {/* 3. LAYER 2: KOSTEN & CAPACITY UNITS (Gesamtergebnis über alle Schritte) */}
      {activeWorkflowLayer === 'cost' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                {isEn ? 'Simulated document volume:' : 'Simuliertes Belegvolumen:'}
              </span>
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {[100, 1000, 2500, 10000, 25000].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setMonthlyVolume(vol)}
                    className={`px-1.5 py-0.5 rounded transition ${
                      config.monthlyVolume === vol
                        ? 'bg-indigo-600 text-white font-bold shadow'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {vol >= 1000 ? `${vol / 1000}k` : vol}
                  </button>
                ))}
                <span className="text-slate-400 dark:text-slate-500">{isEn ? '/mo' : '/Mo'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => runParetoOptimization()}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-[11px] font-extrabold transition active:scale-95 shadow border border-amber-300/60"
                title={isEn ? 'Calculate Pareto Optimum (Cost vs. Risk)' : 'Pareto-Optimum berechnen (Kosten vs. Risiko)'}
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isEn ? '★ Pareto Optimum' : '★ Pareto-Optimum'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleCalculatorModal(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition active:scale-95 shadow border border-indigo-400/60"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{t.btnOpenCalculator}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <KpiCard
              label={isEn ? 'Monthly (Total)' : 'Monatlich (Gesamt)'}
              term="monthlyTotal"
              valueClass="text-indigo-600 dark:text-indigo-400 text-lg"
              value={`${fmt(metrics.totalCostOfAutomationEur)} €`}
              sub={isEn ? `${fmt(config.monthlyVolume)} documents / month` : `${fmt(config.monthlyVolume)} Belege / Monat`}
            />
            <KpiCard
              label="BTP Capacity Units"
              term="capacityUnits"
              valueClass="text-amber-600 dark:text-amber-400 text-lg"
              value={`${fmt(metrics.sapCapacityUnits)} CU`}
              sub={isEn ? 'SAP AI Core inference' : 'SAP AI Core Inferenz'}
            />
            <KpiCard
              label={isEn ? 'Straight-Through (STP)' : 'Dunkelverarbeitung'}
              term="stp"
              valueClass="text-emerald-600 dark:text-emerald-400 text-lg"
              value={`${Math.round(metrics.lightsOutAutomationRate)} %`}
              sub={isEn ? 'Fully automated rate' : 'Autonome STP-Quote'}
            />
            <KpiCard
              label={isEn ? 'Net Savings' : 'Netto-Einsparung'}
              term="netSavings"
              valueClass="text-emerald-600 dark:text-emerald-300 text-lg"
              value={`+${fmt(metrics.monthlySavingsVsManualEur)} €`}
              sub={isEn ? 'vs. manual processing' : 'Gegenüber manueller Bearbeitung'}
            />
          </div>

          {/* Detaillierte TCA Kostenzerlegung */}
          <CostBreakdown />
        </div>
      )}

      {/* 4. LAYER 3: RISIKO & GOVERNANCE (Gesamtrisiko & Compliance) */}
      {activeWorkflowLayer === 'risk' && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <KpiCard
              label={isEn ? 'Highest EU AI Act Risk' : 'Höchstes EU AI Act Risiko'}
              term="euAiAct"
              valueClass="text-amber-600 dark:text-amber-400 text-base"
              value={
                <span className="inline-flex items-center">
                  LIMITED RISK
                  <InfoTip term="limitedRisk" />
                </span>
              }
              sub={isEn ? 'Transparency obligation (Art. 50)' : 'Transparenzpflicht gem. Art. 50'}
            />
            <KpiCard
              label={isEn ? 'GoBD / SOX Integrity' : 'GoBD / SOX Integrität'}
              term="gobdSoxIntegrity"
              valueClass="text-emerald-600 dark:text-emerald-400 text-base"
              value={isEn ? '✓ 100% Compliant' : '✓ 100% Konform'}
              sub={isEn ? 'Clean Core audit log active' : 'Clean Core Audit-Log aktiv'}
            />
            <KpiCard
              label={isEn ? 'Cumulative Blast Radius' : 'Kumulierter Blast Radius'}
              term="cumulativeBlastRadius"
              valueClass="text-slate-800 dark:text-white text-base"
              value={`${fmt(steps.reduce((acc, s) => acc + (s.damageAmountEur || 0), 0))} €`}
              sub={isEn ? 'Maximum financial exposure' : 'Maximales finanzielles Risiko'}
            />
          </div>
        </div>
      )}

      {/* 5. LAYER 4: CLEAN CORE & ARCHITEKTUR (Gesamt-Pass) */}
      {activeWorkflowLayer === 'architecture' && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <KpiCard
              label="SAP Golden Path"
              term="goldenPath"
              valueClass="text-emerald-600 dark:text-emerald-400 text-base"
              value={`${goldenPathStats.score}%`}
              sub={
                isEn
                  ? `${goldenPathStats.compliantCount} of ${goldenPathStats.totalCount} steps optimal`
                  : `${goldenPathStats.compliantCount} von ${goldenPathStats.totalCount} Schritten optimal`
              }
            />
            <KpiCard
              label="Clean Core Tier"
              term="cleanCoreTier"
              valueClass="text-slate-800 dark:text-white text-base"
              value="Tier 1 (BTP Side-by-Side)"
              sub="Zero Modification Policy"
            />
            <KpiCard
              label={isEn ? 'E2E Latency' : 'E2E Latenzzeit'}
              term="e2eLatency"
              valueClass="text-sky-700 dark:text-sky-300 text-base"
              value={`${metrics.endToEndLatencySec} s`}
              sub={isEn ? 'Total chain runtime' : 'Gesamtlaufzeit der Kette'}
            />
            <KpiCard
              label={isEn ? 'SAP Standard Tools' : 'SAP Standard-Tools'}
              term="sapStandardTools"
              valueClass="text-purple-700 dark:text-purple-300 text-base truncate"
              value="BTP AI Core & RAP"
              sub="Joule / BRFplus / OData v4"
            />
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={() => toggleBlueprint(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-xs font-semibold shadow transition"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{language === 'en' ? 'Open Management Blueprint' : 'Management Blueprint öffnen'}</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
