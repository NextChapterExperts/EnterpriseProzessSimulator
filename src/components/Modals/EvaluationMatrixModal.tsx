'use client';

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  X,
  Scale,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Zap,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const EvaluationMatrixModal: React.FC = () => {
  const { isEvaluationMatrixOpen, closeEvaluationMatrix, language } = useSimulatorStore();
  const [activeTab, setActiveTab] = useState<'philosophy' | 'dimensions' | 'benchmarks' | 'matrix'>('philosophy');

  const isEn = language === 'en';
  const t = TRANSLATIONS[language];

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEvaluationMatrix();
    };
    if (isEvaluationMatrixOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEvaluationMatrixOpen, closeEvaluationMatrix]);

  if (!isEvaluationMatrixOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none"
      onClick={closeEvaluationMatrix}
    >
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-4 my-auto relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {isEn ? 'Scientific Methodology' : 'Methodisches Framework'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                OODA • Claude Shannon Entropy • Zwingmann Tiers
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug flex items-center space-x-2">
              <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{t.evalModalTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.evalModalSubtitle}
            </p>
          </div>
          <button
            onClick={closeEvaluationMatrix}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition shrink-0"
            title={isEn ? 'Close (ESC)' : 'Schließen (ESC)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab-Leiste */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-1 gap-1 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('philosophy')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'philosophy'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{t.evalTabPhilosophy}</span>
          </button>
          <button
            onClick={() => setActiveTab('dimensions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'dimensions'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{t.evalTabDimensions}</span>
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'benchmarks'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{t.evalTabBenchmarks}</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{t.evalTabMatrix}</span>
          </button>
        </div>

        {/* Inhalt je nach Tab */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* TAB 1: WARUM MESSEN OHNE CODE? (PHILOSOPHIE & THEORIE) */}
          {activeTab === 'philosophy' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Highlight-Box: Die Windkanal-Analogie */}
              <div className="bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/30 border border-indigo-200 dark:border-indigo-800/70 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {isEn
                      ? 'The "Wind Tunnel" Principle of Enterprise Architecture'
                      : 'Das „Windkanal-Prinzip“ der Enterprise-Architektur'}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn ? (
                    <>
                      <strong>Why can we evaluate without code?</strong> In civil engineering, an architect calculates static load, wind resistance, and thermal insulation <em>before pouring the first bucket of concrete</em>, using proven material constants (steel vs. timber vs. concrete). The SAP Process Simulator models the fundamental <strong>systemic and information-theoretic material properties</strong> of the 5 automation archetypes.
                    </>
                  ) : (
                    <>
                      <strong>Warum können wir ohne Code bewerten?</strong> In der Bauphysik berechnet ein Ingenieur Traglast, Windwiderstand und Wärmedämmung <em>vor dem ersten Spatenstich</em> anhand von Materialkonstanten (Stahl vs. Holz vs. Beton). Der Prozess-Simulator modelliert analog dazu die <strong>systemtheoretischen und informationstheoretischen Materialeigenschaften</strong> der 5 Automatisierungs-Archetypen.
                    </>
                  )}
                </p>
              </div>

              {/* Die 3 fundamentalen Naturgesetze von Software-Architektur */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span className="text-amber-500 font-mono">1.</span>
                    <span>{isEn ? 'Combinatorial Explosion' : 'Kombinatorische Explosion'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {isEn
                      ? 'Human free-text language is open-ended. Deterministic regex or keyword parsers inevitably collapse because no human developer can author 10,000 rules for every slang, typo, or syntax twist.'
                      : 'Menschliche Sprache ist offene Entropie. Deterministische Regex-Systeme scheitern unausweichlich an Freitext, weil kein Entwickler 10.000 Regeln für alle Synonyme, Dialekte und Tippfehler pflegen kann.'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span className="text-sky-500 font-mono">2.</span>
                    <span>{isEn ? 'Semantic Vector Spaces' : 'Semantische Vektorräume'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {isEn
                      ? 'LLMs project text into high-dimensional embeddings. "Send the usual parts to Kassel" matches "Follow-up order to AN-2026-88" with 98% accuracy, but carries a statistical ~0.8% residual hallucination risk.'
                      : 'LLMs projizieren Freitext in hochdimensionale Embeddings. „Schick mir das Gleiche wie neulich“ matcht semantisch mühelos auf „Folgeauftrag“, birgt aber ein statistisches Restrisiko von ~0,8% Halluzination.'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span className="text-emerald-500 font-mono">3.</span>
                    <span>{isEn ? 'The Copilot Paradox' : 'Das Copilot-Paradoxon'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {isEn
                      ? 'A Copilot ensures 99.8% quality by enforcing 4-eyes human sign-off. But it deliberately destroys straight-through processing (0% STP) and generates human labor costs and minutes of latency.'
                      : 'Ein Copilot sichert 99,8% Qualität durch menschliche 4-Augen-Freigabe. Er vernichtet aber die Dunkelverarbeitung (0% STP), erzeugt Lohnkosten und Latenzen von Minuten bis Stunden.'}
                  </p>
                </div>
              </div>

              {/* Management-Fazit */}
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {isEn ? '💡 Key takeaway for executives:' : '💡 Kernaussage fürs Management:'}
                </span>
                <span className="text-slate-600 dark:text-slate-300 italic">
                  {isEn
                    ? '„The simulator does not measure whether your script is pretty; it calculates at which noise level and financial blast radius AI yields a positive ROI compared to BRFplus rules or human clerks.“'
                    : '„Der Simulator prüft nicht, ob ein Skript schön programmiert ist, sondern berechnet, ab welchem Datenrauschen und Schadensrisiko KI betriebswirtschaftlich und compliance-technisch besser abschneidet als BRFplus-Regeln oder menschliche Sachbearbeiter.“'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: DIE 4 QUALITÄTSDIMENSIONEN */}
          {activeTab === 'dimensions' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Semantische Erkennung */}
                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>{isEn ? '1. Semantic Recognition Rate' : '1. Semantische Erkennungsquote'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      0 – 100 %
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Measures how reliably the archetype extracts intent and line items under linguistic variance and data noise. Deterministic drops from 99% (EDI) to 20% (free text), whereas LLMs remain stable at >96%.'
                      : 'Misst, wie zuverlässig das System Absichten und Belegzeilen trotz Umgangssprache und Rauschen versteht. Deterministisch fällt von 99% (EDI) auf 20% (Freitext), während LLMs stabil bei >96% bleiben.'}
                  </p>
                </div>

                {/* 2. Silent Failure / Halluzination */}
                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>{isEn ? '2. Silent Failure Rate (Hallucination)' : '2. Silent Failure (Halluzinationsrisiko)'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      0.01 – 6.5 %
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'The risk of generating an unflagged, syntactically valid but factually false document mutation. Deterministic rules have 0.01%, single-turn LLMs ~0.8%, autonomous tool-agents ~3.5%.'
                      : 'Das Risiko, dass ein Beleg unbemerkt falsch verbucht wird (stille Halluzination). Deterministische Regeln liegen bei 0,01%, Single-Turn LLMs bei ~0,8%, autonome Agenten mit Tool-Calls bei ~3,5%.'}
                  </p>
                </div>

                {/* 3. Stammdaten-Grounding */}
                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                      <span>{isEn ? '3. Master Data Grounding' : '3. SAP Stammdaten-Grounding'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                      KNA1 / MARA Match
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Validates extracted entities against live ERP tables (customer KNA1, material MARA). Without grounding, LLMs fabricate plausible IDs; with grounding, hallucinations are rejected before commit.'
                      : 'Verifiziert erkannte Belegdaten gegen reale ERP-Tabellen. Ohne Grounding erfindet KI plausible Kunden; mit Grounding (HANA Fuzzy / Vector Engine) werden Halluzinationen vor Verbuchung abgefangen.'}
                  </p>
                </div>

                {/* 4. First-Pass-Yield */}
                <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{isEn ? '4. First-Pass Yield (STP)' : '4. First-Pass-Yield (Reine Dunkelquote)'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      0 – 99.9 %
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'The percentage of inbound transactions that traverse the step completely lights-out without any human clarification and without unhandled errors.'
                      : 'Der Prozentsatz der Transaktionen, die diesen Schritt komplett automatisiert im ersten Durchlauf fehlerfrei und ohne manuelle Sachbearbeiter-Intervention meistern.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMPIRISCHE BENCHMARKS (WOHER KOMMEN DIE ZAHLEN?) */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      <th className="py-2.5 px-3">Archetyp</th>
                      <th className="py-2.5 px-3">Semantische Erkennung</th>
                      <th className="py-2.5 px-3">Silent Hallucination</th>
                      <th className="py-2.5 px-3">Dunkelquote (STP)</th>
                      <th className="py-2.5 px-3">Kosten & Latenz</th>
                      <th className="py-2.5 px-3">Empirische Quelle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                        1. Deterministisch
                      </td>
                      <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                        20% Freitext / 99% EDI
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                        0.01%
                      </td>
                      <td className="py-2.5 px-3">20% – 99%</td>
                      <td className="py-2.5 px-3 text-emerald-600">0 CU (12 ms)</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">BRFplus / Regex / OData Specs</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60 bg-indigo-50/30 dark:bg-indigo-950/20">
                      <td className="py-2.5 px-3 font-sans font-bold text-indigo-700 dark:text-indigo-300">
                        2. Single-Turn ML
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                        98.4%
                      </td>
                      <td className="py-2.5 px-3 text-sky-600 dark:text-sky-400 font-bold">
                        ~0.80%
                      </td>
                      <td className="py-2.5 px-3">~94%</td>
                      <td className="py-2.5 px-3 text-sky-600">0.0005 CU (380 ms)</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">LLM Extraction Benchmark (JSON Mode)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                        3. Autopilot (Agent)
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                        96.0%
                      </td>
                      <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">
                        ~3.50%
                      </td>
                      <td className="py-2.5 px-3">~88%</td>
                      <td className="py-2.5 px-3 text-amber-600">0.08 CU (1.450 ms)</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">Tool-Calling & Schema-Drift Benchmarks</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                        4. Copilot (Joule HITL)
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                        99.8% (geprüft)
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                        0.10%
                      </td>
                      <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">
                        0% (Stoppt immer)
                      </td>
                      <td className="py-2.5 px-3 text-rose-600">0.02 CU + Lohn (2–4 Min)</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">Human Oversight & SOX Studies</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Erläuterung der 0.8% Halluzination */}
              <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 p-3.5 rounded-xl space-y-1.5">
                <span className="font-bold text-sky-900 dark:text-sky-200 flex items-center space-x-1.5 text-xs">
                  <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>
                    {isEn ? 'Understanding the 0.8% Benchmark:' : 'Hintergrund zur 0,8 % Halluzinationsrate:'}
                  </span>
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {isEn
                    ? 'State-of-the-art foundation models (Gemini Flash, Claude 3.5, GPT-4o) exhibit an empirical error rate between 0.6% and 1.1% on structured entity extraction. This means 8 out of 1,000 items contain subtle misclassifications (e.g. inverted dates or misassigned unit codes). In low-reversibility steps, this is easily absorbed; in irreversible steps, it demands human sign-off.'
                    : 'Moderne Foundation-Modelle (Gemini Flash, Claude 3.5, GPT-4o) weisen bei strukturierter Belegextraktion (JSON Mode) eine empirische Fehlerrate von 0,6% bis 1,1% auf. Das bedeutet: Bei ca. 8 von 1.000 Belegen tritt ein subtiler Fehler auf (z. B. vertauschte Datumsformate oder falsche Mengeneinheiten). Bei niedriger Reversibilität ist das unkritisch; bei irreversiblen Buchungen zwingt es zum Vier-Augen-Prinzip.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ARTIKEL- & ENTSCHEIDUNGSMATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/60 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {isEn
                    ? 'Rule of Thumb: When to choose which Archetype?'
                    : 'Die Faustformel: Wann wähle ich welchen Archetyp?'}
                </h4>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 w-32 shrink-0">
                      Deterministisch:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {isEn
                        ? 'For structured, deterministic data: EDI formats, table lookups, BRFplus decision tables, credit limit checks, and fast-path routing. Cost: 0 CU.'
                        : 'Immer bei relationalen, fest strukturierten Daten: EDI-Formate, Tabellen-Lookups, BRFplus-Regeln, Kreditlimitprüfung und Fast-Path-Routing. 0 Token-Kosten.'}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-sky-600 dark:text-sky-400 w-32 shrink-0">
                      Single-Turn ML:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {isEn
                        ? 'For unstructured inbound text and triage: Emails, free-text orders, translation, and semantic intent mapping. Low cost, fast response.'
                        : 'Für unstrukturierte Eingangspost und Triage: Freitext-Bestellungen, E-Mail-Sortierung, Übersetzung und semantisches Intent-Mapping. Günstig & schnell.'}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-amber-600 dark:text-amber-400 w-32 shrink-0">
                      Copilot (Joule):
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {isEn
                        ? 'Mandatory for high reversibility (Blast Radius >= 4): SOX-relevant financial bookings, irreversible ERP mutations, or human discretion cases.'
                        : 'Zwingend bei hoher Reversibilität (Blast Radius >= 4): SOX-relevante Finanzbuchungen, irreversible ERP-Verbuchungen oder Kulanzentscheidungen.'}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 w-32 shrink-0">
                      Autopilot:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {isEn
                        ? 'For multi-step autonomous pipelines with confidence gates: Document AI extraction with automated validation checks.'
                        : 'Für mehrstufige autonome Pipelines mit Konfidenz-Gates: Document AI Extraktion mit automatischer Schwellwert-Prüfung.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            SAP BTP AI Core • SAP Build Process Automation • Clean Core RAP
          </span>
          <button
            onClick={closeEvaluationMatrix}
            className="px-4 py-1.5 rounded-lg bg-[#0A6ED1] hover:bg-sky-600 text-white font-semibold text-xs shadow transition active:scale-95"
          >
            {isEn ? 'Close' : 'Verstanden & Schließen'}
          </button>
        </div>
      </div>
    </div>
  );
};
