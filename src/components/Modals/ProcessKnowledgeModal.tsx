'use client';

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getProcessKnowledge } from '@/data/processKnowledgeBase';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  X,
  BookOpen,
  Building2,
  Cpu,
  GraduationCap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  Lightbulb,
  CheckCircle2,
  Workflow,
  HelpCircle,
} from 'lucide-react';

export const ProcessKnowledgeModal: React.FC = () => {
  const {
    isProcessKnowledgeOpen,
    closeProcessKnowledge,
    currentTemplate,
    language,
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'sap' | 'cleancore' | 'student'>('overview');

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProcessKnowledge();
      }
    };
    if (isProcessKnowledgeOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessKnowledgeOpen, closeProcessKnowledge]);

  if (!isProcessKnowledgeOpen) return null;

  const t = TRANSLATIONS[language];
  const knowledge = getProcessKnowledge(currentTemplate, language);
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-sky-500/20 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 border border-sky-400/40 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                  {knowledge.scopeCode}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {knowledge.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {knowledge.businessArea} • {t.processModalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={closeProcessKnowledge}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition shrink-0 ml-2"
            title={t.processClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/70 px-6 gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.processTabOverview}</span>
          </button>

          <button
            onClick={() => setActiveTab('sap')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'sap'
                ? 'bg-white dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.processTabSap}</span>
          </button>

          <button
            onClick={() => setActiveTab('cleancore')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'cleancore'
                ? 'bg-white dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.processTabCleanCore}</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'student'
                ? 'bg-white dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t.processTabStudent}</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300 select-text">
          
          {/* TAB 1: ALLGEMEINES PROZESSVERSTÄNDNIS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Kernsatz */}
              <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl p-4 text-sky-900 dark:text-sky-200 leading-relaxed font-medium">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Core Objective & Process Mission:' : 'Kernaussage & Prozessziel:'}
                </span>
                {knowledge.headlineSummary}
              </div>

              {/* Ausführliche, allgemeinsprachliche Erklärung */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{isEn ? 'Plain-Language Business Description' : 'Allgemeinsprachliche Beschreibung (Lebensnah)'}</span>
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                  {knowledge.plainDescription}
                </div>
              </div>

              {/* Praxis-Szenario / Anschauungsbeispiel */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>{isEn ? 'Real-World Business Example' : 'Praxisnahes Anschauungsbeispiel'}</span>
                </h3>
                <div className="bg-amber-50/60 dark:bg-gradient-to-r dark:from-amber-950/30 dark:via-slate-950/70 dark:to-slate-950/70 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                  {knowledge.realWorldScenario}
                </div>
              </div>

              {/* OODA-Aufbau im Simulator */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/50">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 flex items-center space-x-1.5">
                  <Workflow className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{isEn ? 'Process Structure in the Simulator:' : 'Abbildung im Prozess-Simulator:'}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? `This scenario decomposes into ${currentTemplate.steps.length} cognitive steps across the 4 OODA phases (Observe, Orient, Decide, Act). You can adjust each step individually between deterministic rules, classical ML, copilot, and autonomous agent.`
                    : `Dieses Szenario ist im Simulator in ${currentTemplate.steps.length} kognitive Schritte über die 4 OODA-Phasen (Observe, Orient, Decide, Act) unterteilt. Jeder Schritt kann separat von deterministischer Regel bis zum autonomen Agenten konfiguriert werden.`}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BEDEUTUNG FÜR SAP & S/4HANA */}
          {activeTab === 'sap' && (
            <div className="space-y-6 animate-fade-in">
              {/* Rolle im ERP-Ökosystem */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{isEn ? 'Significance & Role in the SAP Ecosystem' : 'Bedeutung & Rolle im SAP-Ökosystem'}</span>
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                  {knowledge.sapSignificance.roleInErpEcosystem}
                </div>
              </div>

              {/* Beteiligte Module */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  {isEn ? 'Core SAP Modules & Cloud Services:' : 'Beteiligte SAP-Kernmodule & Cloud-Services:'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {knowledge.sapSignificance.coreModules.map((mod, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60 font-mono text-xs font-semibold shadow-sm"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Standard-Belegkette & Belegfluss */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{t.processDocumentFlowTitle}</span>
                </h3>
                <div className="space-y-2.5">
                  {knowledge.sapSignificance.documentFlow.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-sm">
                        {doc.icon || '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {doc.stepNumber}. {doc.documentName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700">
                            {doc.sapObjectType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wichtige Fiori Apps & Transaktionen */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  {t.processTransactionsTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {knowledge.sapSignificance.keyTransactionsAndApps.map((app, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 rounded-xl space-y-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-800 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800/50">
                          {app.codeOrApp}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate ml-2">
                          {app.title}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                        {app.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KI & CLEAN CORE */}
          {activeTab === 'cleancore' && (
            <div className="space-y-6 animate-fade-in">
              {/* Clean Core Richtlinien & Standard-APIs */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.processCleanCoreTitle}</span>
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 space-y-3 shadow-sm">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold block mb-1">
                      {isEn ? 'Official Clean Core API:' : 'Offizielle Standard-Schnittstelle (A2X / BAdI):'}
                    </span>
                    <span className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 block">
                      {knowledge.sapSignificance.cleanCoreAndIntegration.standardApi}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      {isEn ? 'Extension Guideline (Side-by-Side vs. In-App):' : 'Erweiterungs-Leitfaden (Clean Core Prinzip):'}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {knowledge.sapSignificance.cleanCoreAndIntegration.extensionGuideline}
                    </p>
                  </div>
                </div>
              </div>

              {/* KI-Potenzial & SAP AI Core */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{t.processAiTitle}</span>
                </h3>
                <div className="bg-sky-50/60 dark:bg-gradient-to-r dark:from-sky-950/30 dark:via-slate-950/70 dark:to-slate-950/70 border border-sky-200 dark:border-sky-800/50 rounded-xl p-4 text-slate-800 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-2 shadow-sm">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {isEn ? 'Where AI creates the highest business leverage:' : 'Wo KI den höchsten betrieblichen Hebel hat:'}
                  </div>
                  <p>{knowledge.sapSignificance.cleanCoreAndIntegration.aiCoreUseCase}</p>
                </div>
              </div>

              {/* Warum Clean Core für KI entscheidend ist */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/40 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {isEn ? 'Why Clean Core is essential for Autonomous Agents:' : 'Warum Clean Core für autonome KI-Agenten unverzichtbar ist:'}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'AI agents can only interact reliably with ERP systems when business objects are exposed via strictly typed, idempotent OData APIs. Legacy table modifications bypass audit logs, trigger validation errors, and block seamless cloud upgrades.'
                    : 'KI-Agenten können nur dann verlässlich mit ERP-Systemen interagieren, wenn Belege über strikt typisierte, idempotente OData-APIs angesprochen werden. Legacy-Direktänderungen an Kerntabellen umgehen Audit-Logs, verursachen Validierungsfehler und verhindern automatische Cloud-Upgrades.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENTEN-LEITFADEN & PRÜFUNGSRELEVANZ */}
          {activeTab === 'student' && (
            <div className="space-y-6 animate-fade-in">
              {/* Kernaussage / Merksatz */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/60 rounded-xl p-4 space-y-1.5 shadow-sm">
                <span className="text-xs font-mono text-amber-800 dark:text-amber-400 uppercase font-bold flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{isEn ? 'Essential Conceptual Takeaway:' : 'Didaktischer Merksatz für Studierende:'}</span>
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {knowledge.studentTakeaways.keyConcept}
                </p>
              </div>

              {/* Prozessabgrenzung */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{isEn ? 'Crucial Process Distinction (How to not confuse processes):' : 'Wichtige Prozessabgrenzung (Verwechslungsgefahr):'}</span>
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed shadow-sm">
                  {knowledge.studentTakeaways.processDistinction}
                </div>
              </div>

              {/* Prüfungsrelevanz & Typische Fragen */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{isEn ? 'Typical Exam Questions in Information Systems / Business:' : 'Typische Klausur- & Prüfungsfragen (Wirtschaftsinformatik / BWL):'}</span>
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-amber-900 dark:text-amber-200/90 text-xs sm:text-sm leading-relaxed font-mono shadow-sm">
                  {knowledge.studentTakeaways.examRelevance}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>
              {isEn ? 'Scope Item' : 'Standard Scope Item'} {knowledge.scopeCode} • {knowledge.name}
            </span>
          </div>

          <button
            onClick={closeProcessKnowledge}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold transition active:scale-95 border border-slate-300 dark:border-slate-700"
          >
            {t.processClose}
          </button>
        </div>

      </div>
    </div>
  );
};
