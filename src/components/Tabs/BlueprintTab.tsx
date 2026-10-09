'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { Printer, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

export const BlueprintTab: React.FC = () => {
  const { currentTemplate, steps, config, metrics } = useSimulatorStore();

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
