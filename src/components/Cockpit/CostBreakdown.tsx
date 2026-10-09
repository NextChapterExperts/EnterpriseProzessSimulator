'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { Coins, Users, ShieldAlert, TrendingDown } from 'lucide-react';

export const CostBreakdown: React.FC = () => {
  const { metrics, language } = useSimulatorStore();
  const isEn = language === 'en';

  const total = metrics.totalCostOfAutomationEur || 1;
  const cuPercent = Math.round((metrics.sapCuCostEur / total) * 100);
  const humanPercent = Math.round((metrics.humanEscalationCostEur / total) * 100);
  const riskPercent = Math.round((metrics.riskDamageCostEur / total) * 100);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
          <Coins className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{isEn ? 'TCA Cost Breakdown (Monthly)' : 'TCA Kostenzerlegung (Monat)'}</span>
        </h4>
        <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
          {metrics.totalCostOfAutomationEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
        </span>
      </div>

      {/* Stacked Bar Visualisierung */}
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full flex overflow-hidden border border-slate-200 dark:border-slate-800">
        <div
          style={{ width: `${cuPercent}%` }}
          className="bg-sky-500 transition-all duration-300"
          title={`SAP BTP CU: ${metrics.sapCuCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} € (${cuPercent}%)`}
        />
        <div
          style={{ width: `${humanPercent}%` }}
          className="bg-amber-500 transition-all duration-300"
          title={`Human Escalation: ${metrics.humanEscalationCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} € (${humanPercent}%)`}
        />
        <div
          style={{ width: `${riskPercent}%` }}
          className="bg-red-500 transition-all duration-300"
          title={`Blast Radius Risk: ${metrics.riskDamageCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} € (${riskPercent}%)`}
        />
      </div>

      {/* Legende mit Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded bg-sky-500" />
            <span className="text-slate-700 dark:text-slate-300">SAP BTP AI Core (CU)</span>
          </div>
          <div className="text-right font-mono">
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {metrics.sapCuCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
            </span>
            <span className="text-[10px] text-slate-500 ml-1.5">
              ({metrics.sapCapacityUnits.toLocaleString(isEn ? 'en-US' : 'de-DE')} CU)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span className="text-slate-700 dark:text-slate-300">
              {isEn ? 'Human-in-the-Loop TCO' : 'Human-in-the-Loop TCO'}
            </span>
          </div>
          <div className="text-right font-mono">
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {metrics.humanEscalationCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
            </span>
            <span className="text-[10px] text-slate-500 ml-1.5">({humanPercent}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded bg-red-500" />
            <span className="text-slate-700 dark:text-slate-300">
              {isEn ? 'Blast Radius Risk Costs' : 'Blast Radius Risikokosten'}
            </span>
          </div>
          <div className="text-right font-mono">
            <span className="font-bold text-red-600 dark:text-red-300">
              {metrics.riskDamageCostEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €
            </span>
            <span className="text-[10px] text-slate-500 ml-1.5">({riskPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Delta vs Manual Baseline */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <TrendingDown className="w-4 h-4" />
          <span>{isEn ? 'Savings vs. Manual:' : 'Ersparnis vs. Manuell:'}</span>
        </div>
        <div className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {metrics.monthlySavingsVsManualEur.toLocaleString(isEn ? 'en-US' : 'de-DE')} €/{isEn ? 'mo' : 'M'}
        </div>
      </div>
    </div>
  );
};
