import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getRiskChallenges, RISK_CHALLENGES_DE } from '@/data/challenges';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  Zap,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';

const CHALLENGE_KEYS = Object.keys(RISK_CHALLENGES_DE);

export const ChallengeDrawer: React.FC = () => {
  const {
    activeChallengeId,
    closeChallengeDrawer,
    openChallengeDrawer,
    language,
    steps,
    currentTemplate,
    config,
    setSelectedStepId,
    setActiveMainTab,
  } = useSimulatorStore();

  if (!activeChallengeId) return null;
  const challenges = getRiskChallenges(language);
  const challenge = challenges[activeChallengeId];
  if (!challenge) return null;

  const isEn = language === 'en';
  const currentIndex = CHALLENGE_KEYS.indexOf(activeChallengeId);
  const prevChallengeId =
    currentIndex > 0 ? CHALLENGE_KEYS[currentIndex - 1] : CHALLENGE_KEYS[CHALLENGE_KEYS.length - 1];
  const nextChallengeId =
    currentIndex < CHALLENGE_KEYS.length - 1 ? CHALLENGE_KEYS[currentIndex + 1] : CHALLENGE_KEYS[0];

  const affectedSteps = steps.filter((step) => {
    const metrics = calculateStepMetrics(step, config);
    return metrics.triggeredChallengeIds.includes(challenge.id);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-[#090e1d] border-l border-slate-200 dark:border-slate-700/80 h-full p-6 text-slate-800 dark:text-slate-100 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* 1. Drawer Header mit Navigation & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span
              className={`p-1.5 rounded-lg border ${
                challenge.severity === 'critical'
                  ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <Layers className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                <span>13-Challenges Radar &bull; {challenge.clusterName}</span>
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {challenge.id}: {challenge.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Vorherige / Nächste Challenge Navigation */}
            <button
              onClick={() => openChallengeDrawer(prevChallengeId)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              title={isEn ? 'Previous Challenge' : 'Vorherige Challenge'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 px-1">
              {currentIndex + 1}/{CHALLENGE_KEYS.length}
            </span>
            <button
              onClick={() => openChallengeDrawer(nextChallengeId)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              title={isEn ? 'Next Challenge' : 'Nächste Challenge'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            <button
              onClick={closeChallengeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isEn ? 'Close' : 'Schließen'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Schnellauswahl-Leiste aller 13 Challenges */}
        <div className="py-2.5 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-1.5">
            <span>{isEn ? 'Direct Jump to Challenge:' : 'Direktsprung zu Challenge:'}</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">{challenge.id}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {CHALLENGE_KEYS.map((cKey, idx) => {
              const ch = challenges[cKey];
              const isActive = cKey === activeChallengeId;
              const isCrit = ch?.severity === 'critical';

              return (
                <button
                  key={cKey}
                  onClick={() => openChallengeDrawer(cKey)}
                  className={`py-1 text-[10.5px] font-mono font-bold rounded border transition text-center ${
                    isActive
                      ? 'bg-sky-600 text-white border-sky-500 shadow'
                      : isCrit
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 hover:text-red-900 dark:hover:text-white'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={`${cKey}: ${ch?.name}`}
                >
                  C{idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Schweregrad, Cluster & Studenten-Band Meta-Pille */}
        <div className="my-3 space-y-2">
          {/* Studenten-Band Zuordnung */}
          <div className="flex items-center justify-between text-xs font-mono bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800/60">
            <span className="text-[10px] text-indigo-700 dark:text-indigo-400 uppercase font-bold flex items-center space-x-1.5">
              <span>🎓</span>
              <span>{isEn ? 'Student Assignment:' : 'Studenten-Zuweisung:'}</span>
            </span>
            <span className="text-indigo-900 dark:text-indigo-200 font-semibold text-[11px]">
              {(() => {
                switch (challenge.id) {
                  case 'CH_01':
                  case 'CH_02':
                  case 'CH_03':
                    return isEn
                      ? 'Student 1 • Band 1: Probabilistics & Context'
                      : 'Student 1 • Band 1: Probabilistik & Kontext';
                  case 'CH_04':
                  case 'CH_05':
                  case 'CH_06':
                  case 'CH_07':
                    return isEn
                      ? 'Student 2 • Band 2: Agent Control & Reliability'
                      : 'Student 2 • Band 2: Agenten-Kontrolle & Zuverlässigkeit';
                  case 'CH_08':
                  case 'CH_09':
                  case 'CH_10':
                  case 'CH_11':
                    return isEn
                      ? 'Student 3 • Band 3: Security, Multi-Tenant & GoBD'
                      : 'Student 3 • Band 3: Sicherheit, Mandant & GoBD-Audit';
                  case 'CH_12':
                  case 'CH_13':
                    return isEn
                      ? 'Student 4 • Band 4: Resilience, Latency & SLAs'
                      : 'Student 4 • Band 4: Kosten, Resilienz & SLA';
                  default:
                    return '';
                }
              })()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                {isEn ? 'Risk Category' : 'Risikokategorie'}
              </span>
              <span className="text-slate-800 dark:text-slate-300 font-medium">{challenge.clusterName}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                {isEn ? 'Severity Level' : 'Schweregrad'}
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px] ${
                  challenge.severity === 'critical'
                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {isEn
                  ? challenge.severity
                  : ({ critical: 'kritisch', high: 'hoch', medium: 'mittel', low: 'niedrig' } as Record<string, string>)[
                      challenge.severity
                    ] ?? challenge.severity}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Detaillierte Sektionen */}
        <div className="space-y-4 flex-1">
          {/* Risikobeschreibung */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{isEn ? 'Risk Decomposition & Business Impact' : 'Risiko-Dekomposition & Auswirkung'}</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{challenge.description}</p>
          </div>

          {/* Trigger Condition */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span>{isEn ? 'Root Cause & Technical Trigger' : 'System-Trigger & Ursache'}</span>
            </h4>
            <p className="text-xs text-sky-800 dark:text-sky-200 leading-relaxed font-mono bg-white dark:bg-slate-950/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {challenge.triggerDescription}
            </p>
          </div>

          {/* SAP Clean Core Mitigation */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 space-y-1.5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isEn ? 'SAP Clean Core Mitigation Strategy' : 'SAP Clean Core Mitigationsstrategie'}</span>
            </h4>
            <p className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed font-sans">{challenge.mitigationStrategy}</p>
          </div>

          {/* 4. Live Workflow-Kopplung: Betroffene Schritte im aktuellen Szenario */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 font-mono">
                <span className="text-sky-500 dark:text-sky-400 font-bold">⚡</span>
                <span>{isEn ? `Live Context in ${currentTemplate.scopeCode}` : `Live-Bezug in ${currentTemplate.scopeCode}`}</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentTemplate.name}
              </span>
            </div>

            {affectedSteps.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[11px] text-amber-800 dark:text-amber-300/90 font-sans">
                  {isEn
                    ? `This risk is currently active or triggered in ${affectedSteps.length} step(s) due to the selected automation tier:`
                    : `Dieses Risiko wird aktuell in ${affectedSteps.length} Schritt(en) durch die gewählte Ausführungs-Stufe provoziert:`}
                </p>
                <div className="space-y-1 pt-1">
                  {affectedSteps.map((step) => {
                    const stepIdx = steps.findIndex((s) => s.id === step.id);
                    return (
                      <div
                        key={step.id}
                        onClick={() => {
                          setSelectedStepId(step.id);
                          setActiveMainTab('simulator');
                          closeChallengeDrawer();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-950/80 border border-amber-200 dark:border-amber-900/40 hover:border-sky-500 dark:hover:border-sky-500/70 cursor-pointer transition text-xs group"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                            {stepIdx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition truncate max-w-[240px]">
                            {step.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono uppercase">
                            {step.currentArchetype}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>
                  {isEn
                    ? 'In the current configuration, this risk is successfully mitigated (0 steps at risk).'
                    : 'In der aktuellen Konfiguration wird dieses Risiko erfolgreich abgewendet (0 Schritte gefährdet).'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Footer mit Vor / Zurück Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openChallengeDrawer(prevChallengeId)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Previous' : 'Zurück'}</span>
            </button>
            <button
              onClick={() => openChallengeDrawer(nextChallengeId)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition flex items-center space-x-1"
            >
              <span>{isEn ? 'Next' : 'Weiter'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={closeChallengeDrawer}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-lg transition"
          >
            {isEn ? 'Close' : 'Schließen'}
          </button>
        </div>
      </div>
    </div>
  );
};
