import { AutomationArchetype } from '@/types/process';
import { Language } from '@/i18n/translations';

export interface ZwingmannTier {
  id: AutomationArchetype;
  name: string;
  zwingmannLevel: string;
  zwingmannConcept: string;
  sapShortLabel: string;
  sapEquivalent: string;
  shortDesc: string;
  fullDesc: string;
  latencyText: string;
  cuText: string;
  recommendedFor: string;
  terminologyAlert?: {
    title: string;
    description: string;
  };
}

export const ZWINGMANN_TIERS_DE: Record<AutomationArchetype, ZwingmannTier> = {
  deterministic: {
    id: 'deterministic',
    name: 'Deterministisch',
    zwingmannLevel: 'Stufe 1 (Kognitions-Kybernetik)',
    zwingmannConcept: 'Deterministisches Regelwerk (Keine stochastische KI)',
    sapShortLabel: 'BRFplus / RAP',
    sapEquivalent: 'SAP S/4HANA Core / BRFplus / ABAP Cloud RAP / SQL Exact Match',
    shortDesc: 'BRFplus / DMN / SQL',
    fullDesc:
      'Klassisches Regelwerk ohne KI. 0 CU Inferenz, < 50 ms Latenz. Fehlerrate 0% bei sauberem Datenformat. Ambiguitätstoleranz = 0 (bricht bei unstrukturiertem Freitext ab). 100% GoBD- und revisionssicher.',
    latencyText: '< 50 ms',
    cuText: '0 CU',
    recommendedFor: 'Strukturierte Geschäftsregeln, ATP-Prüfung, feste OData-Filter, buchhalterische Verbuchung.',
  },
  classic_ml: {
    id: 'classic_ml',
    name: 'Single-Turn ML',
    zwingmannLevel: 'Stufe 2 (Kognitions-Kybernetik)',
    zwingmannConcept: 'Stateless Single-Turn API-Call (Prompt ➔ Text/JSON ohne Dialog)',
    sapShortLabel: 'GenAI Hub / DOX',
    sapEquivalent: 'SAP GenAI Hub Foundation Models / SAP DOX / HANA In-Memory Fuzzy Search',
    shortDesc: 'Single-Turn / ML (Stateless)',
    fullDesc:
      'Isolierter, zustandsloser Modellaufruf im Single-Turn Modus (Prompt in ➔ Text/JSON out, OCR-Extraktion, Übersetzung oder Fuzzy Search) – vollautomatisch im Hintergrund ohne Dialog und ohne Tool-Calling.',
    latencyText: '~ 380 ms',
    cuText: '0.002 CU',
    recommendedFor: 'Belegdaten-Extraktion (SAP DOX), In-Memory Stammdaten-Matching, mehrsprachige Begleittexte.',
    terminologyAlert: {
      title: '⚠️ Begriffsklärung: Single-Turn vs. SAP Joule Assistent',
      description:
        'Zwingmann nannte Stufe 2 historisch „Assistant“. In der modernen SAP-Welt (SAP Autonomous Suite) ist ein Assistent (z. B. Buchungsassistent) jedoch eine übergeordnete Funktion, die mehrere Agenten führt (siehe Stufe 5). Stufe 2 ist bei SAP ein reiner zustandsloser Single-Turn API-Call über den SAP GenAI Hub oder SAP DOX.',
    },
  },
  copilot: {
    id: 'copilot',
    name: 'Copilot',
    zwingmannLevel: 'Stufe 3 (Kognitions-Kybernetik)',
    zwingmannConcept: 'Human-in-the-Loop (Mensch führt, KI schlägt vor)',
    sapShortLabel: 'Joule / HITL Gate',
    sapEquivalent: 'SAP Joule In-App Approval / Fiori Freigabe-Workflow (human_approved: true)',
    shortDesc: 'Joule / Human Commit',
    fullDesc:
      'Mensch führt, KI schlägt vor (z. B. SAP Joule Side-by-Side). Das System hält den Belegfluss zwingend an und verlangt eine menschliche Freigabe oder Korrektur. 0% Dunkelverarbeitung.',
    latencyText: '~ 650 ms + Wartezeit',
    cuText: '0.005 CU',
    recommendedFor: 'SOX-Compliance (Vier-Augen-Prinzip), Kulanz- und Ermessensfälle, Stützräder in Adoptionsphase 1.',
  },
  autopilot: {
    id: 'autopilot',
    name: 'Autopilot',
    zwingmannLevel: 'Stufe 4 (Kognitions-Kybernetik)',
    zwingmannConcept: 'Autopilot: Strukturierter Workflow + AI (SAP Build Process Automation / n8n Flow)',
    sapShortLabel: 'Workflow + AI',
    sapEquivalent: 'SAP Build Process Automation / n8n Workflow (mit KI-Gates & Ausnahme-Queue)',
    shortDesc: 'Workflow + AI (Autopilot)',
    fullDesc:
      'Autopilot (Workflow + AI): Strukturierter, automatisierter Ablauf (z. B. SAP Build Process Automation oder n8n), der KI-Fähigkeiten (Modelle, Extraktion, NLP) nahtlos einbettet. Führt Belege automatisiert durch definierte Verzweigungen (~90–95% Dunkelverarbeitung) und stoppt nur bei Ausnahmen oder Unterschreitung der Konfidenz im Klärungskorb.',
    latencyText: '~ 1.450 ms',
    cuText: '0.008 CU',
    recommendedFor: 'Standardisierte Geschäftsprozesse mit definierten Verzweigungen und Schwellwertprüfung.',
  },
  agentic: {
    id: 'agentic',
    name: 'Autonomous Agent',
    zwingmannLevel: 'Stufe 5 (Kognitions-Kybernetik)',
    zwingmannConcept: 'Autonome Joule AI Agents unter einem Fachassistenten',
    sapShortLabel: 'Joule Agent / Assistent',
    sapEquivalent: 'SAP Joule AI Agents (geführt von Domain-Assistenten wie Buchungsassistent) / Joule Studio',
    shortDesc: 'Joule Agent (Domain-Assistent)',
    fullDesc:
      'Autonome Joule AI Agents mit Reasoning, Tool-Calling über MCP und Agent-to-Agent (A2A) Kooperation. Genau wie bei SAP Sapphire vorgestellt: Ein übergeordneter Fachassistent (z. B. Buchungsassistent oder HR Operations Assistant) führt ein Team aus 5–10 autonomen Agenten, die komplexe Aufgaben selbstständig lösen.',
    latencyText: '~ 3.800 ms',
    cuText: '0.040 CU',
    recommendedFor: 'Komplexe Ausnahmebehandlung, Dispute-Klärung, autonome Daten-Selbstheilung und Sonderfälle.',
    terminologyAlert: {
      title: '💡 Reale SAP-Architektur: Assistenten führen Agenten',
      description:
        'Bei SAP ist der Fachassistent (z. B. Buchungsassistent) das Dach für bis zu 10 autonome Joule Agents (z. B. Dispute Agent, Exception Agent, Posting Agent). Die Agenten führen die Aufgaben autonom mit MCP-Tools aus.',
    },
  },
};

