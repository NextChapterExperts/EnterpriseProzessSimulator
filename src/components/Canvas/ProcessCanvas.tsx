'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { ProcessNode } from './ProcessNode';
import { SimulationControls } from './SimulationControls';

const nodeTypes = {
  processNode: ProcessNode,
};

export const ProcessCanvas: React.FC = () => {
  const { steps, simulationStepIndex } = useSimulatorStore();

  const { nodes, edges } = useMemo(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    const STEP_GAP_X = 350;
    const START_X = 40;
    const PROCESS_Y = 130;

    steps.forEach((step, index) => {
      const posX = START_X + index * STEP_GAP_X;

      // Process Node
      generatedNodes.push({
        id: step.id,
        type: 'processNode',
        position: { x: posX, y: PROCESS_Y },
        data: { step, stepIndex: index },
      });

      // Forward Edge
      if (index < steps.length - 1) {
        const nextStep = steps[index + 1];
        const isPassedInSim = simulationStepIndex > index;
        const isCurrentEdge = simulationStepIndex === index;

        generatedEdges.push({
          id: `edge-${step.id}->${nextStep.id}`,
          source: step.id,
          target: nextStep.id,
          animated: isCurrentEdge || isPassedInSim,
          style: {
            stroke: isPassedInSim ? '#10b981' : isCurrentEdge ? '#38bdf8' : '#334155',
            strokeWidth: isCurrentEdge ? 3.5 : 2.5,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isPassedInSim ? '#10b981' : isCurrentEdge ? '#38bdf8' : '#334155',
            width: 14,
            height: 14,
          },
        });
      }
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [steps, simulationStepIndex]);

  return (
    <div className="relative w-full h-full bg-[#080d1a] flex flex-col">
      {/* Oben: Simulation Control Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-[#0B132B]/80 z-20">
        <SimulationControls />
      </div>

      {/* Phasen-Leitschiene */}
      <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-cyan-400 uppercase tracking-wider">Observe (Filter & Extraktion)</span>
        </div>
        <div className="text-slate-600">➔</div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-purple-400 uppercase tracking-wider">Orient (KNA1 / MARA Grounding)</span>
        </div>
        <div className="text-slate-600">➔</div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-amber-400 uppercase tracking-wider">Decide (BRFplus & ATP)</span>
        </div>
        <div className="text-slate-600">➔</div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 uppercase tracking-wider">Act (Mutation & Bestätigung)</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.3}
          maxZoom={1.5}
          className="react-flow-dark"
        >
          <Background color="#1e293b" gap={20} size={1} />
          <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 !fill-slate-300" />
          <MiniMap
            nodeColor="#0A6ED1"
            className="!bg-slate-900/90 !border-slate-800"
            maskColor="rgba(15, 23, 42, 0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};
