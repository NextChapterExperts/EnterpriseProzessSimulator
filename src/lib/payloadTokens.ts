import { CognitivePrimitive, AutomationArchetype } from '@/types/process';
import { getSampleMessage, MessageQuality } from '@/data/dryRunSample';

/**
 * Ermittelt den aktiven Text der Eingangsnachricht (entweder manuell editiert oder das gewählte Muster).
 */
export function getActivePayloadText(
  templateId: string,
  quality: MessageQuality = 'good',
  customMessageText?: string | null
): string {
  if (customMessageText !== undefined && customMessageText !== null) {
    return customMessageText;
  }
  const sample = getSampleMessage(templateId, quality);
  return sample.rawText;
}

/**
 * Schätzt die Anzahl der Tokens eines Freitexts (ca. 3.6 Zeichen pro Token bei deutsch/englischen Geschäftstexten).
 */
export function estimatePayloadTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  return Math.max(50, Math.ceil(text.length / 3.6));
}

/**
 * Berechnet für einen konkreten Workflow-Schritt dynamisch die Eingangs- und Ausgangs-Tokens
 * basierend auf dem aktuellen Inbound-Payload.
 */
export function calculateStepDynamicTokens(
  step: { primitive: CognitivePrimitive; currentArchetype: AutomationArchetype },
  payloadText: string
): { tokensIn: number; tokensOut: number } {
  // Deterministische Schritte verbrauchen 0 Tokens (Clean Core)
  if (step.currentArchetype === 'deterministic') {
    return { tokensIn: 0, tokensOut: 0 };
  }

  const baseInboundTokens = estimatePayloadTokens(payloadText);

  switch (step.primitive) {
    case 'Filter / Gatekeeper':
      // Triage liest Header + Anfang der Nachricht
      return {
        tokensIn: Math.min(baseInboundTokens, 600) + 120,
        tokensOut: 40,
      };

    case 'Extractor / Transformer':
      // Extractor liest die gesamte Nachricht + Schema-Prompting
      return {
        tokensIn: baseInboundTokens + 350,
        // Ausgangs-Tokens entsprechen dem erzeugten JSON (typisch ~30-35% der Eingangslänge)
        tokensOut: Math.max(120, Math.min(2500, Math.round(baseInboundTokens * 0.35))),
      };

    case 'Matcher / Enricher':
      // Stammdaten-Matching vergleicht extrahierte Entitäten mit SAP-Suchergebnissen
      return {
        tokensIn: Math.max(100, Math.round(baseInboundTokens * 0.25)) + 250,
        tokensOut: 80,
      };

    case 'Evaluator / Reasoner':
      // Geschäftsregeln & ATP-Prüfung bewerten die Belegpositionen
      return {
        tokensIn: Math.max(120, Math.round(baseInboundTokens * 0.25)) + 400,
        tokensOut: 150,
      };

    case 'Executor / Actuator':
      // Verbuchung (falls Copilot-Freigabe aktiv)
      return {
        tokensIn: 300,
        tokensOut: 60,
      };

    case 'Generator / Synthesizer':
      // Generierung der Bestätigung oder des Kundenanschreibens
      return {
        tokensIn: Math.max(200, Math.round(baseInboundTokens * 0.25)) + 250,
        tokensOut: Math.max(150, Math.min(800, Math.round(baseInboundTokens * 0.3))),
      };

    default:
      return {
        tokensIn: baseInboundTokens,
        tokensOut: 200,
      };
  }
}
