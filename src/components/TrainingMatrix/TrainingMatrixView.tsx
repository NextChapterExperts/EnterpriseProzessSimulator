'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import { CognitivePrimitive, AutomationArchetype } from '@/types/process';
import { Info, ShieldAlert } from 'lucide-react';
import { getMethodologyItem, MethodologyInfoItem } from '@/data/methodologyTraining';
import { MethodologyInfoModal } from '@/components/Modals/MethodologyInfoModal';
import { TRANSLATIONS } from '@/i18n/translations';

interface ArchetypeExecutionDetail {
  archetype: AutomationArchetype;
  name: string;
  flowBehavior: 'STP' | 'HUMAN_ALWAYS' | 'CONFIDENCE_GATE';
  flowText: string;
  sapTech: string;
  recommendation: string;
}

interface PrimitiveRow {
  oodaPhase: 'Observe' | 'Orient' | 'Decide' | 'Act';
  primitive: CognitivePrimitive;
  taskTitle: string;
  taskDescription: string;
  sapStandardChecks?: string[];
  relevantChallenges?: { id: string; name: string }[];
  executions: ArchetypeExecutionDetail[];
}

const MATRIX_DATA_DE: PrimitiveRow[] = [
  // 1. Observe
  {
    oodaPhase: 'Observe',
    primitive: 'Filter / Gatekeeper',
    taskTitle: 'Eingangskanal & Vorfilterung',
    taskDescription: 'Eingehende Nachrichten abfangen, Spam und Duplikate verwerfen, Format validieren.',
    sapStandardChecks: [
      'Inbound Payload-Validierung',
      'Deduplizierung & Idempotenz-Token',
      'Spam- & Schema-Sanitization',
      'Event Mesh Routing',
    ],
    relevantChallenges: [
      { id: 'CH_08', name: 'Prompt Injection' },
      { id: 'CH_01', name: 'Schema Divergence' },
      { id: 'CH_12', name: 'Token Starvation' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministisch',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP Event Mesh / Cloud Integration Routing Rules',
        recommendation: 'Standard für 99% aller Fälle. Feste Filterkriterien ohne KI-Kosten.',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP BTP GenAI Hub (Single-Turn Prompt)',
        recommendation: 'Semantische Prüfung, wenn Absichten im Freitext erkannt werden müssen.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Stoppt immer)',
        sapTech: 'SAP Fiori Inbox / Joule Triage-Vorschlag',
        recommendation: 'Nur wenn jeder Eingang zwingend manuell gesichtet werden soll.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Bedingter Stopp (Hält nur bei unsicherer Triage)',
        sapTech: 'Autonome Classification-Pipeline mit Konfidenz-Gate',
        recommendation: 'Klassifiziert Standardfälle dunkel; stoppt nur bei Konfidenz < 85%.',
      },
    ],
  },

  // 2. Orient
  {
    oodaPhase: 'Orient',
    primitive: 'Extractor / Transformer',
    taskTitle: 'Datenextraktion & Strukturierung',
    taskDescription: 'Unstrukturierte E-Mails, Freitexte und PDF-Anhänge in strukturierte Belegfelder überführen.',
    sapStandardChecks: [
      'OCR Bounding-Box Konfidenz (>85%)',
      'Pydantic/JSON-Schema Validierung',
      'Mengeneinheiten- & Währungskonvertierung (T006/TCURR)',
      'DOX BAPI-Interface Mapping',
    ],
    relevantChallenges: [
      { id: 'CH_01', name: 'Context Drift' },
      { id: 'CH_03', name: 'Lost in the Middle' },
      { id: 'CH_06', name: 'Silent Degradation' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministisch',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'ABAP Regex / Starre EDI-Parser',
        recommendation: 'Nur für standardisierte, tabellarische Formate (bricht bei Formatänderungen ab).',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'BTP Document Information Extraction / LLM JSON-Mode',
        recommendation: 'Ideal für Freitexte. Zieht Kopf- und Positionsdaten ohne UI-Unterbrechung ab.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Stoppt immer)',
        sapTech: 'SAP Joule Side-by-Side Belegprüfung in Fiori',
        recommendation: 'Mitarbeiter prüft jedes extrahierte Feld manuell vor der Weitergabe.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Bedingter Stopp (Hält nur bei schlechter Datenqualität)',
        sapTech: 'Autonome Function-Calling Pipeline mit OCR-Tool',
        recommendation: 'Extrahiert selbstständig; schickt nur unleserliche Belege (< 85% Konfidenz) zur Klärung.',
      },
    ],
  },

  {
    oodaPhase: 'Orient',
    primitive: 'Matcher / Enricher',
    taskTitle: 'Stammdaten-Abgleich & Anreicherung',
    taskDescription: 'Kunden, Materialien, Equipments und Konditionen gegen SAP Stammdaten auflösen.',
    sapStandardChecks: [
      'Debitor/Kreditor Primary Key Lookup (KNA1/LFA1)',
      'Materialstamm-Existenz & Löschvormerkung (MARA)',
      'HANA Vector & Trigram Fuzzy-Search',
      'Sperrprüfung (Lock Contention Check)',
    ],
    relevantChallenges: [
      { id: 'CH_04', name: 'Phantom Entity IDs' },
      { id: 'CH_02', name: 'Stale Embeddings' },
      { id: 'CH_09', name: 'Multi-Tenant Leakage' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministisch',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'S/4HANA OData v4 Lookup (KUNNR, MARA, EQUI)',
        recommendation: 'Standard bei bekannter Kundennummer oder exakter Materialnummer (< 20 ms).',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML / Fuzzy)',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP HANA Fuzzy Search / Vector Embeddings',
        recommendation: 'Wenn Artikelbezeichnungen oder Schreibweisen ungenau sind.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Stoppt immer)',
        sapTech: 'Fiori Match-Kandidaten-Auswahl durch Sachbearbeiter',
        recommendation: 'Bei mehreren plausiblen Debitorenkonten entscheidet der Mensch.',
      },
      {
        archetype: 'agentic',
        name: '5. Agentic',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (Multi-Agent Self-Healing)',
        sapTech: 'Autonomer Multi-Agent Schwarm (Historie + IoT)',
        recommendation: 'Für schwere Sonderfälle: Rekonstruiert fehlende Nummern aus alten Aufträgen.',
      },
    ],
  },

  // 3. Decide
  {
    oodaPhase: 'Decide',
    primitive: 'Evaluator / Reasoner',
    taskTitle: 'Regelprüfung & Geschäftslogik',
    taskDescription: 'Kreditlimits, Verträge, SLA-Garantien, Kulanz und Prioritäten bewerten.',
    sapStandardChecks: [
      'Dynamische Kreditlimitprüfung (UKM_BP / VKM1)',
      'ATP Verfügbarkeitsprüfung (VBBE/MD04)',
      'Konditionsschema & Staffelpreise (PRCD_ELEMENTS)',
      'Unvollständigkeitsprotokoll (VBUV)',
    ],
    relevantChallenges: [
      { id: 'CH_05', name: 'Flaky Tool Calls' },
      { id: 'CH_07', name: 'Routing Loops' },
      { id: 'CH_12', name: 'Cost Explosion' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministisch',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP BRFplus / DMN Decision Tables',
        recommendation: 'Feste Geschäftsregeln ohne Auslegungsspielraum (z.B. Garantiedatum überschritten).',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP AI Core Scoring-Modell / Fraud Detection',
        recommendation: 'Klassisches Kredit- und Betrugsrisiko-Scoring in Echtzeit.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Bedingter Stopp (Hält nur bei schlechter Datenqualität)',
        sapTech: 'Autonomer Policy-Evaluator mit Schwellwertprüfung',
        recommendation: 'Entscheidet Standardfälle selbstständig; übergibt Grenzfälle an Sachbearbeiter.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Stoppt immer)',
        sapTech: 'SAP Joule Kulanz-Empfehlung mit menschlicher Freigabe',
        recommendation: 'Vorgeschrieben bei Ermessensentscheidungen oder hohen Auftragswerten.',
      },
    ],
  },

  // 4. Act
  {
    oodaPhase: 'Act',
    primitive: 'Executor / Actuator',
    taskTitle: 'ERP-Mutation & Verbuchung',
    taskDescription: 'Rechtsverbindliche Anlage oder Änderung von Belegen in S/4HANA (z.B. Serviceauftrag oder Kundenauftrag anlegen).',
    sapStandardChecks: [
      'Enqueue-Sperre (ENQUEUE_EVVBAKE)',
      'Bestellnummer-Idempotenz (BSTNK)',
      'RAP Business Object / BAPI Atomic Commit',
      'GoBD / SOX Audit Trail (CDHDR/CDPOS)',
    ],
    relevantChallenges: [
      { id: 'CH_10', name: 'SOX/GoBD Audit Break' },
      { id: 'CH_11', name: 'Privileged Escalation' },
      { id: 'CH_13', name: 'Thread Lock' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministisch',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'S/4HANA RAP (ABAP Cloud) / BAPI Commit',
        recommendation: 'Vollautomatische Buchung, wenn alle Prüfungen zuvor grün waren.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Bedingter Stopp (Hält bei Wertgrenze oder Sperrkonflikt)',
        sapTech: 'Autonome Buchungs-Engine mit Wertlimit & Enqueue-Handling',
        recommendation: 'Bucht automatisch bis Wertgrenze (z. B. 10.000 €); eskaliert bei Lock Contention.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Stoppt immer)',
        sapTech: 'SAP Fiori Freigabe-App (SOX / GoBD 4-Augen-Prinzip)',
        recommendation: 'Gesetzlich/organisatorisch gefordert bei hohem finanziellen Risiko.',
      },
      {
        archetype: 'agentic',
        name: '5. Agentic',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (Multi-Agent Self-Healing)',
        sapTech: 'Autonomer Transaktions-Agent mit Fehlerbehebung & Rollback',
        recommendation: 'Löst Sperren und temporäre Systemfehler automatisch durch Retry-Policies.',
      },
    ],
  },

  {
    oodaPhase: 'Act',
    primitive: 'Generator / Synthesizer',
    taskTitle: 'Kundenkommunikation & Belegabschluss',
    taskDescription: 'Auftragsbestätigung, Disponenten-Zusammenfassung oder Klärungs-E-Mail verfassen.',
    sapStandardChecks: [
      'Output Control & Formular-Binding (ADS / Smart Forms)',
      'Rechtliche Vorbehaltsklausel-Validierung',
      'Drucker/Mailspool-Kopplung (NAST/TOA01 ArchiveLink)',
      'SOX-konforme Versandprotokollierung',
    ],
    relevantChallenges: [
      { id: 'CH_01', name: 'Context Drift in Mail' },
      { id: 'CH_08', name: 'Prompt Injection via Reply' },
      { id: 'CH_13', name: 'Cascading Latency' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministisch',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP Smart Forms / Adobe Forms Template',
        recommendation: 'Klassische, starre PDF-Bestätigung nach festem Formular-Layout.',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Dunkelverarbeitung (100% automatisch)',
        sapTech: 'SAP BTP GenAI Hub (Prompt in ➔ E-Mail Text out)',
        recommendation: 'Generiert im Hintergrund eine individuelle, höfliche Antwortmail auf Basis der Belegdaten.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Stoppt immer)',
        sapTech: 'SAP Joule E-Mail-Entwurf in Outlook / Fiori',
        recommendation: 'KI entwirft den Text, der Sachbearbeiter liest vor Versand Korrektur.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Bedingter Stopp (Hält nur bei schlechter Datenqualität)',
        sapTech: 'Autonome Versand-Pipeline mit Qualitätsprüfung',
        recommendation: 'Versendet Standardbestätigungen direkt; stoppt nur bei unklaren Konditionen.',
      },
    ],
  },
];