export const ZWINGMANN_TIERS_EN: Record<AutomationArchetype, ZwingmannTier> = {
  deterministic: {
    id: 'deterministic',
    name: 'Deterministic',
    zwingmannLevel: 'Tier 1 (Cybernetics)',
    zwingmannConcept: 'Deterministic Business Rules (No Stochastic AI)',
    sapShortLabel: 'BRFplus / RAP',
    sapEquivalent: 'SAP S/4HANA Core / BRFplus / ABAP Cloud RAP / SQL Exact Match',
    shortDesc: 'BRFplus / DMN / SQL',
    fullDesc:
      'Strict rules without generative AI. 0 CU inference, < 50 ms latency. Error rate 0% on clean schemas. Zero ambiguity tolerance. 100% compliant with audit & regulatory standards.',
    latencyText: '< 50 ms',
    cuText: '0 CU',
    recommendedFor: 'Structured business rules, ATP validation, static OData filters, GL postings.',
  },
  classic_ml: {
    id: 'classic_ml',
    name: 'Single-Turn ML',
    zwingmannLevel: 'Tier 2 (Cybernetics)',
    zwingmannConcept: 'Stateless Single-Turn API Call (Prompt ➔ Text/JSON without dialogue)',
    sapShortLabel: 'GenAI Hub / DOX',
    sapEquivalent: 'SAP GenAI Hub Foundation Models / SAP DOX / HANA In-Memory Fuzzy Search',
    shortDesc: 'Single-Turn / ML (Stateless)',
    fullDesc:
      'Isolated, stateless model execution in single-turn mode (prompt in ➔ text/JSON out, OCR extraction, translation, or fuzzy search) – running fully automated in the background without dialogue or tool calls.',
    latencyText: '~ 380 ms',
    cuText: '0.002 CU',
    recommendedFor: 'Document extraction (SAP DOX), in-memory master data matching, multilingual notifications.',
    terminologyAlert: {
      title: '⚠️ Terminology Clarification: Single-Turn vs. SAP Joule Assistant',
      description:
        'Historically called "Assistant" in Zwingmann taxonomy. In modern SAP architecture (SAP Autonomous Suite), an Assistant (e.g. Booking Assistant) is an umbrella grouping multiple agents (Tier 5). Tier 2 in SAP is a stateless single-turn API call via SAP GenAI Hub or DOX.',
    },
  },
  copilot: {
    id: 'copilot',
    name: 'Copilot',
    zwingmannLevel: 'Tier 3 (Cybernetics)',
    zwingmannConcept: 'Human-in-the-Loop (Human leads, AI proposes)',
    sapShortLabel: 'Joule / HITL Gate',
    sapEquivalent: 'SAP Joule In-App Approval / Fiori Approval Workflow (human_approved: true)',
    shortDesc: 'Joule / Human Commit',
    fullDesc:
      'Human leads, AI proposes (e.g. SAP Joule side-by-side). The system halts document flow and requires authoritative manual approval. 0% Straight-Through Processing.',
    latencyText: '~ 650 ms + wait time',
    cuText: '0.005 CU',
    recommendedFor: 'SOX compliance (dual control), discretionary goodwill decisions, adoption training.',
  },
  autopilot: {
    id: 'autopilot',
    name: 'Autopilot',
    zwingmannLevel: 'Tier 4 (Cybernetics)',
    zwingmannConcept: 'Autopilot: Structured Workflow + AI (SAP Build Process Automation / n8n Flow)',
    sapShortLabel: 'Workflow + AI',
    sapEquivalent: 'SAP Build Process Automation / n8n Workflow with AI Gates & Exception Queue',
    shortDesc: 'Workflow + AI (Autopilot)',
    fullDesc:
      'Autopilot (Workflow + AI): A structured workflow (e.g. SAP Build Process Automation or n8n) embedding AI capabilities (models, extraction, threshold checks). Steers processes automatically through decision branches (~90–95% STP) and halts only on exceptions or low confidence in a clarification queue.',
    latencyText: '~ 1,450 ms',
    cuText: '0.008 CU',
    recommendedFor: 'Standard business processes with defined decision branches and threshold checks.',
  },
  agentic: {
    id: 'agentic',
    name: 'Autonomous Agent',
    zwingmannLevel: 'Tier 5 (Cybernetics)',
    zwingmannConcept: 'Autonomous Joule AI Agents led by a Domain Assistant',
    sapShortLabel: 'Joule Agent / Assistant',
    sapEquivalent: 'SAP Joule AI Agents (governed by Domain Assistants like Booking Assistant) / Joule Studio',
    shortDesc: 'Joule Agent (Domain Assistant)',
    fullDesc:
      'Autonomous Joule AI Agents with reasoning, tool calling via MCP, and Agent-to-Agent (A2A) collaboration. Exactly as presented at SAP Sapphire: An overarching Domain Assistant (e.g. Booking Assistant or HR Operations Assistant) leads a team of 5–10 autonomous agents.',
    latencyText: '~ 3,800 ms',
    cuText: '0.040 CU',
    recommendedFor: 'Complex exception handling, dispute settlement, autonomous self-healing, and edge cases.',
    terminologyAlert: {
      title: '💡 Real SAP Architecture: Assistants lead Agents',
      description:
        'In SAP, a Domain Assistant (e.g. Booking Assistant) is the umbrella for up to 10 autonomous Joule Agents (e.g. Dispute Agent, Exception Agent, Posting Agent) executing tasks autonomously with MCP tools.',
    },
  },
};

export const getZwingmannTiers = (lang: Language = 'de'): Record<AutomationArchetype, ZwingmannTier> => {
  return lang === 'en' ? ZWINGMANN_TIERS_EN : ZWINGMANN_TIERS_DE;
};

export const ZWINGMANN_TIERS = ZWINGMANN_TIERS_DE;

