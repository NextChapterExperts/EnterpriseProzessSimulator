import type { Language } from './translations';

/**
 * Zweisprachiges Glossar für Fachbegriffe (ⓘ Info-Tips).
 * Jeder Eintrag erklärt einen Begriff kurz (short) und optional ausführlicher (details).
 */
export interface GlossaryEntry {
  term: string;
  short: string;
  details?: string;
}

type GlossaryDict = Record<string, { de: GlossaryEntry; en: GlossaryEntry }>;

export const GLOSSARY: GlossaryDict = {
  gobd: {
    de: {
      term: 'GoBD',
      short:
        'Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form (deutsches Steuerrecht).',
      details:
        'Verlangt, dass jede Buchung nachvollziehbar, unveränderbar, vollständig und zeitgerecht ist. Für KI-Automatisierung heißt das: Jede automatische Verbuchung braucht ein lückenloses Audit-Log, wer/was wann warum gebucht hat.',
    },
    en: {
      term: 'GoBD',
      short:
        'German tax-law principles for the proper keeping and retention of books, records and documents in electronic form.',
      details:
        'Requires every posting to be traceable, immutable, complete and timely. For AI automation this means every automated posting needs a complete audit log of who/what posted when and why.',
    },
  },
  sox: {
    de: {
      term: 'SOX / SOX-404',
      short:
        'Sarbanes-Oxley Act (USA). Section 404 verpflichtet Unternehmen zu wirksamen internen Kontrollen über die Finanzberichterstattung (ICFR).',
      details:
        'Relevant für alle Unternehmen mit US-Börsennotierung bzw. deren Tochtergesellschaften. Automatisierte Buchungen müssen kontrolliert, freigegeben (Vier-Augen-Prinzip) und prüfbar sein.',
    },
    en: {
      term: 'SOX / SOX-404',
      short:
        'U.S. Sarbanes-Oxley Act. Section 404 requires effective internal controls over financial reporting (ICFR).',
      details:
        'Applies to U.S.-listed companies and their subsidiaries. Automated postings must be controlled, approved (four-eyes principle) and auditable.',
    },
  },
  gobdSoxIntegrity: {
    de: {
      term: 'GoBD / SOX-Integrität',
      short:
        'Zeigt, ob der Prozess die Anforderungen an revisionssichere Buchführung (GoBD, Deutschland) und interne Finanzkontrollen (SOX, USA) erfüllt.',
      details:
        'Konform heißt: Kritische ERP-Buchungen laufen nur über deterministische Regeln oder eine menschliche Freigabe (HITL), und jede Aktion wird im Clean-Core-Audit-Log protokolliert.',
    },
    en: {
      term: 'GoBD / SOX Integrity',
      short:
        'Shows whether the process meets the requirements for audit-proof bookkeeping (GoBD, Germany) and internal financial controls (SOX, USA).',
      details:
        'Compliant means: critical ERP postings only run through deterministic rules or a human approval (HITL), and every action is recorded in the Clean Core audit log.',
    },
  },
  blastRadius: {
    de: {
      term: 'Blast Radius',
      short:
        'Wie groß der Schaden ist, wenn dieser Schritt einen Fehler macht – und wie schwer er sich rückgängig machen lässt.',
      details:
        'Bewertet auf einer Skala von 1 (leicht umkehrbar, z. B. ein Entwurf) bis 5 (irreversibel, z. B. Zahlung ausgeführt oder Ware versendet). Ab Stufe 4 verlangt das Tool eine menschliche Freigabe oder deterministische Logik.',
    },
    en: {
      term: 'Blast Radius',
      short:
        'How much damage occurs if this step makes a mistake – and how hard it is to undo.',
      details:
        'Rated from 1 (easily reversible, e.g. a draft) to 5 (irreversible, e.g. payment executed or goods shipped). From level 4 upwards the tool requires a human approval or deterministic logic.',
    },
  },
  cumulativeBlastRadius: {
    de: {
      term: 'Kumulierter Blast Radius',
      short:
        'Summe des maximalen finanziellen Schadens (in €), der entstehen könnte, wenn jeder Prozessschritt einmal fehlerhaft ausgeführt wird.',
      details:
        'Ein Worst-Case-Indikator pro Beleg: Je höher der Wert, desto wichtiger sind Schutzplanken (Guardrails), Konfidenz-Gates und menschliche Freigaben an den kritischen Stellen.',
    },
    en: {
      term: 'Cumulative Blast Radius',
      short:
        'Total maximum financial damage (in €) that could occur if every process step were executed incorrectly once.',
      details:
        'A worst-case indicator per document: the higher the value, the more important guardrails, confidence gates and human approvals at the critical steps become.',
    },
  },
  reversibility: {
    de: {
      term: 'Reversibilitäts-Stufe',
      short: 'Skala 1–5, wie leicht sich das Ergebnis eines Schritts rückgängig machen lässt (1 = trivial, 5 = irreversibel).',
    },
    en: {
      term: 'Reversibility Level',
      short: 'Scale 1–5 for how easily a step’s result can be undone (1 = trivial, 5 = irreversible).',
    },
  },
  euAiAct: {
    de: {
      term: 'EU AI Act',
      short:
        'EU-Verordnung über Künstliche Intelligenz. Sie stuft KI-Systeme in Risikoklassen ein: unannehmbar, hoch, begrenzt (Limited) und minimal.',
      details:
        'Je höher die Risikoklasse, desto strenger die Pflichten (Dokumentation, menschliche Aufsicht, Transparenz). Angezeigt wird die höchste Risikoklasse aller KI-Schritte im Prozess.',
    },
    en: {
      term: 'EU AI Act',
      short:
        'EU regulation on artificial intelligence. It classifies AI systems into risk classes: unacceptable, high, limited and minimal.',
      details:
        'The higher the class, the stricter the obligations (documentation, human oversight, transparency). Shown is the highest risk class across all AI steps in the process.',
    },
  },
  limitedRisk: {
    de: {
      term: 'Limited Risk (Art. 50)',
      short:
        'Begrenztes Risiko nach EU AI Act. Hauptpflicht ist Transparenz (Art. 50): Betroffene müssen erkennen können, dass sie mit KI interagieren bzw. Inhalte KI-generiert sind.',
    },
    en: {
      term: 'Limited Risk (Art. 50)',
      short:
        'Limited risk under the EU AI Act. The main obligation is transparency (Art. 50): people must be able to tell that they are interacting with AI or that content is AI-generated.',
    },
  },
  stp: {
    de: {
      term: 'Dunkelverarbeitung (STP)',
      short:
        'Straight-Through Processing: Anteil der Belege, die vollautomatisch ohne menschliches Eingreifen von Anfang bis Ende durchlaufen.',
      details:
        'Auch „Lights-Out-Quote“ genannt. Jeder Copilot-Schritt (menschliche Freigabe) oder jede Eskalation senkt die Quote.',
    },
    en: {
      term: 'Straight-Through Processing (STP)',
      short:
        'Share of documents that run fully automatically from start to finish without any human intervention.',
      details:
        'Also called “lights-out rate” (German: Dunkelverarbeitung). Every Copilot step (human approval) or escalation lowers the rate.',
    },
  },
  capacityUnits: {
    de: {
      term: 'BTP Capacity Units (CU)',
      short:
        'Abrechnungseinheit der SAP Business Technology Platform. KI-Aufrufe in SAP AI Core / Generative AI Hub verbrauchen CUs abhängig von Modell und Token-Menge.',
      details:
        'Deterministische Schritte (Regeln, Standard-ERP) verbrauchen 0 CU. Die Euro-Werte sind Schätzungen auf Basis eines CU-Faktors.',
    },
    en: {
      term: 'BTP Capacity Units (CU)',
      short:
        'Billing unit of the SAP Business Technology Platform. AI calls in SAP AI Core / Generative AI Hub consume CUs depending on model and token volume.',
      details:
        'Deterministic steps (rules, standard ERP) consume 0 CU. Euro amounts are estimates based on a CU factor.',
    },
  },
  monthlyTotal: {
    de: {
      term: 'Monatliche Gesamtkosten',
      short:
        'Geschätzte monatliche Automatisierungskosten (Modell-Inferenz, BTP-Orchestrierung, Restaufwand für Freigaben) für das gewählte Belegvolumen.',
    },
    en: {
      term: 'Monthly Total Cost',
      short:
        'Estimated monthly cost of automation (model inference, BTP orchestration, remaining approval effort) for the selected document volume.',
    },
  },
  netSavings: {
    de: {
      term: 'Netto-Einsparung',
      short:
        'Geschätzte monatliche Ersparnis gegenüber einer vollständig manuellen Bearbeitung durch Sachbearbeiter – nach Abzug der Automatisierungskosten.',
    },
    en: {
      term: 'Net Savings',
      short:
        'Estimated monthly savings compared to fully manual processing by clerks – after deducting the cost of automation.',
    },
  },
  totalCostOfAutomation: {
    de: {
      term: 'Total Cost of Automation (TCA)',
      short:
        'Gesamtkosten der Automatisierung pro Monat: KI-Inferenz, Plattform-Orchestrierung und verbleibender menschlicher Aufwand (Freigaben, Klärfälle).',
    },
    en: {
      term: 'Total Cost of Automation (TCA)',
      short:
        'Total monthly cost of automation: AI inference, platform orchestration and remaining human effort (approvals, exceptions).',
    },
  },
  cleanCore: {
    de: {
      term: 'Clean Core',
      short:
        'SAP-Prinzip: Das S/4HANA-Kernsystem bleibt unmodifiziert. Erweiterungen laufen über freigegebene APIs oder seitlich auf der BTP (Side-by-Side).',
      details:
        'Vorteil: Upgrades bleiben einfach, und KI-Logik kann den ERP-Kern nicht unkontrolliert verändern.',
    },
    en: {
      term: 'Clean Core',
      short:
        'SAP principle: the S/4HANA core system stays unmodified. Extensions run via released APIs or side-by-side on BTP.',
      details: 'Benefit: upgrades stay simple and AI logic cannot change the ERP core in an uncontrolled way.',
    },
  },
  cleanCoreTier: {
    de: {
      term: 'Clean Core Tier',
      short:
        'Einstufung der Erweiterungsart. Tier 1 = Side-by-Side auf der SAP BTP über freigegebene APIs („Zero Modification Policy“: keine Änderung am ERP-Kern).',
    },
    en: {
      term: 'Clean Core Tier',
      short:
        'Classification of the extension type. Tier 1 = side-by-side on SAP BTP via released APIs (“Zero Modification Policy”: no change to the ERP core).',
    },
  },
  cleanCoreIndex: {
    de: {
      term: 'Clean Core Index',
      short: 'Anteil der Prozessschritte, die Clean-Core-konform umgesetzt sind (nur freigegebene APIs, keine Kernmodifikation).',
    },
    en: {
      term: 'Clean Core Index',
      short: 'Share of process steps implemented in a Clean Core compliant way (released APIs only, no core modification).',
    },
  },
  goldenPath: {
    de: {
      term: 'SAP Golden Path',
      short:
        'Von SAP empfohlene Referenzarchitektur je Aufgabentyp (z. B. Regeln → BRFplus, Tabellen-Vorhersage → sap-rpt-1, Dokumente → Document AI).',
      details: 'Der Wert zeigt, wie viele Schritte die empfohlene Architektur verwenden.',
    },
    en: {
      term: 'SAP Golden Path',
      short:
        'SAP-recommended reference architecture per task type (e.g. rules → BRFplus, tabular prediction → sap-rpt-1, documents → Document AI).',
      details: 'The value shows how many steps use the recommended architecture.',
    },
  },
  e2eLatency: {
    de: {
      term: 'E2E-Latenz',
      short: 'End-to-End-Laufzeit: Summe der Verarbeitungszeiten aller Schritte für einen Beleg (ohne Wartezeit auf menschliche Freigaben).',
    },
    en: {
      term: 'E2E Latency',
      short: 'End-to-end runtime: sum of processing times of all steps for one document (excluding waiting time for human approvals).',
    },
  },
  sapStandardTools: {
    de: {
      term: 'SAP Standard-Tools',
      short:
        'BTP AI Core (KI-Modelle), RAP (ABAP RESTful Application Programming), Joule (SAP-KI-Assistent), BRFplus (Regel-Engine), OData v4 (Standard-API-Protokoll).',
    },
    en: {
      term: 'SAP Standard Tools',
      short:
        'BTP AI Core (AI models), RAP (ABAP RESTful Application Programming), Joule (SAP AI assistant), BRFplus (rules engine), OData v4 (standard API protocol).',
    },
  },
  hitl: {
    de: {
      term: 'Human-in-the-Loop (HITL)',
      short: 'Ein Mensch prüft den KI-Vorschlag und gibt ihn frei, bevor der Prozess weiterläuft.',
    },
    en: {
      term: 'Human-in-the-Loop (HITL)',
      short: 'A human reviews and approves the AI proposal before the process continues.',
    },
  },
  confidenceGate: {
    de: {
      term: 'Konfidenz-Gate',
      short:
        'Schwellenwert in %: Liegt die Sicherheit der KI darunter, wird der Beleg an einen Sachbearbeiter eskaliert statt automatisch weiterverarbeitet.',
    },
    en: {
      term: 'Confidence Gate',
      short:
        'Threshold in %: if the AI’s confidence falls below it, the document is escalated to a clerk instead of being processed automatically.',
    },
  },
  guardrail: {
    de: {
      term: 'Schutzplanke (Guardrail)',
      short: 'Harte Regel, die riskante autonome Aktionen blockiert – z. B. keine KI-Buchung ohne Freigabe bei Blast Radius ≥ 4.',
    },
    en: {
      term: 'Guardrail',
      short: 'Hard rule that blocks risky autonomous actions – e.g. no AI posting without approval at Blast Radius ≥ 4.',
    },
  },
  dataNoise: {
    de: {
      term: 'Data Noise Level',
      short: 'Simulierter Anteil fehlerhafter, unvollständiger oder unstrukturierter Eingangsbelege.',
    },
    en: {
      term: 'Data Noise Level',
      short: 'Simulated share of faulty, incomplete or unstructured inbound documents.',
    },
  },
  pareto: {
    de: {
      term: 'Pareto-Optimum',
      short:
        'Zustand, in dem sich kein Kriterium (Durchsatz, Kosten, Risiko) mehr verbessern lässt, ohne ein anderes zu verschlechtern.',
      details:
        'Die Pareto-Optimierung wählt pro Schritt die Architektur mit dem besten Verhältnis aus Dunkelverarbeitung, Token-Bedarf und Risiko.',
    },
    en: {
      term: 'Pareto Optimum',
      short: 'A state where no criterion (throughput, cost, risk) can be improved without worsening another.',
      details:
        'Pareto optimization picks, per step, the architecture with the best balance of straight-through processing, token footprint and risk.',
    },
  },
  ooda: {
    de: {
      term: 'OODA-Loop',
      short: 'Entscheidungszyklus nach John Boyd: Observe (Wahrnehmen), Orient (Einordnen), Decide (Entscheiden), Act (Handeln).',
    },
    en: {
      term: 'OODA Loop',
      short: 'Decision cycle by John Boyd: Observe, Orient, Decide, Act.',
    },
  },
  dox: {
    de: {
      term: 'SAP Document Information Extraction (DOX)',
      short: 'SAP-BTP-Service, der strukturierte Daten (Kopf, Positionen) aus PDFs, Scans und E-Mails extrahiert.',
    },
    en: {
      term: 'SAP Document Information Extraction (DOX)',
      short: 'SAP BTP service that extracts structured data (header, line items) from PDFs, scans and emails.',
    },
  },
  brfplus: {
    de: {
      term: 'SAP BRFplus',
      short: 'Regel-Engine in SAP: Entscheidungstabellen und Regeln werden deterministisch und nachvollziehbar ausgeführt – ohne KI-Halluzinationen.',
    },
    en: {
      term: 'SAP BRFplus',
      short: 'Rules engine in SAP: decision tables and rules run deterministically and traceably – without AI hallucinations.',
    },
  },
  contextDrift: {
    de: {
      term: 'Context Drift',
      short: 'Schleichender Informationsverlust, wenn Eingangsformate sich ändern und die KI Felder falsch oder gar nicht mehr erkennt.',
    },
    en: {
      term: 'Context Drift',
      short: 'Gradual loss of information when input formats change and the AI recognizes fields incorrectly or not at all.',
    },
  },
};

export type GlossaryKey = keyof typeof GLOSSARY;

export const getGlossaryEntry = (key: string, lang: Language): GlossaryEntry | null => {
  const entry = GLOSSARY[key];
  if (!entry) return null;
  return entry[lang] || entry.de;
};
