'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { Printer, Layers, CheckCircle2, ShieldAlert, TrendingDown, Zap, ArrowRight } from 'lucide-react';

export const BlueprintTab: React.FC = () => {
  const { currentTemplate, steps, config, metrics, lastParetoResult, language } = useSimulatorStore();
  const isEn = language === 'en';
  const hasPareto = Boolean(lastParetoResult && lastParetoResult.changesSummary.length > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080d1a] overflow-y-auto text-slate-100 p-6 space-y-6 print:bg-white print:text-black print:p-0">
      {/* Top Bar with Print Button */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg print:hidden">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>SAP Enterprise Architecture Management Blueprint</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Druckfertige Vorlage für Lenkungsausschuss, CIO & Enterprise Architecture Board
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0A6ED1] hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Drucken / Als PDF exportieren</span>
        </button>
      </div>

      {/* Printable Document Container */}
      <div className="bg-[#0B132B] print:bg-white border border-slate-800 print:border-none rounded-2xl p-8 max-w-5xl mx-auto w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="border-b-2 border-slate-700 print:border-black pb-4 flex justify-between items-start">
          <div>
            <div className="text-[10px] uppercase font-bold text-sky-400 print:text-blue-700 tracking-wider">
              SAP BTP Clean Core Advisory Suite &bull; Management Report
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white print:text-black mt-1">
              {currentTemplate.name} ({currentTemplate.scopeCode})
            </h1>
            <p className="text-slate-400 print:text-slate-700 text-xs mt-0.5">
              Geschäftsbereich: {currentTemplate.businessArea}
            </p>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-400 print:text-slate-600">
            <div>Generiert: {new Date().toLocaleDateString('de-DE')}</div>
            <div>Monatsvolumen: {config.monthlyVolume.toLocaleString('de-DE')} Transaktionen</div>
            <div>Data Noise Level: {Math.round(config.dataNoiseRate * 100)} %</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-900 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">Total Cost of Automation</div>
            <div className="text-xl font-black text-white print:text-black mt-1 font-mono">
              {metrics.totalCostOfAutomationEur.toLocaleString('de-DE')} €
            </div>
            <div className="text-[10px] text-emerald-400 print:text-emerald-700 mt-0.5">
              -{metrics.monthlySavingsVsManualEur.toLocaleString('de-DE')} € vs. Manuell
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">SAP BTP Capacity Units</div>
            <div className="text-xl font-black text-sky-400 print:text-blue-800 mt-1 font-mono">
              {metrics.sapCapacityUnits.toLocaleString('de-DE')} CU
            </div>
            <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">
              ~{metrics.sapCuCostEur.toLocaleString('de-DE')} € Inferenz
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">Lights-Out Rate</div>
            <div className="text-xl font-black text-emerald-400 print:text-emerald-800 mt-1 font-mono">
              {metrics.lightsOutAutomationRate} %
            </div>
            <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">Dunkelverarbeitung</div>
          </div>

          <div className="p-3.5 bg-slate-900 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">Clean Core Index</div>
            <div className="text-xl font-black text-indigo-400 print:text-indigo-800 mt-1 font-mono">
              {metrics.cleanCoreScore} %
            </div>
            <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">S/4HANA Compliance</div>
          </div>
        </div>

        {/* Vorher-Nachher Transformations-Matrix (Wenn Pareto gerechnet wurde) */}
        {hasPareto && lastParetoResult ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center space-x-1.5">
                <TrendingDown className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'Before & After Transformation (Pre-AI Baseline vs. Pareto Target Architecture)'
                    : 'Vorher-Nachher-Transformation (Vor-KI Baseline vs. Pareto-Zielarchitektur)'}
                </span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-300 print:text-emerald-900 bg-emerald-950/80 print:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-800 print:border-emerald-300 font-mono">
                -{lastParetoResult.savingsPercentage.toFixed(0)} % Prozesskosten
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-emerald-950/30 print:bg-emerald-50 rounded-lg border border-emerald-800/80 print:border-emerald-300">
                <div className="text-[10px] uppercase font-bold text-emerald-300 print:text-emerald-800">
                  Dunkelverarbeitung (STP)
                </div>
                <div className="text-lg font-black text-emerald-200 print:text-emerald-900 mt-1 font-mono">
                  {metrics.lightsOutAutomationRate} %
                </div>
                <div className="text-[10px] text-emerald-400 print:text-emerald-700 mt-0.5">
                  Dunkelverarbeitung (Fast-Path)
                </div>
              </div>

              <div className="p-3 bg-slate-900 print:bg-slate-100 rounded-lg border border-slate-800 print:border-slate-300">
                <div className="text-[10px] uppercase font-semibold text-slate-400 print:text-slate-600">
                  Prozesskosten / Monat
                </div>
                <div className="text-lg font-bold text-white print:text-black mt-1 font-mono">
                  {Math.round(lastParetoResult.optimizedTcaEur).toLocaleString('de-DE')} €
                </div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5 line-through">
                  Basis: {Math.round(lastParetoResult.previousTcaEur).toLocaleString('de-DE')} €
                </div>
              </div>

              <div className="p-3 bg-sky-950/30 print:bg-sky-50 rounded-lg border border-sky-800/80 print:border-sky-300">
                <div className="text-[10px] uppercase font-bold text-sky-300 print:text-sky-800">
                  Jährliches Einsparpotenzial
                </div>
                <div className="text-lg font-black text-sky-200 print:text-sky-900 mt-1 font-mono">
                  {Math.round(lastParetoResult.savingsEur * 12).toLocaleString('de-DE')} €
                </div>
                <div className="text-[10px] text-sky-400 print:text-sky-700 mt-0.5">
                  +{Math.round(lastParetoResult.savingsEur).toLocaleString('de-DE')} € / Monat
                </div>
              </div>

              <div className="p-3 bg-indigo-950/30 print:bg-indigo-50 rounded-lg border border-indigo-800/80 print:border-indigo-300">
                <div className="text-[10px] uppercase font-bold text-indigo-300 print:text-indigo-800">
                  Clean Core Index
                </div>
                <div className="text-lg font-black text-indigo-200 print:text-indigo-900 mt-1 font-mono">
                  {metrics.cleanCoreScore} %
                </div>
                <div className="text-[10px] text-indigo-400 print:text-indigo-700 mt-0.5">
                  Compliance & Revisionssicher
                </div>
              </div>
            </div>

            {/* Transformations-Tabelle (Ist vs. Soll) */}
            <div className="mt-3">
              <h4 className="font-bold text-xs text-white print:text-black mb-1.5 flex items-center space-x-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {isEn
                    ? 'Architectural Transformation Justification per Step'
                    : 'Architektonische Transformations-Begründung je Schritt'}
                </span>
              </h4>
              <div className="border border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left font-mono text-[10.5px]">
                  <thead className="bg-slate-900 print:bg-slate-200 text-slate-400 print:text-slate-700 text-[9.5px] uppercase font-bold">
                    <tr>
                      <th className="p-2 border-b border-slate-800 print:border-slate-300">{isEn ? 'Step' : 'Schritt'}</th>
                      <th className="p-2 border-b border-slate-800 print:border-slate-300">{isEn ? 'Baseline (Pre-AI)' : 'Baseline (Vor-KI Ist-Zustand)'}</th>
                      <th className="p-2 border-b border-slate-800 print:border-slate-300">{isEn ? 'Target (Pareto)' : 'Ziel (Pareto-Optimum)'}</th>
                      <th className="p-2 border-b border-slate-800 print:border-slate-300">{isEn ? 'Confidence' : 'Konfidenz'}</th>
                      <th className="p-2 border-b border-slate-800 print:border-slate-300">{isEn ? 'Architectural Justification & Guardrails' : 'Architektur-Begründung & Schutzplanken'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                    {lastParetoResult.changesSummary.map((c) => (
                      <tr key={c.stepId} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                        <td className="p-2 font-sans font-medium text-white print:text-black">{c.stepName}</td>
                        <td className="p-2 text-slate-400 print:text-slate-600 line-through">{c.oldArchetype}</td>
                        <td className="p-2 font-bold text-sky-400 print:text-blue-800 uppercase">{c.newArchetype}</td>
                        <td className="p-2 text-slate-300 print:text-slate-800 font-semibold">{c.newConfidence}%</td>
                        <td className="p-2 font-sans text-slate-300 print:text-slate-700 text-[10px] leading-tight">{c.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-sky-950/30 print:bg-slate-100 border border-sky-800/80 print:border-slate-300 rounded-xl text-sky-200 print:text-black text-xs space-y-1.5">
            <div className="font-bold flex items-center space-x-2 text-sky-400 print:text-blue-800">
              <Zap className="w-4 h-4 shrink-0 text-sky-400" />
              <span>{isEn ? 'Status Quo: 100% Deterministic Pre-AI Baseline' : 'Status Quo: 100 % Deterministische Vor-KI Baseline'}</span>
            </div>
            <p className="text-[11px] text-slate-300 print:text-slate-700 leading-relaxed">
              {isEn
                ? 'The process currently runs 100% deterministically with traditional manual clarification overhead (human-in-the-loop). Execute "Pareto-Optimum" in the top bar to calculate the AI target architecture and before/after savings.'
                : 'Der Prozess läuft aktuell zu 100 % deterministisch mit klassischem manuellem Klärungsaufwand (Human-in-the-Loop). Führen Sie über „Pareto-Optimum“ in der Menüleiste eine Optimierung aus, um die BTP Zielarchitektur und den Vorher-Nachher-Vergleich zu aktivieren.'}
            </p>
          </div>
        )}

        {/* Sizing Table */}
        <div>
          <h3 className="font-bold text-sm text-white print:text-black mb-2 flex items-center space-x-2">
            <span>SAP BTP Sizing & Komponenten-Architektur</span>
          </h3>
          <table className="w-full border border-slate-800 print:border-slate-300 rounded-xl text-left overflow-hidden text-xs">
            <thead className="bg-slate-900 print:bg-slate-200 text-slate-400 print:text-slate-700 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Schritt</th>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300">OODA Phase</th>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Archetyp</th>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Gate</th>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Clean Core</th>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Blast Radius</th>
                <th className="p-2.5 border-b border-slate-800 print:border-slate-300 text-right">Kosten / Monat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-slate-300 font-mono text-[11px]">
              {steps.map((step) => {
                const m = calculateStepMetrics(step, config);
                return (
                  <tr key={step.id}>
                    <td className="p-2.5 font-sans font-medium text-white print:text-black">{step.name}</td>
                    <td className="p-2.5 text-slate-400 print:text-slate-700">{step.oodaPhase}</td>
                    <td className="p-2.5 font-bold text-sky-400 print:text-blue-800 uppercase">{step.currentArchetype}</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-800">{step.confidenceGate} %</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        step.cleanCoreIndex === 'COMPLIANT'
                          ? 'text-emerald-400 print:text-emerald-800'
                          : 'text-amber-400 print:text-amber-800'
                      }`}>
                        {step.cleanCoreIndex}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300 print:text-slate-800">Stufe {step.reversibility}/5</td>
                    <td className="p-2.5 text-right font-bold text-white print:text-black">
                      {Math.round(m.totalCostEur).toLocaleString('de-DE')} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-900/95 print:bg-slate-200 border-t-2 border-emerald-500/60 font-bold text-xs">
              <tr className="bg-emerald-950/30 print:bg-slate-200">
                <td colSpan={6} className="p-3 font-sans text-slate-200 print:text-black uppercase text-[11px] tracking-wider">
                  <div className="flex items-center justify-between pr-3">
                    <span className="font-bold text-emerald-400 print:text-black text-xs">
                      Gesamtpreis für alle {config.monthlyVolume.toLocaleString('de-DE')} Vorgänge / Monat
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 print:text-slate-700 font-mono">
                      Ø {((metrics.totalCostOfAutomationEur || 0) / (config.monthlyVolume || 1)).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € pro Vorgang
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right font-black font-mono text-base text-emerald-400 print:text-emerald-900">
                  {Math.round(metrics.totalCostOfAutomationEur).toLocaleString('de-DE')} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Schutzplanken und Architekturvorgaben */}
        <div className="p-4 bg-slate-900/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300 space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400 print:text-blue-800 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Architekturvorgaben für den IT-Lenkungsausschuss</span>
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 print:text-slate-800 text-xs leading-relaxed">
            <li>
              <strong>Unstrukturierte Daten (Observe):</strong> SAP Document Information Extraction (DOX) mit Pydantic-Schema-Gate schützt vor Context Drift.
            </li>
            <li>
              <strong>Stammdatenabgleich (Orient):</strong> Deterministischer Abgleich via SAP HANA Trigram Fuzzy Search schließt Halluzinationen bei Debitoren- und Material-IDs aus.
            </li>
            <li>
              <strong>Entscheidungsregeln (Decide):</strong> Keine Black-Box LLM-Entscheidungen bei Preisfindung oder Kreditlimits; zwingende Nutzung von SAP BRFplus.
            </li>
            <li>
              <strong>Buchungsmutation (Act & Blast Radius &ge; 4):</strong> Direkte ERP-Schreibzugriffe dürfen nur über freigegebene OData-APIs mit striktem Human-in-the-Loop Gate erfolgen (GoBD & SOX-404 Compliance).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
