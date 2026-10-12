'use client';

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getStepKnowledge, StepKnowledgeItem } from '@/data/stepKnowledgeBase';
import { getZwingmannTiers } from '@/data/zwingmann';
import { AutomationArchetype } from '@/types/process';
import {
  X,
  GraduationCap,
  Layers,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Building,
  Database,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Clock,
  Coins,
  Compass,
  Scale,
  Eye,
  FileText,
  ShieldAlert,
} from 'lucide-react';

export const StepKnowledgeModal: React.FC = () => {
  const {
    activeStepKnowledgeId,
    closeStepKnowledge,
    steps,
    language,
    updateStepArchetype,
    openChallengeDrawer,
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'sap' | 'challenges' | 'archetypes' | 'student'>('overview');
  const [selectedArchetypeTab, setSelectedArchetypeTab] = useState<AutomationArchetype>('deterministic');

  const zwingmannTiers = getZwingmannTiers(language);

  // Find the active step
  const step = steps.find((s) => s.id === activeStepKnowledgeId);

  useEffect(() => {
    if (step) {
      setSelectedArchetypeTab(step.currentArchetype);
    }
  }, [step]);

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStepKnowledge();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeStepKnowledge]);

  if (!activeStepKnowledgeId || !step) return null;

  const knowledge: StepKnowledgeItem = getStepKnowledge(step, language);
  const isEn = language === 'en';

  const oodaIcons = {
    Observe: <Eye className="w-4 h-4 text-cyan-400" />,
    Orient: <Compass className="w-4 h-4 text-purple-400" />,
    Decide: <Scale className="w-4 h-4 text-amber-400" />,
    Act: <Zap className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-sky-500/20 text-slate-800 dark:text-slate-100">
        
        {/* ========================================================================= */}
        {/* 1. MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/40 text-sky-600 dark:text-sky-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800 font-bold">
                  {knowledge.scopeCode} &bull; {step.oodaPhase} Phase
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {step.primitive}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Blast Radius {step.reversibility}/5
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate mt-0.5">
                {step.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeStepKnowledge}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition shrink-0"
            title={isEn ? 'Close (Esc)' : 'Schließen (Esc)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. TAB LEISTE */}
        {/* ========================================================================= */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 px-5 gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. {isEn ? 'Overview & Classification' : 'Übersicht & Klassifikation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('sap')}
            className={`py-3 px-3.5 border-b-2 font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'sap'
                ? 'border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>2. {isEn ? 'SAP Practices & Methods' : 'SAP Standardverfahren & Prüfpunkte'}</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 px-3.5 border-b-2 font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>3. {isEn ? '13-Challenges Audit Radar' : '13-Challenges Audit-Radar'}</span>
          </button>

          <button
            onClick={() => setActiveTab('archetypes')}
            className={`py-3 px-3.5 border-b-2 font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'archetypes'
                ? 'border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. {isEn ? 'The 5 Model Archetypes' : 'Die 5 Modell-Archetypen im Vergleich'}</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`py-3 px-3.5 border-b-2 font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'student'
                ? 'border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>5. {isEn ? 'Student & Exam Guide' : 'Studenten-Leitfaden & Prüfungsfallen'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. INHALTSBEREICH (SCROLLABLE) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm">
          
          {/* TAB 1: ÜBERSICHT & KLASSIFIKATION */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Kernaufgabe & Ziel */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold tracking-wider block">
                  {isEn ? 'Core Objective & Role in Process' : 'Kernaufgabe & Fachliches Ziel im Prozess'}
                </span>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
                  {knowledge.roleAndObjective}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  {knowledge.detailedProcessDescription}
                </p>
              </div>

              {/* 4 Klassifikations-Kacheln */}
              <div>
                <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider mb-3">
                  {isEn ? 'Architectural Classification' : 'Architektur-Klassifikation & Kybernetik'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  
                  {/* OODA Phase */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      {oodaIcons[step.oodaPhase]}
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        OODA-Phase: {step.oodaPhase}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {knowledge.classification.oodaExplanation}
                    </p>
                  </div>

                  {/* Kognitives Primitiv */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Primitiv: {step.primitive}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {knowledge.classification.primitiveExplanation}
                    </p>
                  </div>

                  {/* Clean Core Index */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Clean Core: {step.cleanCoreIndex}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {knowledge.classification.cleanCoreExplanation}
                    </p>
                  </div>

                  {/* Blast Radius & Reversibilität */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Reversibilität: {step.reversibility}/5 (Schadenspotenzial ca. {step.damageAmountEur} €)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {knowledge.classification.blastRadiusExplanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAP-PRAXIS, STANDARDVERFAHREN & PRÜFPUNKTE */}
          {activeTab === 'sap' && (
            <div className="space-y-6 animate-fade-in">
              {/* 1. SAP STANDARDVERFAHREN, SPERR- & PRÜFLOGIK */}
              {knowledge.sapStandardPractices && knowledge.sapStandardPractices.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <h3 className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold tracking-wider">
                        {isEn ? 'SAP Standard Practices, Locks & Commit Logic' : 'SAP Standardverfahren, Sperr-, Idempotenz- & Prüflogik'}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {knowledge.sapStandardPractices.length} {isEn ? 'SAP Core Checks' : 'Kernverfahren'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {knowledge.sapStandardPractices.map((practice, idx) => {
                      const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
                        CONCURRENCY_LOCKS: { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-700/50' },
                        IDEMPOTENCY: { bg: 'bg-cyan-100 dark:bg-cyan-950/40', text: 'text-cyan-800 dark:text-cyan-400', border: 'border-cyan-300 dark:border-cyan-700/50' },
                        VALIDATION: { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-800 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-700/50' },
                        ACID_TRANSACTION: { bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-800 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-700/50' },
                        AUDIT_GOBD: { bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-800 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-700/50' },
                        MASTER_DATA: { bg: 'bg-indigo-100 dark:bg-indigo-950/40', text: 'text-indigo-800 dark:text-indigo-400', border: 'border-indigo-300 dark:border-indigo-700/50' },
                        BUSINESS_LOGIC: { bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-800 dark:text-rose-400', border: 'border-rose-300 dark:border-rose-700/50' },
                        COMMUNICATION: { bg: 'bg-teal-100 dark:bg-teal-950/40', text: 'text-teal-800 dark:text-teal-400', border: 'border-teal-300 dark:border-teal-700/50' },
                      };
                      const catStyle = categoryColors[practice.category] || categoryColors.VALIDATION;

                      return (
                        <div
                          key={idx}
                          className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                                {practice.category.replace('_', ' ')}
                              </span>
                              <strong className="text-slate-900 dark:text-white text-xs font-semibold">
                                {practice.title}
                              </strong>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {practice.sapObjectsOrTables.map((obj, oIdx) => (
                                <span
                                  key={oIdx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 font-semibold"
                                >
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
                            {practice.technicalDetails}
                          </p>

                          <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 rounded-lg p-2.5 flex items-start space-x-2 text-xs text-sky-800 dark:text-sky-200">
                            <span className="font-bold text-sky-600 dark:text-sky-400 shrink-0">💡 Empfehlung:</span>
                            <span className="leading-snug text-slate-700 dark:text-slate-300">{practice.recommendation}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. REALE AUSPRÄGUNGEN & KANÄLE */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold tracking-wider">
                    {isEn ? 'Real-World Process Manifestations' : 'Was kann dieser Schritt in der Unternehmenspraxis sein?'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {knowledge.realWorldManifestations.length} {isEn ? 'Channels / Variants' : 'Ausprägungsformen'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {knowledge.realWorldManifestations.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-[10px] font-mono font-bold">
                            {idx + 1}
                          </span>
                          <strong className="text-slate-900 dark:text-white text-xs font-semibold">
                            {item.channelOrSource}
                          </strong>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 pl-7 leading-relaxed">
                          {item.exampleDescription}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-300 shrink-0 self-start sm:self-center">
                        {item.practicalFrequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. DIE FACHLICHE ENTSCHEIDUNG */}
              {knowledge.businessDecision && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300 font-bold tracking-wider">
                      {isEn ? 'The Business Decision (What is evaluated?)' : 'Die fachliche Entscheidung (Was muss geprüft & entschieden werden?)'}
                    </h3>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200 font-medium">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                        {isEn ? 'Core Business Question:' : 'Zentrale kaufmännische Kernfrage:'}
                      </span>
                      {knowledge.businessDecision.coreQuestion}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase block">
                        {isEn ? 'Decision Criteria:' : 'Wesentliche Prüfkriterien:'}
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {knowledge.businessDecision.decisionCriteria.map((crit, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-2.5 space-y-1">
                        <span className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase block flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isEn ? 'Happy Path (STP)' : 'Gutfall (Dunkelverarbeitung)'}</span>
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                          {knowledge.businessDecision.happyPath}
                        </p>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg p-2.5 space-y-1">
                        <span className="text-[10.5px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase block flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isEn ? 'Exception Handling' : 'Klärung / Ausnahmepfad'}</span>
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                          {knowledge.businessDecision.exceptionPath}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. STORYTELLING & BERATER-KOMPASS */}
              {knowledge.storytellingAndAdvisory && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300 font-bold tracking-wider">
                      {isEn ? 'Storytelling & Advisory Compass (Pitching to Leadership)' : 'Storytelling & Berater-Kompass (Wie erkläre ich das dem Kunden?)'}
                    </h3>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3.5">
                    {/* Elevator Pitch */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-mono text-purple-700 dark:text-purple-400 font-bold uppercase block">
                        {isEn ? '30-Second Elevator Pitch for Management:' : 'Der 30-Sekunden-Elevator-Pitch fürs Management:'}
                      </span>
                      <blockquote className="bg-purple-50 dark:bg-purple-950/20 border-l-2 border-purple-500 pl-3.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
                        „{knowledge.storytellingAndAdvisory.elevatorPitch}“
                      </blockquote>
                    </div>

                    {/* Denkfehler & Antwort */}
                    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10.5px] font-mono uppercase text-rose-600 dark:text-rose-400 font-bold block">
                            {isEn ? 'Typical Management Misconception:' : 'Typischer Denkfehler von Führungskräften:'}
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                            {knowledge.storytellingAndAdvisory.managementMisconception.misconception}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10.5px] font-mono uppercase text-sky-600 dark:text-sky-400 font-bold block">
                            {isEn ? 'Your Answer as a Consultant:' : 'Deine Antwort als Berater:'}
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                            {knowledge.storytellingAndAdvisory.managementMisconception.consultantAnswer}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Goldene Regel */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-500/30 rounded-lg p-3 flex items-center space-x-3">
                      <span className="text-lg shrink-0">🌟</span>
                      <p className="text-xs text-amber-800 dark:text-amber-200 font-semibold leading-relaxed">
                        {knowledge.storytellingAndAdvisory.goldenRule}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 13-CHALLENGES AUDIT-RADAR */}
          {activeTab === 'challenges' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  <h3 className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400 font-bold tracking-wider">
                    {isEn ? '13-Challenges Governance & Risk Assessment' : '13-Challenges Governance- & Risikoanalyse'}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Automating this process step touches critical architecture and compliance boundaries. Below are the verified challenges and threat scenarios specifically mapped to this step.'
                    : 'Die Automatisierung dieses Prozess-Schritts berührt kritische Architektur-, Haftungs- und Compliance-Grenzen. Die folgenden der 13 Enterprise-Challenges sind für diesen Schritt besonders brisant:'}
                </p>
              </div>

              {knowledge.relevantChallenges && knowledge.relevantChallenges.length > 0 ? (
                <div className="space-y-3.5">
                  {knowledge.relevantChallenges.map((ch, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700/50 rounded-xl p-4 space-y-3 transition"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-600/50 text-amber-800 dark:text-amber-300 font-bold">
                            {ch.challengeId}
                          </span>
                          <strong className="text-sm font-semibold text-slate-900 dark:text-white">
                            {ch.riskTitle}
                          </strong>
                        </div>

                        <button
                          onClick={() => openChallengeDrawer(ch.challengeId)}
                          className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 dark:hover:bg-sky-900/80 border border-sky-300 dark:border-sky-600/40 text-sky-800 dark:text-sky-300 transition flex items-center space-x-1.5 font-medium group"
                        >
                          <span>{isEn ? 'Inspect in Audit Radar' : 'Im 13-Challenges Radar prüfen'}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                      {/* Threat scenario */}
                      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-lg p-3 space-y-1">
                        <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-400 font-bold text-[11px] font-mono uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Threat & Failure Scenario' : 'Konkrete Bedrohung in diesem Schritt'}</span>
                        </div>
                        <p className="text-xs text-rose-900 dark:text-rose-200/90 leading-relaxed">
                          {ch.threatInStep}
                        </p>
                      </div>

                      {/* Mitigation & Control */}
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-3 space-y-1">
                        <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] font-mono uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Required Control & Mitigation' : 'Erforderliche Architektur-Kontrolle & Gegenmaßnahme'}</span>
                        </div>
                        <p className="text-xs text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
                          {ch.mitigationInStep}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center text-xs text-slate-500 dark:text-slate-400">
                  {isEn
                    ? 'No specific critical challenges flagged for this step. Standard Clean Core guidelines apply.'
                    : 'Keine spezifischen Sonder-Herausforderungen für diesen Schritt hinterlegt. Es gelten Standard Clean Core Richtlinien.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIE 5 MODELL-ARCHETYPEN IM VERGLEICH */}
          {activeTab === 'archetypes' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold tracking-wider">
                    {isEn ? 'Compare the 5 Automation Archetypes for this Step' : 'Auswirkungen je nach gewähltem Automatisierungs-Typ'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isEn
                      ? 'Wähle einen Archetyp, um zu sehen, wie er sich auf Durchsatz, Kosten und Risiken auswirkt.'
                      : 'Wähle einen Archetyp, um zu sehen, wie er sich auf Durchsatz, Kosten, Dunkelverarbeitung und Risiken auswirkt.'}
                  </p>
                </div>
              </div>

              {/* Archetypen Wähler mit Dual-Taxonomie */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['deterministic', 'classic_ml', 'copilot', 'autopilot', 'agentic'] as AutomationArchetype[]).map((arch) => {
                  const impact = knowledge.archetypeImpacts[arch];
                  if (!impact) return null;
                  const tier = zwingmannTiers[arch];
                  const isCurrent = step.currentArchetype === arch;
                  const isTabSelected = selectedArchetypeTab === arch;

                  return (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => setSelectedArchetypeTab(arch)}
                      className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                        isTabSelected
                          ? 'bg-sky-100 dark:bg-sky-950/70 border-sky-500 dark:border-sky-400 ring-1 ring-sky-500/50'
                          : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute top-1.5 right-1.5 text-[8.5px] px-1 py-0.2 rounded bg-sky-500 text-slate-950 font-bold font-mono">
                          AKTIV
                        </span>
                      )}
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{tier?.name || arch}</div>
                        <div className="text-[9px] text-sky-600 dark:text-sky-400 font-mono font-medium truncate mt-0.5">
                          {tier?.sapShortLabel || tier?.shortDesc}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                        {impact.darkProcessingRate}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailliertes Profil des gewählten Archetyps */}
              {knowledge.archetypeImpacts[selectedArchetypeTab] && (() => {
                const item = knowledge.archetypeImpacts[selectedArchetypeTab];
                const activeTier = zwingmannTiers[selectedArchetypeTab];

                return (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                            {item.label}
                          </h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                              item.recommendationRating === 'OPTIMAL' || item.recommendationRating === 'DETERMINISTIC_SAFE'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                : item.recommendationRating === 'ACCEPTABLE'
                                ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                                : item.recommendationRating === 'RISKY'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {item.recommendationRating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 flex-wrap">
                          <span className="text-sky-600 dark:text-sky-400 font-semibold">{activeTier?.zwingmannLevel}:</span>
                          <span className="text-slate-700 dark:text-slate-300">{activeTier?.zwingmannConcept}</span>
                        </div>
                      </div>

                      {step.currentArchetype !== selectedArchetypeTab && (
                        <button
                          type="button"
                          onClick={() => updateStepArchetype(step.id, selectedArchetypeTab)}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition active:scale-95 flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Diesen Archetyp für den Schritt aktivieren</span>
                        </button>
                      )}
                    </div>

                    {/* SAP Äquivalent Box */}
                    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs">
                      <div className="text-[10px] font-mono uppercase text-sky-600 dark:text-sky-400 font-bold flex items-center space-x-1.5 mb-0.5">
                        <Building className="w-3 h-3" />
                        <span>Offizielles SAP-Architektur & Produkt-Pendant:</span>
                      </div>
                      <div className="text-slate-900 dark:text-white font-mono font-medium">
                        {activeTier?.sapEquivalent}
                      </div>
                    </div>

                    {/* Terminologie-Hinweis bei Zwingmann Assistant vs. SAP Joule Assistant */}
                    {activeTier?.terminologyAlert && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3 text-xs space-y-1">
                        <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                          <span>{activeTier.terminologyAlert.title}</span>
                        </div>
                        <p className="text-amber-900 dark:text-amber-200/90 text-[11px] leading-relaxed">
                          {activeTier.terminologyAlert.description}
                        </p>
                      </div>
                    )}

                    {/* Technische Funktionsweise */}
                    <div className="text-xs space-y-1">
                      <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block">
                        Technische Funktionsweise:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        {item.technicalMechanism}
                      </p>
                    </div>

                    {/* 4 Kennzahlen im Vergleich */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono block">Dunkelverarbeitung</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">{item.darkProcessingRate}</strong>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono block">Human Involvement</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono truncate block" title={item.humanInvolvement}>
                          {item.humanInvolvement}
                        </strong>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono block">Token-Verbrauch</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">{item.tokenConsumption}</strong>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono block">Kostenprofil</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono truncate block" title={item.costProfile}>
                          {item.costProfile}
                        </strong>
                      </div>
                    </div>

                    {/* Vor- und Nachteile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 space-y-1.5">
                        <span className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Vorteile (Pros)</span>
                        </span>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                          {item.pros.map((p, idx) => (
                            <li key={idx} className="leading-snug">{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg p-3 space-y-1.5">
                        <span className="text-[10.5px] font-mono text-rose-700 dark:text-rose-400 font-bold uppercase flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Nachteile & Risiken (Cons)</span>
                        </span>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                          {item.cons.map((c, idx) => (
                            <li key={idx} className="leading-snug">{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: STUDENTEN-LEITFADEN & PRÜFUNGSWISSEN */}
          {activeTab === 'student' && (
            <div className="space-y-5 animate-fade-in">
              {/* Die Goldene Regel */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-400 p-4 rounded-r-xl space-y-1">
                <span className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400 font-bold tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Die goldene Architektur-Regel für diesen Schritt</span>
                </span>
                <p className="text-slate-900 dark:text-white text-sm font-semibold leading-relaxed">
                  „{knowledge.studentGuide.goldenRule}“
                </p>
              </div>

              {/* Typische Prüfungsfrage */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold tracking-wider flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Typische Prüfungs- & Praxisfrage</span>
                </span>
                <div className="font-semibold text-slate-900 dark:text-white text-xs">
                  {knowledge.studentGuide.examQuestionAndAnswer.question}
                </div>
                <div className="bg-white dark:bg-slate-900/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-sky-700 dark:text-sky-300 block mb-1">Musterantwort für die Prüfung:</strong>
                  {knowledge.studentGuide.examQuestionAndAnswer.answer}
                </div>
              </div>

              {/* Häufige Denkfehler & Fallen */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono uppercase text-rose-600 dark:text-rose-400 font-bold tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Häufige Denkfehler & Projekt-Fallen</span>
                </span>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  {knowledge.studentGuide.commonPitfalls.map((pit, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200">Falle {idx + 1}:</strong> {pit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Terminologie-Kompass: Zwingmann vs. SAP Joule */}
              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono uppercase text-indigo-700 dark:text-indigo-300 font-bold tracking-wider flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {isEn
                      ? 'Terminology Compass: Zwingmann Autonomy vs. SAP Joule Marketing'
                      : 'Terminologie-Kompass: Zwingmann-Autonomie vs. SAP Joule Begrifflichkeiten'}
                  </span>
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn ? (
                    <>
                      <strong>Why is an &quot;Assistant&quot; Tier 2 in Zwingmann, but a multi-agent supervisor in SAP?</strong>
                      <br />
                      Zwingmann classifies algorithms by <em>cybernetic autonomy</em>: Tier 2 (Task-Assistant) is a stateless, single-turn call (prompt in ➔ text/JSON out, no dialogue, no tools). SAP, conversely, uses &quot;Joule Digital Assistant&quot; as a <em>UX persona / enterprise orchestrator</em> at the very top of Fiori, coordinating domain agents across S/4HANA and BTP. That SAP supervisor role corresponds to <strong>Zwingmann Tier 5 (Agentic Multi-Agent)</strong>.
                    </>
                  ) : (
                    <>
                      <strong>Warum ist ein „Assistant“ bei Zwingmann Stufe 2, bei SAP aber der Dirigent mehrerer Agenten?</strong>
                      <br />
                      Zwingmann teilt nach <em>kognitiver Autonomie</em> ein: Stufe 2 (Task-Assistant) ist ein isolierter, zustandsloser Single-Turn-Aufruf (z. B. Belegdaten extrahieren oder übersetzen – ohne Dialog und ohne Tools). SAP hingegen verwendet den Begriff „Joule Digital Assistant“ als <em>übergeordnete Persona / Dirigenten</em> im Fiori Launchpad, der Aufgaben an spezialisierte Fachagenten (Dispute, Sales, Maintenance) verteilt. Diese SAP-Rolle entspricht exakt <strong>Zwingmann Stufe 5 (Agentic Multi-Agent)</strong>.
                    </>
                  )}
                </p>
              </div>

              {/* Governance Takeaway */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-emerald-700 dark:text-emerald-300 block">Governance & Compliance Merkposten:</strong>
                  {knowledge.studentGuide.governanceTakeaway}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL FOOTER */}
        {/* ========================================================================= */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Schritt {steps.findIndex((s) => s.id === step.id) + 1} von {steps.length}</span>
            <span>&bull;</span>
            <span className="text-sky-600 dark:text-sky-400">{step.name}</span>
          </div>
          <button
            type="button"
            onClick={closeStepKnowledge}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition"
          >
            {isEn ? 'Close' : 'Schließen'}
          </button>
        </div>

      </div>
    </div>
  );
};
