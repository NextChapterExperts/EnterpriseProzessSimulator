'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { ProcessTimeline } from './ProcessTimeline';
import { HeroStepCenter } from './HeroStepCenter';
import { StepAdvisorySidebar } from './StepAdvisorySidebar';
import { ZwingmannInfoModal } from '@/components/Modals/ZwingmannInfoModal';

export const TimelineWorkspace: React.FC = () => {
  const { activeZwingmannInfo, closeZwingmannInfo } = useSimulatorStore();

  return (
    <div className="flex-1 flex w-full h-full overflow-hidden select-none bg-[#080d1a]">
      {/* 1. Spalte Links (~330px): Navigator mit Zwingmann-Buttons an jeder Box */}
      <ProcessTimeline />

      {/* 2. Spalte Mitte (Flex-1): DER HERO STEP (Datenfluss: Input -> Engine -> Output) */}
      <HeroStepCenter />

      {/* 3. Spalte Rechts (~360px): Steuerung & Advisory Panel */}
      <StepAdvisorySidebar />

      {/* Zwingmann Methodologie Info Modal */}
      <ZwingmannInfoModal
        archetype={activeZwingmannInfo}
        onClose={closeZwingmannInfo}
      />
    </div>
  );
};
