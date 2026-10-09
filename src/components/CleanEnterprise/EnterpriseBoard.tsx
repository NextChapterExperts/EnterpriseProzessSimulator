'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getProcessTemplates } from '@/data/templates';
import { findProcessAssistant } from '@/lib/sapAiCatalogMatcher';
import {
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Cpu,
  ShieldCheck,
  TrendingDown,
  ExternalLink,
  RefreshCw,
  Zap,
  HelpCircle,
  ChevronDown,
  Workflow,
  MessageSquare,
  Users,
} from 'lucide-react';
import { ProcessStep, SapAgentMatchResult, ProcessDomainCategory } from '@/types/process';

export const EnterpriseBoard: React.FC = () => {
  const {
    steps,
    currentTemplate,
    selectTemplate,
    applyGeneratedProcess,
    selectedStepId,
    setSelectedStepId,
    runParetoOptimization,
    lastParetoResult,
    config,
    language,
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState<'agents' | 'assistant'>('agents');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiClarification, setAiClarification] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const allTemplates = useMemo(() => getProcessTemplates(language), [language]);

  // Gruppierung der 20 Prozesse nach Fachdomäne
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, { label: string; icon: string; items: typeof allTemplates }> = {
      O2C: { label: 'Order-to-Cash (Vertrieb & Faktura)', icon: '🛒', items: [] },
      P2P: { label: 'Procure-to-Pay (Einkauf & Kreditoren)', icon: '📦', items: [] },
      R2R: { label: 'Record-to-Report (Finance & Treasury)', icon: '📊', items: [] },
      SCM: { label: 'Plan-to-Product & Logistics (SCM & EWM)', icon: '🏭', items: [] },
      ASSET_SERVICE: { label: 'Asset, Service & Maintenance (EAM & IoT)', icon: '🔧', items: [] },
    };

    allTemplates.forEach((t) => {
      const cat = t.domainCategory || 'O2C';
      if (groups[cat]) {
        groups[cat].items.push(t);
      } else {
        groups.O2C.items.push(t);
      }
    });

    return groups;
  }, [allTemplates]);

  // Speech Recognition Init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = language === 'en' ? 'en-US' : 'de-DE';

        recog.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          if (text) {
            setInputText(text);
            handleSendAiPrompt(text);
          }
          setIsRecording(false);
        };

        recog.onerror = () => setIsRecording(false);
        recog.onend = () => setIsRecording(false);
        recognitionRef.current = recog;
      }
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSendAiPrompt = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);
    setAiClarification(null);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });

      if (!res.ok) throw new Error(`Fehler (${res.status})`);
      const data = await res.json();

      if (data.status === 'clarifying') {
        setAiClarification(data.aiResponseText);
      } else if (data.status === 'ready' && Array.isArray(data.steps)) {
        applyGeneratedProcess(
          data.processTitle || 'Zielprozess',
          data.processScopeCode || 'BTP-AI',
          data.steps,
          data.monthlyVolume || 15000,
          data.executiveSummary
        );
      }
    } catch (err: any) {
      alert(`Fehler: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const activeStep = steps.find((s) => s.id === selectedStepId) || steps[0];
  const activeMatch = activeStep?.sapAgentMatch;
  const matchedAgent = activeMatch?.matchedAgent;
  const isFastPath = activeMatch?.recommendationType === 'DETERMINISTIC_FAST_PATH' || activeStep?.currentArchetype === 'deterministic';
  const processAssistant = useMemo(() => findProcessAssistant(currentTemplate, language), [currentTemplate, language]);

  // Aggregierte KPIs
  const totalSteps = steps.length;
  const deterministicSteps = steps.filter((s) => s.currentArchetype === 'deterministic').length;
  const stpRate = totalSteps > 0 ? Math.round((deterministicSteps / totalSteps) * 100) : 80;

  const totalAiu = steps.reduce(
    (acc, s) => acc + (s.sapAgentMatch?.matchedAgent?.monthlyAiuEstimated || 0),
    0
  );
  const totalEur = Math.round(totalAiu * 0.92);

  return (
    <div className="flex-1 flex flex-col h-screen w-screen bg-[#070c18] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Schlanker Header mit 20 SAP-Standardprozessen */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                Enterprise Process Simulator
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-semibold">
                Pareto &bull; SAP Discovery Center
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Top 20 SAP Best-Practice Prozesse &bull; Modulare Agenten vs. End-to-End Joule Assistent
            </p>
          </div>
        </div>

        {/* 20 Standard-SAP-Prozesse Dropdown & Pareto-Button */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-[11px] font-mono text-slate-400 mr-2 uppercase tracking-wide">
              SAP Prozess:
            </span>
            <select
              value={currentTemplate.id}
              onChange={(e) => selectTemplate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
            >
              {Object.entries(groupedTemplates).map(([catKey, group]) => (
                <optgroup key={catKey} label={`${group.icon} ${group.label}`} className="bg-slate-900 text-slate-300">
                  {group.items.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-950 text-white py-1">
                      [{t.scopeCode}] {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Pareto-Aktionsbutton */}
          <button
            onClick={() => runParetoOptimization()}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 shadow active:scale-95 ${
              lastParetoResult
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border-amber-600'
            }`}
            title="Berechnet die Pareto 80/20-Regel: Maximale Dunkelverarbeitung (STP) & minimaler Token-Verbrauch"
          >
            <Zap className={`w-3.5 h-3.5 ${lastParetoResult ? 'text-emerald-400 fill-emerald-400' : 'text-amber-200 fill-amber-200'}`} />
            <span>{lastParetoResult ? 'Pareto-Optimum aktiv' : 'Pareto optimieren (80/20)'}</span>
          </button>
        </div>
      </header>

      {/* 2. Dialog-Leiste: Spracheingabe & Freitext-Prompt */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex items-center space-x-3 shrink-0">
        <button
          onClick={toggleRecording}
          className={`p-2 rounded-xl border flex items-center justify-center transition active:scale-95 shadow ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-600 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title={isRecording ? 'Aufnahme stoppen' : 'Per Sprache sprechen'}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-sky-400" />}
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendAiPrompt();
            }}
            disabled={isLoading}
            placeholder={
              isRecording
                ? 'Ich höre zu... sprich deinen Prozess und klicke dann nochmals auf das Mikrofon'
                : 'Freitext oder Spracheingabe: Spezifischen Prozess per KI generieren oder anpassen...'
            }
            className="w-full px-3.5 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
          />
        </div>

        <button
          onClick={() => handleSendAiPrompt()}
          disabled={isLoading || !inputText.trim()}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'Modelliere...' : 'KI-Transfer'}</span>
        </button>
      </div>

      {/* Klärungs-Banner falls KI Rückfragen hat */}
      {aiClarification && (
        <div className="bg-sky-950/80 border-b border-sky-800 px-6 py-2 flex items-center justify-between text-xs text-sky-200 shrink-0">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold">Frage des Architekten:</span>
            <span>{aiClarification}</span>
          </div>
          <button
            onClick={() => setAiClarification(null)}
            className="text-[11px] text-sky-400 hover:underline font-mono"
          >
            Ausblenden
          </button>
        </div>
      )}

      {/* 3. Kompakte KPI-Leiste (Genau die 4 Kernmetriken) */}
      <div className="grid grid-cols-4 gap-3 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 shrink-0">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Dunkelverarbeitung (STP)</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">{stpRate} % Dunkelquote</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-sky-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Inferenz &amp; Tokens</div>
            <div className="text-sm font-bold text-sky-400 font-mono">
              {lastParetoResult ? '~850 Tokens / Beleg' : '~3.400 Tokens / Beleg'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <TrendingDown className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Pareto-Effizienz</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              {lastParetoResult ? `80/20 Optimum (${lastParetoResult.savingsPercentage}% Ersparnis)` : 'Standard Baseline'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <Coins className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">BTP Inferenz-Kosten</div>
            <div className="text-sm font-bold text-indigo-400 font-mono">
              {totalEur} € / Monat ({totalAiu.toFixed(1)} AIU)
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hauptarbeitsbereich: Split-Screen */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Linke Spalte (55%): Pareto-optimierte Prozesskette */}
        <section className="flex-[55] bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
                [{currentTemplate.scopeCode}] &bull; {currentTemplate.businessArea}
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                {currentTemplate.name}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-slate-400">
                {steps.length} OODA-Schritte
              </span>
            </div>
          </div>

          {/* Vertikale Schritt-Kette */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {steps.map((step, idx) => {
              const isSelected = step.id === activeStep.id;
              const isDeterministic = step.currentArchetype === 'deterministic';
              const isCopilot = step.currentArchetype === 'copilot';
              const match = step.sapAgentMatch;
              const isGap = match?.recommendationType === 'CUSTOM_GAP';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="h-6 w-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xs font-bold text-white">{step.name}</h3>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {step.oodaPhase}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {step.primitive} &bull; {step.sapReference}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      {isDeterministic && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-800 font-mono">
                          Clean Core STP
                        </span>
                      )}
                      {isCopilot && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-indigo-950/90 text-indigo-300 border border-indigo-800 font-mono">
                          Joule Copilot
                        </span>
                      )}
                      {!isDeterministic && !isCopilot && !isGap && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-sky-950/90 text-sky-300 border border-sky-800 font-mono">
                          Autonomer Agent
                        </span>
                      )}
                      {isGap && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800 font-mono">
                          Weißer Fleck
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rechte Spalte (45%): Dual-View Modulare Agenten vs End-to-End Joule Assistent */}
        <section className="flex-[45] bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'agents'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Modulare Agenten pro Step</span>
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'assistant'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>End-to-End Joule Assistent</span>
              </button>
            </div>

            <a
              href="https://discovery-center.cloud.sap/ai-catalog/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-sky-400 hover:text-sky-300 hover:underline flex items-center space-x-1"
            >
              <span>Katalog</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* TAB 1: MODULARE AGENTEN PRO STEP */}
          {activeTab === 'agents' && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="bg-slate-950 border border-sky-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                    Aktiver Schritt: {activeStep?.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Konfidenz-Gate: {activeStep?.confidenceGate}%
                  </span>
                </div>

                {/* Ist dieser Schritt Deterministisch (Clean Core Fast-Path)? */}
                {isFastPath ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/60 space-y-1.5">
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Clean Core Fast-Path (0 Tokens, 0 € BTP-Kosten)</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Dieser Schritt benötigt kein KI-Modell für Standardfälle. Er läuft zu{' '}
                        <strong>{activeStep?.confidenceGate || 95}% dunkel</strong> über SAP S/4HANA Event Mesh,
                        ABAP Core Data Services oder BRFplus Decision Tables.
                      </p>
                    </div>

                    {/* Falls ein Ausnahme-Agent für die restlichen 5-10% existiert */}
                    {matchedAgent && (
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                            Agent für Ausnahmen ({100 - (activeStep?.confidenceGate || 95)}% Volumen):
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                            {matchedAgent.typeLabel}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{matchedAgent.name}</h4>
                        <p className="text-[11px] text-slate-300">{matchedAgent.shortDescription}</p>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                          <span>Abrechnung bei Ausnahmen:</span>
                          <span className="text-amber-300 font-bold">
                            {matchedAgent.pricePerBlockAiu} AIU / Aktion
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : matchedAgent ? (
                  /* Autonomer SAP Business AI Agent */
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-white">{matchedAgent.name}</h3>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-800 font-bold font-mono">
                          {matchedAgent.typeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {matchedAgent.shortDescription}
                      </p>
                    </div>

                    {/* Kompatibilität */}
                    {matchedAgent.worksWith && matchedAgent.worksWith.length > 0 && (
                      <div className="text-[11px] text-slate-400">
                        <span className="text-slate-500 font-mono">Kompatibel mit: </span>
                        <strong className="text-slate-200">{matchedAgent.worksWith.join(', ')}</strong>
                      </div>
                    )}

                    {/* Preispunkt & Metrik */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                        <span>Abrechnungsmetrik:</span>
                        <strong className="text-slate-200">{matchedAgent.metric}</strong>
                      </div>
                      <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                        <span>Preis pro Aktion:</span>
                        <strong className="text-slate-200">
                          {matchedAgent.pricePerBlockAiu > 0 ? `${matchedAgent.pricePerBlockAiu} AIU` : '0 AIU'}
                        </strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1.5 font-mono">
                        <span className="font-bold text-white">Monatliche Inferenzkosten:</span>
                        <span className="font-bold text-emerald-400">
                          {matchedAgent.monthlyAiuEstimated} AIU (~{matchedAgent.monthlyCostEurEstimated.toFixed(2)} €)
                        </span>
                      </div>
                    </div>

                    {/* SAP Discovery Center Link */}
                    <div className="pt-1">
                      <a
                        href={matchedAgent.discoveryCenterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 text-xs font-bold transition"
                      >
                        <span>Im SAP AI Catalog öffnen</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-800/60 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Strategischer weißer Fleck (Gap)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Für diesen spezifischen Prozessschritt listet SAP derzeit keinen schlüsselfertigen
                      Standard-Agenten. Hier empfiehlt sich eine maßgeschneiderte BTP-Erweiterung (Kyma / CAP).
                    </p>
                  </div>
                )}
              </div>

              {/* Fußleiste: Gesamt-Footprint der Kette */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  BTP Business AI Architektur-Footprint
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Clean Core Fast-Path</span>
                    <span className="font-bold text-emerald-400 font-mono">{deterministicSteps} Schritte (0 €)</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Spezialisierte Agenten</span>
                    <span className="font-bold text-sky-400 font-mono">{totalSteps - deterministicSteps} aktiv</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: END-TO-END JOULE ASSISTENT */}
          {activeTab === 'assistant' && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="bg-slate-950 border border-indigo-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{processAssistant.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono font-bold">
                      {processAssistant.typeLabel}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {processAssistant.shortDescription}
                </p>

                {/* Rolle im Prozess */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider font-mono">
                    Ganzheitliche Begleitung (Human-in-the-Loop)
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 text-[11.5px] leading-relaxed">
                    <li className="flex items-start space-x-2">
                      <span className="text-indigo-400">&bull;</span>
                      <span>
                        Begleitet den Sachbearbeiter durch den <strong>gesamten Belegfluss</strong> von{' '}
                        {currentTemplate.name}.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-indigo-400">&bull;</span>
                      <span>
                        Fängt <strong>Ausnahmen und Diskrepanzen</strong> (die 15-20% Non-STP Fälle) dialogbasiert ab
                        und liefert kontextbezogene Handlungsempfehlungen.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-indigo-400">&bull;</span>
                      <span>
                        Nahtlos eingebettet in <strong>SAP Fiori Horizon</strong> und <strong>Joule Studio</strong>.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Lizenzierung & Kosten */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                    Lizenz- &amp; Kostenmodell
                  </h4>
                  <div className="flex justify-between items-center text-[11.5px] font-mono text-slate-300">
                    <span>Modell:</span>
                    <strong className="text-emerald-400 font-bold">Joule Base Edition (Flatrate)</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11.5px] font-mono text-slate-300">
                    <span>Zusätzliche Tokenkosten:</span>
                    <strong className="text-white">0 € (in Cloud ERP Lizenz enthalten)</strong>
                  </div>
                </div>

                {/* Zuarbeitende Spezial-Agenten & Preisschilder (Worker Agents) */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Bot className="w-3.5 h-3.5 text-sky-400" />
                      <h4 className="font-bold text-white text-[11px] uppercase tracking-wider font-mono">
                        Zuarbeitende Spezial-Agenten &amp; Preisschilder
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {steps.length} Schritte
                    </span>
                  </div>

                  <div className="space-y-2">
                    {steps.map((s, i) => {
                      const isStp = s.currentArchetype === 'deterministic';
                      const match = s.sapAgentMatch?.matchedAgent;
                      return (
                        <div
                          key={s.id}
                          className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono font-bold text-slate-400">
                                #{i + 1}
                              </span>
                              <span className="text-xs font-semibold text-slate-200">
                                {s.name}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-slate-400 pl-4 font-mono">
                              {isStp ? (
                                <span className="text-emerald-400">
                                  Clean Core Fast-Path ({s.sapGoldenPathTool || 'BRFplus / CDS'})
                                </span>
                              ) : match ? (
                                <span className="text-sky-300">
                                  {match.name}
                                </span>
                              ) : (
                                <span className="text-amber-400">
                                  Maßgeschneiderte BTP Extension
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            {isStp ? (
                              <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                                0,00 € (STP)
                              </span>
                            ) : match ? (
                              <div className="space-y-0.5">
                                <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                                  {match.monthlyCostEurEstimated.toFixed(2)} € / M.
                                </span>
                                <div className="text-[9.5px] text-slate-500 font-mono">
                                  {match.pricePerBlockAiu} AIU / Aktion
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                                Custom BTP
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Kosten-Gesamtsumme */}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Gesamt-Preisschild aller Agenten:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {totalEur} € / Monat ({totalAiu.toFixed(1)} AIU)
                    </span>
                  </div>
                </div>

                {/* Discovery Center Link */}
                <div className="pt-2">
                  <a
                    href={processAssistant.discoveryCenterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-bold transition"
                  >
                    <span>Joule Assistent im SAP AI Catalog öffnen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
