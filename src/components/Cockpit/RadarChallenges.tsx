'use client';

import React from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { calculateStepMetrics } from '@/lib/tcaCalculator';
import { RISK_CHALLENGES } from '@/data/challenges';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const RadarChallenges: React.FC = () => {
  const { steps, config, openChallengeDrawer, language } = useSimulatorStore();
  const isEn = language === 'en';

  // Zähle getriggerte Risiken nach Clustern
  const clusterCounts = {
    DATA_CONTEXT_INTEGRITY: 0,
    RELIABILITY_DETERMINISM: 0,
    SECURITY_COMPLIANCE: 0,
    COST_PERFORMANCE_DECAY: 0,
  };

  const triggeredSet = new Set<string>();

  steps.forEach((step) => {
    const metrics = calculateStepMetrics(step, config);
    metrics.triggeredChallengeIds.forEach((cId) => {
      triggeredSet.add(cId);
      const ch = RISK_CHALLENGES[cId];
      if (ch) {
        clusterCounts[ch.cluster] += 1;
      }
    });
  });

  const clusterLabels = [
    { key: 'DATA_CONTEXT_INTEGRITY', label: '1. Data Integrity', count: clusterCounts.DATA_CONTEXT_INTEGRITY, max: 4, angle: 0 },
    { key: 'RELIABILITY_DETERMINISM', label: '2. Determinism', count: clusterCounts.RELIABILITY_DETERMINISM, max: 4, angle: 90 },
    { key: 'SECURITY_COMPLIANCE', label: '3. Compliance', count: clusterCounts.SECURITY_COMPLIANCE, max: 4, angle: 180 },
    { key: 'COST_PERFORMANCE_DECAY', label: '4. Cost Decay', count: clusterCounts.COST_PERFORMANCE_DECAY, max: 4, angle: 270 },
  ];

  // SVG Radar Polygon Koordinaten
  const centerX = 110;
  const centerY = 100;
  const maxRadius = 75;

  const getCoordinates = (value: number, max: number, angleDeg: number) => {
    const normalized = Math.min(1, Math.max(0.15, value / max));
    const r = normalized * maxRadius;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const x = centerX + r * Math.cos(angleRad);
    const y = centerY + r * Math.sin(angleRad);
    return { x, y };
  };

  const polygonPoints = clusterLabels
    .map((c) => {
      const { x, y } = getCoordinates(c.count, c.max, c.angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>13-Challenges Audit-Radar</span>
        </h4>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            triggeredSet.size > 0
              ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80'
              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
          }`}
        >
          {triggeredSet.size} {isEn ? 'active risks' : 'aktive Risiken'}
        </span>
      </div>

      {/* SVG Radar Visualisierung */}
      <div className="flex justify-center my-1">
        <svg width="220" height="200" className="overflow-visible">
          {/* Radar Circles */}
          {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={maxRadius * level}
              fill="none"
              stroke="#94a3b8"
              strokeOpacity="0.3"
              strokeWidth="0.8"
              strokeDasharray={level < 1 ? '3,3' : undefined}
            />
          ))}

          {/* Axes */}
          <line x1={centerX} y1={centerY - maxRadius} x2={centerX} y2={centerY + maxRadius} stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="1" />
          <line x1={centerX - maxRadius} y1={centerY} x2={centerX + maxRadius} y2={centerY} stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="1" />

          {/* Dynamic Polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(239, 68, 68, 0.35)"
            stroke="#ef4444"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Points */}
          {clusterLabels.map((c, i) => {
            const { x, y } = getCoordinates(c.count, c.max, c.angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={c.count > 0 ? '#ef4444' : '#10b981'}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          <text x={centerX} y={centerY - maxRadius - 10} textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">
            Data Integrity ({clusterCounts.DATA_CONTEXT_INTEGRITY})
          </text>
          <text x={centerX + maxRadius + 15} y={centerY + 3} textAnchor="start" fill="#64748b" fontSize="9" fontWeight="bold">
            Determinism ({clusterCounts.RELIABILITY_DETERMINISM})
          </text>
          <text x={centerX} y={centerY + maxRadius + 14} textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">
            Compliance ({clusterCounts.SECURITY_COMPLIANCE})
          </text>
          <text x={centerX - maxRadius - 15} y={centerY + 3} textAnchor="end" fill="#64748b" fontSize="9" fontWeight="bold">
            Cost Decay ({clusterCounts.COST_PERFORMANCE_DECAY})
          </text>
        </svg>
      </div>

      {/* Triggered Challenges Badges List */}
      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          {isEn ? 'Triggered Risks (click for details):' : 'Getriggerte Risiken (Klick für Details):'}
        </span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {Array.from(triggeredSet).length === 0 ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium py-1">
              {isEn ? '✓ No active risk warnings' : '✓ Keine aktiven Risikowarnungen'}
            </span>
          ) : (
            Array.from(triggeredSet).map((cId) => {
              const ch = RISK_CHALLENGES[cId];
              if (!ch) return null;
              return (
                <button
                  key={cId}
                  onClick={() => openChallengeDrawer(cId)}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-red-50 dark:bg-red-950/80 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/80 transition"
                >
                  <AlertTriangle className="w-2.5 h-2.5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold">{cId}:</span>
                  <span className="truncate max-w-[120px]">{ch.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
