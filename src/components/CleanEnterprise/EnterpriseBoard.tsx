'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getProcessTemplates } from '@/data/templates';
import {
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Send,
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
} from 'lucide-react';
import { ProcessStep, SapAgentMatchResult } from '@/types/process';

export const EnterpriseBoard: React.FC = () => {
  const {
    steps,
    currentTemplate,
    selectTemplate,
    applyGeneratedProcess,
    selectedStepId,
    setSelectedStepId,
    lastParetoResult,
    config,
    language,
  } = useSimulatorStore();

  const [showSapAgents, setShowSapAgents] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiClarification, setAiClarification] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const templates = getProcessTemplates('de');

  // Speech Recognition Init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'de-DE';

        recog.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          if (text) {
            setInputText(text);
            handleSendProcess(text);
          }
          setIsRecording(false);
        };

        recog.onerror = () => setIsRecording(false);
        recog.onend = () => setIsRecording(false);
        recognitionRef.current = recog;
      }
    }
  }, []);

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

  const handleSendProcess = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);
    setAiClarification(null);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language: 'de' }),
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
        setShowSapAgents(true);
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
      {/* 1. Schlanker Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
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
              Zielarchitektur im Pareto-Optimum &bull; Automatische Zuordnung der SAP Business AI Agenten
            </p>
          </div>
        </div>

        {/* Schnellauswahl Standard-Prozesse */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-mono px-2">Vorlagen:</span>
          {templates.slice(0, 3).map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTemplate.id === t.id
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.name.split('(')[0]}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Dialog-Leiste: Spracheingabe & KI-Prompt */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5 flex items-center space-x-3 shrink-0">
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
              if (e.key === 'Enter') handleSendProcess();
            }}
            disabled={isLoading}
            placeholder={
              isRecording
                ? 'Ich höre zu... sprich deinen Prozess und klicke dann nochmals auf das Mikrofon'
                : 'Prozess per Sprache oder Text beschreiben (z. B. "20.000 Rechnungen mit 3-Way Match und Freigabe")...'
            }
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
          />
        </div>

        <button
          onClick={() => handleSendProcess()}
          disabled={isLoading || !inputText.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'Modelliere...' : 'Optimieren'}</span>
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
      <div className="grid grid-cols-4 gap-3 px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 shrink-0">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Dunkelverarbeitung (STP)</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">{stpRate} % STP-Quote</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-sky-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Inferenz &amp; Tokens</div>
            <div className="text-sm font-bold text-white font-mono">Minimal (Fast-Paths aktiv)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <TrendingDown className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Pareto-Effizienz</div>
            <div className="text-sm font-bold text-amber-300 font-mono">-65 % Durchlaufzeit</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-3">
          <Coins className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">SAP BTP Inferenz-Kosten</div>
            <div className="text-sm font-bold text-indigo-300 font-mono">
              {totalAiu} AIU (~{totalEur} €/Monat)
            </div>
          </div>
        </div>
      </div>

      {/* 4. Haupt-Bereich: Split-Screen (Links: Pareto-Prozess | Rechts: SAP Agenten) */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Linke Spalte (55%): Der Pareto-optimierte Prozess */}
        <section className="flex-[55] bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Pareto-Optimum
                </span>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {currentTemplate.name}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {steps.length} Schritte im OODA-Loop &bull; Klicke einen Schritt für die Agenten-Details
              </p>
            </div>

            {/* Der geforderte Schalter / Knopf */}
            <button
              onClick={() => setShowSapAgents(!showSapAgents)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow ${
                showSapAgents
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sky-900/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{showSapAgents ? '✓ SAP Agenten aktiv' : 'SAP Agenten einblenden'}</span>
            </button>
          </div>

          {/* Schritt-Kette (Vertikal, sauber, übersichtlich) */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {steps.map((step, idx) => {
              const isSelected = (selectedStepId || steps[0]?.id) === step.id;
              const match = step.sapAgentMatch;
              const isGap = match?.recommendationType === 'CUSTOM_GAP';
              const isFastPath = match?.recommendationType === 'DETERMINISTIC_FAST_PATH';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-950 border-sky-500 ring-2 ring-sky-500/20 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-2">
                          <span>{step.name}</span>
                          <span className="text-[10px] font-mono font-normal text-slate-400">
                            ({step.primitive})
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5 flex items-center space-x-2">
                          <span className="text-sky-400 font-mono">Phase: {step.oodaPhase}</span>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-mono">
                            {step.currentArchetype === 'deterministic' ? 'Fast-Path (0 Tokens)' : 'KI-Assistent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isFastPath && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          Clean Core STP
                        </span>
                      )}
                      {isGap && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                          Weißer Fleck
                        </span>
                      )}
                      {!isFastPath && !isGap && (
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                          SAP Agent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rechte Spalte (45%): SAP Business AI & Agenten-Abbildung */}
        <section className="flex-[45] bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                SAP Business AI &amp; Discovery Center
              </h2>
            </div>
            <a
              href="https://discovery-center.cloud.sap/ai-catalog/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-sky-400 hover:text-sky-300 hover:underline flex items-center space-x-1"
            >
              <span>Katalog öffnen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {showSapAgents ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Ausgewählter Schritt Karte */}
              <div className="bg-slate-950 border border-sky-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                    Aktiver Schritt: {activeStep?.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Konfidenz-Gate: {activeStep?.confidenceGate}%
                  </span>
                </div>

                {matchedAgent ? (
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

                    {/* Direkter Link */}
                    <a
                      href={`https://discovery-center.cloud.sap/ai-catalog/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
                    >
                      <span>Im SAP Discovery Center aufrufen</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : activeMatch?.recommendationType === 'DETERMINISTIC_FAST_PATH' ? (
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Clean Core Fast-Path (0 Tokens, 0 € Kosten)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Dieser Schritt benötigt kein LLM. Er wird direkt über SAP S/4HANA Event Mesh, ABAP Core Data Services oder BRFplus Decision Tables dunkelverbucht.
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-800/80 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Weißer Fleck im SAP Standard</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Für diese spezifische Geschäftslogik existiert kein vorgefertigter Standard-Agent im Discovery Center. 
                    </p>
                    <p className="text-[11px] text-amber-200/90 font-mono">
                      💡 Empfehlung Next Chapter Experts: Schlanker BTP Kyma / Cloud Foundry Microservice.
                    </p>
                  </div>
                )}
              </div>

              {/* Zusammenfassung über alle Schritte */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Gesamter BTP Business AI Footprint
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Standard-Agenten</span>
                    <span className="font-bold text-white font-mono">
                      {steps.filter((s) => s.sapAgentMatch?.recommendationType === 'SAP_STANDARD_AGENT').length} aktiv
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Weiße Flecken</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {steps.filter((s) => s.sapAgentMatch?.recommendationType === 'CUSTOM_GAP').length} Custom
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <Bot className="w-10 h-10 text-slate-600" />
              <p className="text-xs max-w-xs">
                Klicke auf <strong>„SAP Agenten einblenden“</strong>, um für jeden optimierten Prozessschritt die Discovery Center Standard-Agenten samt BTP-Kosten anzuzeigen.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
