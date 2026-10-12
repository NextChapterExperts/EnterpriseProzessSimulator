'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getProcessTemplates } from '@/data/templates';
import { ProcessTemplate } from '@/types/process';
import { TRANSLATIONS } from '@/i18n/translations';
import { CreateWorkflowModal } from '@/components/Modals/CreateWorkflowModal';
import { Layers, Workflow, Play, Compass, Info, Sun, Moon, Scale } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTemplate,
    customTemplates,
    selectTemplate,
    activeMainTab,
    setActiveMainTab,
    language,
    setLanguage,
    openProcessKnowledge,
    openEvaluationMatrix,
    theme,
    setTheme,
  } = useSimulatorStore();

  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const t = TRANSLATIONS[language];
  const templates = getProcessTemplates(language);
  const allAvailableTemplates = React.useMemo(() => {
    const map = new Map<string, ProcessTemplate>();
    templates.forEach((t) => map.set(t.id, t));
    customTemplates.forEach((t) => map.set(t.id, t));
    return Array.from(map.values());
  }, [templates, customTemplates]);

  return (
    <header className="bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm dark:shadow-xl select-none transition-colors duration-150">
      {/* Brand & Titel */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#0A6ED1] to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            {t.appTitle}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Haupt-Tabs: Simulator vs. Methoden- & Schulungsmatrix */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-1 space-x-1 shadow-inner">
        <button
          onClick={() => setActiveMainTab('simulator')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeMainTab === 'simulator'
              ? 'bg-[#0A6ED1] text-white shadow-md shadow-sky-900/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>{t.tabSimulator}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('matrix')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeMainTab === 'matrix'
              ? 'bg-[#0A6ED1] text-white shadow-md shadow-sky-900/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t.tabMatrix}</span>
        </button>
      </div>

      {/* Theme-Umschalter, Szenario Auswahl, Sprachschalter & Neuer Workflow Button */}
      <div className="flex items-center space-x-3">
        {/* Theme-Umschalter Hell (☀️) / Dunkel (🌙) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-inner" title={t.themeTooltip}>
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-bold transition ${
              theme === 'light'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
            title={t.themeLight}
          >
            <Sun className="w-3.5 h-3.5 text-amber-900" />
            <span>{t.themeLight}</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-bold transition ${
              theme === 'dark'
                ? 'bg-[#0A6ED1] text-white shadow-sm font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
            title={t.themeDark}
          >
            <Moon className="w-3.5 h-3.5 text-slate-500 dark:text-sky-300" />
            <span>{t.themeDark}</span>
          </button>
        </div>

        {/* Sprach-Umschalter DE / EN */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-inner">
          <button
            onClick={() => setLanguage('de')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-bold transition ${
              language === 'de'
                ? 'bg-[#0A6ED1] text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
            title="Deutsch"
          >
            <span>🇩🇪</span>
            <span>DE</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-bold transition ${
              language === 'en'
                ? 'bg-[#0A6ED1] text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
            title="English"
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>

        {/* Szenario Dropdown */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.scenarioLabel}</span>
          <select
            value={currentTemplate.id}
            onChange={(e) => selectTemplate(e.target.value)}
            className="bg-white dark:bg-slate-950 text-slate-900 dark:text-sky-300 rounded px-2.5 py-1 font-semibold text-xs border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer max-w-[200px] truncate shadow-sm dark:shadow-none"
          >
            {allAvailableTemplates.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.scopeCode} – {tmpl.name}
              </option>
            ))}
          </select>
          <button
            onClick={openProcessKnowledge}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-white transition"
            title={t.tooltipProcessInfo}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Button: Bewertungsmatrix & Evaluationsmodell */}
        <button
          onClick={openEvaluationMatrix}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 text-xs font-semibold transition active:scale-95 shadow-sm"
          title={t.tooltipEvaluationMatrix}
        >
          <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{t.btnEvaluationMatrix}</span>
        </button>

        {/* Button: Neuen Workflow anlegen & modellieren */}
        <button
          onClick={() => setShowCreatorModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-xs font-semibold transition active:scale-95 shadow-sm"
          title={t.btnModelWithAi}
        >
          <Workflow className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{t.btnModelWithAi}</span>
        </button>
      </div>

      {/* Neuer Workflow Creator Modal */}
      <CreateWorkflowModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
      />
    </header>
  );
};
