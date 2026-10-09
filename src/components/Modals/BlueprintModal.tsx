'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { X, Printer, Layers, CheckCircle2 } from 'lucide-react';
import { InfoTip } from '@/components/common/InfoTip';

export const BlueprintModal: React.FC = () => {
  const { isBlueprintOpen, toggleBlueprint, currentTemplate, steps, config, metrics, language } = useSimulatorStore();

  if (!isBlueprintOpen) return null;

  const isEn = language === 'en';
  const locale = isEn ? 'en-US' : 'de-DE';
  const fmt = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 0 });

  const handlePrint = () => {
    window.print();
  };

  const L = isEn
    ? {
        printBtn: 'Print / Export PDF',
        businessArea: 'Business area',
        date: 'Date',
        monthlyVolume: 'Monthly volume',
        documents: 'documents',
        vsManual: 'vs. manual',
        perMonth: '€/mo',
        inference: 'inference',
        lightsOutSub: 'Straight-through processing',
        sizingTitle: 'SAP BTP Sizing & Architecture Configuration',
        colStep: 'Step',
        colArchetype: 'Archetype',
        colLatency: 'Latency',
        colCost: 'Cost/mo',
        level: 'Level',
        recTitle: 'Enterprise Architecture Recommendation (SAP BTP Clean Core)',
        rec: [
          {
            head: 'Observe phase:',
            body: (
              <>
                Using <em>SAP Document Information Extraction (DOX)</em> with an upstream Pydantic validation gate
                prevents context drift on unstructured emails.
              </>
            ),
          },
          {
            head: 'Orient phase:',
            body: (
              <>
                Mandatory use of the <em>SAP HANA Cloud Vector Engine / Trigram Fuzzy Search</em> against KNA1/MARA to
                fully prevent hallucinated customer and material IDs.
              </>
            ),
          },
          {
            head: 'Decide phase:',
            body: (
              <>
                Pricing and credit limit checks must remain in <em>SAP BRFplus</em> or the ERP pricing procedure to rule
                out prompt injections.
              </>
            ),
          },
          {
            head: 'Act phase & Blast Radius ≥ 4:',
            body: (
              <>
                Write operations on the ERP require a deterministic OData posting (side-by-side extension on BTP) or a{' '}
                <em>human-in-the-loop approval gate</em> (SOX-404 / GoBD compliant).
              </>
            ),
          },
        ],
      }
    : {
        printBtn: 'Drucken / PDF Export',
        businessArea: 'Geschäftsbereich',
        date: 'Datum',
        monthlyVolume: 'Monatsvolumen',
        documents: 'Belege',
        vsManual: 'vs. Manuell',
        perMonth: '€/M',
        inference: 'Inferenz',
        lightsOutSub: 'Dunkelverarbeitung',
        sizingTitle: 'SAP BTP Sizing & Architektur-Konfiguration',
        colStep: 'Schritt',
        colArchetype: 'Archetyp',
        colLatency: 'Latenz',
        colCost: 'Kosten/M',
        level: 'Stufe',
        recTitle: 'Enterprise-Architektur Empfehlung (SAP BTP Clean Core)',
        rec: [
          {
            head: 'Observe-Phase:',
            body: (
              <>
                Einsatz von <em>SAP Document Information Extraction (DOX)</em> mit vorgeschaltetem
                Pydantic-Validierungs-Gate verhindert Context Drift bei unstrukturierten E-Mails.
              </>
            ),
          },
          {
            head: 'Orient-Phase:',
            body: (
              <>
                Zwingende Nutzung der <em>SAP HANA Cloud Vector Engine / Trigram Fuzzy Search</em> gegen KNA1/MARA zur
                vollständigen Vermeidung von Halluzinationen bei Debitoren- und Material-IDs.
              </>
            ),
          },
          {
            head: 'Decide-Phase:',
            body: (
              <>
                Preisfindung und Kreditlimitprüfungen verbleiben zwingend in <em>SAP BRFplus</em> oder im
                ERP-Konditionsschema, um Prompt Injections auszuschließen.
              </>
            ),
          },
          {
            head: 'Act-Phase & Blast Radius ≥ 4:',
            body: (
              <>
                Schreibende ERP-Mutationen erfordern zwingend eine deterministische OData-Verbuchung (Side-by-Side
                Extension auf BTP) oder ein <em>Human-in-the-Loop Freigabe-Gate</em> (SOX-404 / GoBD konform).
              </>
            ),
          },
        ],
      };

  const thClass = 'p-2 border-b border-slate-200 dark:border-slate-800 print:border-slate-300';
  const cardLabel = 'text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 print:text-slate-600 flex items-center';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 print:bg-white print:text-black border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:border-none print:shadow-none">
        {/* Modal Actions Header (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 print:hidden">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#0A6ED1]" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">SAP Enterprise Architecture Management Blueprint</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0A6ED1] hover:bg-sky-600 text-xs font-semibold text-white transition shadow"
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
        <div className="flex-1 p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100 print:text-black print:p-4 text-xs font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-slate-200 dark:border-slate-700 print:border-black pb-4 flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 print:text-blue-700 tracking-wider">
                SAP BTP &amp; Clean Core Advisory Report
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white print:text-black mt-1">
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
              <div className="flex items-center justify-end">
                Data Noise Level: {Math.round(config.dataNoiseRate * 100)} %
                <InfoTip term="dataNoise" />
              </div>
            </div>
          </div>

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 print:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 print:border-slate-300">
              <div className={cardLabel}>
                Total Cost of Automation
                <InfoTip term="totalCostOfAutomation" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white print:text-black mt-1 font-mono">
                {fmt(metrics.totalCostOfAutomationEur)} {L.perMonth}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 print:text-emerald-700 mt-0.5">
                -{fmt(metrics.monthlySavingsVsManualEur)} € {L.vsManual}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 print:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 print:border-slate-300">
              <div className={cardLabel}>
                SAP Capacity Units (CU)
                <InfoTip term="capacityUnits" />
              </div>
              <div className="text-lg font-bold text-sky-600 dark:text-sky-400 print:text-blue-800 mt-1 font-mono">
                {fmt(metrics.sapCapacityUnits)} CU
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                ~{fmt(metrics.sapCuCostEur)} € {L.inference}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 print:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 print:border-slate-300">
              <div className={cardLabel}>
                Lights-Out Automation
                <InfoTip term="stp" />
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 print:text-emerald-800 mt-1 font-mono">
                {metrics.lightsOutAutomationRate} %
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">{L.lightsOutSub}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 print:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 print:border-slate-300">
              <div className={cardLabel}>
                Clean Core Index
                <InfoTip term="cleanCoreIndex" />
              </div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 print:text-indigo-800 mt-1 font-mono">
                {metrics.cleanCoreScore} %
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">Compliance Score</div>
            </div>
          </div>

          {/* Sizing & Schritt-Tabelle */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white print:text-black mb-2 flex items-center space-x-1.5">
              <span>{L.sizingTitle}</span>
            </h3>
            <table className="w-full border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-lg text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 print:bg-slate-200 text-slate-600 dark:text-slate-400 print:text-slate-700 text-[10px] uppercase font-bold">
                <tr>
                  <th className={thClass}>{L.colStep}</th>
                  <th className={thClass}>
                    <span className="inline-flex items-center">
                      OODA / Primitive
                      <InfoTip term="ooda" />
                    </span>
                  </th>
                  <th className={thClass}>{L.colArchetype}</th>
                  <th className={thClass}>
                    <span className="inline-flex items-center">
                      Gate
                      <InfoTip term="confidenceGate" />
                    </span>
                  </th>
                  <th className={thClass}>
                    <span className="inline-flex items-center">
                      Clean Core
                      <InfoTip term="cleanCore" />
                    </span>
                  </th>
                  <th className={thClass}>
                    <span className="inline-flex items-center">
                      Blast Radius
                      <InfoTip term="blastRadius" />
                    </span>
                  </th>
                  <th className={thClass}>{L.colLatency}</th>
                  <th className={`${thClass} text-right`}>{L.colCost}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300 font-mono text-[11px]">
                {steps.map((step) => {
                  const m = calculateStepMetrics(step, config);
                  return (
                    <tr key={step.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/40 print:hover:bg-transparent">
                      <td className="p-2 font-sans font-medium text-slate-900 dark:text-white print:text-black">{step.name}</td>
                      <td className="p-2 text-slate-500 dark:text-slate-400 print:text-slate-700">
                        {step.oodaPhase} &bull; {step.primitive}
                      </td>
                      <td className="p-2 font-bold text-sky-600 dark:text-sky-400 print:text-blue-800 uppercase">{step.currentArchetype}</td>
                      <td className="p-2 text-slate-600 dark:text-slate-300 print:text-slate-800">{step.confidenceGate} %</td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            step.cleanCoreIndex === 'COMPLIANT'
                              ? 'text-emerald-600 dark:text-emerald-400 print:text-emerald-800'
                              : 'text-amber-600 dark:text-amber-400 print:text-amber-800'
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

          {/* Architektur-Empfehlungen für den CIO */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 print:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 print:text-blue-800 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{L.recTitle}</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 print:text-slate-800 leading-relaxed">
              {L.rec.map((r, i) => (
                <li key={i}>
                  <strong>{r.head}</strong> {r.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
