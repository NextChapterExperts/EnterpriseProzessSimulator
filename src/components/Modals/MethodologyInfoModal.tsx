'use client';

import React, { useEffect } from 'react';
import { MethodologyInfoItem, getMethodologyItem } from '@/data/methodologyTraining';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { TRANSLATIONS } from '@/i18n/translations';
import { X, Info, CheckCircle2, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface MethodologyInfoModalProps {
  item: MethodologyInfoItem | null;
  onClose: () => void;
}

export const MethodologyInfoModal: React.FC<MethodologyInfoModalProps> = ({ item, onClose }) => {
  const { language } = useSimulatorStore();
  const t = TRANSLATIONS[language];

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const activeItem = getMethodologyItem(item.id, language) || item;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-4 my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${activeItem.badgeColor}`}
              >
                {activeItem.categoryLabel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {activeItem.title}
            </h3>
            <p className="text-xs text-sky-700 dark:text-sky-400 font-mono">{activeItem.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition shrink-0"
            title={language === 'en' ? 'Close (ESC)' : 'Schließen (ESC)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kurzbeschreibung & Kognitive Rolle */}
        <div className="bg-slate-50 dark:bg-slate-900/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5 text-xs">
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{language === 'en' ? 'Cognitive Role & Purpose:' : 'Kognitive Rolle & Zweck:'}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{activeItem.shortDesc}</p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-800/80">
            <strong className="text-slate-900 dark:text-slate-200">{language === 'en' ? 'Why Needed: ' : 'Warum nötig: '}</strong>
            {activeItem.whyNeeded}
          </p>
        </div>

        {/* Spezieller Business-Use-Case Block (z. B. Warum Copilot trotz Stopp?) */}
        {activeItem.businessUseCases && activeItem.businessUseCases.length > 0 && (
          <div className="bg-sky-50 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 border border-sky-200 dark:border-sky-800/70 p-3.5 rounded-xl space-y-2.5">
            <div className="flex items-center space-x-2 border-b border-sky-200 dark:border-sky-800/50 pb-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider font-mono">
                {language === 'en' ? 'Key Architectural Insight: Why deploy here?' : 'Schlüssel-Erkenntnis: Warum hier einsetzen?'}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {activeItem.businessUseCases.map((uc, i) => (
                <div key={i} className="bg-white dark:bg-slate-950/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="font-semibold text-slate-900 dark:text-white text-[11.5px] mb-0.5">{uc.title}</div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{uc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameter / Kennwerte */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{language === 'en' ? 'Control Parameters & Characteristics:' : 'Steuer-Parameter & Charakteristika:'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {activeItem.parametersOrCharacteristics.map((p, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">{p.label}</div>
                <div className="font-semibold text-slate-900 dark:text-slate-200 text-[11px] mt-0.5 leading-snug">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAP Implementierung & Praxisbeispiel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 dark:text-slate-400 text-[10.5px] font-mono uppercase font-semibold flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{language === 'en' ? 'SAP BTP Technology:' : 'SAP BTP Technologie:'}</span>
            </div>
            <div className="text-sky-700 dark:text-sky-300 font-mono text-[11px] leading-snug">
              {activeItem.sapImplementation}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 dark:text-slate-400 text-[10.5px] font-mono uppercase font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'en' ? 'Practical Example:' : 'Praxis-Beispiel:'}</span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {activeItem.practicalExample}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <span className="text-[10.5px] text-slate-500 font-mono">
            {t.modalEscHint}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A6ED1] hover:bg-sky-600 text-xs font-semibold text-white rounded-lg transition shadow-sm"
          >
            {t.modalBtnUnderstood}
          </button>
        </div>
      </div>
    </div>
  );
};
