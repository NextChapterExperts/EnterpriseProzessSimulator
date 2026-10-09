'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isReady?: boolean;
}

export const VoiceAdvisorBar: React.FC = () => {
  const { applyGeneratedProcess, toggleParetoModal, language } = useSimulatorStore();
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'en'
          ? 'Hello! I am your AI Enterprise Process Architect powered by Gemini 2.5 Flash. Tell me via voice or text which SAP process you want to optimize (e.g. "Invoice Verification with 15k documents" or a custom free-text scenario). I will ask sharp clarifying questions and generate the Pareto-optimal BTP architecture with Discovery Center agents on-the-fly.'
          : 'Hallo Peter! Ich bin dein AI Enterprise Process Architect mit Gemini 2.5 Flash als Hirn. Sag mir einfach per Sprache oder Text, welchen SAP-Prozess wir optimieren wollen (z. B. "Lieferantenrechnungsprüfung mit 15.000 Belegen" oder ein individuelles Freitext-Szenario). Ich kläre kurz die Randbedingungen und modelliere die Kette direkt im Pareto-Optimum inklusive Discovery Center Agenten.',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition Init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognitionSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = language === 'en' ? 'en-US' : 'de-DE';

        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            // Direkt absenden
            handleSendMessage(transcript);
          }
          setIsRecording(false);
        };

        recog.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e);
          setIsRecording(false);
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, [language]);

  const speakText = (text: string) => {
    if (!voiceOutputEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'de-DE';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'en' ? 'en-US' : 'de-DE';
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const historyForApi = newHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyForApi,
          language,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Serverfehler (${res.status})`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.aiResponseText || 'Prozess analysiert.',
        isReady: data.status === 'ready',
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Sprachausgabe
      if (data.aiResponseText) {
        speakText(data.aiResponseText);
      }

      // Wenn 'ready', direkt den State im Store aktualisieren!
      if (data.status === 'ready' && Array.isArray(data.steps)) {
        applyGeneratedProcess(
          data.processTitle || 'Generierter SAP-Zielprozess',
          data.processScopeCode || 'BTP-AI',
          data.steps,
          data.monthlyVolume || 15000,
          data.executiveSummary
        );
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Fehler bei der Prozessanalyse: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    handleSendMessage(prompt);
  };

  return (
    <div className="bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 shadow-md transition-all">
      {/* Top Header Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-1.5">
                <span>AI Enterprise Process Architect</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  Gemini 2.5 Flash
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interaktive Sprach- &amp; Anforderungsanalyse &bull; On-the-Fly Pareto-Modellierung &bull; SAP Discovery Center Matching
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* TTS Audio Toggle */}
          <button
            onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition flex items-center space-x-1 ${
              voiceOutputEnabled
                ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={voiceOutputEnabled ? 'Sprachausgabe aktiv' : 'Sprachausgabe stumm'}
          >
            {voiceOutputEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle Minimize/Maximize */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Ausklappbarer Dialog-Bereich */}
      {isOpen && (
        <div className="px-6 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {/* Schnellauswahl Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[10.5px]">Beispiele:</span>
            <button
              onClick={() =>
                handleQuickPrompt(
                  'Wir verarbeiten 15.000 Lieferantenrechnungen per PDF im Monat, brauchen einen 3-Way-Match gegen S/4HANA Bestellungen und Freigabeworkflow bei Abweichungen.'
                )
              }
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950 text-slate-700 hover:text-sky-800 dark:text-slate-300 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 transition"
            >
              📄 15k Rechnungen (P2P 3-Way-Match)
            </button>
            <button
              onClick={() =>
                handleQuickPrompt(
                  'Kundenaufträge kommen als Freitext-Mail mit Excel-Anhang rein. 20.000 Belege im Monat, manuelle Kreditprüfung und S/4HANA Auftragsanlage.'
                )
              }
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950 text-slate-700 hover:text-sky-800 dark:text-slate-300 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 transition"
            >
              🛒 20k Auftragsanlage (O2C Freitext)
            </button>
            <button
              onClick={() =>
                handleQuickPrompt(
                  'Kundenservice-Reklamationen im Maschinenbau: 5.000 Fälle monatlich, Seriennummern-Garantieprüfung gegen SAP S/4HANA und Gutschrifterstellung.'
                )
              }
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950 text-slate-700 hover:text-sky-800 dark:text-slate-300 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 transition"
            >
              ⚙️ 5k Reklamation &amp; Garantie
            </button>
          </div>

          {/* Dialog Messages History (Kompakt) */}
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-xl max-w-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : m.isReady
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.isReady && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-bold flex items-center space-x-1 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Zielarchitektur im Canvas visualisiert</span>
                      </span>
                      <button
                        onClick={() => toggleParetoModal(true)}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition flex items-center space-x-1"
                      >
                        <span>Discovery Center Board</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-sky-600 dark:text-sky-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini 2.5 Flash analysiert Anforderungen &amp; berechnet Pareto-Optimum...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Eingabezeile mit Mikrofon & Textfeld */}
          <div className="flex items-center space-x-2">
            {/* Mikrofon Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition active:scale-95 shadow-sm ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white border-red-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title={
                isRecording
                  ? 'Aufnahme läuft... Klicke zum Stoppen & Absenden'
                  : 'Spracheingabe starten (Klicke zum Sprechen)'
              }
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isLoading}
                placeholder={
                  isRecording
                    ? 'Ich lausche... sprich einfach und klicke dann erneut auf das Mikrofon'
                    : 'Prozess beschreiben oder Frage beantworten (z. B. 20.000 Belege im Einkauf)...'
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Senden Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <span>Senden</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