const MATRIX_DATA_EN: PrimitiveRow[] = [
  // 1. Observe
  {
    oodaPhase: 'Observe',
    primitive: 'Filter / Gatekeeper',
    taskTitle: 'Inbound Channel & Pre-filtering',
    taskDescription: 'Intercept inbound messages, discard spam and duplicates, validate payload format.',
    sapStandardChecks: [
      'Inbound Payload Schema Validation',
      'Deduplication & Idempotency Key',
      'Spam & Injection Sanitization',
      'Event Mesh Routing Rules',
    ],
    relevantChallenges: [
      { id: 'CH_08', name: 'Prompt Injection' },
      { id: 'CH_01', name: 'Schema Divergence' },
      { id: 'CH_12', name: 'Token Starvation' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP Event Mesh / Cloud Integration Routing Rules',
        recommendation: 'Standard for 99% of cases. Fixed filter criteria without AI costs.',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP BTP GenAI Hub (Single-Turn Prompt)',
        recommendation: 'Semantic classification when intent needs to be recognized in unstructured freetext.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Always pauses)',
        sapTech: 'SAP Fiori Inbox / Joule Triage Suggestion',
        recommendation: 'Only when every inbound communication strictly requires manual inspection.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Conditional Halt (Pauses only on low triage confidence)',
        sapTech: 'Autonomous Classification Pipeline with confidence gating',
        recommendation: 'Classifies standard messages silently; routes to clerk when confidence < 85%.',
      },
    ],
  },

  // 2. Orient
  {
    oodaPhase: 'Orient',
    primitive: 'Extractor / Transformer',
    taskTitle: 'Data Extraction & Structuring',
    taskDescription: 'Transform unstructured emails, freetext notes, and PDF attachments into structured SAP document fields.',
    sapStandardChecks: [
      'OCR Bounding-Box Confidence (>85%)',
      'Pydantic/JSON Schema Enforcement',
      'Unit of Measure & Currency Conversion (T006/TCURR)',
      'DOX BAPI-Interface Mapping',
    ],
    relevantChallenges: [
      { id: 'CH_01', name: 'Context Drift' },
      { id: 'CH_03', name: 'Lost in the Middle' },
      { id: 'CH_06', name: 'Silent Degradation' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'ABAP Regex / Rigid EDI Parsers',
        recommendation: 'Only for standardized, tabular formats (breaks on layout variations).',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'BTP Document Information Extraction / LLM JSON Mode',
        recommendation: 'Ideal for freetext. Extracts header and line items without UI disruption.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Always pauses)',
        sapTech: 'SAP Joule Side-by-Side Review in Fiori',
        recommendation: 'Clerk manually validates every extracted field before propagating.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Conditional Halt (Pauses only on poor data quality)',
        sapTech: 'Autonomous Function-Calling Pipeline with OCR tools',
        recommendation: 'Extracts autonomously; only routes ambiguous items (< 85% confidence) to clarification.',
      },
    ],
  },

  {
    oodaPhase: 'Orient',
    primitive: 'Matcher / Enricher',
    taskTitle: 'Master Data Matching & Grounding',
    taskDescription: 'Resolve customers, materials, equipment, and conditions against authoritative SAP master data.',
    sapStandardChecks: [
      'Customer/Vendor Primary Key Lookup (KNA1/LFA1)',
      'Material Master Active & Deletion Flag Check (MARA)',
      'HANA Vector & Trigram Fuzzy-Search',
      'Lock Contention Inspection',
    ],
    relevantChallenges: [
      { id: 'CH_04', name: 'Phantom Entity IDs' },
      { id: 'CH_02', name: 'Stale Embeddings' },
      { id: 'CH_09', name: 'Multi-Tenant Leakage' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'S/4HANA OData v4 Lookup (KUNNR, MARA, EQUI)',
        recommendation: 'Standard when customer ID or exact material SKU is present (< 20 ms).',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML / Fuzzy)',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP HANA Fuzzy Search / Vector Embeddings',
        recommendation: 'When article descriptions, vendor names, or spellings are imprecise.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Always pauses)',
        sapTech: 'Fiori Candidate Disambiguation by Clerk',
        recommendation: 'When multiple plausible debtor accounts match, human clerk decides.',
      },
      {
        archetype: 'agentic',
        name: '5. Agentic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (Multi-Agent Self-Healing)',
        sapTech: 'Autonomous Multi-Agent Swarm (History + IoT)',
        recommendation: 'For complex edge cases: Reconstructs missing IDs from past transaction patterns.',
      },
    ],
  },

  // 3. Decide
  {
    oodaPhase: 'Decide',
    primitive: 'Evaluator / Reasoner',
    taskTitle: 'Policy Verification & Business Rules',
    taskDescription: 'Evaluate credit limits, service contracts, SLA terms, goodwill leeway, and dispatch priority.',
    sapStandardChecks: [
      'Dynamic Credit Limit Check (UKM_BP / VKM1)',
      'ATP Availability Check (VBBE/MD04)',
      'Pricing Procedure Evaluation (PRCD_ELEMENTS)',
      'Incompletion Log (VBUV)',
    ],
    relevantChallenges: [
      { id: 'CH_05', name: 'Flaky Tool Calls' },
      { id: 'CH_07', name: 'Routing Loops' },
      { id: 'CH_12', name: 'Cost Explosion' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP BRFplus / DMN Decision Tables',
        recommendation: 'Fixed business rules without interpretation leeway (e.g. warranty expired).',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP AI Core Scoring Model / Fraud Detection',
        recommendation: 'Classic credit and fraud risk scoring evaluated synchronously.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Conditional Halt (Pauses only on poor data quality)',
        sapTech: 'Autonomous Policy Evaluator with threshold gates',
        recommendation: 'Decides standard scenarios autonomously; routes edge cases to clerk.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Always pauses)',
        sapTech: 'SAP Joule Goodwill Recommendation with Human Sign-off',
        recommendation: 'Mandatory for discretionary decisions or high-value orders.',
      },
    ],
  },

  // 4. Act
  {
    oodaPhase: 'Act',
    primitive: 'Executor / Actuator',
    taskTitle: 'ERP Mutation & Document Posting',
    taskDescription: 'Legally binding creation or mutation of business objects in S/4HANA (e.g. create sales/service order).',
    sapStandardChecks: [
      'Enqueue Lock (ENQUEUE_EVVBAKE)',
      'PO Number Idempotency (BSTNK)',
      'RAP Business Object / BAPI Atomic Commit',
      'GoBD / SOX Audit Trail (CDHDR/CDPOS)',
    ],
    relevantChallenges: [
      { id: 'CH_10', name: 'SOX/GoBD Audit Break' },
      { id: 'CH_11', name: 'Privileged Escalation' },
      { id: 'CH_13', name: 'Thread Lock' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'S/4HANA RAP (ABAP Cloud) / BAPI Commit',
        recommendation: 'Fully automated posting once all prior validation gates are green.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Conditional Halt (Pauses at value threshold or lock conflict)',
        sapTech: 'Autonomous Posting Engine with value caps & lock handling',
        recommendation: 'Posts automatically up to configured value limit (e.g. €10k); escalates on lock contention.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Always pauses)',
        sapTech: 'SAP Fiori Approval App (SOX / Four-Eyes Principle)',
        recommendation: 'Legally / organizationally mandated when high financial blast radius exists.',
      },
      {
        archetype: 'agentic',
        name: '5. Agentic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (Multi-Agent Self-Healing)',
        sapTech: 'Autonomous Transaction Agent with self-healing & rollback',
        recommendation: 'Resolves lock contentions and transient RFC errors automatically via retry policies.',
      },
    ],
  },

  {
    oodaPhase: 'Act',
    primitive: 'Generator / Synthesizer',
    taskTitle: 'Outbound Communication & Order Completion',
    taskDescription: 'Compose order confirmation, dispatch summary, or customer clarification notice.',
    sapStandardChecks: [
      'Output Control & Template Binding (ADS / Smart Forms)',
      'Legal Disclaimer Clause Validation',
      'Printer/Mail Spool Coupling (NAST/TOA01 ArchiveLink)',
      'SOX-compliant Outbound Dispatch Log',
    ],
    relevantChallenges: [
      { id: 'CH_01', name: 'Context Drift in Mail' },
      { id: 'CH_08', name: 'Prompt Injection via Reply' },
      { id: 'CH_13', name: 'Cascading Latency' },
    ],
    executions: [
      {
        archetype: 'deterministic',
        name: '1. Deterministic',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP Smart Forms / Adobe Forms Template',
        recommendation: 'Classic, rigid PDF confirmation following standardized corporate form layout.',
      },
      {
        archetype: 'classic_ml',
        name: '2. Assistant (Single-Turn ML)',
        flowBehavior: 'STP',
        flowText: 'Straight-Through Processing (100% automated)',
        sapTech: 'SAP BTP GenAI Hub (Prompt in ➔ Email text out)',
        recommendation: 'Generates personalized, polite responses in background batch based on order payload.',
      },
      {
        archetype: 'copilot',
        name: '3. Copilot',
        flowBehavior: 'HUMAN_ALWAYS',
        flowText: 'Human-in-the-Loop (Always pauses)',
        sapTech: 'SAP Joule Email Draft in Outlook / Fiori',
        recommendation: 'AI drafts communication, human clerk reviews and edits prior to outbound dispatch.',
      },
      {
        archetype: 'autopilot',
        name: '4. Autopilot',
        flowBehavior: 'CONFIDENCE_GATE',
        flowText: 'Conditional Halt (Pauses only on poor data quality)',
        sapTech: 'Autonomous Outbound Pipeline with quality validation',
        recommendation: 'Dispatches standard confirmations directly; pauses only on unclear conditions.',
      },
    ],
  },
];

