'use client';

import React, { useState, useEffect } from 'react';
import {
  ProcessStep,
  AutomationArchetype,
  PRIMITIVE_ALLOWED_ARCHETYPES,
} from '@/types/process';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getZwingmannTiers } from '@/data/zwingmann';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { getRiskChallenges } from '@/data/challenges';
import { InfoTip } from '@/components/common/InfoTip';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Server,
  ArrowDownRight,
} from 'lucide-react';

interface StepCardProps {
  step: ProcessStep;
  index: number;
}

// Ordnung der Archetypen: Deterministisch ➔ ML ➔ Autopilot (Workflow+AI) ➔ Copilot (ganz rechts!)
const ARCHETYPE_ORDER: AutomationArchetype[] = [
  'deterministic',
  'classic_ml',
  'autopilot',
  'copilot',
];

export const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    updateStepArchetype,
    dryRunResult,
    simulationStepIndex,
    selectedStepId,
    setSelectedStepId,
    language,
    config,
    openChallengeDrawer,
  } = useSimulatorStore();

  const isEn = language === 'en';
  const zwingmannTiers = getZwingmannTiers(language);
  const trace = dryRunResult?.traces?.find((t) => t.stepId === step.id);
  const isCurrentSim = simulationStepIndex === index;
  const isPassed = simulationStepIndex > index;
  const isSelected = selectedStepId === step.id;
  const isFocused = isCurrentSim || isSelected;

  const hasError = trace?.status === 'error';
  const hasEscalation = trace?.status === 'escalation';

  const metrics = calculateStepMetrics(step, config);
  const activeChallenges = metrics.triggeredChallengeIds;

  const allChallengesDict = getRiskChallenges(language);

  // Bestimme dynamisch je nach Schritt, Eigenschaften und Archetyp:
  // Welche Challenges werden für DIESEN Schritt gelöst vs. induziert
  const getStepCardChallenges = (): { solved: string[]; induced: string[] } => {
    const arch = step.currentArchetype;
    const isUnstructured = step.isUnstructuredInput;
    const rev = step.reversibility;
    const prim = step.primitive;
    const ooda = step.oodaPhase;

    let solved: string[] = [];
    let induced: string[] = [];

    if (arch === 'deterministic') {
      // Deterministische Logik löst Halluzinationen (C4), Stale RAG (C2), Prompt Injection (C8) und Runaway Tokens (C12)
      if (prim === 'Filter / Gatekeeper') {
        solved = isUnstructured ? ['CH_08', 'CH_12'] : ['CH_01', 'CH_08', 'CH_12'];
        if (isUnstructured) induced = ['CH_01']; // Starr bei Freitext
      } else if (prim === 'Extractor / Transformer') {
        solved = ['CH_04', 'CH_12'];
        induced = ['CH_01']; // Regex bricht bei Layoutverschiebung
      } else if (prim === 'Matcher / Enricher') {
        solved = ['CH_02', 'CH_04', 'CH_08'];
      } else if (prim === 'Evaluator / Reasoner') {
        solved = ['CH_07', 'CH_08', 'CH_12'];
      } else if (prim === 'Executor / Actuator') {
        solved = ['CH_05', 'CH_10', 'CH_11']; // Revisionssicher via BAPI/RAP
      } else {
        solved = ['CH_04', 'CH_12'];
      }
    } else if (arch === 'classic_ml') {
      // Single-Turn ML löst Schema Divergence (C1) bei Freitext & Attention Dilution (C3)
      if (prim === 'Filter / Gatekeeper' || prim === 'Extractor / Transformer') {
        solved = ['CH_01'];
        induced = ['CH_03']; // Lost in the Middle bei langen Texten
      } else if (prim === 'Matcher / Enricher') {
        solved = ['CH_01'];
        induced = ['CH_02']; // Stale Embeddings wenn nicht CDC
      } else {
        solved = ['CH_01'];
        induced = ['CH_06']; // Silent Degradation
      }
    } else if (arch === 'copilot') {
      // Copilot löst Halluzination (C4), Silent Drift (C6) und SOX Break (C10) durch menschliche Signatur
      solved = ['CH_04', 'CH_06', 'CH_10'];
      induced = ['CH_11']; // Shared Account Privileged Access
    } else if (arch === 'autopilot') {
      // Autopilot löst manuelle Bottlenecks, induziert aber agentische Risiken
      solved = ['CH_01'];
      induced = activeChallenges.length > 0 
        ? activeChallenges.slice(0, 3) 
        : rev >= 4 ? ['CH_05', 'CH_10'] : ooda === 'Orient' ? ['CH_04'] : ['CH_06'];
    } else {
      // agentic
      solved = [];
      induced = activeChallenges.length > 0 
        ? activeChallenges.slice(0, 3) 
        : ['CH_07', 'CH_12', 'CH_13'];
    }

    return { solved, induced };
  };

  const { solved: solvedChallenges, induced: inducedChallenges } = getStepCardChallenges();

  // Auf Step-Ebene kein Schwarm mehr; Copilot steht immer ganz rechts
  const rawKeys = PRIMITIVE_ALLOWED_ARCHETYPES[step.primitive] || ARCHETYPE_ORDER;
  const allowedKeys = [...rawKeys]
    .filter((k) => k !== 'agentic')
    .sort((a, b) => ARCHETYPE_ORDER.indexOf(a) - ARCHETYPE_ORDER.indexOf(b));

  // OODA Farb-Palette
  const oodaColors: Record<string, string> = {
    Observe: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800/70',
    Orient: 'bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800/70',
    Decide: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/70',
    Act: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/70',
  };

  // Archetyp-Erklärung spezifisch für diesen Schritt: Was bedeutet die Auswahl?
  const getArchetypeStepMeaning = (arch: AutomationArchetype): string => {
    switch (arch) {
      case 'deterministic':
        return isEn
          ? 'Tier 1 (Deterministic): Rigid rules via ABAP/BRFplus (100% reproducible, 0 token cost, halts on noise).'
          : 'Stufe 1 (Deterministisch): Starre Regeln via ABAP/BRFplus (100% reproduzierbar, 0 Token-Kosten, stoppt bei Freitext).';
      case 'classic_ml':
        return isEn
          ? 'Tier 2 (Classic ML): Statistical pattern match / in-memory fuzzy search (fast, handles slight typos).'
          : 'Stufe 2 (Klassisch ML): Statistische Heuristik & In-Memory Fuzzy Search (schnell, tolerant bei Tippfehlern).';
      case 'autopilot':
        return isEn
          ? `Tier 4 (Autopilot): Autonomous LLM execution with ${step.confidenceGate}% confidence gate (flexible, risks C1/C2 hallucinations).`
          : `Stufe 4 (Autopilot): Autonome LLM-Ausführung mit ${step.confidenceGate}% Konfidenz-Gate (flexibel, birgt Risiko C1/C2).`;
      case 'copilot':
        return isEn
          ? 'Tier 5 (Copilot): AI draft proposal with mandatory 4-eyes human review before execution (safe, higher human latency).'
          : 'Stufe 5 (Copilot): KI-Vorschlag mit verpflichtender 4-Augen-Freigabe durch Sachbearbeiter (sicher, Human-Latenz).';
      default:
        return '';
    }
  };

  // Falls ein Step noch fälschlicherweise auf agentic stand, sanft auf autopilot korrigieren
  useEffect(() => {
    if (step.currentArchetype === 'agentic') {
      updateStepArchetype(step.id, 'autopilot');
    }
  }, [step.id, step.currentArchetype, updateStepArchetype]);

  return (
    <div
      onClick={() => setSelectedStepId(step.id)}
      className={`rounded-xl border-2 transition-all p-3 space-y-2 cursor-pointer select-none shadow-sm ${
        hasError && isFocused
          ? 'border-red-500 ring-2 ring-red-500/50 bg-red-50 dark:bg-red-950/20 shadow-red-200 dark:shadow-red-950/40'
          : hasEscalation && isFocused
          ? 'border-amber-500 ring-2 ring-amber-500/50 bg-amber-50 dark:bg-amber-950/20 shadow-amber-200 dark:shadow-amber-950/40'
          : isFocused
          ? 'border-[#0A6ED1] ring-2 ring-[#0A6ED1]/40 shadow-md bg-white dark:bg-slate-900'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900/90'
      }`}
    >
      {/* 1. Header: Nummer, Name & OODA/Primitive Badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
              hasError
                ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800'
                : isPassed
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                : isCurrentSim
                ? 'bg-[#0A6ED1] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-transparent'
            }`}
          >
            {hasError ? '✕' : isPassed ? '✓' : index + 1}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight truncate block">
              {step.name}
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${oodaColors[step.oodaPhase] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                {step.oodaPhase}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[140px]" title={step.primitive}>
                {step.primitive.split('/')[0].trim()}
              </span>
            </div>
          </div>
        </div>

        {/* Schlanker Status-Indikator */}
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0 uppercase ${
            hasError
              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
              : hasEscalation
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              : trace?.isSelfHealed
              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900'
          }`}
        >
          {hasError
            ? (isEn ? 'Error' : 'Fehler')
            : hasEscalation
            ? (isEn ? 'Escalation' : 'Klärung')
            : trace?.isSelfHealed
            ? 'Healed'
            : 'OK'}
        </span>
      </div>

      {/* 2. Was genau im Schritt passiert: Direkte fachliche Beschreibung */}
      <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug font-sans bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-200 dark:border-slate-800/60">
        <p className="line-clamp-2" title={step.description}>
          {step.businessIntent || step.description}
        </p>
      </div>

      {/* 3. Challenge Trade-off Indikator (Gelöst vs. Induziert) mit interaktiver Erklärung */}
      <div className="flex items-center justify-between text-[9.5px] font-mono px-2 py-1.5 rounded bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 gap-1 flex-wrap">
        {/* Solved Challenges */}
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          {solvedChallenges.length > 0 ? (
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{isEn ? 'Solves:' : 'Löst:'}</span>
              {solvedChallenges.map((chKey) => {
                const ch = allChallengesDict[chKey];
                const shortId = chKey.replace('CH_', 'C');
                return (
                  <span
                    key={chKey}
                    className="inline-flex items-center space-x-0.5 px-1 py-0.2 rounded bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openChallengeDrawer(chKey);
                      }}
                      className="hover:underline cursor-pointer"
                      title={`${shortId}: ${ch?.name || ''} - ${isEn ? 'Click to open details' : 'Klicken für Details'}`}
                    >
                      {shortId}
                    </button>
                    <InfoTip
                      title={`${shortId}: ${ch?.name || chKey}`}
                      text={ch?.description || ''}
                      details={isEn ? `Mitigation: ${ch?.mitigationStrategy || ''}` : `Lösungsweg: ${ch?.mitigationStrategy || ''}`}
                      className="!ml-0.5 !w-3 !h-3"
                    />
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-500">{isEn ? 'Tier 1 Rule' : 'Stufe 1 Regel'}</span>
          )}
        </div>

        {/* Induced Challenges / Risks */}
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          {inducedChallenges.length > 0 ? (
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{isEn ? 'Risk:' : 'Risiko:'}</span>
              {inducedChallenges.map((chKey) => {
                const ch = allChallengesDict[chKey];
                const shortId = chKey.replace('CH_', 'C');
                return (
                  <span
                    key={chKey}
                    className="inline-flex items-center space-x-0.5 px-1 py-0.2 rounded bg-amber-100/70 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openChallengeDrawer(chKey);
                      }}
                      className="hover:underline cursor-pointer"
                      title={`${shortId}: ${ch?.name || ''} - ${isEn ? 'Click to open details' : 'Klicken für Details'}`}
                    >
                      {shortId}
                    </button>
                    <InfoTip
                      title={`${shortId}: ${ch?.name || chKey}`}
                      text={ch?.description || ''}
                      details={isEn ? `Threat: ${ch?.triggerDescription || ''}` : `Ursache: ${ch?.triggerDescription || ''}`}
                      className="!ml-0.5 !w-3 !h-3"
                    />
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold">{isEn ? '0 Risks' : '0 Risiken'}</span>
          )}
        </div>
      </div>

      {/* 4. Auswahl der AI-Kapazität / Automatisierungsstufe */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
          <span>{isEn ? 'Execution Tier:' : 'Ausführungs-Stufe:'}</span>
          <span className="text-sky-600 dark:text-sky-400 font-semibold truncate max-w-[170px]">
            {zwingmannTiers[step.currentArchetype]?.name}
          </span>
        </div>

        <div
          className={`grid gap-1 ${
            allowedKeys.length === 2
              ? 'grid-cols-2'
              : allowedKeys.length === 3
              ? 'grid-cols-3'
              : 'grid-cols-4'
          }`}
        >
          {allowedKeys.map((key) => {
            const tier = zwingmannTiers[key];
            const isActive = step.currentArchetype === key;
            const isCopilot = key === 'copilot';

            return (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStepId(step.id);
                  updateStepArchetype(step.id, key);
                }}
                className={`py-1 px-1 text-[10px] rounded border transition text-center font-medium truncate ${
                  isActive
                    ? isCopilot
                      ? 'bg-sky-600 text-white border-sky-500 font-bold shadow'
                      : 'bg-[#0A6ED1] text-white border-blue-500 font-bold shadow'
                    : isCopilot
                    ? 'bg-sky-50 dark:bg-slate-950/70 border-sky-200 dark:border-sky-900/60 text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-white hover:bg-sky-100 dark:hover:bg-sky-950'
                    : 'bg-slate-100 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
                title={getArchetypeStepMeaning(key)}
              >
                {tier.name}
              </button>
            );
          })}
        </div>

        {/* Aktive Stufenauswirkung: Erklärung direkt unter den Buttons */}
        <div className="text-[9.5px] text-slate-600 dark:text-slate-400 font-sans italic px-1 pt-0.5 flex items-start space-x-1">
          <Info className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <span className="leading-tight">{getArchetypeStepMeaning(step.currentArchetype)}</span>
        </div>
      </div>

      {/* 5. Ausklappbare Detailansicht (Input, Output, SAP-Schnittstelle) */}
      <div className="pt-1 border-t border-slate-200 dark:border-slate-800/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="w-full flex items-center justify-between text-[9.5px] font-mono text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition py-0.5"
        >
          <span>{isEn ? 'Step Specifications' : 'Schritt-Spezifikation & I/O'}</span>
          {showDetails ? (
            <ChevronUp className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          )}
        </button>

        {showDetails && (
          <div className="mt-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-[10px] space-y-1.5 font-mono">
            {step.inputDescription && (
              <div className="flex items-start space-x-1.5">
                <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">IN:</span>
                <span className="text-slate-700 dark:text-slate-300 font-sans">{step.inputDescription}</span>
              </div>
            )}
            {step.outputDescription && (
              <div className="flex items-start space-x-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">OUT:</span>
                <span className="text-slate-700 dark:text-slate-300 font-sans">{step.outputDescription}</span>
              </div>
            )}
            {step.sapReference && (
              <div className="flex items-start space-x-1.5 pt-1 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400">
                <Server className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <span className="truncate">{step.sapReference}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
