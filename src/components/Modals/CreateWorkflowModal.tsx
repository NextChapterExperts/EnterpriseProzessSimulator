'use client';

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import {
  ProcessTemplate,
  ProcessStep,
  AutomationArchetype,
  OODAPhase,
  CognitivePrimitive,
  EuAiActRiskLevel,
} from '@/types/process';
import { getGoldenPathRecommendation } from '@/lib/goldenPathAdvisor';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  Sparkles,
  X,
  Bot,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  Workflow,
  PlusCircle,
  HelpCircle,
  Cpu,
  Layers,
  ShieldAlert,
  ArrowRight,
  Check,
} from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkflowPreset {
  id: string;
  scopeCode: string;
  nameDe: string;
  nameEn: string;
  areaDe: string;
  areaEn: string;
  descDe: string;
  descEn: string;
  stepsDe: Array<{
    name: string;
    phase: OODAPhase;
    primitive: CognitivePrimitive;
    archetype: AutomationArchetype;
    sapRef: string;
    desc: string;
    sapGoldenPathTool?: string;
    sapGoldenPathGraph?: string;
    euAiActRisk?: EuAiActRiskLevel;
  }>;
  stepsEn: Array<{
    name: string;
    phase: OODAPhase;
    primitive: CognitivePrimitive;
    archetype: AutomationArchetype;
    sapRef: string;
    desc: string;
    sapGoldenPathTool?: string;
    sapGoldenPathGraph?: string;
    euAiActRisk?: EuAiActRiskLevel;
  }>;
}

