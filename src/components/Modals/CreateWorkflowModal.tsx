'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { ProcessTemplate, ProcessStep } from '@/types/process';
import { getProcessTemplates } from '@/data/templates';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  X,
  Workflow,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FolderOpen,
  ClipboardPaste,
} from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Verfügbare Standard-Blueprints aus dem zentralen Verzeichnis
const AVAILABLE_BLUEPRINTS: Array<{
  id: string;
  name: string;
  scope: string;
  description: string;
  path: string;
  jsonUrl: string;
}> = [
  {
    id: 'scope-j11-4e9',
    name: 'Professional Services: T&E Billing & Real-Time WIP Recognition',
    scope: 'J11/4E9/1IL',
    description: 'S/4HANA Cloud Public Edition: Zeiterfassung, Spesen, Universal Journal EBRR (SPTMWP) und Manage Project Billing.',
    path: 'process_blueprints/01_professional_services_wip/workflow.json',
    jsonUrl: '/blueprints/01_professional_services_wip/workflow.json',
  },
];

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, addCustomTemplate, customTemplates } = useSimulatorStore();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'upload' | 'blueprints' | 'paste'>('blueprints');
  const [jsonText, setJsonText] = useState<string>('');
  const [parsedTemplate, setParsedTemplate] = useState<ProcessTemplate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAlreadyLoaded = useMemo(() => {
    if (!parsedTemplate) return false;
    const builtIns = getProcessTemplates(language);
    return (
      builtIns.some((t) => t.id === parsedTemplate.id) ||
      customTemplates.some(
        (t) => t.id === parsedTemplate.id || (t.scopeCode === parsedTemplate.scopeCode && t.name === parsedTemplate.name)
      )
    );
  }, [parsedTemplate, language, customTemplates]);

  if (!isOpen) return null;

  const validateAndSetTemplate = (rawJson: string, sourceName?: string) => {
    try {
      setErrorMessage(null);
      const parsed = JSON.parse(rawJson);

      if (!parsed.name || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
        throw new Error(
          language === 'en'
            ? 'Invalid template: Missing "name" or non-empty "steps" array.'
            : 'Ungültiger Blueprint: Pflichtfelder "name" oder "steps" (nicht leer) fehlen.'
        );
      }

      // Schritte absichern und formatieren
      const validatedSteps: ProcessStep[] = parsed.steps.map((s: any, idx: number) => ({
        id: s.id || `step-${idx + 1}`,
        name: s.name || `Schritt ${idx + 1}`,
        oodaPhase: s.oodaPhase || 'Observe',
        primitive: s.primitive || 'Filter / Gatekeeper',
        currentArchetype: 'deterministic',
        confidenceGate: typeof s.confidenceGate === 'number' ? s.confidenceGate : 90,
        cleanCoreIndex: s.cleanCoreIndex || 'COMPLIANT',
        reversibility: s.reversibility || 1,
        isUnstructuredInput: Boolean(s.isUnstructuredInput),
        baseLatencyMs: typeof s.baseLatencyMs === 'number' ? s.baseLatencyMs : 100,
        baseTokensIn: typeof s.baseTokensIn === 'number' ? s.baseTokensIn : 0,
        baseTokensOut: typeof s.baseTokensOut === 'number' ? s.baseTokensOut : 0,
        damageAmountEur: typeof s.damageAmountEur === 'number' ? s.damageAmountEur : 100,
        sapReference: s.sapReference || 'SAP Standard',
        description: s.description || '',
        sapGoldenPathTool: s.sapGoldenPathTool,
        sapGoldenPathGraph: s.sapGoldenPathGraph,
        euAiActRisk: s.euAiActRisk || 'MINIMAL',
        businessIntent: s.businessIntent,
        inputDescription: s.inputDescription,
        outputDescription: s.outputDescription,
        requiredLicense: s.requiredLicense,
      }));

      const template: ProcessTemplate = {
        id: parsed.id || `custom-${Date.now()}`,
        scopeCode: parsed.scopeCode || 'CUSTOM',
        name: parsed.name,
        businessArea: parsed.businessArea || 'Enterprise Business Process',
        description: parsed.description || '',
        steps: validatedSteps,
      };

      setParsedTemplate(template);
      if (sourceName) setFileName(sourceName);
    } catch (err: any) {
      setParsedTemplate(null);
      setErrorMessage(err.message || 'JSON Parse-Fehler');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
        validateAndSetTemplate(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadBlueprint = async (bp: typeof AVAILABLE_BLUEPRINTS[0]) => {
    try {
      setErrorMessage(null);
      setFileName(bp.name);
      const res = await fetch(bp.jsonUrl);
      if (!res.ok) {
        throw new Error(`Fehler beim Laden von ${bp.jsonUrl} (Status: ${res.status})`);
      }
      const text = await res.text();
      setJsonText(text);
      validateAndSetTemplate(text, bp.name);
    } catch (err: any) {
      // Fallback: versuche direkt aus templates.ts zu laden
      setErrorMessage(err.message);
    }
  };

  const handleApplyWorkflow = () => {
    if (!parsedTemplate) return;
    addCustomTemplate(parsedTemplate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-5 my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#0A6ED1] to-sky-400 text-white font-bold shadow-lg shadow-sky-500/20">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {language === 'en' ? 'Import Architecture Blueprint' : 'Workflow aus Architecture-Blueprint importieren'}
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-mono">
                {language === 'en'
                  ? 'Standard path: Load machine-readable blueprint JSON directly into simulation'
                  : 'Standardweg: Maschinenlesbares Blueprint-JSON direkt in die Simulation laden'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab-Auswahl: Wie soll das JSON geladen werden? */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('blueprints')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'blueprints'
                ? 'bg-[#0A6ED1] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Available Blueprints' : 'Verfügbare Blueprints'}</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'upload'
                ? 'bg-[#0A6ED1] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Upload JSON' : 'JSON-Datei auswählen'}</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'paste'
                ? 'bg-[#0A6ED1] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Paste JSON' : 'JSON einfügen'}</span>
          </button>
        </div>

        {/* Tab-Inhalte */}
        <div className="space-y-4">
          {activeTab === 'blueprints' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en'
                  ? 'Select an existing blueprint from the central process repository:'
                  : 'Wähle einen bestehenden Blueprint aus dem zentralen Prozess-Verzeichnis:'}
              </p>
              <div className="space-y-2">
                {AVAILABLE_BLUEPRINTS.map((bp) => (
                  <div
                    key={bp.id}
                    onClick={() => handleLoadBlueprint(bp)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 hover:border-[#0A6ED1] dark:hover:border-sky-500 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A6ED1]/10 text-[#0A6ED1] dark:text-sky-400 border border-[#0A6ED1]/20">
                          {bp.scope}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0A6ED1] dark:group-hover:text-sky-400 transition">
                          {bp.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {bp.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A6ED1] dark:group-hover:text-sky-400 transition ml-3 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-[#0A6ED1] dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
                <FileJson className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {language === 'en'
                    ? 'Click to select workflow.json or drag file here'
                    : 'Klicken, um workflow.json von der Festplatte zu wählen'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'en' ? 'Accepts valid ProcessTemplate JSON' : 'Akzeptiert ProcessTemplate JSON aus dem Blueprint-Verzeichnis'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-2">
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  if (e.target.value.trim()) {
                    validateAndSetTemplate(e.target.value, 'Eingefügtes JSON');
                  } else {
                    setParsedTemplate(null);
                    setErrorMessage(null);
                  }
                }}
                placeholder={
                  language === 'en'
                    ? 'Paste your workflow.json content here...'
                    : 'Füge hier den Inhalt der workflow.json aus dem Blueprint ein...'
                }
                rows={8}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0A6ED1]"
              />
            </div>
          )}

          {/* Fehlermeldung */}
          {errorMessage && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Vorschau bei erfolgreichem Parsen */}
          {parsedTemplate && (
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    {language === 'en' ? 'Blueprint Ready to Load' : 'Blueprint erfolgreich erkannt'}
                  </span>
                </div>
                {fileName && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {fileName}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">
                  {parsedTemplate.name}{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    ({parsedTemplate.scopeCode})
                  </span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {parsedTemplate.description}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  {parsedTemplate.steps.length} {language === 'en' ? 'Steps configured' : 'Prozessschritte konfiguriert'} (
                  {parsedTemplate.steps.map((s) => s.oodaPhase[0]).join(' → ')})
                </p>
              </div>

              {/* Hinweis bei bereits existierendem Workflow */}
              {isAlreadyLoaded && (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                  {language === 'en'
                    ? 'ℹ This workflow already exists in the simulator. Loading will update (overwrite) it without creating a duplicate.'
                    : 'ℹ Dieser Workflow existiert bereits im Simulator. Beim Laden wird er aktualisiert (überschrieben), ohne einen doppelten Eintrag zu erzeugen.'}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleApplyWorkflow}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0A6ED1] hover:bg-[#0854a0] text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>
                  {isAlreadyLoaded
                    ? (language === 'en' ? 'Update & Reload Workflow' : 'Workflow aktualisieren & neu laden')
                    : (language === 'en' ? 'Load Workflow into Simulator' : 'Workflow in Simulator laden & visualisieren')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
