'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { UserX, Clock, Euro } from 'lucide-react';
import { ProcessStep } from '@/types/process';

interface EscalationNodeData {
  step: ProcessStep;
}

export const EscalationNode: React.FC<NodeProps> = ({ data }) => {
  const step = (data as unknown as EscalationNodeData).step;
  const { config } = useSimulatorStore();
  const metrics = calculateStepMetrics(step, config);

  const escalationRatePercent = Math.round((1 - metrics.effectiveAutomationRate) * 100);

  return (
    <div className="w-64 rounded-lg bg-amber-950/40 border border-amber-600/50 border-dashed p-2.5 text-slate-200 shadow-md backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-amber-500 !border-2 !border-slate-900"
      />

      <div className="flex items-center justify-between border-b border-amber-800/40 pb-1.5">
        <div className="flex items-center space-x-1.5 text-amber-400">
          <UserX className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Human Escalation Task</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">
          {escalationRatePercent} % Klärfälle
        </span>
      </div>

      <p className="text-[10px] text-slate-300 mt-1.5">
        Unter {step.confidenceGate}% Konfidenz: Manuelle Prüfung durch SAP Sachbearbeiter.
      </p>

      <div className="mt-2 pt-1.5 border-t border-amber-900/40 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>~{config.resolutionTimeMinutes} min / Fall</span>
        </span>
        <span className="text-amber-400 font-bold">
          {Math.round(metrics.humanResolutionCostEur).toLocaleString('de-DE')} €/M
        </span>
      </div>
    </div>
  );
};
