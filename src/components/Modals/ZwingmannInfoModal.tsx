'use client';

import React from 'react';
import { AutomationArchetype } from '@/types/process';
import { getZwingmannTiers } from '@/data/zwingmann';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { X, Info, Clock, Coins, CheckCircle2 } from 'lucide-react';

interface ZwingmannInfoModalProps {
  archetype: AutomationArchetype | null;
  onClose: () => void;
}

export const ZwingmannInfoModal: React.FC<ZwingmannInfoModalProps> = ({ archetype, onClose }) => {
  const { language } = useSimulatorStore();
  const t = TRANSLATIONS[language];

  if (!archetype) return null;
  const tiers = getZwingmannTiers(language);
  const tier = tiers[archetype];
  if (!tier) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                {language === 'en' ? 'Zwingmann Methodology' : 'Zwingmann-Methodologie'}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{tier.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={language === 'en' ? 'Close' : 'Schließen'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Beschreibung & Kognitive Einordnung */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-sky-600 dark:text-sky-400 font-bold">{tier.zwingmannLevel}</span>
            <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
              {tier.zwingmannConcept}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            {tier.fullDesc}
          </p>
        </div>

        {/* SAP-Architektur Pendant */}
        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-mono font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1.5">
            <span>🏛️ {language === 'en' ? 'SAP Architecture Equivalent:' : 'Offizielles SAP BTP / S/4HANA Äquivalent:'}</span>
          </div>
          <div className="text-xs text-slate-800 dark:text-slate-200 font-mono font-semibold">
            {tier.sapEquivalent}
          </div>
        </div>

        {/* Terminologie-Kollision & Abgrenzung (Falls vorhanden) */}
        {tier.terminologyAlert && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1.5">
              <span>{tier.terminologyAlert.title}</span>
            </div>
            <p className="text-amber-900 dark:text-amber-200/90 text-[11px] leading-relaxed">
              {tier.terminologyAlert.description}
            </p>
          </div>
        )}

        {/* Technische Kennwerte */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500">
                {language === 'en' ? 'Typical Latency' : 'Typische Latenz'}
              </div>
              <div className="font-bold text-slate-900 dark:text-white">{tier.latencyText}</div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <Coins className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500">
                {language === 'en' ? 'Inference Cost' : 'Inferenzkosten'}
              </div>
              <div className="font-bold text-emerald-700 dark:text-emerald-300">{tier.cuText}</div>
            </div>
          </div>
        </div>

        {/* Empfehlung */}
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-xs space-y-1">
          <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{language === 'en' ? 'Recommended Deployment Scope:' : 'Optimaler Einsatzbereich:'}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">{tier.recommendedFor}</p>
        </div>

        {/* Schließen Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A6ED1] hover:bg-sky-600 text-xs font-semibold text-white rounded-lg transition"
          >
            {t.modalBtnUnderstood}
          </button>
        </div>
      </div>
    </div>
  );
};
