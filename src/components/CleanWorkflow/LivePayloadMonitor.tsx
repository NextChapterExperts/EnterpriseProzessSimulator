'use client';

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  Edit3,
  FileText,
  CheckCircle2,
  Sparkles,
  UserCheck,
  XCircle,
  AlertTriangle,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Mail,
  Scale,
  Plus,
  Minus,
} from 'lucide-react';
import { getSampleMessage } from '@/data/dryRunSample';
import { TRANSLATIONS } from '@/i18n/translations';
import { getFieldMeta, formatFieldValue } from './fieldDescriptions';
import { getPlainLanguageStepAction } from './stepActionDescriptions';
import { ProcessSummaryView } from './ProcessSummaryView';
import { StepImpactCriteria } from './StepImpactCriteria';
import {
  calculateStepQualityMetrics,
  calculateStepArchetypeComparison,
} from '@/lib/qualityCalculator';
import { InfoTip } from '@/components/common/InfoTip';

export const LivePayloadMonitor: React.FC = () => {
  const [showOriginalMail, setShowOriginalMail] = useState(false);
  const [isStepBlockOpen, setIsStepBlockOpen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);

  const {
    steps,
    currentTemplate,
    dryRunResult,
    simulationStepIndex,
    isSimulating,
    selectedStepId,
    selectedMessageQuality,
    customMessageText,
    customSender,
    customSubject,
    stepDecisions,
    setStepDecision,
    approveAndContinueSimulation,
    resetStepDecision,
    language,
    activeWorkflowLayer,
    openStepKnowledge,
    openEvaluationMatrix,
    config,
    updateStepArchetype,
  } = useSimulatorStore();

  const t = TRANSLATIONS[language];

  // Wenn Gesamtprozess & Bilanz ausgewählt ist (und nicht gerade eine Simulation live über Steps läuft)
  if (selectedStepId === 'process_summary' && !isSimulating) {
    return <ProcessSummaryView />;
  }

  // Der aktuell angezeigte Schritt (Simulation hat Vorrang während sie aktiv läuft, sonst die Benutzer-Auswahl)
  const activeIndex = (() => {
    if (isSimulating && simulationStepIndex >= 0 && simulationStepIndex < steps.length) {
      return simulationStepIndex;
    }
    const selectedIdx = steps.findIndex((s) => s.id === selectedStepId);
    if (selectedIdx >= 0) return selectedIdx;
    if (simulationStepIndex >= 0 && simulationStepIndex < steps.length) return simulationStepIndex;
    return 0;
  })();

  const currentStep = steps[activeIndex] || steps[0];
  const trace = dryRunResult?.traces?.[activeIndex];
  const previousTraces = dryRunResult?.traces ? dryRunResult.traces.slice(0, activeIndex) : [];
  const hasError = trace?.status === 'error';
  const hasEscalation = trace?.status === 'escalation';

  const currentDecision = currentStep ? stepDecisions[currentStep.id] : undefined;
  const isApproved = currentDecision?.status === 'approved';
  const isModified = currentDecision?.status === 'modified';
  const isRejected = currentDecision?.status === 'rejected';

  const prevTrace = activeIndex > 0 && dryRunResult?.traces ? dryRunResult.traces[activeIndex - 1] : null;

  const isEn = language === 'en';
  const qualityMetrics = currentStep
    ? calculateStepQualityMetrics(currentStep, config)
    : null;
  const archetypeComparisons = currentStep
    ? calculateStepArchetypeComparison(currentStep, config, language)
    : [];

  // Wenn eine Box aufgemacht wurde (Schritt-Info oder Qualitäts-Scorecard),
  // bleibt sie beim Springen zwischen Steps offen!
  // Sie schließt sich nur bei explizitem Wechsel des Layers oben.
  useEffect(() => {
    setIsQualityOpen(false);
  }, [activeWorkflowLayer]);

  // Formatierungshilfe für strukturierte Payloads (Tabellen, Arrays, Strings, Zahlen)
  const renderFormattedValue = (val: any) => {
    if (val === null || val === undefined) {
      return <span className="text-slate-400 dark:text-slate-500 italic">null</span>;
    }
    const formattedVal = formatFieldValue(val, language);
    if (typeof formattedVal === 'boolean') {
      return (
        <span className={formattedVal ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>
          {formattedVal ? 'true' : 'false'}
        </span>
      );
    }
    if (typeof formattedVal === 'number') {
      return <span className="text-sky-600 dark:text-sky-300 font-mono font-semibold">{formattedVal}</span>;
    }
    if (Array.isArray(formattedVal)) {
      if (formattedVal.length === 0) return <span className="text-slate-400 dark:text-slate-500 italic">[]</span>;
      if (typeof formattedVal[0] === 'string' || typeof formattedVal[0] === 'number') {
        return (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {formattedVal.map((item, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-800 dark:text-sky-200 border border-slate-200 dark:border-slate-700 font-mono">
                {String(formatFieldValue(item, language))}
              </span>
            ))}
          </div>
        );
      }

      // Fachliche Spaltenüberschriften
      const getTableHeader = (key: string) => {
        const headers: Record<string, string> = {
          pos: 'Pos.',
          artikel: 'Artikel / Bezeichnung',
          desc: 'Artikel / Bezeichnung',
          teil: 'Ersatzteil-Bezeichnung',
          matnr: 'SAP Material-Nr.',
          menge: 'Menge',
          qty: 'Menge',
          unit: 'Einheit',
          einzelpreis: 'Einzelpreis',
          price: 'Einzelpreis',
          gesamt: 'Gesamtpreis',
          total: 'Gesamt',
          werk: 'Werk',
          maraText: 'SAP Bezeichnung',
          rechnungsnr: 'Rechnungs-Nr.',
          ursprungsbetrag: 'Rechnungsbetrag',
          skonto: 'Skonto',
          zahlbetrag: 'Zahlbetrag',
        };
        return headers[key] || getFieldMeta(key, language).label || key;
      };

      return (
        <div className="mt-1 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 shadow-sm">
          <table className="w-full text-left text-[10.5px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 font-mono text-[10px]">
                {Object.keys(formattedVal[0]).map((colKey) => (
                  <th key={colKey} className="px-2.5 py-1.5 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {getTableHeader(colKey)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {formattedVal.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  {Object.values(row).map((cell: any, cellIdx) => (
                    <td key={cellIdx} className="px-2.5 py-1.5 text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">
                      {typeof cell === 'object'
                        ? JSON.stringify(cell)
                        : String(formatFieldValue(cell, language))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (typeof formattedVal === 'object') {
      return (
        <div className="pl-2 border-l border-slate-200 dark:border-slate-800 text-[10px] space-y-0.5 mt-0.5 font-mono">
          {Object.entries(formattedVal).map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{getFieldMeta(k, language).label || k}:</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-right truncate">
                {typeof v === 'object' && v !== null
                  ? JSON.stringify(v)
                  : String(formatFieldValue(v, language))}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{String(formattedVal)}</span>;
  };

  // Rendert ein Belegattribut mit verständlichem Label, technischem Schlüssel und interaktivem (i) Info-Icon
  const renderFieldWithInfo = (key: string, val: any) => {
    const meta = getFieldMeta(key, language);
    return (
      <div key={key} className="flex flex-col space-y-1 pb-1.5 border-b border-slate-200 dark:border-slate-800/40 last:border-b-0">
        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
            {meta.label}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px] opacity-80">({key})</span>
          <div className="group relative inline-block">
            <span
              className="w-3.5 h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-950 text-sky-600 dark:text-sky-400 border border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 flex items-center justify-center text-[9px] font-bold cursor-help transition select-none"
              title={meta.description}
            >
              i
            </span>
            <div className="hidden group-hover:block absolute left-5 bottom-0 z-50 w-64 p-2.5 bg-white dark:bg-slate-900 border border-sky-400 dark:border-sky-500/70 rounded-lg text-slate-800 dark:text-slate-200 text-[10.5px] shadow-2xl font-sans leading-normal pointer-events-none">
              <div className="font-bold text-sky-600 dark:text-sky-300 mb-0.5">{meta.label}</div>
              <div className="text-slate-700 dark:text-slate-300 leading-snug">{meta.description}</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1 pt-1 border-t border-slate-200 dark:border-slate-800">
                {language === 'en' ? 'SAP/OData Field:' : 'SAP/OData Feld:'} {key}
              </div>
            </div>
          </div>
        </div>
        <div className="pl-1">{renderFormattedValue(val)}</div>
      </div>
    );
  };

  // Dynamische Beispieldaten für das aktive Szenario, die gewählte Qualität & Sprache
  const sample = getSampleMessage(currentTemplate.id, selectedMessageQuality, language);
  const isGood = selectedMessageQuality === 'good';
  const isCustom = customMessageText !== null;
  const activeRawText = customMessageText !== null ? customMessageText : sample.rawText;
  const activeSender = customSender !== null ? customSender : sample.sender;
  const activeSubject = customSubject !== null ? customSubject : sample.subject;

  return (
    <div
      className={`bg-white dark:bg-slate-900/95 rounded-xl transition-all shadow-xl flex flex-col text-slate-800 dark:text-slate-200 border-2 ${
        hasError
          ? 'border-red-500 ring-2 ring-red-400/40 dark:ring-red-500/50 shadow-red-500/10 dark:shadow-red-950/50'
          : currentStep?.currentArchetype === 'copilot'
          ? 'border-sky-500 ring-2 ring-sky-400/30 dark:ring-sky-500/30 shadow-sky-500/10 dark:shadow-sky-950/30'
          : hasEscalation
          ? 'border-amber-500 ring-2 ring-amber-400/40 dark:ring-amber-500/50 shadow-amber-500/10 dark:shadow-amber-950/50'
          : 'border-[#0A6ED1] ring-2 ring-[#0A6ED1]/40 dark:ring-[#0A6ED1]/60 shadow-blue-500/10 dark:shadow-[#0A6ED1]/25'
      }`}
    >
      {/* 1. Header: Gemeinsame Farb-Umrandung, Szenario-Bezug & Qualitäts-Auswahl */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950/70 rounded-t-[10px]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-1.5 py-0.2 rounded border border-sky-300 dark:border-sky-800">
              {language === 'en' ? 'Step' : 'Schritt'} {activeIndex + 1}/{steps.length}
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {activeWorkflowLayer === 'cost'
                ? (language === 'en' ? 'Step Cost & Capacity Units' : 'Schritt-Kosten & Capacity Units')
                : activeWorkflowLayer === 'risk'
                ? (language === 'en' ? 'Step Risk & Governance' : 'Schritt-Risiko & Governance')
                : activeWorkflowLayer === 'architecture'
                ? (language === 'en' ? 'Step Clean Core & SAP Architecture' : 'Schritt-Architektur & Clean Core')
                : (language === 'en' ? 'Live Document & Payload Monitor' : 'Live Beleg- & Payload-Monitor')}
            </h2>
          </div>
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'en' ? 'Scenario:' : 'Szenario:'} <span className="text-slate-800 dark:text-slate-300 font-medium">{currentTemplate.name}</span> &bull; <span className="font-mono text-sky-700 dark:text-sky-300 font-semibold">{sample.filename}</span>
          </p>
        </div>

        {/* Live Puls / Latenz */}
        <div className="flex items-center space-x-2">
          {isSimulating ? (
            <span className="flex items-center space-x-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 animate-pulse font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE</span>
            </span>
          ) : (
            <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono">
              {trace?.latencyMs || 0} ms
            </span>
          )}
        </div>
      </div>

      {/* 2. Rein visuelle Live-Ansicht (Ohne Schiebebalken / natürliche Höhe) */}
      <div className="p-3.5 space-y-3">
        {/* Schritt-Erklärung & Fachlicher Kontext (Aufgabe, Intent, SAP-Referenz & Guide) */}
        {/* Schritt-Erklärung & Fachlicher Kontext (Vollständig einklappbar, standardmäßig zu) */}
        {currentStep && (
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm overflow-hidden">
            {/* Collapsible Header */}
            <div
              onClick={() => setIsStepBlockOpen(!isStepBlockOpen)}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-900/70 transition select-none flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="w-4 h-4 rounded flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs border border-slate-300 dark:border-slate-700 shrink-0">
                  {isStepBlockOpen ? '−' : '+'}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {language === 'en' ? 'Step' : 'Schritt'} {activeIndex + 1}: {currentStep.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-mono">
                  {currentStep.primitive}
                </span>
              </div>

              {!isStepBlockOpen ? (
                <div className="flex items-center space-x-2 font-mono text-[10.5px]">
                  <span className="text-slate-500 hidden sm:inline">
                    {language === 'en' ? 'Interface:' : 'Schnittstelle:'} {currentStep.sapReference}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openStepKnowledge(currentStep.id);
                    }}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white transition text-[10.5px] font-mono shadow-sm active:scale-95"
                    title={language === 'en' ? 'Open detailed step dossier & student guide' : 'Ausführliche Schritt-Erklärung & Studenten-Leitfaden öffnen'}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{language === 'en' ? 'Step Dossier & Guide' : 'Schritt-Erklärung & Guide'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt: Schnittstelle & Was in diesem Schritt passiert */}
            {isStepBlockOpen && (
              <div className="p-3 pt-0 space-y-2.5 border-t border-slate-200 dark:border-slate-800/80 mt-0.5">
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-b border-slate-200 dark:border-slate-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-800 font-mono">
                      {language === 'en' ? 'Interface:' : 'Schnittstelle:'} {currentStep.sapReference}
                    </span>
                    <span className="text-[10.5px] px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono">
                      {language === 'en' ? 'OODA Phase:' : 'OODA-Phase:'} {currentStep.oodaPhase}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 shadow-sm space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 text-xs font-bold font-mono">
                    <span>⚡</span>
                    <span>{language === 'en' ? 'What happens in this step:' : 'Was in diesem Schritt passiert:'}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans pt-0.5">
                    {getPlainLanguageStepAction({
                      stepIndex: activeIndex,
                      templateId: currentTemplate.id,
                      stepName: currentStep.name,
                      primitive: currentStep.primitive,
                      status: trace?.status || 'success',
                      isSelfHealed: trace?.isSelfHealed,
                      archetype: currentStep.currentArchetype,
                      language,
                      businessIntent: currentStep.businessIntent,
                      description: currentStep.description,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schritt-Ebenen Metriken für Kosten, Risiko oder Architektur (nur wenn aktiver Layer != 'flow' && != 'quality') */}
        {currentStep && <StepImpactCriteria step={currentStep} />}

        {/* LAYER 2: QUALITÄT & GENAUIGKEIT (Nur wenn Layer 2 aktiv, einklappbar, standardmäßig zu) */}
        {currentStep && activeWorkflowLayer === 'quality' && qualityMetrics && (
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm overflow-hidden">
            {/* Collapsible Header */}
            <div
              onClick={() => setIsQualityOpen(!isQualityOpen)}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-900/70 transition select-none flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
                  {isQualityOpen ? '−' : '+'}
                </span>
                <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {t.qualityScorecardTitle}: {currentStep.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentStep.currentArchetype}
                </span>
              </div>

              {/* Kompakte Vorschau-Badges im eingeklappten Zustand */}
              {!isQualityOpen ? (
                <div className="flex items-center space-x-2 font-mono text-[10.5px]">
                  <span className="text-slate-500 hidden sm:inline">
                    {t.qualityRecognition}:{' '}
                    <strong className={qualityMetrics.semanticRecognitionRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                      {qualityMetrics.semanticRecognitionRate}%
                    </strong>
                  </span>
                  <span className="text-slate-400 hidden md:inline">&bull;</span>
                  <span className="text-slate-500 hidden sm:inline">
                    {t.qualityHallucination}:{' '}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {qualityMetrics.hallucinationRisk}%
                    </strong>
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEvaluationMatrix();
                    }}
                    className="flex items-center space-x-1 text-[10.5px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold underline cursor-pointer"
                  >
                    <span>{language === 'en' ? 'Methodology & Benchmarks ↗' : 'Methodik & Benchmarks ↗'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {isQualityOpen && (
              <div className="p-3 pt-0 space-y-3 border-t border-slate-200 dark:border-slate-800/80 mt-1">
                {/* 4 Quality Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2">
                  {/* 1. Erkennungsqualität */}
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium truncate">
                        {t.qualityRecognition}
                      </span>
                      <InfoTip
                        title={t.qualityRecognition}
                        text={isEn ? qualityMetrics.whyRecognitionEn : qualityMetrics.whyRecognitionDe}
                        details={isEn ? `Archetype: ${currentStep.currentArchetype} | Data Noise: ${Math.round(config.dataNoiseRate * 100)}%` : `Archetyp: ${currentStep.currentArchetype} | Rauschanteil: ${Math.round(config.dataNoiseRate * 100)}%`}
                      />
                    </div>
                    <div
                      className={`text-base font-extrabold mt-0.5 ${
                        qualityMetrics.semanticRecognitionRate >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : qualityMetrics.semanticRecognitionRate >= 60
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {qualityMetrics.semanticRecognitionRate}%
                    </div>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      {qualityMetrics.semanticRecognitionRate < 50
                        ? (language === 'en' ? 'Collapses on free text' : 'Scheitert an Freitext')
                        : (language === 'en' ? 'High semantic match' : 'Hohe Semantik-Treue')}
                    </span>
                  </div>

                  {/* 2. Halluzinations-Risiko */}
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium truncate">
                        {t.qualityHallucination}
                      </span>
                      <InfoTip
                        title={t.qualityHallucination}
                        text={isEn ? qualityMetrics.whyHallucinationEn : qualityMetrics.whyHallucinationDe}
                        details={isEn ? `Calculated based on LLM temperature, schema validation and reversibility tier.` : `Berechnet anhand Modell-Temperatur, Schema-Validierung und Schadens-Reversibilität.`}
                      />
                    </div>
                    <div
                      className={`text-base font-extrabold mt-0.5 ${
                        qualityMetrics.hallucinationRisk <= 0.05
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : qualityMetrics.hallucinationRisk <= 1.0
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {qualityMetrics.hallucinationRisk}%
                    </div>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      {qualityMetrics.hallucinationRisk <= 0.05
                        ? (language === 'en' ? 'Deterministic zero risk' : 'Deterministisch null Risiko')
                        : qualityMetrics.hallucinationRisk <= 1.0
                        ? (language === 'en' ? 'Empirical LLM benchmark' : 'Empirischer LLM-Benchmark')
                        : (language === 'en' ? 'Tool-calling drift hazard' : 'Tool-Drift-Gefahr')}
                    </span>
                  </div>

                  {/* 3. First-Pass-Yield */}
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium truncate">
                        {t.qualityFirstPassYield}
                      </span>
                      <InfoTip
                        title={t.qualityFirstPassYield}
                        text={isEn ? qualityMetrics.whyFpyEn : qualityMetrics.whyFpyDe}
                        details={isEn ? `Formula: STP-Rate × (1 - Hallucination Risk)` : `Formel: Dunkelverarbeitungsquote × (1 - Halluzinationsrisiko)`}
                      />
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {qualityMetrics.firstPassYield}%
                    </div>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      {language === 'en' ? 'Lights-out without human' : 'Dunkel ohne Klärfall'}
                    </span>
                  </div>

                  {/* 4. Stammdaten-Grounding */}
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium truncate">
                        {t.qualityGrounding}
                      </span>
                      <InfoTip
                        title={t.qualityGrounding}
                        text={isEn ? qualityMetrics.whyGroundingEn : qualityMetrics.whyGroundingDe}
                        details={isEn ? `SAP master tables (KNA1, MARA, VBAP) validation consistency.` : `Konsistenzabgleich gegen SAP-Stammdaten (KNA1, MARA, VBAP).`}
                      />
                    </div>
                    <div className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                      {qualityMetrics.groundingScore}%
                    </div>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      {language === 'en' ? 'SAP Core Verified' : 'Gegen SAP verifiziert'}
                    </span>
                  </div>
                </div>

                {/* Didaktische Begründung */}
                <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
                  <div className="font-bold text-slate-900 dark:text-white mb-0.5 flex items-center space-x-1.5">
                    <span>{isEn ? qualityMetrics.verdictEn : qualityMetrics.verdict}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {isEn ? qualityMetrics.explanationEn : qualityMetrics.explanation}
                  </p>
                </div>

                {/* Interaktive 4-Spalten Archetypen-Vergleichstabelle */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center space-x-1.5">
                      <span>⚡</span>
                      <span>{t.archetypeCompareTitle}</span>
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-sans hidden sm:inline">
                      {language === 'en' ? 'Click card to switch archetype' : 'Klick auf Spalte schaltet Archetyp um'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {archetypeComparisons.map((item) => (
                      <div
                        key={item.archetype}
                        onClick={() => updateStepArchetype(currentStep.id, item.archetype)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-150 select-none relative ${
                          item.isSelected
                            ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-400/50 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {item.isSelected && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-indigo-600 text-white shadow-sm">
                            AKTIV
                          </span>
                        )}
                        <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate pr-10">
                          {isEn ? item.nameEn : item.name}
                        </div>

                        <div className="mt-2 space-y-1 font-mono text-[10.5px]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[10px]">{t.compareColRecognition}:</span>
                            <span
                              className={`font-bold ${
                                item.recognitionRate >= 90
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : item.recognitionRate >= 50
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {item.recognitionRate}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[10px]">{t.compareColHallucination}:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {item.hallucinationRisk}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[10px]">{t.compareColStp}:</span>
                            <span
                              className={`font-semibold ${
                                item.stpRate === 0
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {item.stpRate}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[10px]">{t.compareColLatency}:</span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {item.latencyMs} ms
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px] font-sans leading-tight">
                          <span
                            className={`font-bold block truncate ${
                              item.badge === 'sweetspot'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : item.badge === 'risk'
                                ? 'text-rose-600 dark:text-rose-400'
                                : item.badge === 'anti_pattern'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {isEn ? item.verdictEn : item.verdict}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Split: IN vs OUT Transformation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* EINGANG (IN) */}
          <div className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 font-mono">
                    {language === 'en' ? '📥 INBOUND' : '📥 EINGANG'}
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                  {activeIndex === 0
                    ? (language === 'en' ? 'Customer Message' : 'Kunden-Nachricht')
                    : (language === 'en' ? 'Document State' : 'Belegdaten')}
                </span>
              </div>

              {activeIndex === 0 ? (
                /* Schritt 1: Originale Kunden-Nachricht */
                <div className="text-xs space-y-2.5 pt-1">
                  <div className="space-y-1.5 text-slate-800 dark:text-slate-300">
                    <div className="text-[11px] bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">
                          <strong className="text-slate-500 dark:text-slate-400">{t.sender}</strong> {activeSender}
                        </span>
                        {isCustom && (
                          <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-800 shrink-0 font-sans font-bold">
                            {language === 'en' ? 'Edited' : 'Editiert'}
                          </span>
                        )}
                      </div>
                      <div className="truncate"><strong className="text-slate-500 dark:text-slate-400">{t.subject}</strong> {activeSubject}</div>
                      <div className="text-[10px] text-slate-500"><strong className="text-slate-500 dark:text-slate-400">{t.receivedAt}</strong> {sample.receivedAt}</div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-200 dark:border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-semibold uppercase flex items-center space-x-1">
                          <FileText className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                          <span>{language === 'en' ? 'Original Inbound Mail' : 'Original-Eingangsnachricht'} ({activeRawText.length} {language === 'en' ? 'chars' : 'Z.'})</span>
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-800 dark:text-sky-100/95 font-mono whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto pr-1">
                        {activeRawText}
                      </div>
                    </div>
                  </div>

                  <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 rounded-lg p-2.5 text-[11px] text-sky-900 dark:text-sky-200/90 font-sans leading-relaxed">
                    {language === 'en'
                      ? 'Step 1 operates directly on this raw inbound message to classify the intent and trigger the pipeline.'
                      : 'Schritt 1 arbeitet direkt auf dieser eingehenden Originalnachricht, um den Geschäftsvorfall zu klassifizieren und die Pipeline zu starten.'}
                  </div>
                </div>
              ) : (
                /* Schritt > 1: Direkt die übergebenen Belegdaten für diesen Schritt! */
                <div className="text-xs space-y-2.5 pt-1">
                  {/* Die übergebenen Nutzdaten (Input für diesen Schritt) */}
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[10.5px] space-y-1.5 shadow-sm">
                    <div className="text-slate-700 dark:text-slate-300 text-[10px] uppercase font-bold border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-sky-700 dark:text-sky-300">
                        <span>📥</span>
                        <span>
                          {language === 'en'
                            ? 'Inbound Document Fields:'
                            : 'Eingehende Belegfelder:'}
                        </span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                        {Object.keys(prevTrace?.outputData || {}).length} {language === 'en' ? 'Fields' : 'Felder'}
                      </span>
                    </div>

                    {prevTrace?.outputData && Object.keys(prevTrace.outputData).length > 0 ? (
                      <div className="space-y-1.5 pt-0.5 max-h-[240px] overflow-y-auto pr-1">
                        {Object.entries(prevTrace.outputData).map(([k, v]) =>
                          renderFieldWithInfo(k, v)
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[10.5px] py-1">
                        {language === 'en' ? 'Initial document context passed.' : 'Basis-Belegkontext übergeben.'}
                      </div>
                    )}
                  </div>

                  {/* Optional: Original-E-Mail aufklappen zur Gegenprobe */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowOriginalMail(!showOriginalMail)}
                      className="flex items-center justify-between w-full p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/70 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10.5px] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition font-mono"
                    >
                      <span className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>{language === 'en' ? 'Inspect original email (reference)' : 'Ursprüngliche E-Mail einsehen (Referenz)'}</span>
                      </span>
                      {showOriginalMail ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>

                    {showOriginalMail && (
                      <div className="mt-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 space-y-1.5 font-mono text-[10px] transition-all">
                        <div className="truncate"><strong className="text-slate-500 dark:text-slate-400">{t.sender}</strong> {activeSender}</div>
                        <div className="truncate"><strong className="text-slate-500 dark:text-slate-400">{t.subject}</strong> {activeSubject}</div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 max-h-[85px] overflow-y-auto whitespace-pre-wrap text-slate-800 dark:text-sky-100/90">
                          {activeRawText}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AUSGANG (OUT) */}
          <div
            className={`bg-slate-50/70 dark:bg-slate-950/80 border rounded-xl p-3 space-y-2.5 flex flex-col justify-between transition-all ${
              currentStep?.currentArchetype === 'copilot'
                ? 'border-sky-300 dark:border-sky-800/70 bg-sky-50/30 dark:bg-slate-950/90'
                : trace?.isSelfHealed
                ? 'border-purple-300 dark:border-purple-600/80 bg-purple-50/50 dark:bg-purple-950/20 ring-1 ring-purple-400/40'
                : hasError
                ? 'border-red-300 dark:border-red-600/80 bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-400/40'
                : hasEscalation
                ? 'border-amber-300 dark:border-amber-600/80 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-400/40'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-2.5">
              {/* 1. Header: Status-Punkt, Titel & Technik-Badge */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentStep?.currentArchetype === 'copilot'
                        ? isApproved
                          ? 'bg-emerald-500'
                          : isRejected
                          ? 'bg-red-500'
                          : 'bg-amber-500'
                        : trace?.isSelfHealed
                        ? 'bg-purple-500 animate-pulse'
                        : hasError
                        ? 'bg-red-500'
                        : hasEscalation
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                      currentStep?.currentArchetype === 'copilot'
                        ? 'text-sky-700 dark:text-sky-300'
                        : trace?.isSelfHealed
                        ? 'text-purple-700 dark:text-purple-300'
                        : hasError
                        ? 'text-red-700 dark:text-red-400'
                        : hasEscalation
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {language === 'en' ? '📤 OUTBOUND' : '📤 AUSGANG'}
                  </span>
                </div>

                {/* Gewählte Verarbeitungsart (AI-Kapazität) */}
                <div
                  className={`flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    currentStep?.currentArchetype === 'deterministic'
                      ? 'bg-slate-100 dark:bg-slate-900 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800/80'
                      : currentStep?.currentArchetype === 'classic_ml'
                      ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800'
                      : currentStep?.currentArchetype === 'copilot'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : currentStep?.currentArchetype === 'autopilot'
                      ? 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}
                  title={language === 'en' ? 'Currently selected AI tier for this step' : 'Aktuell im Step gewählte AI-Kapazität'}
                >
                  <span>
                    {currentStep?.currentArchetype === 'deterministic'
                      ? (language === 'en' ? '⚙️ Deterministic' : '⚙️ Deterministisch')
                      : currentStep?.currentArchetype === 'classic_ml'
                      ? (language === 'en' ? '📝 Assistant (Model)' : '📝 Assistant (Modell)')
                      : currentStep?.currentArchetype === 'copilot'
                      ? (language === 'en' ? '🤖 Copilot (HITL Review)' : '🤖 Copilot (HITL Freigabe)')
                      : currentStep?.currentArchetype === 'autopilot'
                      ? '🚀 Autopilot'
                      : '🧠 Agentic Swarm'}
                  </span>
                </div>
              </div>

              {/* 2. Sub-Leiste: Mechanismus & Konfidenz */}
              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/90 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 font-mono gap-1">
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[240px]" title={trace?.techniqueMechanism}>
                  {trace?.techniqueMechanism || (language === 'en' ? 'SAP S/4HANA Processing' : 'SAP S/4HANA Verarbeitung')}
                </span>
                <span
                  className={`font-bold ${
                    (trace?.confidence || 0) >= 0.85
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : (trace?.confidence || 0) >= 0.6
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {Math.round((trace?.confidence || 0) * 100)}% {t.confidence}
                </span>
              </div>

              {/* 3. Status-Banner / Alert abhängig vom Ausgang */}
              <div className="text-xs space-y-2 pt-0.5">
                {currentStep?.currentArchetype === 'copilot' ? (
                  <div className="bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800/80 rounded-xl p-3 space-y-2.5 shadow-md">
                    {/* Header mit HITL Status */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {t.hitlConsoleTitle}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          isApproved
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : isModified
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                            : isRejected
                            ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {isApproved
                          ? t.hitlStatusApproved
                          : isModified
                          ? t.hitlStatusModified
                          : isRejected
                          ? t.hitlStatusRejected
                          : t.hitlStatusPending}
                      </span>
                    </div>

                    {/* KI-Vorschlag */}
                    <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono font-semibold">
                        <span>{t.hitlAiProposal}</span>
                        <span className="text-sky-600 dark:text-sky-400 font-mono">
                          {Math.round((trace?.confidence || 0.95) * 100)}% {t.confidence}
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                        {trace?.logMessage || (language === 'en' ? 'Proposal generated by Joule. Clerk decides on continuation.' : 'Vorschlag von Joule generiert. Sachbearbeiter entscheidet über Weiterführung.')}
                      </p>
                      {currentDecision?.note && (
                        <div className="text-[10.5px] text-sky-700 dark:text-sky-300 border-t border-slate-200 dark:border-slate-800 pt-1 mt-1 font-mono">
                          <span className="text-slate-500 dark:text-slate-400">{t.hitlUserNote} </span>{currentDecision.note}
                        </div>
                      )}
                    </div>

                    {/* Interaktive Aktionen */}
                    <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                      {!isApproved && !isRejected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => currentStep && approveAndContinueSimulation(currentStep.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition active:scale-95"
                            title={language === 'en' ? 'Approve proposal as-is and continue workflow' : 'Vorschlag unverändert freigeben und Workflow fortsetzen'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.btnApproveAndContinue}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (!currentStep) return;
                              const note = window.prompt(t.promptAdjustNote, t.promptDefaultNote);
                              if (note !== null && note.trim() !== '') {
                                setStepDecision(currentStep.id, 'modified', note);
                              }
                            }}
                            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 dark:hover:text-white border border-slate-300 dark:border-slate-700 font-semibold text-xs transition active:scale-95"
                            title={language === 'en' ? 'Manually adjust document values or note' : 'Belegwerte oder Notiz manuell anpassen'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{t.btnAdjustManually}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => currentStep && setStepDecision(currentStep.id, 'rejected', t.rejectionReason)}
                            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800/80 font-semibold text-xs transition active:scale-95"
                            title={language === 'en' ? 'Stop document and reject posting' : 'Beleg stoppen und Verbuchung ablehnen'}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t.btnReject}</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                            {language === 'en' ? 'Decision:' : 'Entscheidung:'} <strong className={isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>{isApproved ? (language === 'en' ? 'Approved' : 'Freigegeben') : (language === 'en' ? 'Rejected' : 'Abgelehnt')}</strong> {currentDecision?.decidedAt && `(${currentDecision.decidedAt})`}
                          </span>
                          <button
                            type="button"
                            onClick={() => currentStep && resetStepDecision(currentStep.id)}
                            className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 underline font-mono"
                          >
                            {t.btnResetDecision}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : trace?.isSelfHealed ? (
                  <div className="bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 p-2.5 rounded-lg text-purple-900 dark:text-purple-200 text-[11px] space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-purple-700 dark:text-purple-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? '✨ Autonomous Self-Healing (Agentic Swarm)' : '✨ Autonome Selbstheilung (Agentic Swarm)'}</span>
                    </div>
                    <p className="leading-relaxed">{trace?.logMessage}</p>
                  </div>
                ) : hasError ? (
                  <div className="bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 p-2.5 rounded-lg text-red-900 dark:text-red-200 text-[11px] space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Error / Halt Signal' : 'Fehler / Stopp-Signal'}</span>
                    </div>
                    <p className="leading-relaxed">{trace?.logMessage || (language === 'en' ? 'Processing stopped.' : 'Verarbeitung gestoppt.')}</p>
                  </div>
                ) : hasEscalation ? (
                  <div className="bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 p-2.5 rounded-lg text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? '⚠️ Clarification Required / Human-in-the-Loop' : '⚠️ Klärungsbedarf / Human-in-the-Loop'}</span>
                    </div>
                    <p className="leading-relaxed">{trace?.logMessage || (language === 'en' ? 'Confidence below threshold.' : 'Konfidenz zu gering.')}</p>
                  </div>
                ) : null}

                {/* 4. Strukturierte Ergebnisdaten: 1:1 extrahierte Belegdaten */}
                {trace?.outputData && Object.keys(trace.outputData).length > 0 ? (
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[10.5px] space-y-1.5 shadow-sm">
                    <div className="text-slate-700 dark:text-slate-300 text-[10px] uppercase font-bold border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-sky-700 dark:text-sky-300">
                        <span>📤</span>
                        <span>
                          {language === 'en'
                            ? 'Extracted / Generated Fields:'
                            : 'Extrahierte / Erzeugte Belegdaten:'}
                        </span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                        {Object.keys(trace?.outputData || {}).length} {language === 'en' ? 'Fields' : 'Felder'}
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-0.5 max-h-[280px] overflow-y-auto pr-1">
                      {Object.entries(trace.outputData).map(([k, v]) =>
                        renderFieldWithInfo(k, v)
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 text-center text-slate-500 dark:text-slate-400 text-xs italic font-mono">
                    {language === 'en' ? 'No output fields generated.' : 'Keine Ausgangsdaten erzeugt.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

