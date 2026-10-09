'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { getGlossaryEntry } from '@/i18n/glossary';

interface InfoTipProps {
  /** Schlüssel im Glossar (src/i18n/glossary.ts) */
  term?: string;
  /** Alternativ: Benutzerdefinierter Titel */
  title?: string;
  /** Alternativ: Benutzerdefinierte Erklärung */
  text?: string;
  /** Alternativ: Zusätzliche Details */
  details?: string;
  className?: string;
}

const POPOVER_WIDTH = 300;

/**
 * Klickbares ⓘ-Symbol, das eine kurze, zweisprachige Begriffserklärung als Popover anzeigt.
 * Das Popover wird per Portal gerendert, damit es nicht von overflow-Containern abgeschnitten wird.
 */
export const InfoTip: React.FC<InfoTipProps> = ({ term, title, text, details, className = '' }) => {
  const language = useSimulatorStore((s) => s.language);
  const glossaryEntry = term ? getGlossaryEntry(term, language) : null;
  const entry = glossaryEntry || (title && text ? { term: title, short: text, details } : null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popId = useId();

  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = r.left + r.width / 2 - POPOVER_WIDTH / 2;
    left = Math.max(8, Math.min(left, vw - POPOVER_WIDTH - 8));
    const placeAbove = r.bottom + 220 > vh && r.top > 220;
    const top = placeAbove ? r.top - 8 : r.bottom + 8;
    setPos({ top, left, placeAbove });
  }, []);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target) || btnRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onScroll = () => updatePosition();
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, updatePosition]);

  if (!entry) return null;

  const label = language === 'en' ? `What is “${entry.term}”?` : `Was bedeutet „${entry.term}“?`;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center justify-center align-middle shrink-0 w-3.5 h-3.5 ml-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-300 focus-visible:text-sky-600 dark:focus-visible:text-sky-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 transition print:hidden normal-case ${
          open ? 'text-sky-600 dark:text-sky-300' : ''
        } ${className}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open &&
        pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popRef}
            id={popId}
            role="dialog"
            aria-label={entry.term}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: POPOVER_WIDTH,
              transform: pos.placeAbove ? 'translateY(-100%)' : undefined,
              zIndex: 1000,
            }}
            className="rounded-xl border border-slate-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 p-3 text-left font-sans normal-case tracking-normal select-text print:hidden"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-[12px] font-bold text-sky-700 dark:text-sky-300 leading-snug">{entry.term}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={language === 'en' ? 'Close' : 'Schließen'}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11.5px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal">{entry.short}</p>
            {entry.details && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5 font-normal">{entry.details}</p>
            )}
          </div>,
          document.body
        )}
    </>
  );
};