const PRESETS: WorkflowPreset[] = [
  {
    id: 'preset-gpt-o2c',
    scopeCode: 'BD9-GPT',
    nameDe: 'Order-to-Cash (SAP AI Golden Path)',
    nameEn: 'Order-to-Cash (SAP AI Golden Path)',
    areaDe: 'Sales & Distribution (SD / Joule Studio)',
    areaEn: 'Sales & Distribution (SD / Joule Studio)',
    descDe: 'Offizielle Golden Path Architektur: Extraktion via SAP Document AI (Graph 2.b), Kredit-Scoring mit sap-rpt-1 (Graph 2.a), DMN-Prüfung (Graph 1) und Joule Studio Process Agent via MCP (Graph 4).',
    descEn: 'Official Golden Path Blueprint: Ingestion via SAP Document AI (Graph 2.b), credit scoring with sap-rpt-1 (Graph 2.a), DMN verification (Graph 1), and Joule Studio Process Agent via MCP (Graph 4).',
    stepsDe: [
      {
        name: 'Inbound EDI & Freitext-Triage',
        phase: 'Observe',
        primitive: 'Filter / Gatekeeper',
        archetype: 'deterministic',
        sapRef: 'SAP Event Mesh & EDI Subsystem',
        desc: 'Feste Geschäftsregeln triagieren EDIFACT-Dateien versus unstrukturierte Kunden-E-Mails.',
        sapGoldenPathTool: 'SAP Build Process Automation',
        sapGoldenPathGraph: 'Graph 1 (Rule-Based Logic)',
        euAiActRisk: 'MINIMAL',
      },
      {
        name: 'Auftrags-PDF & Positions-Extraktion',
        phase: 'Observe',
        primitive: 'Extractor / Transformer',
        archetype: 'copilot',
        sapRef: 'SAP Document AI (GenAI Document Grounding)',
        desc: 'Extraktion von Bestellnummer, Lieferadresse und Materialpositionen aus Kunden-PDFs.',
        sapGoldenPathTool: 'SAP Document AI',
        sapGoldenPathGraph: 'Graph 2.b (Embedded Extraction)',
        euAiActRisk: 'MINIMAL',
      },
      {
        name: 'sap-rpt-1 Zahlungs- & Ausfallrisiko-Scoring',
        phase: 'Orient',
        primitive: 'Matcher / Enricher',
        archetype: 'classic_ml',
        sapRef: 'S/4HANA Credit Management & sap-rpt-1',
        desc: 'Tabellarisches Foundation Model prognostiziert Zahlungsverzug und Bonitätsrisiko.',
        sapGoldenPathTool: 'sap-rpt-1 (Relational Foundation Model)',
        sapGoldenPathGraph: 'Graph 2.a (Tabular / Predictive AI)',
        euAiActRisk: 'LIMITED',
      },
      {
        name: 'Joule Studio Agent Diskrepanz-Klärung',
        phase: 'Decide',
        primitive: 'Evaluator / Reasoner',
        archetype: 'agentic',
        sapRef: 'Joule Studio + MCP Gateway + Signavio Mining',
        desc: 'Autonomer Fachbereichs-Agent prüft Alternativmaterialien und Liefertermine via MCP-Tools.',
        sapGoldenPathTool: 'Joule Studio Agent Builder',
        sapGoldenPathGraph: 'Graph 4 (Autonomous Process Agent)',
        euAiActRisk: 'LIMITED',
      },
      {
        name: 'Kundenauftrag verbuchen (VBAK/VBAP)',
        phase: 'Act',
        primitive: 'Executor / Actuator',
        archetype: 'deterministic',
        sapRef: 'S/4HANA RAP / BAPI_SALESORDER_CREATEFROMDAT2',
        desc: 'Rechtsverbindliche Verbuchung des Auftragsbelegs im ERP-System.',
        sapGoldenPathTool: 'SAP S/4HANA Clean Core RAP API',
        sapGoldenPathGraph: 'Graph 1 (Rule-Based Logic)',
        euAiActRisk: 'MINIMAL',
      },
      {
        name: 'Auftragsbestätigung & Kundenavis',
        phase: 'Act',
        primitive: 'Generator / Synthesizer',
        archetype: 'copilot',
        sapRef: 'SAP Output Management / SMTP',
        desc: 'Erzeugung des PDF-Kundenbelegs und Versand der Auftragsbestätigung.',
        sapGoldenPathTool: 'SAP BTP Output Management',
        sapGoldenPathGraph: 'Graph 2.b (Conversational / Output)',
        euAiActRisk: 'MINIMAL',
      },
    ],
    stepsEn: [
      {
        name: 'Inbound EDI & Freetext Classification',
        phase: 'Observe',
        primitive: 'Filter / Gatekeeper',
        archetype: 'deterministic',
        sapRef: 'SAP Event Mesh & EDI Subsystem',
        desc: 'Deterministic rules triage incoming EDIFACT payloads vs freetext emails.',
        sapGoldenPathTool: 'SAP Build Process Automation',
        sapGoldenPathGraph: 'Graph 1 (Rule-Based Logic)',
        euAiActRisk: 'MINIMAL',
      },
      {
        name: 'Purchase Order PDF Extraction',
        phase: 'Observe',
        primitive: 'Extractor / Transformer',
        archetype: 'copilot',
        sapRef: 'SAP Document AI (GenAI Document Grounding)',
        desc: 'Extraction of PO number, delivery addresses, and line items from customer PDFs.',
        sapGoldenPathTool: 'SAP Document AI',
        sapGoldenPathGraph: 'Graph 2.b (Embedded Extraction)',
        euAiActRisk: 'MINIMAL',
      },
      {
        name: 'sap-rpt-1 Payment Delay & Risk Scoring',
        phase: 'Orient',
        primitive: 'Matcher / Enricher',
        archetype: 'classic_ml',
        sapRef: 'S/4HANA Credit Management & sap-rpt-1',
        desc: 'Relational Foundation Model predicts payment delays and credit default probability.',
        sapGoldenPathTool: 'sap-rpt-1 (Relational Foundation Model)',
        sapGoldenPathGraph: 'Graph 2.a (Tabular / Predictive AI)',
        euAiActRisk: 'LIMITED',
      },
      {
        name: 'Joule Studio Agent Discrepancy Resolution',
        phase: 'Decide',
        primitive: 'Evaluator / Reasoner',
        archetype: 'agentic',
        sapRef: 'Joule Studio + MCP Gateway + Signavio Mining',
        desc: 'Autonomous domain agent evaluates substitute materials and schedules via MCP tools.',
        sapGoldenPathTool: 'Joule Studio Agent Builder',
        sapGoldenPathGraph: 'Graph 4 (Autonomous Process Agent)',
        euAiActRisk: 'LIMITED',
      },
      {
        name: 'Commit Sales Order (VBAK/VBAP)',
        phase: 'Act',
        primitive: 'Executor / Actuator',
        archetype: 'deterministic',
        sapRef: 'S/4HANA RAP / BAPI_SALESORDER_CREATEFROMDAT2',
        desc: 'Binding ERP transaction posting directly in SAP S/4HANA.',
        sapGoldenPathTool: 'SAP S/4HANA Clean Core RAP API',
        sapGoldenPathGraph: 'Graph 1 (Rule-Based Logic)',
        euAiActRisk: 'MINIMAL',
      },
      {
        name: 'Order Confirmation & Dispatch',
        phase: 'Act',
        primitive: 'Generator / Synthesizer',
        archetype: 'copilot',
        sapRef: 'SAP Output Management / SMTP',
        desc: 'Automated synthesis and delivery of binding PDF confirmation.',
        sapGoldenPathTool: 'SAP BTP Output Management',
        sapGoldenPathGraph: 'Graph 2.b (Conversational / Output)',
        euAiActRisk: 'MINIMAL',
      },
    ],
  },
  {
    id: 'preset-miro',
    scopeCode: '2B6',
    nameDe: 'Eingangsrechnungsprüfung (MIRO)',
    nameEn: 'Incoming Invoice Verification (MIRO)',
    areaDe: 'Sourcing & Procurement (MM-IV / S/4HANA)',
    areaEn: 'Sourcing & Procurement (MM-IV / S/4HANA)',
    descDe: 'Erfassung von PDF-Lieferantenrechnungen, 3-Wege-Abgleich gegen Bestellung (EKKO) und Wareneingang, automatische Verbuchung bei Toleranz unter 5€.',
    descEn: 'Ingestion of supplier invoice PDFs, 3-way match against purchase order (EKKO) and goods receipt, automated posting if variance is under $5.',
    stepsDe: [
      {
        name: 'Rechnungs-PDF Inbound Triage',
        phase: 'Observe',
        primitive: 'Filter / Gatekeeper',
        archetype: 'copilot',
        sapRef: 'SAP Event Mesh / Inbound Channel',
        desc: 'Prüfung auf Vorhandensein gültiger PDF-Rechnung und Triage.',
      },
      {
        name: 'OCR & Positions-Extraktion',
        phase: 'Observe',
        primitive: 'Extractor / Transformer',
        archetype: 'copilot',
        sapRef: 'SAP Document Information Extraction (DOX)',
        desc: 'Extrahieren von Rechnungsnummer, Nettobetrag, Steuer und Einzelpositionen.',
      },
      {
        name: '3-Wege-Match gegen Bestellung & WE',
        phase: 'Orient',
        primitive: 'Matcher / Enricher',
        archetype: 'classic_ml',
        sapRef: 'S/4HANA EKKO / EKPO / MSEG Lookup',
        desc: 'Abgleich der berechneten Mengen und Preise gegen Bestell- und Wareneingangsbeleg.',
      },
      {
        name: 'Toleranz- & Abweichungsprüfung',
        phase: 'Decide',
        primitive: 'Evaluator / Reasoner',
        archetype: 'autopilot',
        sapRef: 'SAP BRFplus Rechnungs-Toleranzgruppen',
        desc: 'Prüfung ob Preis- oder Mengenabweichungen innerhalb der erlaubten Toleranz liegen.',
      },
      {
        name: 'Lieferantenrechnung verbuchen',
        phase: 'Act',
        primitive: 'Executor / Actuator',
        archetype: 'deterministic',
        sapRef: 'BAPI_INCOMINGINVOICE_CREATE / MR8M',
        desc: 'Rechtsverbindliche Verbuchung der Verbindlichkeit in FI-AP / MM-IV.',
      },
      {
        name: 'Zahlungsavis & Freigabeinfo senden',
        phase: 'Act',
        primitive: 'Generator / Synthesizer',
        archetype: 'copilot',
        sapRef: 'SAP Output Management / SMTP',
        desc: 'Information an Lieferanten bei Differenzen oder Bereitstellung zur Zahllauf-Freigabe.',
      },
    ],
    stepsEn: [
      {
        name: 'Invoice PDF Inbound Triage',
        phase: 'Observe',
        primitive: 'Filter / Gatekeeper',
        archetype: 'copilot',
        sapRef: 'SAP Event Mesh / Inbound Channel',
        desc: 'Inspection for valid invoice PDF attachment and routing classification.',
      },
      {
        name: 'OCR & Line Item Extraction',
        phase: 'Observe',
        primitive: 'Extractor / Transformer',
        archetype: 'copilot',
        sapRef: 'SAP Document Information Extraction (DOX)',
        desc: 'Extract invoice number, net amounts, VAT rates, and line items.',
      },
      {
        name: '3-Way Match vs PO & Goods Receipt',
        phase: 'Orient',
        primitive: 'Matcher / Enricher',
        archetype: 'classic_ml',
        sapRef: 'S/4HANA EKKO / EKPO / MSEG Lookup',
        desc: 'Reconcile invoiced quantities and unit prices against purchase orders.',
      },
      {
        name: 'Tolerance & Variance Evaluation',
        phase: 'Decide',
        primitive: 'Evaluator / Reasoner',
        archetype: 'autopilot',
        sapRef: 'SAP BRFplus Invoice Tolerance Matrix',
        desc: 'Verify whether price or quantity variances are within allowed enterprise thresholds.',
      },
      {
        name: 'Post Vendor Invoice',
        phase: 'Act',
        primitive: 'Executor / Actuator',
        archetype: 'deterministic',
        sapRef: 'BAPI_INCOMINGINVOICE_CREATE / MR8M',
        desc: 'Persist binding accounts payable liability in FI-AP / MM-IV.',
      },
      {
        name: 'Send Remittance / Dispute Notice',
        phase: 'Act',
        primitive: 'Generator / Synthesizer',
        archetype: 'copilot',
        sapRef: 'SAP Output Management / SMTP',
        desc: 'Notify supplier of invoice clearance or route dispute notice for review.',
      },
    ],
  },

  {
    id: 'preset-claim',
    scopeCode: 'PR01',
    nameDe: 'Lieferanten-Reklamation (QM)',
    nameEn: 'Vendor Quality Claim (QM)',
    areaDe: 'Quality Management & Purchasing (QM / MM)',
    areaEn: 'Quality Management & Purchasing (QM / MM)',
    descDe: 'Reklamation bei defekter Warenanlieferung: Schadensbild erfassen, Charge zuweisen, Kulanz/Garantie prüfen und 8D-Report anfordern.',
    descEn: 'Dispute management for defective material receipts: Ingest inspection defect, resolve batch ID, check warranty, and dispatch 8D notice.',
    stepsDe: [
      {
        name: 'Mängelbericht Inbound Triage',
        phase: 'Observe',
        primitive: 'Filter / Gatekeeper',
        archetype: 'copilot',
        sapRef: 'SAP Event Mesh / Quality Portal',
        desc: 'Klassifizierung der Mängelmeldung: Transportschaden vs. Materialfehler.',
      },
      {
        name: 'Schadensbild- & Foto-Extraktion',
        phase: 'Observe',
        primitive: 'Extractor / Transformer',
        archetype: 'copilot',
        sapRef: 'SAP DOX & Multimodal Image Embedding',
        desc: 'Parsing von Prüflos, Fehlercodes, Fotos und Messwerten.',
      },
      {
        name: 'Lieferant & Chargen-Matching',
        phase: 'Orient',
        primitive: 'Matcher / Enricher',
        archetype: 'classic_ml',
        sapRef: 'S/4HANA MCHA / LFA1 Lookup',
        desc: 'Auflösung der betroffenen Materialcharge und des verantwortlichen Kreditors.',
      },
      {
        name: 'Gewährleistungs- & SLA-Prüfung',
        phase: 'Decide',
        primitive: 'Evaluator / Reasoner',
        archetype: 'autopilot',
        sapRef: 'SAP BRFplus QM-Reklamationsmatrix',
        desc: 'Ermittlung ob Ersatzlieferung oder Gutschrift gefordert wird.',
      },
      {
        name: 'Q-Meldung & Sperrbestand buchen',
        phase: 'Act',
        primitive: 'Executor / Actuator',
        archetype: 'copilot',
        sapRef: 'BAPI_QUALNOTIF_CREATE / MIGO Umbuchung',
        desc: 'Anlage der offiziellen QM-Meldung und Umbuchung in den Sperrbestand.',
      },
      {
        name: '8D-Report & Mängelrüge versenden',
        phase: 'Act',
        primitive: 'Generator / Synthesizer',
        archetype: 'copilot',
        sapRef: 'SAP Output Management / Mail',
        desc: 'Automatisierte Erstellung und Versand des Mängelrüge-Schreibens.',
      },
    ],
    stepsEn: [
      {
        name: 'Defect Inbound Triage',
        phase: 'Observe',
        primitive: 'Filter / Gatekeeper',
        archetype: 'copilot',
        sapRef: 'SAP Event Mesh / Quality Portal',
        desc: 'Classification of incident: Transit damage vs. material fabrication defect.',
      },
      {
        name: 'Defect Symptom & Photo Extraction',
        phase: 'Observe',
        primitive: 'Extractor / Transformer',
        archetype: 'copilot',
        sapRef: 'SAP DOX & Multimodal Image Embedding',
        desc: 'Parsing inspection lot, defect codes, photos, and measurements.',
      },
      {
        name: 'Vendor & Batch Matching',
        phase: 'Orient',
        primitive: 'Matcher / Enricher',
        archetype: 'classic_ml',
        sapRef: 'S/4HANA MCHA / LFA1 Lookup',
        desc: 'Resolve affected material batch number and authoritative vendor ID.',
      },
      {
        name: 'Warranty & Cost Allocation Check',
        phase: 'Decide',
        primitive: 'Evaluator / Reasoner',
        archetype: 'autopilot',
        sapRef: 'SAP BRFplus Quality Matrix',
        desc: 'Determine whether replacement shipment or credit memo is mandated.',
      },
      {
        name: 'Create Quality Notification (QM)',
        phase: 'Act',
        primitive: 'Executor / Actuator',
        archetype: 'copilot',
        sapRef: 'BAPI_QUALNOTIF_CREATE / MIGO Blocked Stock',
        desc: 'Post formal QM notification and transfer items into blocked inspection stock.',
      },
      {
        name: 'Dispatch 8D Defect Notice',
        phase: 'Act',
        primitive: 'Generator / Synthesizer',
        archetype: 'copilot',
        sapRef: 'SAP Output Management / Mail',
        desc: 'Generate formal defect report requesting 8D root-cause corrective action.',
      },
    ],
  },
];

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ isOpen, onClose }) => {
  const { addCustomTemplate, language } = useSimulatorStore();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'presets' | 'golden_path'>('presets');
  const [activePresetId, setActivePresetId] = useState<string>('preset-gpt-o2c');
  const [processName, setProcessName] = useState<string>('');
  const [scopeCode, setScopeCode] = useState<string>('');
  const [businessArea, setBusinessArea] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Golden Path Wizard States
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const [q1_ruleBased, setQ1_ruleBased] = useState<boolean | null>(null);
  const [q2_dataModality, setQ2_dataModality] = useState<'tabular' | 'timeseries' | 'unstructured' | null>(null);
  const [q3_agency, setQ3_agency] = useState<'extraction' | 'conversational' | 'agentic' | null>(null);
  const [q4_agentScope, setQ4_agentScope] = useState<'process_agent' | 'autonomous_agent' | null>(null);

  const [currentSteps, setCurrentSteps] = useState<
    Array<{
      name: string;
      phase: OODAPhase;
      primitive: CognitivePrimitive;
      archetype: AutomationArchetype;
      sapRef: string;
      desc: string;
      sapGoldenPathTool?: string;
      sapGoldenPathGraph?: string;
      euAiActRisk?: EuAiActRiskLevel;
    }>
  >([]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load preset upon opening or selecting
  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];
    setActivePresetId(preset.id);
    setScopeCode(preset.scopeCode);
    setProcessName(language === 'en' ? preset.nameEn : preset.nameDe);
    setBusinessArea(language === 'en' ? preset.areaEn : preset.areaDe);
    setDescription(language === 'en' ? preset.descEn : preset.descDe);
    setCurrentSteps(language === 'en' ? preset.stepsEn : preset.stepsDe);
  };

  useEffect(() => {
    if (isOpen) {
      applyPreset('preset-gpt-o2c');
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  // Golden Path Wizard Evaluation
  const getWizardRecommendation = () => {
    if (q1_ruleBased === true) {
      return {
        archetype: 'deterministic' as AutomationArchetype,
        tool: 'SAP Build Process Automation / BRFplus',
        graph: 'Graph 1 (Rule-Based Logic)',
        euRisk: 'MINIMAL' as EuAiActRiskLevel,
        title: language === 'en' ? 'Graph 1: Deterministic Rule Execution' : 'Graph 1: Deterministische Regelausführung',
        desc: language === 'en'
          ? 'Fixed business rules, tables, or DMN workflows in SAP Build. Zero tokens, zero Capacity Units, 100% Straight-Through-Processing.'
          : 'Feste Geschäftsregeln, Tabellen oder DMN-Entscheidungstabellen in SAP Build. 0 Tokens, 0 Capacity Units, 100% Dunkelverarbeitung.',
      };
    }

    if (q1_ruleBased === false) {
      if (q2_dataModality === 'tabular') {
        return {
          archetype: 'classic_ml' as AutomationArchetype,
          tool: 'sap-rpt-1 (Relational Foundation Model)',
          graph: 'Graph 2.a (Tabular / Predictive AI)',
          euRisk: 'LIMITED' as EuAiActRiskLevel,
          title: language === 'en' ? 'Graph 2.a: sap-rpt-1 Relational Foundation Model' : 'Graph 2.a: sap-rpt-1 Relationales Foundation Model',
          desc: language === 'en'
            ? "SAP's proprietary foundation model for tabular business data (e.g. payment delay prediction, customer churn, dispute likelihood)."
            : 'SAPs spezialisiertes Foundation Model für relationale Geschäftsdaten (z. B. Zahlungsverzugs-Prognosen, Churn-Scoring, Rechnungsdifferenz-Vorhersage).',
        };
      }
      if (q2_dataModality === 'timeseries') {
        return {
          archetype: 'classic_ml' as AutomationArchetype,
          tool: 'SAP HANA Cloud PAL (Predictive Analytics)',
          graph: 'Graph 2.a (Classic Time-Series ML)',
          euRisk: 'MINIMAL' as EuAiActRiskLevel,
          title: language === 'en' ? 'Graph 2.a: Classic ML (HANA PAL)' : 'Graph 2.a: Klassisches ML (HANA PAL)',
          desc: language === 'en'
            ? 'Univariate time-series forecasting (e.g. demand planning, inventory replenishment) executed natively in SAP HANA Cloud.'
            : 'Univariate Zeitreihen-Prognosen (z. B. Absatz- und Bedarfsplanung) nativ in der SAP HANA Cloud ausgeführt.',
        };
      }
      if (q2_dataModality === 'unstructured') {
        if (q3_agency === 'extraction') {
          return {
            archetype: 'classic_ml' as AutomationArchetype,
            tool: 'SAP Document AI (GenAI Hub Ingestion)',
            graph: 'Graph 2.b & 3 (Embedded Information Extraction)',
            euRisk: 'MINIMAL' as EuAiActRiskLevel,
            title: language === 'en' ? 'Graph 2.b: SAP Document AI Extraction' : 'Graph 2.b: SAP Document AI Extraktion',
            desc: language === 'en'
              ? 'Low-agency single-turn document parsing. Extracts structured line items from PDFs and emails with schema validation.'
              : 'Low-Agency Einzelschritt-Extraktion. Wandelt unstrukturierte PDFs und E-Mails in strukturierte SAP-Belegpositionen um.',
          };
        }
        if (q3_agency === 'conversational') {
          return {
            archetype: 'copilot' as AutomationArchetype,
            tool: 'SAP Joule Skill (Fiori Embedded)',
            graph: 'Graph 2.b (Conversational UI / HITL)',
            euRisk: 'LIMITED' as EuAiActRiskLevel,
            title: language === 'en' ? 'Graph 2.b: SAP Joule Copilot (HITL)' : 'Graph 2.b: SAP Joule Copilot (HITL)',
            desc: language === 'en'
              ? 'Human-in-the-Loop conversational assistance. The clerk reviews proposals in SAP Fiori and signs off before posting.'
              : 'Human-in-the-Loop Assistenz im SAP Fiori Launchpad. Sachbearbeiter prüfen Vorschläge und geben Belege manuell frei.',
          };
        }
        if (q3_agency === 'agentic') {
          if (q4_agentScope === 'process_agent') {
            return {
              archetype: 'agentic' as AutomationArchetype,
              tool: 'Joule Studio Agent Builder + MCP Protocol Gateway',
              graph: 'Graph 4 (Autonomous Process Agent)',
              euRisk: 'LIMITED' as EuAiActRiskLevel,
              title: language === 'en' ? 'Graph 4: Joule Studio Process Agent (Low-Code)' : 'Graph 4: Joule Studio Process Agent (Low-Code)',
              desc: language === 'en'
                ? 'Domain-scoped autonomous agent built via Joule Studio. Resolves exceptions using MCP tools with Signavio Agent Mining oversight.'
                : 'Fachbereichsbezogener autonomer Agent aus dem Joule Studio. Löst Abweichungen über standardisierte MCP-Tools autonom auf.',
            };
          }
          if (q4_agentScope === 'autonomous_agent') {
            return {
              archetype: 'agentic' as AutomationArchetype,
              tool: 'SAP Cloud SDK for AI + A2A Protocol / Agent Hub',
              graph: 'Graph 4 (Autonomous Multi-System Agent)',
              euRisk: 'HIGH' as EuAiActRiskLevel,
              title: language === 'en' ? 'Graph 4: Cross-Functional Autonomous Agent (Pro-Code)' : 'Graph 4: Cross-Funktionaler Autonomer Agent (Pro-Code)',
              desc: language === 'en'
                ? 'Multi-agent orchestration utilizing the Agent-to-Agent (A2A) protocol. Registered in SAP AI Agent Hub on LeanIX.'
                : 'Komplexe Multi-Agenten-Orchestrierung über das A2A-Protokoll (Agent-to-Agent). Registriert im SAP AI Agent Hub auf LeanIX.',
            };
          }
        }
      }
    }

    return null;
  };

  const applyWizardToStep = () => {
    const rec = getWizardRecommendation();
    if (!rec || !currentSteps[selectedStepIdx]) return;

    const updated = [...currentSteps];
    updated[selectedStepIdx] = {
      ...updated[selectedStepIdx],
      archetype: rec.archetype,
      sapRef: rec.tool,
      sapGoldenPathTool: rec.tool,
      sapGoldenPathGraph: rec.graph,
      euAiActRisk: rec.euRisk,
    };
    setCurrentSteps(updated);
  };

  // Freitext Dekomposition in 6 Schritte entlang des SAP AI Golden Path
  const handleDeconstructText = () => {
    if (!description.trim()) return;

    const pName = processName.trim() || (language === 'en' ? 'Custom Business Process' : 'Benutzerdefinierter Prozess');
    const sCode = scopeCode.trim() || 'CUS1';

    const deconstructed = [
      {
        name: language === 'en' ? `${pName} Inbound & Triage` : `${pName} Eingang & Triage`,
        phase: 'Observe' as OODAPhase,
        primitive: 'Filter / Gatekeeper' as CognitivePrimitive,
        archetype: 'deterministic' as AutomationArchetype,
        sapRef: 'SAP Build Process Automation / BRFplus',
        desc: language === 'en' ? 'Deterministic rule-based triage of inbound requests.' : 'Deterministische Regeltriage von eingehenden Belegen.',
        sapGoldenPathTool: 'SAP Build Process Automation / BRFplus',
        sapGoldenPathGraph: 'Graph 1 (Rule-Based Logic)',
        euAiActRisk: 'MINIMAL' as EuAiActRiskLevel,
      },
      {
        name: language === 'en' ? `${pName} Payload Extraction` : `${pName} Datenextraktion`,
        phase: 'Observe' as OODAPhase,
        primitive: 'Extractor / Transformer' as CognitivePrimitive,
        archetype: 'copilot' as AutomationArchetype,
        sapRef: 'SAP Document AI (GenAI Document Grounding)',
        desc: language === 'en' ? 'Extract header and line items from unstructured documents.' : 'Kopf- und Positionsdaten aus unstrukturierten Belegen extrahieren.',
        sapGoldenPathTool: 'SAP Document AI',
        sapGoldenPathGraph: 'Graph 2.b & 3 (Embedded Extraction)',
        euAiActRisk: 'MINIMAL' as EuAiActRiskLevel,
      },
      {
        name: language === 'en' ? `${pName} Master Data Reconciliation` : `${pName} Stammdaten-Abgleich`,
        phase: 'Orient' as OODAPhase,
        primitive: 'Matcher / Enricher' as CognitivePrimitive,
        archetype: 'classic_ml' as AutomationArchetype,
        sapRef: 'sap-rpt-1 (Relational Foundation Model)',
        desc: language === 'en' ? 'Match tabular data against SAP business partners and items.' : 'Abgleich relationaler Daten gegen SAP Geschäftspartner und Materialstamm.',
        sapGoldenPathTool: 'sap-rpt-1 (Relational Foundation Model)',
        sapGoldenPathGraph: 'Graph 2.a (Tabular / Predictive AI)',
        euAiActRisk: 'LIMITED' as EuAiActRiskLevel,
      },
      {
        name: language === 'en' ? `${pName} Discrepancy Resolution` : `${pName} Diskrepanzklärung`,
        phase: 'Decide' as OODAPhase,
        primitive: 'Evaluator / Reasoner' as CognitivePrimitive,
        archetype: 'agentic' as AutomationArchetype,
        sapRef: 'Joule Studio Process Agent + MCP Knowledge Graph',
        desc: language === 'en' ? 'Autonomous discrepancy resolution within enterprise guardrails.' : 'Autonome Diskrepanzklärung innerhalb von Schutzplanken via MCP.',
        sapGoldenPathTool: 'Joule Studio Process Agent + MCP Knowledge Graph',
        sapGoldenPathGraph: 'Graph 4 (Autonomous Process Agent)',
        euAiActRisk: 'LIMITED' as EuAiActRiskLevel,
      },
      {
        name: language === 'en' ? `${pName} ERP Mutation & Posting` : `${pName} Belegverbuchung in SAP`,
        phase: 'Act' as OODAPhase,
        primitive: 'Executor / Actuator' as CognitivePrimitive,
        archetype: 'deterministic' as AutomationArchetype,
        sapRef: 'S/4HANA RAP / OData Service',
        desc: language === 'en' ? 'Create binding transaction in S/4HANA via Clean Core API.' : 'Rechtsverbindlichen Beleg in S/4HANA via Clean-Core-API anlegen.',
        sapGoldenPathTool: 'S/4HANA RAP / OData Service',
        sapGoldenPathGraph: 'Graph 1 (Clean Core Mutation)',
        euAiActRisk: 'MINIMAL' as EuAiActRiskLevel,
      },
      {
        name: language === 'en' ? `${pName} Output & Notification` : `${pName} Ausgabe & Benachrichtigung`,
        phase: 'Act' as OODAPhase,
        primitive: 'Generator / Synthesizer' as CognitivePrimitive,
        archetype: 'copilot' as AutomationArchetype,
        sapRef: 'SAP BTP Output Management + Joule Assistant',
        desc: language === 'en' ? 'Generate status confirmation and dispatch with preview.' : 'Statusbestätigung erzeugen und mit Fiori-Vorschau versenden.',
        sapGoldenPathTool: 'SAP BTP Output Management + Joule Assistant',
        sapGoldenPathGraph: 'Graph 3 (Embedded Output)',
        euAiActRisk: 'MINIMAL' as EuAiActRiskLevel,
      },
    ];

    setCurrentSteps(deconstructed);
  };

  const handleCreateAndLaunch = () => {
    const templateId = 'custom-' + Date.now();
    const finalSteps: ProcessStep[] = currentSteps.map((s, idx) => {
      const rec = getGoldenPathRecommendation(
        s.primitive,
        s.phase,
        idx < 2,
        s.phase === 'Act' ? (idx === 4 ? 4 : 1) : 1,
        language
      );
      return {
        id: `${templateId}-step-${idx + 1}`,
        name: s.name,
        oodaPhase: s.phase,
        primitive: s.primitive,
        currentArchetype: s.archetype,
        confidenceGate: s.archetype === 'deterministic' ? 95 : 85,
        cleanCoreIndex: 'COMPLIANT',
        reversibility: s.phase === 'Act' ? (idx === 4 ? 4 : 1) : 1,
        isUnstructuredInput: idx < 2,
        baseLatencyMs: s.archetype === 'deterministic' ? 45 : s.archetype === 'classic_ml' ? 120 : 650,
        baseTokensIn: s.archetype === 'deterministic' ? 0 : 850,
        baseTokensOut: s.archetype === 'deterministic' ? 0 : 250,
        damageAmountEur: idx === 4 ? 4500 : 150,
        sapReference: s.sapRef || rec.recommendedTool,
        description: s.desc,
        sapGoldenPathTool: s.sapGoldenPathTool || rec.recommendedTool,
        sapGoldenPathGraph: s.sapGoldenPathGraph || rec.graphRef,
        euAiActRisk: s.euAiActRisk || (s.archetype === 'deterministic' ? 'MINIMAL' : s.archetype === 'agentic' ? 'HIGH' : 'LIMITED'),
      };
    });

    const newTemplate: ProcessTemplate = {
      id: templateId,
      scopeCode: scopeCode || 'CUS1',
      name: processName || (language === 'en' ? 'New Workflow' : 'Neuer Workflow'),
      businessArea: businessArea || 'SAP S/4HANA Custom',
      description: description || processName,
      steps: finalSteps,
    };

    addCustomTemplate(newTemplate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 space-y-4 my-auto relative"
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
                {t.creatorModalTitle}
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-mono">
                {t.creatorModalSubtitle}
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

        {/* Tab Switcher: Presets vs SAP AI Golden Path Wizard */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activeTab === 'presets'
                ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/20'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.creatorTabPreset}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('golden_path')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activeTab === 'golden_path'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-300" />
            <span>{t.creatorTabGoldenPath}</span>
          </button>
        </div>

        {/* TAB 1: PRESETS & FREITEXT */}
        {activeTab === 'presets' && (
          <div className="space-y-3.5">
            {/* 1. Vorlagen-Schnellauswahl */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{t.creatorPresetLabel}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESETS.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${
                        isActive
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-400 dark:border-sky-600 shadow'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-bold">[{preset.scopeCode}]</span>
                      <span>{language === 'en' ? preset.nameEn : preset.nameDe}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Stammdaten des Workflows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {t.creatorProcessName}
                </label>
                <input
                  type="text"
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  placeholder={t.creatorProcessNamePlaceholder}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {t.creatorScopeCode}
                </label>
                <input
                  type="text"
                  value={scopeCode}
                  onChange={(e) => setScopeCode(e.target.value)}
                  placeholder="z. B. 2B6"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-sky-700 dark:text-sky-300 font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {t.creatorBusinessArea}
                </label>
                <input
                  type="text"
                  value={businessArea}
                  onChange={(e) => setBusinessArea(e.target.value)}
                  placeholder="z. B. Sourcing & Procurement"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 3. Freitext Ablaufbeschreibung & KI Dekonstruktion */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10.5px] font-mono uppercase">
                <span>{t.creatorDescription}</span>
                <button
                  type="button"
                  onClick={handleDeconstructText}
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-white flex items-center space-x-1 font-semibold hover:underline"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{t.creatorGenerateBtn}</span>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder={t.creatorDescriptionPlaceholder}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 resize-none font-sans"
              />
            </div>
          </div>
        )}

        {/* TAB 2: SAP AI GOLDEN PATH WIZARD */}
        {activeTab === 'golden_path' && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/40 text-xs">
            {/* Header & Step Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t.wizardTitle}</span>
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {t.wizardSubtitle}
                </p>
              </div>

              {/* Step Target Picker */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {language === 'en' ? 'Target Step:' : 'Ziel-Schritt:'}
                </span>
                <select
                  value={selectedStepIdx}
                  onChange={(e) => setSelectedStepIdx(Number(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700/60 rounded px-2 py-1 text-sky-700 dark:text-sky-300 font-bold text-[10px] focus:outline-none"
                >
                  {currentSteps.map((s, idx) => (
                    <option key={idx} value={idx}>
                      #{idx + 1}: {s.name.slice(0, 24)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Guided Questions (Graphs 1 to 4) */}
            <div className="space-y-2.5">
              {/* Question 1: Graph 1 */}
              <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-[10.5px] font-bold text-sky-700 dark:text-sky-300 font-mono">
                  {t.wizardQuestion1Title}
                </div>
                <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                  {t.wizardQuestion1Desc}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setQ1_ruleBased(true);
                      setQ2_dataModality(null);
                      setQ3_agency(null);
                      setQ4_agentScope(null);
                    }}
                    className={`p-2 rounded text-left border transition text-[11px] ${
                      q1_ruleBased === true
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold shadow'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="block font-semibold">
                      {language === 'en' ? '✓ Yes (Deterministic Rules / Formulas)' : '✓ Ja (Feste Regeln / Formeln)'}
                    </span>
                    <span className="text-[9.5px] opacity-80 font-normal font-mono block">➔ 0 AI: SAP Build DMN / BRFplus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQ1_ruleBased(false);
                    }}
                    className={`p-2 rounded text-left border transition text-[11px] ${
                      q1_ruleBased === false
                        ? 'bg-sky-100 dark:bg-sky-950/70 border-sky-400 dark:border-sky-500 text-sky-800 dark:text-sky-200 font-bold shadow'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="block font-semibold">
                      {language === 'en' ? '⚡ No (Requires AI)' : '⚡ Nein (Benötigt KI)'}
                    </span>
                    <span className="text-[9.5px] opacity-80 font-normal font-mono block">
                      {language === 'en' ? '➔ Proceed to Graph 2 (Modality)' : '➔ Weiter zu Graph 2 (Modalität)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Question 2: Graph 2.a (if Q1 is false) */}
              {q1_ruleBased === false && (
                <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 animate-fadeIn">
                  <div className="text-[10.5px] font-bold text-purple-700 dark:text-purple-300 font-mono">
                    {t.wizardQuestion2Title}
                  </div>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                    {t.wizardQuestion2Desc}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setQ2_dataModality('tabular');
                        setQ3_agency(null);
                        setQ4_agentScope(null);
                      }}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q2_dataModality === 'tabular'
                          ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">
                        {language === 'en' ? 'Tabular Data' : 'Tabellarische Daten'}
                      </span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">➔ sap-rpt-1 (Foundation Model)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQ2_dataModality('timeseries');
                        setQ3_agency(null);
                        setQ4_agentScope(null);
                      }}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q2_dataModality === 'timeseries'
                          ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">
                        {language === 'en' ? 'Time-Series' : 'Zeitreihen'}
                      </span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">➔ Classic ML (HANA PAL)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQ2_dataModality('unstructured');
                      }}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q2_dataModality === 'unstructured'
                          ? 'bg-sky-100 dark:bg-sky-950/70 border-sky-400 dark:border-sky-500 text-sky-800 dark:text-sky-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">
                        {language === 'en' ? 'Unstructured / Text' : 'Unstrukturiert / Text'}
                      </span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">
                        {language === 'en' ? '➔ Proceed to Graph 2.b/3 (Agency)' : '➔ Weiter zu Graph 2.b/3 (Agency)'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Question 3: Graph 2.b & 3 (if Q2 is unstructured) */}
              {q1_ruleBased === false && q2_dataModality === 'unstructured' && (
                <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 animate-fadeIn">
                  <div className="text-[10.5px] font-bold text-amber-700 dark:text-amber-300 font-mono">
                    {t.wizardQuestion3Title}
                  </div>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                    {t.wizardQuestion3Desc}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setQ3_agency('extraction');
                        setQ4_agentScope(null);
                      }}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q3_agency === 'extraction'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">
                        {language === 'en' ? 'Single-Turn Extraction' : 'Einzelschritt-Extraktion'}
                      </span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">➔ SAP Document AI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQ3_agency('conversational');
                        setQ4_agentScope(null);
                      }}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q3_agency === 'conversational'
                          ? 'bg-sky-100 dark:bg-sky-950/70 border-sky-400 dark:border-sky-500 text-sky-800 dark:text-sky-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">
                        {language === 'en' ? 'Copilot Dialogue (HITL)' : 'Copilot Dialog (HITL)'}
                      </span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">➔ SAP Joule Skill (Fiori)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQ3_agency('agentic');
                      }}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q3_agency === 'agentic'
                          ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">
                        {language === 'en' ? 'Autonomous Agent' : 'Autonomer Agent'}
                      </span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">
                        {language === 'en' ? '➔ Proceed to Graph 4 (Scope)' : '➔ Weiter zu Graph 4 (Scope)'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Question 4: Graph 4 (if Q3 is agentic) */}
              {q1_ruleBased === false && q2_dataModality === 'unstructured' && q3_agency === 'agentic' && (
                <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 animate-fadeIn">
                  <div className="text-[10.5px] font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                    {t.wizardQuestion4Title}
                  </div>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                    {t.wizardQuestion4Desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setQ4_agentScope('process_agent')}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q4_agentScope === 'process_agent'
                          ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">Process Agent (Low-Code)</span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">➔ Joule Studio + MCP Gateway</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQ4_agentScope('autonomous_agent')}
                      className={`p-2 rounded text-left border transition text-[10.5px] ${
                        q4_agentScope === 'autonomous_agent'
                          ? 'bg-indigo-100 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-500 text-indigo-800 dark:text-indigo-200 font-bold shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-semibold">Autonomous Agent (Pro-Code)</span>
                      <span className="text-[9px] opacity-80 font-normal font-mono block">➔ SAP Cloud SDK for AI + A2A</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Recommendation Result Box */}
            {getWizardRecommendation() && (
              <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-purple-100 dark:from-purple-950/40 to-slate-100 dark:to-slate-900 border border-purple-300 dark:border-purple-600/50 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {getWizardRecommendation()?.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-[9.5px]">
                    <span className="px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
                      {getWizardRecommendation()?.tool}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                      EU AI Act: {getWizardRecommendation()?.euRisk}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  {getWizardRecommendation()?.desc}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-purple-200 dark:border-slate-800/80 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applyWizardToStep}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {language === 'en' ? `Apply to Step #${selectedStepIdx + 1}` : `Auf Schritt #${selectedStepIdx + 1} anwenden`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('preset-gpt-o2c')}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-sky-800 text-[10.5px] font-mono transition"
                  >
                    {language === 'en' ? '⚡ Load Full Golden Path Blueprint' : '⚡ Vollständige Golden Path Vorlage laden'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Die 6 generierten OODA-Schritte mit direkter Anpassung */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between px-0.5">
            <span>{t.creatorGeneratedHeading}</span>
            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
              6 {language === 'en' ? 'Cognitive Primitives' : 'Kognitive Primitives'}
            </span>
          </div>

          <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
            {currentSteps.map((step, idx) => {
              const rec = getGoldenPathRecommendation(
                step.primitive,
                step.phase,
                idx < 2,
                step.phase === 'Act' ? (idx === 4 ? 4 : 1) : 1,
                language
              );
              const isCompliant = step.archetype === rec.recommendedArchetype;

              return (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-5 h-5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => {
                          const updated = [...currentSteps];
                          updated[idx].name = e.target.value;
                          setCurrentSteps(updated);
                        }}
                        className="bg-transparent text-slate-900 dark:text-white font-sans font-bold text-xs focus:outline-none focus:underline truncate w-full sm:w-64"
                      />
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {step.phase} &bull; {step.primitive}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 flex-wrap sm:flex-nowrap gap-y-1">
                    {/* Golden Path Compliance Indicator */}
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold border flex items-center space-x-1 ${
                        isCompliant
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/70'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-600/70'
                      }`}
                      title={
                        isCompliant
                          ? `${language === 'en' ? 'Conforms to SAP Golden Path' : 'Entspricht SAP Golden Path'}: ${rec.qualityBenefit}`
                          : `${language === 'en' ? 'Deviation from SAP Golden Path' : 'Abweichung vom SAP Golden Path'} (${language === 'en' ? 'Recommended' : 'Empfohlen'}: ${rec.recommendedArchetype} via ${rec.recommendedTool})`
                      }
                    >
                      <span>{isCompliant ? '🟢 Golden Path' : (language === 'en' ? '⚠️ Deviation' : '⚠️ Abweichung')}</span>
                    </span>

                    {step.sapGoldenPathTool && (
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/80 hidden sm:inline truncate max-w-[120px]"
                        title={step.sapGoldenPathTool}
                      >
                        {step.sapGoldenPathTool.split(' ')[0]}
                      </span>
                    )}
                    {step.euAiActRisk && (
                      <span
                        className={`text-[8.5px] font-mono px-1 py-0.2 rounded font-semibold border ${
                          step.euAiActRisk === 'HIGH'
                            ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
                            : step.euAiActRisk === 'LIMITED'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {step.euAiActRisk}
                      </span>
                    )}
                    <select
                      value={step.archetype}
                      onChange={(e) => {
                        const updated = [...currentSteps];
                        updated[idx].archetype = e.target.value as AutomationArchetype;
                        setCurrentSteps(updated);
                      }}
                      className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sky-700 dark:text-sky-300 font-bold text-[10px] rounded px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="deterministic">
                        {language === 'en' ? 'Deterministic' : 'Deterministisch'} {rec.recommendedArchetype === 'deterministic' ? '★' : ''}
                      </option>
                      <option value="classic_ml">
                        Assistant / ML {rec.recommendedArchetype === 'classic_ml' ? '★' : ''}
                      </option>
                      <option value="copilot">
                        Copilot (HITL) {rec.recommendedArchetype === 'copilot' ? '★' : ''}
                      </option>
                      <option value="autopilot">
                        Autopilot {rec.recommendedArchetype === 'autopilot' ? '★' : ''}
                      </option>
                      <option value="agentic">
                        Agentic Swarm {rec.recommendedArchetype === 'agentic' ? '★' : ''}
                      </option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Footer Aktionen */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            {t.creatorBtnCancel}
          </button>

          <button
            type="button"
            onClick={handleCreateAndLaunch}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#0A6ED1] hover:bg-sky-600 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{t.creatorBtnLaunch}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
