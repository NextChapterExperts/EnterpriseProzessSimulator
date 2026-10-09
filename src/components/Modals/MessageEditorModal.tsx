'use client';

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getSampleMessage } from '@/data/dryRunSample';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  FileText,
  X,
  RotateCcw,
  Scissors,
  Check,
} from 'lucide-react';

interface MessageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageEditorModal: React.FC<MessageEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentTemplate,
    selectedMessageQuality,
    customMessageText,
    customSender,
    customSubject,
    setCustomMessage,
    setMessageQuality,
    language,
  } = useSimulatorStore();

  const t = TRANSLATIONS[language];
  const standardSample = getSampleMessage(currentTemplate.id, selectedMessageQuality, language);

  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');

  // Initialisieren beim Öffnen
  useEffect(() => {
    if (isOpen) {
      setText(customMessageText !== null ? customMessageText : standardSample.rawText);
      setSender(customSender !== null ? customSender : standardSample.sender);
      setSubject(customSubject !== null ? customSubject : standardSample.subject);
    }
  }, [isOpen, customMessageText, customSender, customSubject, standardSample]);

  if (!isOpen) return null;

  // Schulungs-Presets
  const handleLoadPreset = (quality: 'good' | 'poor') => {
    setMessageQuality(quality);
    const preset = getSampleMessage(currentTemplate.id, quality, language);
    setText(preset.rawText);
    setSender(preset.sender);
    setSubject(preset.subject);
  };

  // Schulungs-Aktion: Nummern gezielt löschen
  const handleSimulateMissingData = () => {
    let modified = text;
    if (currentTemplate.id === 'scope-2f1') {
      modified = modified
        .replace(/10084721/g, language === 'en' ? '??? (Number unreadable)' : '??? (Nummer unleserlich)')
        .replace(/SN-9941-K/g, '???')
        .replace(/SV-88102/g, '???');
    } else if (currentTemplate.id === 'scope-bd9') {
      modified = modified
        .replace(/FL-9021/g, language === 'en' ? 'Round-Flange' : 'Flansch-Rund')
        .replace(/DI-4410/g, language === 'en' ? 'Standard-Gasket' : 'Dichtung-Normal')
        .replace(/PO-4711-AUG/g, '');
    } else {
      modified = modified.replace(/RE-2026-9011/g, '???').replace(/RE-2026-9012/g, '???').replace(/INV-2026-9011/g, '???').replace(/INV-2026-9012/g, '???');
    }
    setText(modified);
  };

  const handleResetToStandard = () => {
    setText(standardSample.rawText);
    setSender(standardSample.sender);
    setSubject(standardSample.subject);
  };

  const handleApply = () => {
    setCustomMessage(text, sender, subject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4 text-slate-800 dark:text-slate-200">
        {/* 1. Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'en' ? 'Inbound Message Inspector & Editor' : 'Eingangsnachricht Inspektor & Editor'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en' ? 'Training mode • Inspect and modify document payloads interactively' : 'Schulungsmodus • Belegdokument ansehen und interaktiv für Testläufe verändern'}
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

        {/* 2. Schulungs-Presets Leiste */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
            <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 font-semibold mr-1">
              {language === 'en' ? 'Preset Template:' : 'Schulungs-Vorlage:'}
            </span>
            <button
              type="button"
              onClick={() => handleLoadPreset('good')}
              className={`px-2.5 py-1 rounded font-semibold text-[11px] transition ${
                selectedMessageQuality === 'good' && customMessageText === null
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'en' ? '★ Clean (Standard)' : '★ Gut (Vollständig)'}
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('poor')}
              className={`px-2.5 py-1 rounded font-semibold text-[11px] transition ${
                selectedMessageQuality === 'poor' && customMessageText === null
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'en' ? '⚠️ Noisy (Complex)' : '⚠️ Schlecht (Verrauscht)'}
            </button>
            <button
              type="button"
              onClick={handleSimulateMissingData}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/80 flex items-center space-x-1 transition"
              title={language === 'en' ? 'Strips machine IDs or SKUs to trigger error/escalation behavior' : 'Löscht Equipment- oder Artikelnummern im Text, um Fehlerverhalten zu demonstrieren'}
            >
              <Scissors className="w-3 h-3" />
              <span>{language === 'en' ? 'Strip IDs' : 'Nummern entfernen'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToStandard}
            className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.btnReset}</span>
          </button>
        </div>

        {/* 3. Metadaten-Felder (Absender & Betreff) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {language === 'en' ? 'Sender (Email / Channel):' : 'Absender (E-Mail / Kanal):'}
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-sky-700 dark:text-sky-200 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {language === 'en' ? 'Subject:' : 'Betreff:'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* 4. Der vollständige Text (Ungekürzt & editierbar) */}
        <div className="flex-1 flex flex-col space-y-1 min-h-[220px]">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {language === 'en' ? 'Full Inbound Document Payload (Email / Text):' : 'Vollständiger Dokumenten-Inhalt (E-Mail / PDF-Freitext):'}
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              {text.length} {language === 'en' ? 'characters' : 'Zeichen'} &bull; {language === 'en' ? 'Complete payload' : 'Ungekürzter Volltext'}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={13}
            className="w-full flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-800 dark:text-sky-100 leading-relaxed focus:outline-none focus:border-sky-500 resize-none shadow-inner"
            placeholder={language === 'en' ? 'Enter inbound message here...' : 'Eingangsnachricht hier eingeben...'}
          />
        </div>

        {/* 5. Footer mit Schulungs-Hinweis & Aktionen */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
            💡 <strong className="text-slate-700 dark:text-slate-300">{language === 'en' ? 'Training Tip:' : 'Schulungs-Tipp:'}</strong> {language === 'en' ? 'Modify text or remove machine IDs to see live how AI agents vs deterministic rules react.' : 'Verändere Wörter oder lösche Maschinennummern, um live zu zeigen, wie KI vs. deterministische Regeln reagieren.'}
          </p>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              {language === 'en' ? 'Cancel' : 'Abbrechen'}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-[#0A6ED1] hover:bg-sky-600 text-xs font-bold text-white shadow transition flex items-center space-x-1.5 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Apply Message' : 'Nachricht übernehmen'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
