'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { WorkflowView } from '@/components/CleanWorkflow/WorkflowView';
import { TrainingMatrixView } from '@/components/TrainingMatrix/TrainingMatrixView';
import { ChallengeDrawer } from '@/components/Modals/ChallengeDrawer';
import { EvaluationMatrixModal } from '@/components/Modals/EvaluationMatrixModal';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export default function Home() {
  const { activeMainTab } = useSimulatorStore();

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 overflow-hidden select-none transition-colors duration-150">
      {/* Header Bar */}
      <Header />

      {/* Hauptbereich: Workflow Simulator ODER Methoden- & Schulungsmatrix */}
      <main className="flex-1 flex overflow-hidden">
        {activeMainTab === 'simulator' && <WorkflowView />}
        {activeMainTab === 'matrix' && <TrainingMatrixView />}
      </main>

      {/* Globaler 13-Challenges Audit-Radar Drawer */}
      <ChallengeDrawer />

      {/* Globales Bewertungsmatrix & Evaluationsmodell Modal */}
      <EvaluationMatrixModal />
    </div>
  );
}
