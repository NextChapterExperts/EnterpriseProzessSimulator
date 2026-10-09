'use client';

import React, { useState, useEffect } from 'react';
import { ProcessStep } from '@/types/process';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  Coins,
  ShieldAlert,
  Cpu,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getAiCoreStepRecommendation } from '@/lib/aiCoreAdvisor';
import { getActivePayloadText, calculateStepDynamicTokens } from '@/lib/payloadTokens';
import { evaluateGoldenPath } from '@/lib/goldenPathAdvisor';
import { getStepKnowledge } from '@/data/stepKnowledgeBase';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { getRiskChallenges } from '@/data/challenges';
import { getZwingmannTiers } from '@/data/zwingmann';
import { InfoTip } from '@/components/common/InfoTip';

interface StepImpactCriteriaProps {
  step: ProcessStep;
}

export const StepImpactCriteria: React.FC<StepImpactCriteriaProps> = ({ step }) => {
  const {
    language,
    config,
    currentTemplate,
    selectedMessageQuality,
    customMessageText,
    toggleCalculatorModal,
    activeWorkflowLayer,
    openChallengeDrawer,
  } = useSimulatorStore();

  const [isCostOpen, setIsCostOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);

  // Wenn der Benutzer eine Box geöffnet hat, soll sie beim Wechseln der Steps geöffnet bleiben!
  // Sie schließt sich nur, wenn der Benutzer oben die Ebene (activeWorkflowLayer) wechselt.
  useEffect(() => {
    setIsCostOpen(false);
    setIsRiskOpen(false);
    setIsArchOpen(false);
  }, [activeWorkflowLayer]);

  // Im Flow-Modus (Layer 1) und Qualitäts-Modus (Layer 2) keine redundanten Kriterien rendern
  if (activeWorkflowLayer === 'flow' || activeWorkflowLayer === 'quality') {
    return null;
  }

  const isEn = language === 'en';
  const numberLocale = isEn ? 'en-US' : 'de-DE';
  const goldenPathAssessment = evaluateGoldenPath(step, language);
  const goldenPathTool = step.sapGoldenPathTool || goldenPathAssessment.recommendedTool;
  const goldenPathGraph = step.sapGoldenPathGraph || goldenPathAssessment.graphRef;
  const isGoldenPathCompliant = goldenPathAssessment.isCompliant;

  const euRisk =
    step.euAiActRisk ||
    (step.currentArchetype === 'agentic'
      ? 'LIMITED'
      : step.reversibility >= 4 || step.damageAmountEur > 2000
      ? 'LIMITED'
      : 'MINIMAL');

  const activePayloadText = getActivePayloadText(
    currentTemplate.id,
    selectedMessageQuality,
    customMessageText
  );
  const dynamicTokens = calculateStepDynamicTokens(step, activePayloadText);

  const knowledge = getStepKnowledge(step, language);
  const relevantChallenges = knowledge.relevantChallenges || [];

  const aiRec = getAiCoreStepRecommendation(
    step.primitive,
    step.currentArchetype,
    step.oodaPhase,
    language,
    { baseTokensIn: dynamicTokens.tokensIn, baseTokensOut: dynamicTokens.tokensOut },
    config.monthlyVolume
  );

  return (
    <div className="select-none">
      {/* LAYER 3: KOSTEN & CAPACITY UNITS (Zusätzliche Preisangaben) */}
      {activeWorkflowLayer === 'cost' && (
        <div className="bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 rounded-xl transition-all shadow-md overflow-hidden">
          <div
            onClick={() => setIsCostOpen(!isCostOpen)}
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/70 transition select-none flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs font-mono">
              <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
                {isCostOpen ? '−' : '+'}
              </span>
              <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>
                {language === 'en'
                  ? `Additional Pricing & Capacity for: ${step.name}`
                  : `Zusatz: Kosten & BTP-Kapazität für ${step.name}`}
              </span>
            </div>

            {!isCostOpen ? (
              <div className="flex items-center space-x-2 font-mono text-[10.5px]">
                <span className="text-slate-500 hidden sm:inline">
                  {aiRec.costBreakdown.isDeterministicFree ? '0 CU (0,00 €)' : aiRec.costBreakdown.formattedCostPerTx} / {language === 'en' ? 'doc' : 'Beleg'} &bull; {aiRec.costBreakdown.formattedMonthlyCost}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCalculatorModal(true);
                  }}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition active:scale-95 shadow"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'AI Core Calculator' : 'BTP-Rechner öffnen'}</span>
                </button>
              </div>
            )}
          </div>

          {isCostOpen && (
            <div className="p-3 pt-0 space-y-2.5 border-t border-slate-200 dark:border-slate-800 mt-0.5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono pt-2.5">
                {/* 1. Preis pro Beleg */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    {language === 'en' ? 'Cost / Document' : 'Kosten pro Beleg'}
                  </span>
                  <div className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">
                    {aiRec.costBreakdown.isDeterministicFree
                      ? '0 CU (0,00 €)'
                      : aiRec.costBreakdown.formattedCostPerTx}
                  </div>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    {aiRec.costBreakdown.isDeterministicFree
                      ? (language === 'en' ? 'Free in ERP Core' : 'Kostenlos im ERP Core')
                      : (language === 'en' ? 'Inference Fee' : 'Inferenz-Kosten')}
                  </span>
                </div>

                {/* 2. Monatliche Hochrechnung */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    {language === 'en' ? 'Monthly Projection' : 'Monatlich'}{' '}
                    <span className="text-slate-400 dark:text-slate-500">({config.monthlyVolume.toLocaleString(numberLocale)})</span>
                    <InfoTip term="capacityUnits" />
                  </span>
                  <div className="text-indigo-600 dark:text-indigo-300 font-bold text-sm mt-0.5">
                    {aiRec.costBreakdown.formattedMonthlyCost}
                  </div>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    {language === 'en' ? 'Estimated monthly BTP CU' : 'Geschätzte BTP CU'}
                  </span>
                </div>

                {/* 3. Inferenz-Tokens */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    {language === 'en' ? 'Inference Tokens' : 'Tokens / Beleg'}
                  </span>
                  <div className="text-sky-700 dark:text-sky-300 font-bold text-sm mt-0.5">
                    {dynamicTokens.tokensIn} In / {dynamicTokens.tokensOut} Out
                  </div>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    {step.currentArchetype === 'deterministic'
                      ? (language === 'en' ? '0 LLM Tokens' : '0 LLM-Tokens')
                      : (language === 'en' ? 'Prompt + Completion' : 'Prompt & Antwort')}
                  </span>
                </div>

                {/* 4. Modell */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    {language === 'en' ? 'AI Core Model' : 'Empfohlenes Modell'}
                  </span>
                  <div
                    className="text-amber-700 dark:text-amber-300 font-bold text-sm mt-0.5 truncate"
                    title={aiRec.recommendedModelName}
                  >
                    {aiRec.recommendedModelName}
                  </div>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    Provider: {aiRec.recommendedProvider}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LAYER 3: RISIKO & GOVERNANCE (Zusätzliche Risikobewertung) */}
      {activeWorkflowLayer === 'risk' && (() => {
        const metrics = calculateStepMetrics(step, config);
        const allChallenges = getRiskChallenges(language);
        const archetype = step.currentArchetype;
        const isHighReversibility = step.reversibility >= 4;

        // Dynamisches Risikoprofil je nach gewählter Ausführungsstufe (Execution Tier)
        const getRiskProfile = () => {
          switch (archetype) {
            case 'deterministic':
              return {
                euRiskClass: 'MINIMAL',
                euRiskBadge: isEn ? 'MINIMAL (0 AI)' : 'MINIMAL (0 AI)',
                euArticle: isEn ? 'Outside AI Scope' : 'Außerhalb KI-Scope',
                euDesc: isEn
                  ? 'Pure deterministic ERP rules (ABAP/BRFplus). Exempt from AI Act compliance obligations.'
                  : 'Reine deterministische ERP-Regeln (ABAP/BRFplus). Keine Kennzeichnungs- oder Auditpflichten.',
                errorRate: '< 0.01%',
                errorLabel: isEn ? 'Rules halt on mismatch' : 'Prüfregel bricht bei Abweichung hart ab',
                liability: isEn ? 'System Configuration' : 'Standard ERP-Regelwerk',
                liabilityDesc: isEn ? '100% reproducible, no model drift' : '100% reproduzierbar, kein Model-Drift',
                guardrail: isEn ? 'SAP PFCG authorization & table locks' : 'SAP PFCG Berechtigungsprüfung & Sperrlogik',
                guardrailType: isEn ? 'ERP Core Security' : 'ERP-Basis-Sicherheit',
                statusBanner: isEn
                  ? '🛡️ High Reliability: 0% AI hallucination risk (Deterministic ABAP / BRFplus rule set)'
                  : '🛡️ Hohe Verlässlichkeit: 0% KI-Halluzinationsrisiko (Deterministisches ABAP / BRFplus Regelwerk)',
                bannerColor: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
                solvedChallenges: ['CH_02', 'CH_04', 'CH_08', 'CH_12'],
                inducedChallenges: step.isUnstructuredInput ? ['CH_01'] : [],
              };
            case 'classic_ml':
              return {
                euRiskClass: 'MINIMAL',
                euRiskBadge: isEn ? 'TRANSPARENCY (Art. 50)' : 'TRANSPARENZ (Art. 50)',
                euArticle: isEn ? 'Art. 50 EU AI Act' : 'Art. 50 EU AI Act',
                euDesc: isEn
                  ? 'Pattern matching / extraction. Transparency notice required when AI processes documents.'
                  : 'Mustererkennung / Extraktion. Hinweispflicht bei KI-gestützter Belegvorverarbeitung.',
                errorRate: '~ 0.8%',
                errorLabel: isEn ? 'Statistical matching tolerance' : 'Statistische Heuristik-Toleranz',
                liability: isEn ? 'Schema-Validated Output' : 'Schema-validierter Output',
                liabilityDesc: isEn ? 'Fast path with bounded variance' : 'Schneller Pfad mit begrenzter Varianz',
                guardrail: isEn ? 'Pydantic schema validation & regex casting' : 'Pydantic Schema-Validierung & Typ-Casting',
                guardrailType: isEn ? 'Data Validation Gate' : 'Daten-Validierungs-Gate',
                statusBanner: isEn
                  ? '⚡ Statistical ML: Low latency, bounded extraction & fuzzy variance'
                  : '⚡ Statistisches ML: Geringe Latenz, begrenzte Extraktions- & Fuzzy-Varianz',
                bannerColor: 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300',
                solvedChallenges: step.isUnstructuredInput ? ['CH_01'] : [],
                inducedChallenges: ['CH_03'],
              };
            case 'copilot':
              return {
                euRiskClass: 'LIMITED',
                euRiskBadge: isEn ? 'LIMITED (Human Oversight)' : 'LIMITED RISK (Human Oversight)',
                euArticle: isEn ? 'Art. 14 EU AI Act Compliant' : 'Art. 14 EU AI Act erfüllt',
                euDesc: isEn
                  ? 'AI proposal with mandatory human review. Full human oversight legally shields the organization.'
                  : 'Joule macht Entwurf, Mensch signiert (4-Augen-Prinzip). Volle Human Oversight schützt vor KI-Fehlern.',
                errorRate: '< 0.2%',
                errorLabel: isEn ? 'Clerk catches 99.8% of errors' : 'Sachbearbeiter fängt 99,8% aller Fehler ab',
                liability: isEn ? 'Business Clerk (HITL)' : 'Menschlicher Sachbearbeiter (HITL)',
                liabilityDesc: isEn ? 'Audit-proof digital signature in Fiori' : 'Revisionssichere Signatur in SAP Fiori',
                guardrail: isEn ? 'Mandatory 4-eyes approval & audit log' : 'Verpflichtendes 4-Augen-Prinzip & Freigabe-Log',
                guardrailType: isEn ? 'Human-in-the-Loop' : 'Menschliche Freigabe',
                statusBanner: isEn
                  ? '👤 Human-in-the-Loop Active: Clerk verification catches AI hallucinations before posting'
                  : '👤 Human-in-the-Loop aktiv: Sachbearbeiter-Freigabe fängt KI-Fehler vor Verbuchung ab',
                bannerColor: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300',
                solvedChallenges: ['CH_04', 'CH_06', 'CH_10'],
                inducedChallenges: ['CH_11'],
              };
            case 'autopilot':
              return {
                euRiskClass: isHighReversibility ? 'HIGH' : 'LIMITED',
                euRiskBadge: isHighReversibility
                  ? (isEn ? 'HIGH RISK (Guardrail Alert)' : 'HIGH RISK (Schutzplanken-Bruch)')
                  : (isEn ? 'LIMITED RISK (Autonomous)' : 'LIMITED RISK (Autonome Ausführung)'),
                euArticle: isHighReversibility
                  ? (isEn ? 'Violation of Art. 6 & SOX/GoBD' : 'Verstoß gegen Art. 6 & GoBD/SOX')
                  : (isEn ? 'Art. 12 & 14 EU AI Act' : 'Art. 12 & 14 EU AI Act'),
                euDesc: isHighReversibility
                  ? (isEn
                      ? '🚨 CRITICAL: Irreversible ERP posting without human sign-off violates accounting governance and EU AI Act high-risk rules!'
                      : '🚨 KRITISCH: Irreversible ERP-Buchung ohne menschliche Freigabe verletzt GoBD, SOX und EU AI Act Vorschriften!')
                  : (isEn
                      ? 'Autonomous execution via confidence gate. Requires continuous drift telemetry and audit trails.'
                      : 'Autonome Dunkelverarbeitung. Erfordert lückenlose Audit-Logs (Art. 12) und ständige Drift-Überwachung.'),
                errorRate: '~ 3.5%',
                errorLabel: isEn ? 'Undetected silent degradation risk' : 'Risiko unentdeckter Fehlbuchungen',
                liability: isEn ? 'Automated System (IT Owner)' : 'Autonomes System (IT-Betreiber)',
                liabilityDesc: isEn ? 'Unreviewed straight-through exposure' : 'Ungeprüfter Dunkeldurchlauf',
                guardrail: isEn
                  ? `Dual confidence gate (>= ${step.confidenceGate}%) + auto-fallback`
                  : `Dual-Konfidenz-Gate (>= ${step.confidenceGate}%) + Auto-Klärung`,
                guardrailType: isEn ? 'Confidence & Fallback' : 'Konfidenz-Gate & Fallback',
                statusBanner: isHighReversibility
                  ? (isEn
                      ? '🚨 Guardrail Alert: Autopilot on irreversible posting violates financial compliance (GoBD/SOX)!'
                      : '🚨 Schutzplanken-Warnung: Autopilot auf irreversibler Verbuchung verletzt GoBD/SOX-Compliance!')
                  : (isEn
                      ? `🤖 Autonomous Straight-Through: Confidence gate (${step.confidenceGate}%) active – silent failure risk`
                      : `🤖 Autonome Dunkelverarbeitung: Konfidenz-Gate (${step.confidenceGate}%) aktiv – Silent-Failure-Risiko`),
                bannerColor: isHighReversibility
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300',
                solvedChallenges: ['CH_11'],
                inducedChallenges: metrics.triggeredChallengeIds,
              };
            case 'agentic':
            default:
              return {
                euRiskClass: 'HIGH',
                euRiskBadge: isEn ? 'HIGH RISK (Agentic Swarm)' : 'HIGH RISK (Autonome Multi-Agenten)',
                euArticle: isEn ? 'Art. 6 & 14 EU AI Act' : 'Art. 6 & 14 EU AI Act',
                euDesc: isEn
                  ? 'Multi-agent orchestration with write APIs. Requires strict sandbox isolation, Signavio mining, and emergency stop.'
                  : 'Multi-Agenten-Swarm mit Schreib-APIs. Erfordert Sandbox-Isolierung, Signavio-Mining und Not-Aus.',
                errorRate: '~ 6.5%',
                errorLabel: isEn ? 'Tool mismatch & looping cascades' : 'Tool-Mismatch & Kaskadenfehler',
                liability: isEn ? 'AI Operations Team' : 'AI Operations & Plattformverantwortlicher',
                liabilityDesc: isEn ? 'Non-deterministic decision chains' : 'Nicht-deterministische Entscheidungsketten',
                guardrail: isEn ? 'Signavio Agent Mining & Kill-Switch' : 'Signavio Agent Mining & Kill-Switch',
                guardrailType: isEn ? 'Agent Governance' : 'Agenten-Governance',
                statusBanner: isEn
                  ? '🕸️ Agentic Swarm: Highest autonomy, heightened risk of infinite loops and tool miscalls'
                  : '🕸️ Agentic Swarm: Höchste Autonomie, erhöhtes Risiko von Endlosschleifen und Tool-Fehlern',
                bannerColor: 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300',
                solvedChallenges: [],
                inducedChallenges: metrics.triggeredChallengeIds,
              };
          }
        };

        const profile = getRiskProfile();

        return (
          <div className="bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-900/60 rounded-xl transition-all shadow-md overflow-hidden">
            {/* 1. Header mit Step-Titel & aktuellem Archetyp */}
            <div
              onClick={() => setIsRiskOpen(!isRiskOpen)}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/70 transition select-none flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-xs font-mono">
                <span className="w-4 h-4 rounded flex items-center justify-center bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs border border-amber-200 dark:border-amber-800 shrink-0">
                  {isRiskOpen ? '−' : '+'}
                </span>
                <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>
                  {language === 'en'
                    ? `Risk & Governance Assessment: ${step.name}`
                    : `Risiko- & Governance-Bewertung: ${step.name}`}
                </span>
              </div>

              {!isRiskOpen ? (
                <div className="flex items-center space-x-2 font-mono text-[10.5px]">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold">
                    {getZwingmannTiers(language)[archetype]?.name || archetype}
                  </span>
                  <span className="text-slate-500 hidden sm:inline">
                    {profile.euRiskBadge} &bull; {profile.errorRate}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold">
                    {language === 'en' ? 'Active Tier:' : 'Aktive Stufe:'} {getZwingmannTiers(language)[archetype]?.name || archetype}
                  </span>
                </div>
              )}
            </div>

            {isRiskOpen && (
              <div className="p-3 pt-0 space-y-3 border-t border-slate-200 dark:border-slate-800 mt-0.5">
                {/* 2. Dynamisches Risiko-Status-Banner für die gewählte Stufe */}
                <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between gap-2 mt-2.5 ${profile.bannerColor}`}>
              <div className="flex items-center space-x-2 font-semibold">
                <span>{profile.statusBanner}</span>
              </div>
              <span className="text-[10px] opacity-80 shrink-0">
                {profile.errorLabel}
              </span>
            </div>

            {/* 3. 4 dynamische Hauptkarten (EU AI Act, Blast Radius, Governance, Schutzplanke) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs font-mono">
              {/* Karte 1: EU AI Act */}
              <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center justify-between">
                  <span>{isEn ? 'EU AI Act Risk Class' : 'EU AI Act Risikoklasse'}</span>
                  <InfoTip term="euAiAct" />
                </span>
                <div
                  className={`font-bold text-sm truncate ${
                    profile.euRiskClass === 'HIGH'
                      ? 'text-red-600 dark:text-red-400'
                      : profile.euRiskClass === 'LIMITED'
                      ? 'text-amber-600 dark:text-amber-300'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                  title={profile.euArticle}
                >
                  {profile.euRiskBadge}
                </div>
                <div className="text-[9.5px] font-semibold text-slate-600 dark:text-slate-300">
                  {profile.euArticle}
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight font-sans line-clamp-2" title={profile.euDesc}>
                  {profile.euDesc}
                </p>
              </div>

              {/* Karte 2: Finanzieller Blast Radius & Monatsrisiko */}
              <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center justify-between">
                  <span>{isEn ? 'Monthly Risk Exposure' : 'Monatliches Risiko'}</span>
                  <InfoTip term="blastRadius" />
                </span>
                <div className="text-amber-700 dark:text-amber-300 font-bold text-sm">
                  {metrics.riskCostEur < 0.5 ? '< 1 €' : `${metrics.riskCostEur.toLocaleString(numberLocale, { maximumFractionDigits: 0 })} €`} {isEn ? '/ mo' : '/ Mo'}
                </div>
                <div className="text-[9.5px] text-slate-600 dark:text-slate-300">
                  {isEn ? 'Error rate:' : 'Fehlerquote:'} <strong className="text-slate-800 dark:text-slate-100">{profile.errorRate}</strong>
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight font-sans">
                  {isEn ? 'Max per incident:' : 'Max. Einzelschaden:'} {step.damageAmountEur.toLocaleString(numberLocale)} € ({isEn ? 'Reversibility' : 'Reversibilität'} {step.reversibility}/5)
                </p>
              </div>

              {/* Karte 3: Reversibilität & Haftungsübergang */}
              <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center justify-between">
                  <span>{isEn ? 'Liability & Reversibility' : 'Haftung & Reversibilität'}</span>
                  <InfoTip term="cleanCore" />
                </span>
                <div className="text-sky-700 dark:text-sky-300 font-bold text-sm truncate" title={profile.liability}>
                  {profile.liability}
                </div>
                <div className="text-[9.5px] text-slate-600 dark:text-slate-300">
                  {isEn ? 'Reversibility:' : 'Storno:'} <span className="font-semibold text-slate-800 dark:text-slate-200">{isHighReversibility ? (isEn ? 'Hard (Level 4-5)' : 'Schwer (Stufe 4-5)') : (isEn ? 'Easy (Level 1-3)' : 'Leicht (Stufe 1-3)')}</span>
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight font-sans line-clamp-2" title={profile.liabilityDesc}>
                  {profile.liabilityDesc}
                </p>
              </div>

              {/* Karte 4: Aktive Schutzplanke (Guardrail) */}
              <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center justify-between">
                  <span>{isEn ? 'Active Guardrail' : 'Aktive Schutzplanke'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </span>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-sm truncate" title={profile.guardrailType}>
                  {profile.guardrailType}
                </div>
                <div className="text-[9.5px] text-slate-600 dark:text-slate-300 truncate" title={profile.guardrail}>
                  {profile.guardrail}
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight font-sans">
                  {archetype === 'deterministic'
                    ? (isEn ? 'Deterministic validation rules' : 'Deterministische Validierungsregeln')
                    : archetype === 'copilot'
                    ? (isEn ? 'Human-in-the-loop audit sign-off' : 'Menschliche Freigabe im Fiori Launchpad')
                    : (isEn ? `Confidence gate >= ${step.confidenceGate}%` : `Konfidenz-Gate >= ${step.confidenceGate}%`)}
                </p>
              </div>
            </div>

            {/* 4. Schutzplanken-Verletzung (Guardrail Alert Banner, falls getriggert) */}
            {metrics.guardrailViolation && (
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 font-sans text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-red-700 dark:text-red-300 font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>{isEn ? '🚨 COMPLIANCE VIOLATION DETECTED' : '🚨 COMPLIANCE-VERLETZUNG FESTGESTELLT'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isEn ? (metrics.guardrailMessageEn || metrics.guardrailMessage) : metrics.guardrailMessage}
                </p>
              </div>
            )}

            {/* 5. 13-Challenges Audit Radar: Akut drohende vs. gelöste Risiken für diese Stufe */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[10.5px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    {language === 'en'
                      ? `13-Challenges Impact for ${getZwingmannTiers(language)[archetype]?.name || archetype}`
                      : `13-Challenges Risikoprofil für ${getZwingmannTiers(language)[archetype]?.name || archetype}`}
                  </span>
                </span>
                <span className="text-[9.5px] text-slate-500 font-mono">
                  {language === 'en' ? 'Click challenge badge for mitigation details' : 'Klicken für Ursachen & Mitigation'}
                </span>
              </div>

              {/* Akute Risiken */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{isEn ? 'Acute Risks Triggered by this Tier:' : 'Akut ausgelöste Risiken dieser Ausführungsstufe:'}</span>
                </div>
                {profile.inducedChallenges.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.inducedChallenges.map((cId) => {
                      const ch = allChallenges[cId];
                      return (
                        <button
                          key={cId}
                          type="button"
                          onClick={() => openChallengeDrawer(cId)}
                          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/80 border border-amber-300 hover:border-amber-400 dark:border-amber-800 dark:hover:border-amber-600 text-[10.5px] font-mono text-amber-900 dark:text-amber-200 transition shadow-sm active:scale-95 group"
                          title={ch?.description || cId}
                        >
                          <span className="font-bold text-amber-700 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-300">
                            {cId.replace('CH_', 'C')}:
                          </span>
                          <span className="truncate max-w-[200px]">{ch?.name || cId}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-[11px] font-sans text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2 rounded-lg flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {isEn
                        ? 'Zero acute AI vulnerabilities in this execution tier (100% deterministic reproducibility).'
                        : 'Keine akuten KI-Risiken für diese Stufe (100% deterministische Reproduzierbarkeit).'}
                    </span>
                  </div>
                )}
              </div>

              {/* Gelöste Risiken durch diesen Archetyp */}
              {profile.solvedChallenges.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center space-x-1">
                    <span>✨</span>
                    <span>{isEn ? 'Risks Mitigated / Solved by this Tier:' : 'Durch diese Stufe eliminierte / mitigierte Risiken:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.solvedChallenges.map((cId) => {
                      const ch = allChallenges[cId];
                      return (
                        <button
                          key={cId}
                          type="button"
                          onClick={() => openChallengeDrawer(cId)}
                          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[10.5px] font-mono text-emerald-900 dark:text-emerald-200 transition shadow-sm active:scale-95 group"
                          title={ch?.description || cId}
                        >
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            ✓ {cId.replace('CH_', 'C')}:
                          </span>
                          <span className="truncate max-w-[200px]">{ch?.name || cId}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  })()}

      {/* LAYER 5: SAP ARCHITECTURE & TOOLS (Zusätzliche Architektur-Details) */}
      {activeWorkflowLayer === 'architecture' && (
        <div className="bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-900/60 rounded-xl transition-all shadow-md overflow-hidden">
          <div
            onClick={() => setIsArchOpen(!isArchOpen)}
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/70 transition select-none flex-wrap gap-2"
          >
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-bold text-xs font-mono">
              <span className="w-4 h-4 rounded flex items-center justify-center bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800 shrink-0">
                {isArchOpen ? '−' : '+'}
              </span>
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>
                {language === 'en'
                  ? `Additional SAP Architecture for: ${step.name}`
                  : `Zusatz: SAP Architecture & Tools für ${step.name}`}
              </span>
            </div>

            {!isArchOpen ? (
              <div className="flex items-center space-x-2 font-mono text-[10.5px]">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-semibold">
                  {goldenPathGraph}
                </span>
                <span className="text-slate-500 hidden sm:inline">
                  {goldenPathTool}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-semibold">
                  {goldenPathGraph}
                </span>
              </div>
            )}
          </div>

          {isArchOpen && (
            <div className="p-3 pt-0 space-y-2.5 border-t border-slate-200 dark:border-slate-800 mt-0.5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono pt-2.5">
                {/* 1. SAP Tool */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    {isEn ? 'SAP Standard Tool' : 'SAP Standard-Tool'}
                  </span>
                  <div
                    className="text-purple-700 dark:text-purple-300 font-bold text-sm mt-0.5 truncate"
                    title={goldenPathTool}
                  >
                    {goldenPathTool}
                  </div>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    {isEn ? 'Reference architecture RA0034' : 'Referenzarchitektur RA0034'}
                  </span>
                </div>

                {/* 2. Benötigte Lizenz */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    {isEn ? 'Required License' : 'Benötigte Lizenz'}
                  </span>
                  <div
                    className="text-slate-900 dark:text-white font-bold text-sm mt-0.5 truncate"
                    title={step.requiredLicense}
                  >
                    {step.requiredLicense || 'SAP S/4HANA Cloud'}
                  </div>
                  <span className="text-[9.5px] text-slate-500 block truncate">
                    SAP Discovery Center SKU
                  </span>
                </div>

                {/* 3. Golden Path Check */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center">
                    Golden Path Status
                    <InfoTip term="goldenPath" />
                  </span>
                  <div
                    className={`font-bold text-sm mt-0.5 truncate ${
                      isGoldenPathCompliant ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-300'
                    }`}
                  >
                    {isGoldenPathCompliant
                      ? (isEn ? '✓ 100% Compliant' : '✓ 100% Konform')
                      : `⚠️ ${isEn ? 'Target' : 'Soll'}: ${goldenPathAssessment.recommendedArchetype}`}
                  </div>
                  <span
                    className="text-[9.5px] text-slate-600 dark:text-slate-400 block truncate font-sans"
                    title={
                      isGoldenPathCompliant
                        ? goldenPathAssessment.qualityBenefit
                        : goldenPathAssessment.deviationTradeOff?.purchasedBenefit
                    }
                  >
                    {isGoldenPathCompliant
                      ? goldenPathAssessment.qualityBenefit
                      : goldenPathAssessment.deviationTradeOff?.purchasedBenefit}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
