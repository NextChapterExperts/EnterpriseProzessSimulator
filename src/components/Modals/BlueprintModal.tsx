'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { X, Printer, Layers, CheckCircle2, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { InfoTip } from '@/components/common/InfoTip';

export const BlueprintModal: React.FC = () => {
  const {
    isBlueprintOpen,
    toggleBlueprint,
    currentTemplate,
    steps,
    config,
    metrics,
    language,
    lastParetoResult,
  } = useSimulatorStore();

  if (!isBlueprintOpen) return null;

  const isEn = language === 'en';
  const locale = isEn ? 'en-US' : 'de-DE';
  const fmt = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 0 });

  const handlePrint = () => {
    window.print();
  };

  const hasPareto = Boolean(lastParetoResult && lastParetoResult.changesSummary.length > 0);

  const L = isEn
    ? {
        printBtn: 'Print / Export PDF',
        modalTitle: 'Enterprise Architecture Decision Memo & Blueprint Report',
        docSubtitle: 'Management Decision Memo & S/4HANA Cloud Target Architecture',
        businessArea: 'Business area',
        date: 'Date',
        monthlyVolume: 'Monthly volume',
        documents: 'documents',
        vsManual: 'vs. manual',
        perMonth: '€/mo',
        perYear: '€/year',
        inference: 'inference',
        lightsOutSub: 'Straight-through processing',
        sizingTitle: 'SAP BTP Sizing & Step Configuration',
        colStep: 'Step',
        colArchetype: 'Archetype',
        colLatency: 'Latency',
        colCost: 'Cost/mo',
        level: 'Level',
        deltaTitle: 'Before & After Transformation (Baseline vs. Pareto Target Architecture)',
        deltaStp: 'Straight-Through Processing',
        deltaTca: 'Process Cost / Month',
        deltaSavings: 'Annual Savings Potential',
        deltaCleanCore: 'Clean Core Score',
        noParetoNotice: 'Tip for client workshops: Click "Pareto-Optimum" in the top bar to activate the before/after delta and annual savings calculation.',
        roadmapTitle: 'Step-by-Step Transformation Roadmap',
        recTitle: 'Enterprise Architecture & Governance Recommendation (SAP BTP Clean Core)',
        nextStepsTitle: 'Recommended Next Implementation Steps',
        stepsList: [
          'Phase 1 (Weeks 1-2): Establish deterministic Clean Core RAP / OData APIs with strict SOX/GoBD audit-trails.',
          'Phase 2 (Weeks 3-4): Deploy SAP Document AI and In-Memory Vector Matching in dedicated test subaccount.',
          'Phase 3 (Weeks 5-6): Activate 85% straight-through processing with automated exceptions routed to Joule Copilot.',
        ],
        rec: [
          {
            head: 'Observe phase:',
            body: 'Deploying SAP Document AI with an upstream schema validation gate prevents context drift and ensures structured ingestion.',
          },
          {
            head: 'Orient phase:',
            body: 'Mandatory in-memory matching via SAP HANA Cloud against KNA1/MARA guarantees 0% hallucinated customer and material IDs.',
          },
          {
            head: 'Decide phase:',
            body: 'Pricing, credit limit and compliance rules remain deterministically governed in SAP BRFplus to eliminate prompt injection risks.',
          },
          {
            head: 'Act phase:',
            body: 'Final persistence in S/4HANA Cloud Universal Journal (ACDOCA) occurs via Clean Core RAP APIs with full reversibility.',
          },
        ],
      }
    : {
        printBtn: 'Drucken / PDF Export',
        modalTitle: 'Enterprise Architecture Management Memo & Blueprint Report',
        docSubtitle: 'Management Decision Memo & S/4HANA Cloud Zielarchitektur',
        businessArea: 'Geschäftsbereich',
        date: 'Datum',
        monthlyVolume: 'Monatsvolumen',
        documents: 'Vorgänge',
        vsManual: 'vs. Manuell',
        perMonth: '€/M',
        perYear: '€/Jahr',
        inference: 'Inferenz',
        lightsOutSub: 'Dunkelverarbeitung',
        sizingTitle: 'SAP BTP Sizing & Schritt-Konfiguration',
        colStep: 'Schritt',
        colArchetype: 'Archetyp',
        colLatency: 'Latenz',
        colCost: 'Kosten/M',
        level: 'Stufe',
        deltaTitle: 'Vorher-Nachher-Transformation (Ist-Zustand vs. Pareto-Zielarchitektur)',
        deltaStp: 'Dunkelverarbeitung (STP)',
        deltaTca: 'Prozesskosten / Monat',
        deltaSavings: 'Jährliches Einsparpotenzial',
        deltaCleanCore: 'Clean Core Index',
        noParetoNotice: 'Hinweis für Kunden-Workshops: Führen Sie über die Schaltfläche „Pareto-Optimum“ eine Optimierung durch, um den Vorher-Nachher-Vergleich und die Jahresersparnis im Report zu aktivieren.',
        roadmapTitle: 'Schritt-für-Schritt Transformations-Roadmap',
        recTitle: 'Enterprise-Architektur & Governance-Empfehlung (SAP BTP Clean Core)',
        nextStepsTitle: 'Empfohlene nächste Umsetzungsschritte für den Lenkungsausschuss',
        stepsList: [
          'Phase 1 (Woche 1–2): Deterministische Clean Core RAP / OData-Schnittstellen mit lückenlosem GoBD-Audit-Trail einrichten.',
          'Phase 2 (Woche 3–4): SAP Document AI und In-Memory Matching in dediziertem BTP-Test-Subaccount mit Realdaten evaluieren.',
          'Phase 3 (Woche 5–6): Produktivsetzung des 85 % Dunkelverarbeitungs-Laufs; gezielte Eskalation von Ausnahmen an den Joule Copilot.',
        ],
        rec: [
          {
            head: 'Observe-Phase:',
            body: 'Einsatz von SAP Document AI mit vorgeschaltetem Validierungs-Gate verhindert Context Drift bei unstrukturierten Belegen.',
          },
          {
            head: 'Orient-Phase:',
            body: 'Zwingende In-Memory-Entitätsauflösung via SAP HANA Cloud gegen KNA1/MARA schließt Halluzinationen bei Debitoren- und Material-IDs vollständig aus.',
          },
          {
            head: 'Decide-Phase:',
            body: 'Preisfindung, Rabatte und Kreditprüfungen verbleiben deterministisch in SAP BRFplus oder im ERP-Konditionsschema, um Manipulationen auszuschließen.',
          },
          {
            head: 'Act-Phase:',
            body: 'Die finale Verbuchung im Universal Journal (ACDOCA) erfolgt atomar über Clean Core RAP APIs mit nachweisbarer Reversibilität.',
          },
        ],
      };

  const thClass = 'p-2 border-b border-slate-200 dark:border-slate-800 print:border-slate-300';
  const cardLabel = 'text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 print:text-slate-600 flex items-center';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:static overflow-y-auto">
      <div className="bg-white dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 print:bg-white print:text-black border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:border-none print:shadow-none my-auto">
        {/* Modal Actions Header (Hidden in Print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 print:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#0A6ED1]" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {L.modalTitle}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A6ED1] hover:bg-sky-600 text-xs font-semibold text-white transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{L.printBtn}</span>
            </button>
            <button
              onClick={() => toggleBlueprint(false)}
              aria-label={isEn ? 'Close' : 'Schließen'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Blueprint Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100 print:text-black print:p-4 text-xs font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-slate-200 dark:border-slate-700 print:border-black pb-4 flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 print:text-blue-700 tracking-wider">
                Next Chapter Experts · Enterprise Architecture & AI Advisory
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-black mt-1">
                {currentTemplate.name} ({currentTemplate.scopeCode})
              </h1>
              <p className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs mt-0.5">
                {L.businessArea}: {currentTemplate.businessArea}
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500 dark:text-slate-400 print:text-slate-600">
              <div>
                {L.date}: {new Date().toLocaleDateString(locale)}
              </div>
              <div>
                {L.monthlyVolume}: {fmt(config.monthlyVolume)} {L.documents}
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-semibold mt-0.5">
                Clean Core Score: {metrics.cleanCoreScore} %
              </div>
            </div>
          </div>

          {/* Vorher-Nachher Transformations-Matrix (Wenn Pareto gerechnet wurde) */}
          {hasPareto && lastParetoResult ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 print:text-emerald-800 flex items-center space-x-1.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>{L.deltaTitle}</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 print:text-emerald-900 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 font-mono">
                  -{lastParetoResult.savingsPercentage.toFixed(0)} % Prozesskosten
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 print:bg-emerald-50 rounded-lg border border-emerald-200 dark:border-emerald-800/80 print:border-emerald-300">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                    {L.deltaStp}
                  </div>
                  <div className="text-lg font-black text-emerald-900 dark:text-emerald-200 mt-1 font-mono flex items-center space-x-1.5">
                    <span>{metrics.lightsOutAutomationRate} %</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Dunkelverarbeitung (Fast-Path)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 print:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 print:border-slate-300">
                  <div className={cardLabel}>{L.deltaTca}</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white print:text-black mt-1 font-mono">
                    {fmt(lastParetoResult.optimizedTcaEur)} €
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5 line-through">
                    Basis: {fmt(lastParetoResult.previousTcaEur)} €
                  </div>
                </div>

                <div className="p-3 bg-sky-50/80 dark:bg-sky-950/30 print:bg-sky-50 rounded-lg border border-sky-200 dark:border-sky-800/80 print:border-sky-300">
                  <div className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-300">
                    {L.deltaSavings}
                  </div>
                  <div className="text-lg font-black text-sky-900 dark:text-sky-200 mt-1 font-mono">
                    {fmt(lastParetoResult.savingsEur * 12)} €
                  </div>
                  <div className="text-[10px] text-sky-700 dark:text-sky-400 mt-0.5">
                    +{fmt(lastParetoResult.savingsEur)} € / Monat
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/30 print:bg-indigo-50 rounded-lg border border-indigo-200 dark:border-indigo-800/80 print:border-indigo-300">
                  <div className="text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-300">
                    {L.deltaCleanCore}
                  </div>
                  <div className="text-lg font-black text-indigo-900 dark:text-indigo-200 mt-1 font-mono">
                    {metrics.cleanCoreScore} %
                  </div>
                  <div className="text-[10px] text-indigo-700 dark:text-indigo-400 mt-0.5">
                    Compliance &amp; Revisionssicher
                  </div>
                </div>
              </div>

              {/* Transformations-Tabelle (Ist vs. Soll) */}
              <div className="mt-3">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white print:text-black mb-1.5 flex items-center space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                  <span>{L.roadmapTitle}</span>
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left font-mono text-[10.5px]">
                    <thead className="bg-slate-100 dark:bg-slate-900 print:bg-slate-200 text-slate-600 dark:text-slate-400 print:text-slate-700 text-[9.5px] uppercase font-bold">
                      <tr>
                        <th className={thClass}>Schritt</th>
                        <th className={thClass}>Ist-Archetyp</th>
                        <th className={thClass}>Ziel-Archetyp (Pareto)</th>
                        <th className={thClass}>Konfidenz</th>
                        <th className={thClass}>Architektur-Begründung</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300">
                      {lastParetoResult.changesSummary.map((c) => (
                        <tr key={c.stepId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 print:hover:bg-transparent">
                          <td className="p-2 font-sans font-medium text-slate-900 dark:text-white print:text-black">{c.stepName}</td>
                          <td className="p-2 text-slate-500 dark:text-slate-400 print:text-slate-600 line-through">{c.oldArchetype}</td>
                          <td className="p-2 font-bold text-sky-600 dark:text-sky-400 print:text-blue-800 uppercase">{c.newArchetype}</td>
                          <td className="p-2 text-slate-700 dark:text-slate-300 print:text-slate-800 font-semibold">{c.newConfidence}%</td>
                          <td className="p-2 font-sans text-slate-600 dark:text-slate-300 print:text-slate-700 text-[10px] leading-tight">{c.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Hinweis, wenn noch kein Pareto gelaufen ist */
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 print:bg-amber-50 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 print:text-amber-900 text-xs flex items-center space-x-2">
              <Zap className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{L.noParetoNotice}</span>
            </div>
          )}

          {/* Sizing & Schritt-Tabelle */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white print:text-black mb-2 flex items-center space-x-1.5">
              <span>{L.sizingTitle}</span>
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono text-[10.5px]">
                <thead className="bg-slate-100 dark:bg-slate-900 print:bg-slate-200 text-slate-600 dark:text-slate-400 print:text-slate-700 text-[9.5px] uppercase font-bold">
                  <tr>
                    <th className={thClass}>{L.colStep}</th>
                    <th className={thClass}>OODA / Primitive</th>
                    <th className={thClass}>{L.colArchetype}</th>
                    <th className={thClass}>Gate</th>
                    <th className={thClass}>Clean Core</th>
                    <th className={thClass}>Blast Radius</th>
                    <th className={thClass}>{L.colLatency}</th>
                    <th className={`${thClass} text-right`}>{L.colCost}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300">
                  {steps.map((step) => {
                    const m = calculateStepMetrics(step, config);
                    return (
                      <tr key={step.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 print:hover:bg-transparent">
                        <td className="p-2 font-sans font-medium text-slate-900 dark:text-white print:text-black">{step.name}</td>
                        <td className="p-2 text-slate-500 dark:text-slate-400 print:text-slate-700 text-[10px]">
                          {step.oodaPhase} &bull; {step.primitive}
                        </td>
                        <td className="p-2 font-bold text-sky-600 dark:text-sky-400 print:text-blue-800 uppercase">{step.currentArchetype}</td>
                        <td className="p-2 text-slate-600 dark:text-slate-300 print:text-slate-800">{step.confidenceGate} %</td>
                        <td className="p-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                              step.cleanCoreIndex === 'COMPLIANT'
                                ? 'text-emerald-700 dark:text-emerald-400 print:text-emerald-800 bg-emerald-100 dark:bg-emerald-950/60'
                                : 'text-amber-700 dark:text-amber-400 print:text-amber-800 bg-amber-100 dark:bg-amber-950/60'
                            }`}
                          >
                            {step.cleanCoreIndex}
                          </span>
                        </td>
                        <td className="p-2 text-slate-600 dark:text-slate-300 print:text-slate-800">
                          {L.level} {step.reversibility}/5
                        </td>
                        <td className="p-2 text-slate-500 dark:text-slate-400 print:text-slate-700">{m.latencyMs} ms</td>
                        <td className="p-2 text-right font-bold text-slate-900 dark:text-white print:text-black">{fmt(Math.round(m.totalCostEur))} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architektur- & Governance-Empfehlungen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 print:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 print:text-blue-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{L.recTitle}</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 print:text-slate-800 text-[11px] leading-relaxed">
                {L.rec.map((r, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">{r.head}</span>
                    <span className="text-slate-600 dark:text-slate-300">{r.body}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Handlungsempfehlung & 3-Schritte-Pilotierungsplan */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 print:bg-emerald-50/60 rounded-xl border border-emerald-200 dark:border-emerald-800/80 print:border-emerald-300 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 print:text-emerald-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{L.nextStepsTitle}</span>
              </h4>
              <ol className="space-y-1.5 text-slate-700 dark:text-slate-300 print:text-slate-800 text-[11px] leading-relaxed list-decimal list-inside">
                {L.stepsList.map((stepText, idx) => (
                  <li key={idx} className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