export const TrainingMatrixView: React.FC = () => {
  const { setActiveMainTab, language, openChallengeDrawer } = useSimulatorStore();
  const [filterPhase, setFilterPhase] = useState<string>('ALL');
  const [selectedInfoItem, setSelectedInfoItem] = useState<MethodologyInfoItem | null>(null);

  const t = TRANSLATIONS[language];
  const matrixData = language === 'en' ? MATRIX_DATA_EN : MATRIX_DATA_DE;
  const infoItem = (key: string, fallbackKey: string) =>
    getMethodologyItem(key, language) || getMethodologyItem(fallbackKey, language);

  const filteredRows =
    filterPhase === 'ALL' ? matrixData : matrixData.filter((r) => r.oodaPhase === filterPhase);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/90 dark:bg-[#0a0f1d] overflow-y-auto px-4 sm:px-8 py-6 text-slate-800 dark:text-slate-200 transition-colors duration-150">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* 1. Header & Leitfaden */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
              {t.matrixBadge}
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {t.matrixTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {t.matrixDesc}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => openChallengeDrawer('CH_01')}
              className="px-3.5 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-600/40 text-amber-900 dark:text-amber-300 text-xs font-medium transition flex items-center space-x-1.5 shadow-sm"
              title={language === 'en' ? 'Open the 13-Challenges Governance Radar' : '13-Challenges Governance- & Audit-Radar öffnen'}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{language === 'en' ? '13 Challenges Radar' : '13-Challenges Radar'}</span>
            </button>

            <button
              onClick={() => setActiveMainTab('simulator')}
              className="px-4 py-2 rounded-lg bg-[#0A6ED1] hover:bg-sky-600 text-white text-xs font-medium transition shadow-sm"
            >
              {t.btnToSimulator}
            </button>
          </div>
        </div>

        {/* 2. Die 3 Verhaltensweisen im Prozessfluss */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              {t.cardStpTitle}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.cardStpDesc}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
              {t.cardHitlTitle}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.cardHitlDesc}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
            <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
              {t.cardGateTitle}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.cardGateDesc}
            </div>
          </div>
        </div>

        {/* 3. Phasen-Filter */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{language === 'en' ? 'OODA Filter:' : 'OODA-Filter:'}</span>
          {['ALL', 'Observe', 'Orient', 'Decide', 'Act'].map((phase) => (
            <button
              key={phase}
              onClick={() => setFilterPhase(phase)}
              className={`px-3 py-1 rounded text-xs transition ${
                filterPhase === phase
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900'
              }`}
            >
              {phase === 'ALL' ? t.filterAllPhases : phase}
            </button>
          ))}
        </div>

        {/* 4. Die Ruhige, Vollständige Schulungstabelle */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950/40 shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-3.5 w-32">
                  <div className="flex items-center space-x-1">
                    <span>{t.colOoda}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedInfoItem(infoItem('ooda_header', 'ooda_header'))}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                      title={t.tooltipOpenDetails}
                    >
                      <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    </button>
                  </div>
                </th>
                <th className="py-3 px-3.5 w-64">
                  <div className="flex items-center space-x-1">
                    <span>{t.colPrimitive}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedInfoItem(infoItem('primitive_header', 'primitive_header'))}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                      title={t.tooltipOpenDetails}
                    >
                      <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </th>
                <th className="py-3 px-3.5 w-48">
                  <div className="flex items-center space-x-1">
                    <span>{t.colArchetype}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedInfoItem(infoItem('archetype_header', 'archetype_header'))}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                      title={t.tooltipOpenDetails}
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
                </th>
                <th className="py-3 px-3.5 w-56">{t.colFlow}</th>
                <th className="py-3 px-3.5 w-52">{t.colSapTech}</th>
                <th className="py-3 px-3.5">{t.colRecommendation}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.map((row) => (
                <React.Fragment key={row.primitive}>
                  {row.executions.map((exec, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <tr
                        key={`${row.primitive}-${exec.archetype}`}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 transition ${
                          isFirst ? 'border-t-2 border-t-slate-200 dark:border-t-slate-800' : ''
                        }`}
                      >
                        {/* Spalte 1: OODA Phase */}
                        {isFirst && (
                          <td
                            rowSpan={row.executions.length}
                            className="py-3.5 px-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 align-top border-r border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{row.oodaPhase}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const key = 'ooda_' + row.oodaPhase.toLowerCase();
                                  setSelectedInfoItem(infoItem(key, 'ooda_header'));
                                }}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                                title={t.tooltipOpenDetails}
                              >
                                <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              {row.oodaPhase === 'Observe' && (language === 'en' ? 'Observe' : 'Wahrnehmung')}
                              {row.oodaPhase === 'Orient' && (language === 'en' ? 'Orient' : 'Einordnung')}
                              {row.oodaPhase === 'Decide' && (language === 'en' ? 'Decide' : 'Entscheidung')}
                              {row.oodaPhase === 'Act' && (language === 'en' ? 'Act' : 'Aktion')}
                            </span>
                          </td>
                        )}

                        {/* Spalte 2: Kognitives Primitiv */}
                        {isFirst && (
                          <td
                            rowSpan={row.executions.length}
                            className="py-3.5 px-3.5 align-top border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="font-medium text-slate-900 dark:text-white text-xs">{row.taskTitle}</div>
                              <button
                                type="button"
                                onClick={() => {
                                  const key = 'primitive_' + row.primitive;
                                  setSelectedInfoItem(infoItem(key, 'primitive_header'));
                                }}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition shrink-0"
                                title={t.tooltipOpenDetails}
                              >
                                <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              </button>
                            </div>
                            <div className="text-[11px] text-sky-700 dark:text-sky-400/90 font-mono mt-0.5">
                              {row.primitive}
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                              {row.taskDescription}
                            </div>

                            {/* SAP Standardprüfungen & Verfahren */}
                            {row.sapStandardChecks && row.sapStandardChecks.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                                <span className="text-[10px] font-mono uppercase text-sky-700 dark:text-sky-400 font-bold block mb-1">
                                  {language === 'en' ? 'SAP Core Checks & Architecture:' : 'SAP Standardprüfungen & Verfahren:'}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {row.sapStandardChecks.map((chk, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                      {chk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 13-Challenges Radar Verknüpfung */}
                            {row.relevantChallenges && row.relevantChallenges.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                                <div className="flex items-center space-x-1 mb-1">
                                  <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold">
                                    {language === 'en' ? 'Critical Challenges (Click to inspect):' : 'Relevante 13 Challenges (Klick für Radar):'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {row.relevantChallenges.map((ch) => (
                                    <button
                                      key={ch.id}
                                      type="button"
                                      onClick={() => openChallengeDrawer(ch.id)}
                                      className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-600/40 text-amber-800 dark:text-amber-300 transition flex items-center space-x-1 cursor-pointer group shadow-sm"
                                      title={
                                        language === 'en'
                                          ? `Open in 13-Challenges Audit Radar: ${ch.id} - ${ch.name}`
                                          : `Im 13-Challenges Audit-Radar öffnen: ${ch.id} - ${ch.name}`
                                      }
                                    >
                                      <span className="font-bold underline group-hover:text-amber-950 dark:group-hover:text-white">{ch.id}</span>
                                      <span className="text-amber-700 dark:text-amber-200/80 max-w-[120px] truncate">{ch.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        )}

                        {/* Spalte 3: Ausführungsart (Archetyp) */}
                        <td className="py-3 px-3.5 font-medium text-slate-800 dark:text-slate-200 align-top border-r border-slate-200 dark:border-slate-800/50">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-900 dark:text-white font-semibold">{exec.name}</div>
                            <button
                              type="button"
                              onClick={() => {
                                const key = 'archetype_' + exec.archetype;
                                setSelectedInfoItem(infoItem(key, 'archetype_header'));
                              }}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 transition"
                              title={t.tooltipOpenDetails}
                            >
                              <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{exec.archetype}</div>
                        </td>

                        {/* Spalte 4: Prozessfluss-Bedeutung */}
                        <td className="py-3 px-3.5 align-top border-r border-slate-200 dark:border-slate-800/50">
                          {exec.flowBehavior === 'STP' && (
                            <div className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                              {exec.flowText}
                            </div>
                          )}
                          {exec.flowBehavior === 'HUMAN_ALWAYS' && (
                            <div className="text-amber-700 dark:text-amber-400 text-xs font-semibold">
                              {exec.flowText}
                            </div>
                          )}
                          {exec.flowBehavior === 'CONFIDENCE_GATE' && (
                            <div className="text-sky-700 dark:text-sky-300 text-xs font-semibold">
                              {exec.flowText}
                            </div>
                          )}
                        </td>

                        {/* Spalte 5: SAP-Schnittstelle */}
                        <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 text-[11px] font-mono align-top border-r border-slate-200 dark:border-slate-800/50">
                          {exec.sapTech}
                        </td>

                        {/* Spalte 6: Praxis-Empfehlung */}
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed align-top">
                          {exec.recommendation}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fußnote */}
        <div className="mt-4 text-[11px] text-slate-500 leading-relaxed">
          {t.trainingFootnote}
        </div>

        {/* 5. Ausführliches Methoden- & Schulungsmodal */}
        <MethodologyInfoModal
          item={selectedInfoItem}
          onClose={() => setSelectedInfoItem(null)}
        />
      </div>
    </div>
  );
};
