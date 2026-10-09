import { Language } from '@/i18n/translations';

export type InfoCategory = 'ooda' | 'primitive' | 'archetype';

export interface MethodologyInfoItem {
  id: string;
  category: InfoCategory;
  categoryLabel: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  whyNeeded: string;
  parametersOrCharacteristics: { label: string; value: string }[];
  sapImplementation: string;
  practicalExample: string;
  businessUseCases?: { title: string; desc: string }[];
}

const ITEMS_DE: Record<string, MethodologyInfoItem> = {
  // EBENE 1: OODA-LOOP
  ooda_header: {
    id: 'ooda_header',
    category: 'ooda',
    categoryLabel: 'Ebene 1: Kognitiver OODA-Loop',
    badgeColor: 'border-cyan-700 bg-cyan-950/60 text-cyan-300',
    title: 'Der OODA-Loop in der Prozessautomatisierung',
    subtitle: 'Observe ➔ Orient ➔ Decide ➔ Act (John Boyd / Kognitive Kybernetik)',
    shortDesc:
      'Ein moderner Geschäftsprozess ist kein starres Fließband, sondern ein kontinuierlicher Zyklus kognitiver Anpassung.',
    whyNeeded:
      'Herkömmliche BPM-Workflows scheitern an unstrukturierten Eingaben, weil sie Wahrnehmung und Aktion starr verdrahten. Der OODA-Loop trennt saubere sensorische Wahrnehmung (Observe), betriebswirtschaftliche Einordnung (Orient) und regelbasierte Entscheidung (Decide) von der endgültigen Systembuchung (Act).',
    parametersOrCharacteristics: [
      { label: 'Ebene im Modell', value: 'Höchste Steuerungsebene (Fortschritts-Metrik des Belegs)' },
      { label: 'Zyklus-Natur', value: 'Iterativ: Neue Daten oder Fehler können den Loop neu anstoßen' },
      { label: 'Ziel', value: 'Entkopplung von Reizaufnahme, Kontext-Grounding und System-Mutation' },
    ],
    sapImplementation: 'SAP Build Process Automation & Event Mesh Lifecycle',
    practicalExample:
      'Eine Kunden-E-Mail trifft ein (Observe) ➔ wird mit SAP Stammdaten gematcht (Orient) ➔ gegen Kreditlimits geprüft (Decide) ➔ und als Kundenauftrag verbucht (Act).',
  },

  ooda_observe: {
    id: 'ooda_observe',
    category: 'ooda',
    categoryLabel: 'Ebene 1: OODA-Loop',
    badgeColor: 'border-cyan-700 bg-cyan-950/60 text-cyan-300',
    title: 'OBSERVE (Wahrnehmung & Signalaufnahme)',
    subtitle: 'Aufnahme unstrukturierter Umweltreize & Wandlung in Belegsignale',
    shortDesc:
      'Fängt alle eingehenden Rohdaten ab: E-Mails, PDF-Scans, Portalanfragen, EDI-Dateien. Trennt Rauschen/Spam von echten Vorgängen und extrahiert Rohdaten.',
    whyNeeded:
      'Ohne standardisierte Wahrnehmungsphase überflutet unstrukturierter Müll die ERP-Kernsysteme. Observe stellt sicher, dass nur valide, verwertbare Signale die nächste Stufe erreichen.',
    parametersOrCharacteristics: [
      { label: 'Aufgabe', value: 'Triage, Spam-Filterung, OCR & Information Extraction' },
      { label: 'Zugehörige Primitives', value: 'Filter / Gatekeeper, Extractor / Transformer' },
      { label: 'SAP BTP Services', value: 'Document Information Extraction (DOX), Event Mesh' },
    ],
    sapImplementation: 'SAP BTP Document Information Extraction & Cloud Integration (CPI)',
    practicalExample:
      'Klaus Müller schickt eine unformatierte E-Mail mit PDF-Bestellung. Observe filtert Werbebanner heraus und liest Positionen und Lieferadresse ein.',
  },

  ooda_orient: {
    id: 'ooda_orient',
    category: 'ooda',
    categoryLabel: 'Ebene 1: OODA-Loop',
    badgeColor: 'border-purple-700 bg-purple-950/60 text-purple-300',
    title: 'ORIENT (Kontextualisierung & Grounding)',
    subtitle: 'Abgleich mit dem Unternehmensgedächtnis (SAP Stammdaten)',
    shortDesc:
      'Bringt die extrahierten Signale mit der SAP-Realität zusammen: Debitor (KNA1), Materialstamm (MARA), Serviceverträge, Konditionen und Historie.',
    whyNeeded:
      'KI-Modelle ohne Grounding halluzinieren. Orient verhindert Halluzinationen, indem Freitext-Begriffe auf existierende Primärschlüssel (z. B. Debitor 0000100420) abgebildet werden.',
    parametersOrCharacteristics: [
      { label: 'Aufgabe', value: 'Entity Resolution, Fuzzy Matching, Vektorsuche' },
      { label: 'Zugehörige Primitives', value: 'Matcher / Enricher' },
      { label: 'SAP BTP Services', value: 'SAP HANA Cloud Vector Engine, S/4HANA Master Data Services' },
    ],
    sapImplementation: 'SAP HANA Cloud Fuzzy Search & S/4HANA OData Core APIs',
    practicalExample:
      'Der Kunde schreibt „Brauche 10x Flansch wie im Mai“. Orient durchsucht die Auftragshistorie und ermittelt Materialnummer FL-9021.',
  },

  ooda_decide: {
    id: 'ooda_decide',
    category: 'ooda',
    categoryLabel: 'Ebene 1: OODA-Loop',
    badgeColor: 'border-amber-700 bg-amber-950/60 text-amber-300',
    title: 'DECIDE (Entscheidungsfindung & Regelprüfung)',
    subtitle: 'Bewertung von Geschäftsregeln, Limits, Compliance & Risiken',
    shortDesc:
      'Prüft Geschäftsregeln: Kreditlimit ausreichend? Garantiedatum gültig? Liefertermin machbar? SOX-Konformität gegeben?',
    whyNeeded:
      'Automatisierung ohne Guardrails führt zu fatalen Fehlern (z. B. Falschlieferungen, unerlaubte Rabatte). Decide entscheidet: Dunkel durchbuchen oder Mensch hinzuziehen?',
    parametersOrCharacteristics: [
      { label: 'Aufgabe', value: 'Policy Evaluation, Schwellwertprüfung, ATP-Check' },
      { label: 'Zugehörige Primitives', value: 'Evaluator / Reasoner' },
      { label: 'SAP BTP Services', value: 'SAP Build Process Automation Business Rules (BRFplus/DMN)' },
    ],
    sapImplementation: 'SAP BRFplus & S/4HANA Credit Management / Pricing Engine',
    practicalExample:
      'Liegt der Auftragswert unter 5.000 € und ist das Kreditlimit grün, entscheidet Decide auf sofortige Freigabe. Bei 150.000 € wird ein Freigabeschritt erzwungen.',
  },

  ooda_act: {
    id: 'ooda_act',
    category: 'ooda',
    categoryLabel: 'Ebene 1: OODA-Loop',
    badgeColor: 'border-emerald-700 bg-emerald-950/60 text-emerald-300',
    title: 'ACT (ERP-Mutation & Systeminteraktion)',
    subtitle: 'Rechtsverbindliche Verbuchung und Kommunikation nach außen',
    shortDesc:
      'Führt die finale Zustandsänderung im ERP aus (Kundenauftrag SO01 anlegen, FI-Zahlungsbeleg buchen) und versendet Bestätigungen an Kunden oder Disponenten.',
    whyNeeded:
      'Alle kognitiven Vorarbeiten sind wertlos, wenn sie nicht persistent und audit-sicher ins Kernsystem übertragen werden.',
    parametersOrCharacteristics: [
      { label: 'Aufgabe', value: 'Schreibende ERP-Transaktion (Commit), Dokumentengenerierung' },
      { label: 'Zugehörige Primitives', value: 'Executor / Actuator, Generator / Synthesizer' },
      { label: 'SAP BTP Services', value: 'ABAP RESTful Application Programming Model (RAP), Forms by Adobe' },
    ],
    sapImplementation: 'S/4HANA RAP Business Objects (BAPI/OData Write) & Event Mesh Outbox',
    practicalExample:
      'Anlage des Verkaufsbelegs #400019284 in SAP S/4HANA und automatischer E-Mail-Versand der Auftragsbestätigung als PDF.',
  },

  // EBENE 2: KOGNITIVE PRIMITIVES
  primitive_header: {
    id: 'primitive_header',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitive Primitives',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Die 6 Kognitiven Primitives (Aufgabentypen)',
    subtitle: 'Standardbausteine menschlicher & maschineller Informationsverarbeitung',
    shortDesc:
      'Jede Geschäftsaufgabe im Unternehmen lässt sich auf genau 6 kognitive Grundbausteine abbilden – unabhängig von Fachbereich und Technologie.',
    whyNeeded:
      'Verhindert monolithische Spaghettiprozesse. Wenn man weiß, welches Primitiv vorliegt, kann man die technisch und wirtschaftlich optimale Ausführungsart wählen (z.B. Regex statt LLM für Filter).',
    parametersOrCharacteristics: [
      { label: '1. Filter / Gatekeeper', value: 'Vorfilterung, Relevanzprüfung, Triage' },
      { label: '2. Extractor / Transformer', value: 'Informationsextraktion aus Freitext/PDF' },
      { label: '3. Matcher / Enricher', value: 'Stammdaten-Grounding & Entity Resolution' },
      { label: '4. Evaluator / Reasoner', value: 'Geschäftsregeln, Policies & Schwellwerte' },
      { label: '5. Executor / Actuator', value: 'Schreibende ERP-Mutation (RAP/BAPI)' },
      { label: '6. Generator / Synthesizer', value: 'Kommunikation & Beleg-Erzeugung' },
    ],
    sapImplementation: 'Komponenten-Katalog für Enterprise Architecture & Clean Core',
    practicalExample:
      'Ein Standard-Auftragsprozess durchläuft nacheinander alle 6 Primitives: Filter ➔ Extraktion ➔ Stammdatenabgleich ➔ Kreditprüfung ➔ ERP-Buchung ➔ E-Mail-Versand.',
  },

  'primitive_Filter / Gatekeeper': {
    id: 'primitive_Filter / Gatekeeper',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitives Primitiv',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Filter / Gatekeeper (Triage & Vorfilterung)',
    subtitle: 'Relevanzprüfung, Spam-Schutz & Format-Validierung am Eingang',
    shortDesc:
      'Entscheidet an der Pforte: Gehört diese Nachricht zu diesem Geschäftsprozess? Ist das Format gültig oder handelt es sich um Spam, Newsletter oder Duplikate?',
    whyNeeded:
      'Schützt nachgelagerte teure KI-Modelle und Kern-Systeme vor sinnloser Last und Fehlstarts.',
    parametersOrCharacteristics: [
      { label: 'Relevanz-Schwellwert', value: 'Konfidenz (z.B. >= 0.85 für Auftragsbezug)' },
      { label: 'Format-Schema', value: 'Prüfung auf erlaubte Dateitypen (PDF, XML, E-Mail)' },
      { label: 'Duplikat-Fenster', value: 'Zeitraum für Hash-Prüfung gegen Mehrfachsendungen' },
      { label: 'Quarantäne-Routing', value: 'Zielwarteschlange für verworfene Eingänge' },
    ],
    sapImplementation: 'SAP Cloud Integration Message Routing & BTP Event Mesh Triage',
    practicalExample:
      'Eine E-Mail mit Betreff „Abwesenheitsnotiz“ wird sofort verworfen; „Bestellung AN-2026-88“ wird an den Extractor weitergeleitet.',
  },

  'primitive_Extractor / Transformer': {
    id: 'primitive_Extractor / Transformer',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitives Primitiv',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Extractor / Transformer (Informationsextraktion)',
    subtitle: 'Überführung unstrukturierter Texte & Dokumente in Belegfelder',
    shortDesc:
      'Liest Freitexte, E-Mail-Bodies oder PDFs und extrahiert strukturierte Schlüssel-Wert-Paare: Kopfdaten (Bestellnummer, Datum) und Positionszeilen (Material, Menge, Preis).',
    whyNeeded:
      'Klassische SAP-Transaktionen benötigen strikte Tabellenstrukturen. Der Extractor überbrückt die Kluft zwischen menschlicher Freiform und relationaler ERP-Struktur.',
    parametersOrCharacteristics: [
      { label: 'Extraktions-Schema', value: 'JSON-Schema für Kopf- und Positionsfelder' },
      { label: 'Feld-Konfidenzen', value: 'Mindestwahrscheinlichkeit pro extrahiertem Feld' },
      { label: 'OCR-Engine', value: 'BTP Document Information Extraction oder LLM Vision' },
      { label: 'Normalisierung', value: 'Datumskonvertierung (TT.MM.JJJJ) und Währungsbereinigung' },
    ],
    sapImplementation: 'SAP Document Information Extraction (DOX) & Generative AI Hub',
    practicalExample:
      'Aus dem Satz „Bitte liefern Sie uns 20 Stück vom Typ B nach Köln“ werden Material="Typ B", Menge=20 und Lieferort="Köln" als JSON erzeugt.',
  },

  'primitive_Matcher / Enricher': {
    id: 'primitive_Matcher / Enricher',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitives Primitiv',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Matcher / Enricher (Stammdaten-Grounding)',
    subtitle: 'Abgleich erkannter Entitäten gegen SAP S/4HANA Stammdaten',
    shortDesc:
      'Löst Freitextbezeichnungen auf: Welche Debitor-Nummer (KUNNR) verbirgt sich hinter „Müller Bau GmbH“? Welche Materialnummer (MATNR) hinter „Spezialflansch“?',
    whyNeeded:
      'Ein SAP-Beleg kann ohne echte Stammdaten-IDs nicht gebucht werden. Der Matcher stellt die referenzielle Integrität sicher.',
    parametersOrCharacteristics: [
      { label: 'Such-Strategie', value: 'Exakter Match ➔ Fuzzy Search ➔ Vektor-Embedding' },
      { label: 'Stammdaten-Objekte', value: 'Debitor (KNA1), Material (MARA), Equipment (EQUI)' },
      { label: 'Schwellwert (Fuzzy)', value: 'Mindestübereinstimmung (z.B. Levenshtein >= 0.85)' },
      { label: 'Anreicherungsfelder', value: 'Zahlungsbedingungen, Steuerklassifikation, Verkaufsorg.' },
    ],
    sapImplementation: 'SAP HANA Cloud Fuzzy Search & S/4HANA Core Data Services (CDS Views)',
    practicalExample:
      '„Klaus Müller Tiefbau, Hamburg“ wird eindeutig dem SAP-Debitor 0000100420 zugeordnet inklusive Buchungskreis und Zahlungsziel.',
  },

  'primitive_Evaluator / Reasoner': {
    id: 'primitive_Evaluator / Reasoner',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitives Primitiv',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Evaluator / Reasoner (Regeln & Richtlinien)',
    subtitle: 'Prüfung von Limits, Verträgen, Konditionen & Schutzplanken',
    shortDesc:
      'Führt die betriebswirtschaftliche Bewertung durch: Darf der Auftrag gebucht werden? Reicht das Kreditlimit? Ist die Garantie aktiv? Gibt es Sonderkonditionen?',
    whyNeeded:
      'Trennt die Datenermittlung von der geschäftlichen Genehmigung. Schützt das Unternehmen vor Risiken, Betrug und Fehlkalkulationen.',
    parametersOrCharacteristics: [
      { label: 'Entscheidungstabellen', value: 'DMN / BRFplus Regelmatrix' },
      { label: 'Finanzielle Limits', value: 'Unterschriftsbefugnisse (Delegation of Authority)' },
      { label: 'Eskalationskriterien', value: 'Regeln für den Stopp und Weiterleitung an Menschen' },
      { label: 'Plausibilitätsprüfungen', value: 'Vergleich Liefertermin vs. Produktionsvorlaufzeit' },
    ],
    sapImplementation: 'SAP Build Process Automation Decision Service & Credit Management',
    practicalExample:
      'Garantieprüfung beim Serviceauftrag: Kaufdatum vor 18 Monaten ➔ Garantie deckt Reparatur zu 100%, keine Rechnungsstellung nötig.',
  },

  'primitive_Executor / Actuator': {
    id: 'primitive_Executor / Actuator',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitives Primitiv',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Executor / Actuator (ERP-Mutation & Verbuchung)',
    subtitle: 'Rechtsverbindliche Anlage oder Änderung von Belegen im SAP-System',
    shortDesc:
      'Führt den schreibenden API-Call aus: Anlegen eines Kundenauftrags (VA01/SO01), Buchen eines FI-Ausgleichsbelegs oder Generieren eines Serviceauftrags.',
    whyNeeded:
      'Der Punkt, an dem der kognitive Prozess reale betriebswirtschaftliche Konsequenzen erzeugt (Lagerabgang, Zahlungsfluss, Haftung).',
    parametersOrCharacteristics: [
      { label: 'Schnittstellentyp', value: 'S/4HANA RAP Business Object, OData v4 oder BAPI' },
      { label: 'Idempotenz-Schlüssel', value: 'Verhindert Doppelbuchungen bei Netzwerk-Retries' },
      { label: 'Blast Radius (1–5)', value: 'Risikostufe bei Fehlern (Auswirkung auf Bilanzen/Lager)' },
      { label: 'Clean Core Index', value: 'Nutzung freigegebener SAP-Standard-APIs (Clean Core)' },
    ],
    sapImplementation: 'S/4HANA ABAP Cloud RAP (RESTful Application Programming Model)',
    practicalExample:
      'Aufruf der OData-Schnittstelle API_SALES_ORDER_SRV zur Verbuchung von Auftrag #400019284 in Buchungskreis 1010.',
  },

  'primitive_Generator / Synthesizer': {
    id: 'primitive_Generator / Synthesizer',
    category: 'primitive',
    categoryLabel: 'Ebene 2: Kognitives Primitiv',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Generator / Synthesizer (Kommunikation & Belege)',
    subtitle: 'Erstellung von Kundenbestätigungen, PDFs & Abschluss-E-Mails',
    shortDesc:
      'Verfasst die Rückmeldung an den Absender oder das Team: Erstellen des Auftragsbestätigungs-PDFs, Formulieren einer E-Mail mit Belegnummer oder Verfassen von Klärungsfragen.',
    whyNeeded:
      'Schließt den Kommunikationskreislauf mit dem Kunden. Ohne transparente Bestätigung entstehen teure telefonische Nachfragen.',
    parametersOrCharacteristics: [
      { label: 'Ausgabekanal', value: 'E-Mail, SAP Fiori Notification, PDF-Druck, SMS' },
      { label: 'Tonalität & Sprache', value: 'Geschäftlich freundlich, Mehrsprachigkeit (DE/EN/FR)' },
      { label: 'Beleg-Referenzen', value: 'Automatische Einbindung von SAP-Belegnummer und Tracking-Link' },
      { label: 'Genehmigungspflicht', value: 'Direktversand oder Vorlage als Entwurf beim Mitarbeiter' },
    ],
    sapImplementation: 'SAP Forms by Adobe & BTP GenAI Hub E-Mail-Synthese',
    practicalExample:
      'Generierung einer personalisierten Auftragsbestätigung mit Hinweis auf den Liefertermin 15.10. und Belegkopie als PDF.',
  },

  // EBENE 3: AUSFÜHRUNGSARTEN (ARCHETYPEN)
  archetype_header: {
    id: 'archetype_header',
    category: 'archetype',
    categoryLabel: 'Ebene 3: Ausführungsarten (Zwingmann-Methodologie)',
    badgeColor: 'border-emerald-700 bg-emerald-950/60 text-emerald-300',
    title: 'Die 5 Ausführungsarten der Automatisierung',
    subtitle: 'Deterministisch ➔ Assistant ➔ Copilot ➔ Autopilot ➔ Agentic',
    shortDesc:
      'Definiert, WELCHE Technologie die kognitive Aufgabe ausführt und WIE sich der Schritt im Belegfluss verhält (Dunkelverarbeitung vs. Menschliche Freigabe).',
    whyNeeded:
      'Entscheidet über Kosten, Geschwindigkeit, Fehlerrate und Durchsatz. Eine falsche Wahl führt entweder zu explodierenden KI-Kosten oder zu blockierten Prozessen.',
    parametersOrCharacteristics: [
      { label: '1. Deterministisch', value: '100% STP, 0 ms Latenz, 0 CU Inferenz (Starre Regeln)' },
      { label: '2. Assistant', value: '100% STP, KI rein vorbereitend/lesend im Hintergrund' },
      { label: '3. Copilot', value: '0% STP (Stoppt zwingend) – KI entwirft, Mensch gibt frei' },
      { label: '4. Autopilot', value: '~90% STP – Single-Agent läuft autonom, stoppt bei <85%' },
      { label: '5. Agentic', value: '~95% STP – Multi-Agenten heilen Daten autonom via ReAct' },
    ],
    sapImplementation: 'Zwingmann-Framework für Enterprise AI Architekturen',
    practicalExample:
      'Derselbe Stammdaten-Abgleich kann deterministisch (OData-Key), per Copilot (Joule schlägt Debitor vor) oder agentic (Schwarm sucht alte Rechnungen) gelöst werden.',
  },

  archetype_deterministic: {
    id: 'archetype_deterministic',
    category: 'archetype',
    categoryLabel: 'Ebene 3: Ausführungsart',
    badgeColor: 'border-slate-700 bg-slate-900 text-sky-300',
    title: 'Deterministisch (Klassisches Regelwerk & Code)',
    subtitle: 'Starre Regeln: BRFplus, SQL, ABAP Regex, OData Filter',
    shortDesc:
      'Arbeitet ohne KI nach exakten Wenn-Dann-Regeln. Maximale Geschwindigkeit (< 50 ms), 0 Inferenzkosten, 0% Halluzinationsrisiko.',
    whyNeeded:
      'Für alle standardisierten Aufgaben mit bekannter Struktur. Deterministischer Code ist 100-mal günstiger und schneller als jedes KI-Modell.',
    parametersOrCharacteristics: [
      { label: 'Dunkelverarbeitungsquote', value: '100% STP (Läuft vollautomatisch im Hintergrund)' },
      { label: 'Latenz & Kosten', value: '< 50 ms, 0 CU Inferenzkosten' },
      { label: 'Ambiguitätstoleranz', value: '0 (bricht bei Formatänderung oder Tippfehler ab)' },
      { label: 'Wartungsaufwand', value: 'Regeländerungen müssen manuell gepflegt werden' },
    ],
    sapImplementation: 'SAP BRFplus, S/4HANA ABAP CDS Views & Cloud Integration Rules',
    practicalExample:
      'Prüfung, ob Rechnungsbetrag und Bestellbetrag auf den Cent übereinstimmen; Validierung von E-Mail-Adressen per Regex.',
  },

  archetype_classic_ml: {
    id: 'archetype_classic_ml',
    category: 'archetype',
    categoryLabel: 'Ebene 3: Ausführungsart',
    badgeColor: 'border-teal-700 bg-teal-950 text-teal-300',
    title: 'Assistant (Klassisches LLM & Semantische Suche)',
    subtitle: 'Vollautomatische Text-Verarbeitung im Hintergrund (Prompt in ➔ Daten out)',
    shortDesc:
      'Setzt Sprachmodelle oder Vektorsuche ein, um Freitexte zu verstehen, zusammenzufassen oder Entitäten zu extrahieren – läuft vollautomatisch ohne UI-Unterbrechung.',
    whyNeeded:
      'Ermöglicht Dunkelverarbeitung auch bei Freitexten, ohne dass dafür ein Mitarbeiter vor den Bildschirm gerufen werden muss.',
    parametersOrCharacteristics: [
      { label: 'Dunkelverarbeitungsquote', value: '100% STP (Läuft vollautomatisch im Batch/Hintergrund)' },
      { label: 'Interaktion', value: 'Keine (Single-Turn Prompt ohne Dialog oder Tool-Calls)' },
      { label: 'Latenz & Kosten', value: '~ 380 ms, ~ 0.02 CU Inferenzkosten' },
      { label: 'Einsatzgrenze', value: 'Führt keine schreibenden ERP-Aktionen selbstständig aus' },
    ],
    sapImplementation: 'SAP BTP Generative AI Hub (Foundation Models via REST API) & HANA Vector',
    practicalExample:
      'Automatisches Zusammenfassen eines 5-seitigen Reklamationsschreibens in 3 Stichpunkte für das Ticket-System.',
  },

  archetype_copilot: {
    id: 'archetype_copilot',
    category: 'archetype',
    categoryLabel: 'Ebene 3: Ausführungsart',
    badgeColor: 'border-blue-700 bg-blue-950 text-sky-300',
    title: 'Copilot (Joule / Human-in-the-Loop)',
    subtitle: 'Mensch führt, KI schlägt vor (human_approved: true zwingend)',
    shortDesc:
      'Hält den Belegfluss zwingend an! Das KI-Modell analysiert die Daten und generiert einen Vorschlag. Der Sachbearbeiter prüft in SAP Fiori / Joule und gibt frei.',
    whyNeeded:
      'Warum sollte man einen Copilot wählen, wenn er den Workflow anhält? Genau das ist die entscheidende Frage für Enterprise-Architekten!',
    parametersOrCharacteristics: [
      { label: 'Dunkelverarbeitungsquote', value: '0% STP (Jeder Beleg stoppt zwingend für den Menschen)' },
      { label: 'Menschlicher Aufwand', value: 'Niedrig: 10 Sek. Prüfung statt 15 Min. manuelles Tippen' },
      { label: 'Rechtliche Verantwortung', value: '100% beim Sachbearbeiter (Compliance & SOX konform)' },
      { label: 'Latenz & Kosten', value: '~ 650 ms, ~ 0.02 CU Inferenzkosten' },
    ],
    sapImplementation: 'SAP Joule Side-by-Side Assistant & SAP Fiori My Inbox',
    practicalExample:
      'Joule schlägt dem Disponenten vor: „Debitor 0000100420 zuordnen mit 97% Konfidenz“. Disponent prüft mit einem Blick und klickt auf „Freigeben“.',
    businessUseCases: [
      {
        title: '1. Compliance, Haftung & SOX (Vier-Augen-Prinzip)',
        desc: 'Rechtsverbindliche Aktionen mit hohem Risiko (z. B. Bestellfreigaben > 50.000 €, Kündigungen, Gefahrgut-Zuteilungen) DÜRFEN nach SOX, IFRS oder internen Richtlinien (Delegation of Authority) rechtlich nicht vollautonom gebucht werden. Der Copilot bereitet alles perfekt vor, aber der Mensch behält die Unterschriftsgewalt.',
      },
      {
        title: '2. Ermessensentscheidungen & Kulanz',
        desc: 'Aufgaben ohne mathematisch eindeutige Wahrheit: Ein unzufriedener A-Kunde bittet formlos um Sondernachlass. Keine KI darf Geld verschenken. Der Copilot berechnet Deckungsbeitrag und Kundenwert und schlägt 5% vor – der Vertriebsleiter entscheidet.',
      },
      {
        title: '3. Stützräder vor dem Rollout (Reifegradmodell)',
        desc: 'Kein CIO schaltet ein neues KI-Modell am Tag 1 auf 100% Dunkelverarbeitung. In Phase 1 (Monat 1–3) läuft der Prozess als Copilot (100% Prüfung). Wenn die Messungen beweisen, dass die KI in 99,5% der Fälle richtig lag, schaltet man auf Autopilot (Dunkelverarbeitung mit Ausnahmebehandlung) um.',
      },
    ],
  },

  archetype_autopilot: {
    id: 'archetype_autopilot',
    category: 'archetype',
    categoryLabel: 'Ebene 3: Ausführungsart',
    badgeColor: 'border-violet-700 bg-violet-950 text-violet-300',
    title: 'Autopilot (Autonomer Single-Agent mit Konfidenz-Gate)',
    subtitle: 'Bedingte Dunkelverarbeitung: Läuft dunkel, stoppt nur bei Ausnahmen',
    shortDesc:
      'Arbeitet standardmäßig vollautomatisch im Hintergrund (~90% STP). Nur wenn die Daten unvollständig sind oder die Modell-Konfidenz unter den Schwellwert (z.B. < 85%) fällt, wird der Beleg an den Sachbearbeiter eskaliert.',
    whyNeeded:
      'Der wirtschaftliche Sweet Spot für die meisten Enterprise-Prozesse: 90% der Routinefälle laufen ohne Personalkosten dunkel durch; teure Sachbearbeiter kümmern sich nur noch um echte Problemfälle.',
    parametersOrCharacteristics: [
      { label: 'Dunkelverarbeitungsquote', value: '~ 90% STP (Bedingter Stopp bei Datenrauschen)' },
      { label: 'Konfidenz-Gate', value: 'Konfigurierbar (z.B. 0.85). Gate entscheidet über Weiterlauf' },
      { label: 'Werkzeuge', value: 'Tool-/Function-Calling in einem eng begrenzten Korridor' },
      { label: 'Latenz & Kosten', value: '~ 1.450 ms, ~ 0.08 CU Inferenzkosten' },
    ],
    sapImplementation: 'SAP Build Process Automation mit integriertem AI Core Function-Calling',
    practicalExample:
      'Lesbare PDF-Aufträge laufen dunkel in 3 Sekunden durch; ein unleserlicher Kassenbon mit 60% Konfidenz landet in der Fiori-Inbox.',
  },

  archetype_agentic: {
    id: 'archetype_agentic',
    category: 'archetype',
    categoryLabel: 'Ebene 3: Ausführungsart',
    badgeColor: 'border-amber-700 bg-amber-950 text-amber-300',
    title: 'Agentic Swarm (Multi-Agenten-System mit Selbstheilung)',
    subtitle: 'Autonome ReAct-Schleifen für komplexe Sonderfälle & Datenrekonstruktion',
    shortDesc:
      'Mehrere spezialisierte Agenten arbeiten zusammen (z.B. Triage-Agent, Historien-Forscher, Validierungs-Agent). Fehlen Daten, rekonstruiert der Schwarm diese autonom aus alten Belegen oder IoT-Signalen.',
    whyNeeded:
      'Erzielt maximale Dunkelverarbeitung (~95% STP) selbst bei verrauschten Härtefällen, erfordert aber höhere Tokenbudgets und längere Laufzeiten.',
    parametersOrCharacteristics: [
      { label: 'Dunkelverarbeitungsquote', value: '~ 95% STP (Höchste Automatisierungsstufe)' },
      { label: 'Mechanismus', value: 'Dynamische ReAct-Schleifen (Reason + Act), Multi-Agent Swarm' },
      { label: 'Selbstkorrektur', value: 'Autonome Selbstheilung bei Schnittstellen- und Datenfehlern' },
      { label: 'Latenz & Kosten', value: '~ 3.800 ms, ~ 0.40 CU Inferenzkosten' },
    ],
    sapImplementation: 'SAP AI Core Orchestration Engine mit LangGraph / Multi-Agent Swarm',
    practicalExample:
      'Kunde bestellt ohne Artikelnummer. Der Agentic Swarm durchsucht die vergangenen 12 Bestellungen, gleicht den Lieferort mit der Baustelle ab und ordnet den richtigen Flansch zu.',
  },
};

const ITEMS_EN: Record<string, MethodologyInfoItem> = {
  // TIER 1: OODA LOOP
  ooda_header: {
    id: 'ooda_header',
    category: 'ooda',
    categoryLabel: 'Tier 1: Cognitive OODA Loop',
    badgeColor: 'border-cyan-700 bg-cyan-950/60 text-cyan-300',
    title: 'The OODA Loop in Process Automation',
    subtitle: 'Observe ➔ Orient ➔ Decide ➔ Act (John Boyd / Cognitive Cybernetics)',
    shortDesc:
      'A modern business workflow is not a rigid conveyor belt, but a continuous cycle of cognitive adaptation.',
    whyNeeded:
      'Traditional BPM workflows fail on unstructured inputs because perception and action are tightly coupled. The OODA loop separates sensory perception (Observe), enterprise contextual grounding (Orient), and rule-based decisioning (Decide) from the final system mutation (Act).',
    parametersOrCharacteristics: [
      { label: 'Model Layer', value: 'Highest governance tier (document milestone progress)' },
      { label: 'Cycle Dynamics', value: 'Iterative: New data or edge cases can re-trigger loops' },
      { label: 'Core Objective', value: 'Decoupling raw stimulus ingestion, grounding, and mutation' },
    ],
    sapImplementation: 'SAP Build Process Automation & Event Mesh Lifecycle',
    practicalExample:
      'Customer email arrives (Observe) ➔ matched against SAP master data (Orient) ➔ validated against credit limits (Decide) ➔ posted as Sales Order in S/4HANA (Act).',
  },

  ooda_observe: {
    id: 'ooda_observe',
    category: 'ooda',
    categoryLabel: 'Tier 1: OODA Loop',
    badgeColor: 'border-cyan-700 bg-cyan-950/60 text-cyan-300',
    title: 'OBSERVE (Perception & Signal Intake)',
    subtitle: 'Ingesting unstructured environmental stimuli into machine-readable signals',
    shortDesc:
      'Intercepts all inbound raw data: emails, scanned PDFs, web portal forms, EDI payloads. Separates noise/spam from actual transactions and extracts raw payloads.',
    whyNeeded:
      'Without a standardized intake layer, unstructured noise overwhelms ERP core databases. Observe ensures only validated signals reach subsequent phases.',
    parametersOrCharacteristics: [
      { label: 'Core Tasks', value: 'Triage, spam filtering, OCR & information extraction' },
      { label: 'Mapped Primitives', value: 'Filter / Gatekeeper, Extractor / Transformer' },
      { label: 'SAP BTP Services', value: 'Document Information Extraction (DOX), Event Mesh' },
    ],
    sapImplementation: 'SAP BTP Document Information Extraction & Cloud Integration (CPI)',
    practicalExample:
      'Customer sends informal email with PDF attachment. Observe removes signature banners and parses order line items and shipping addresses.',
  },

  ooda_orient: {
    id: 'ooda_orient',
    category: 'ooda',
    categoryLabel: 'Tier 1: OODA Loop',
    badgeColor: 'border-purple-700 bg-purple-950/60 text-purple-300',
    title: 'ORIENT (Contextualization & Grounding)',
    subtitle: 'Reconciling extracted entities against the enterprise memory (SAP Master Data)',
    shortDesc:
      'Grounds recognized entities in real SAP master records: Customer Account (KNA1), Material Master (MARA), Service Contracts, Pricing Conditions, and Order History.',
    whyNeeded:
      'AI models hallucinate without strict grounding. Orient prevents hallucinations by binding informal text names to actual primary keys (e.g. Debtor 0000100420).',
    parametersOrCharacteristics: [
      { label: 'Core Tasks', value: 'Entity resolution, fuzzy matching, vector similarity search' },
      { label: 'Mapped Primitives', value: 'Matcher / Enricher' },
      { label: 'SAP BTP Services', value: 'SAP HANA Cloud Vector Engine, S/4HANA Master Data Services' },
    ],
    sapImplementation: 'SAP HANA Cloud Fuzzy Search & S/4HANA Core Data Services (CDS Views)',
    practicalExample:
      'Customer writes "Need 10x flanges like in May". Orient queries order history and resolves material ID FL-9021.',
  },

  ooda_decide: {
    id: 'ooda_decide',
    category: 'ooda',
    categoryLabel: 'Tier 1: OODA Loop',
    badgeColor: 'border-amber-700 bg-amber-950/60 text-amber-300',
    title: 'DECIDE (Policy Evaluation & Rules)',
    subtitle: 'Evaluating business constraints, credit limits, contracts & guardrails',
    shortDesc:
      'Executes business policy evaluations: Is credit available? Is warranty active? Can promised delivery date be fulfilled? Is SOX compliance adhered to?',
    whyNeeded:
      'Automation without guardrails causes massive financial harm. Decide determines: Process straight-through or escalate to a human clerk?',
    parametersOrCharacteristics: [
      { label: 'Core Tasks', value: 'Policy evaluation, threshold validation, ATP check' },
      { label: 'Mapped Primitives', value: 'Evaluator / Reasoner' },
      { label: 'SAP BTP Services', value: 'SAP Build Process Automation Decision Service (BRFplus/DMN)' },
    ],
    sapImplementation: 'SAP BRFplus & S/4HANA Credit Management / Pricing Engine',
    practicalExample:
      'Order under $5,000 with clean credit check is automatically approved. Orders exceeding $150,000 trigger a mandatory approval gateway.',
  },

  ooda_act: {
    id: 'ooda_act',
    category: 'ooda',
    categoryLabel: 'Tier 1: OODA Loop',
    badgeColor: 'border-emerald-700 bg-emerald-950/60 text-emerald-300',
    title: 'ACT (ERP Mutation & System Commit)',
    subtitle: 'Legally binding document creation and outbound stakeholder communication',
    shortDesc:
      'Executes persistent ERP database mutations (e.g. create Sales Order SO01, post FI payment clearance) and generates customer/dispatcher notifications.',
    whyNeeded:
      'All upstream cognitive processing is worthless if not reliably and audit-safely committed to the core system of record.',
    parametersOrCharacteristics: [
      { label: 'Core Tasks', value: 'ERP transaction commit, outbound document generation' },
      { label: 'Mapped Primitives', value: 'Executor / Actuator, Generator / Synthesizer' },
      { label: 'SAP BTP Services', value: 'ABAP RESTful Application Programming Model (RAP), Forms by Adobe' },
    ],
    sapImplementation: 'S/4HANA RAP Business Objects (BAPI/OData Write) & Event Mesh Outbox',
    practicalExample:
      'Creating Sales Order #400019284 in SAP S/4HANA and dispatching official PDF order confirmation to customer.',
  },

  // TIER 2: COGNITIVE PRIMITIVES
  primitive_header: {
    id: 'primitive_header',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitives',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'The 6 Cognitive Primitives (Task Patterns)',
    subtitle: 'Universal building blocks of human & machine enterprise intelligence',
    shortDesc:
      'Every business task can be modeled through exactly 6 cognitive primitives — regardless of department, industry, or underlying technology.',
    whyNeeded:
      'Prevents monolithic spaghetti workflows. Knowing the primitive allows selecting the mathematically optimal execution tier (e.g., regex instead of LLM for filtering).',
    parametersOrCharacteristics: [
      { label: '1. Filter / Gatekeeper', value: 'Inbound triage, relevance scoring, format gate' },
      { label: '2. Extractor / Transformer', value: 'Unstructured entity extraction from text/PDF' },
      { label: '3. Matcher / Enricher', value: 'Master data grounding & entity resolution' },
      { label: '4. Evaluator / Reasoner', value: 'Business rules, policies & threshold checks' },
      { label: '5. Executor / Actuator', value: 'Transactional ERP mutation (RAP/BAPI commit)' },
      { label: '6. Generator / Synthesizer', value: 'Outbound communications & document rendering' },
    ],
    sapImplementation: 'Clean Core Enterprise Architecture Component Catalog',
    practicalExample:
      'A sales order workflow chains the 6 primitives: Filter ➔ Extraction ➔ Master Data Matching ➔ Credit Check ➔ ERP Posting ➔ Email Confirmation.',
  },

  'primitive_Filter / Gatekeeper': {
    id: 'primitive_Filter / Gatekeeper',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitive',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Filter / Gatekeeper (Inbound Triage & Routing)',
    subtitle: 'Relevance assessment, spam screening & format verification',
    shortDesc:
      'Acts as perimeter security: Does this inbound message belong to this business process? Is the format valid or is it spam, out-of-office, or duplicate noise?',
    whyNeeded:
      'Shields downstream compute-intensive AI models and ERP databases from useless load and erroneous processing.',
    parametersOrCharacteristics: [
      { label: 'Relevance Threshold', value: 'Confidence score (e.g. >= 0.85 for sales intent)' },
      { label: 'Schema Validation', value: 'Verification of allowable payload formats (PDF, XML)' },
      { label: 'Deduplication Window', value: 'Timeframe for hash-based duplicate detection' },
      { label: 'Quarantine Routing', value: 'Dead-letter queue for rejected inbound messages' },
    ],
    sapImplementation: 'SAP Cloud Integration Message Routing & BTP Event Mesh Triage',
    practicalExample:
      'Out-of-office auto-replies are dropped immediately; binding order inquiries are routed to Extractor.',
  },

  'primitive_Extractor / Transformer': {
    id: 'primitive_Extractor / Transformer',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitive',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Extractor / Transformer (Entity Extraction)',
    subtitle: 'Converting unstructured documents & emails into normalized payload fields',
    shortDesc:
      'Parses unstructured text, body text, or attachments and extracts typed key-value pairs: header fields (PO number, date) and item rows (material, quantity, price).',
    whyNeeded:
      'ERP transactions require strict schemas. Extractor bridges the gap between natural human writing and relational database fields.',
    parametersOrCharacteristics: [
      { label: 'Extraction Schema', value: 'Target JSON schema for header and line items' },
      { label: 'Confidence Thresholds', value: 'Minimum probability score required per field' },
      { label: 'OCR Engine', value: 'BTP Document Information Extraction or LLM Vision' },
      { label: 'Normalization', value: 'ISO date conversion and currency cleansing' },
    ],
    sapImplementation: 'SAP Document Information Extraction (DOX) & Generative AI Hub',
    practicalExample:
      'Extracts "Deliver 20x Type B to Cologne" into typed JSON: Material="Type B", Quantity=20, Destination="Cologne".',
  },

  'primitive_Matcher / Enricher': {
    id: 'primitive_Matcher / Enricher',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitive',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Matcher / Enricher (Master Data Grounding)',
    subtitle: 'Resolving recognized entities against SAP S/4HANA master records',
    shortDesc:
      'Resolves ambiguous text names: Which debtor ID (KUNNR) belongs to "Miller Construction"? Which material code (MATNR) matches "special flange"?',
    whyNeeded:
      'An SAP sales document cannot be created without valid master IDs. Matcher enforces referential integrity.',
    parametersOrCharacteristics: [
      { label: 'Search Strategies', value: 'Exact match ➔ Fuzzy search ➔ Vector embedding' },
      { label: 'Target Master Tables', value: 'Debtor (KNA1), Material (MARA), Equipment (EQUI)' },
      { label: 'Fuzzy Threshold', value: 'Minimum similarity coefficient (e.g. Levenshtein >= 0.85)' },
      { label: 'Enrichment Scope', value: 'Incoterms, payment terms, tax codes, sales org' },
    ],
    sapImplementation: 'SAP HANA Cloud Fuzzy Search & S/4HANA Core Data Services (CDS Views)',
    practicalExample:
      '"Miller Contracting, Hamburg" is accurately mapped to SAP Debtor 0000100420 with company code and payment terms.',
  },

  'primitive_Evaluator / Reasoner': {
    id: 'primitive_Evaluator / Reasoner',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitive',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Evaluator / Reasoner (Business Logic & Policy)',
    subtitle: 'Validating limits, contracts, pricing rules & guardrails',
    shortDesc:
      'Executes economic and risk validation: Is order valid for posting? Is credit sufficient? Is warranty valid? Are requested discounts within policy?',
    whyNeeded:
      'Separates entity resolution from approval logic. Protects the enterprise against fraud, bad debt, and margin erosion.',
    parametersOrCharacteristics: [
      { label: 'Decision Tables', value: 'DMN / BRFplus decision rule matrix' },
      { label: 'Financial Limits', value: 'Delegation of Authority approval ceilings' },
      { label: 'Escalation Triggers', value: 'Rules dictating manual clerk escalation' },
      { label: 'Plausibility Checks', value: 'Requested delivery date vs. production lead time' },
    ],
    sapImplementation: 'SAP Build Process Automation Decision Service & Credit Management',
    practicalExample:
      'Warranty evaluation on repair request: Purchased 18 months ago ➔ Warranty covers parts 100%, invoice waived.',
  },

  'primitive_Executor / Actuator': {
    id: 'primitive_Executor / Actuator',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitive',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Executor / Actuator (ERP Mutation & Commit)',
    subtitle: 'Authoritative transactional creation or alteration in SAP S/4HANA',
    shortDesc:
      'Executes writing API transactions: Creating sales order (VA01/SO01), posting financial clearing document, or generating field service ticket.',
    whyNeeded:
      'The critical junction where cognitive intent creates persistent legal and financial realities (inventory release, liabilities, revenue).',
    parametersOrCharacteristics: [
      { label: 'API Protocols', value: 'S/4HANA RAP Business Object, OData v4 or BAPI' },
      { label: 'Idempotency Key', value: 'Guarantees single execution during network retries' },
      { label: 'Blast Radius (1–5)', value: 'Risk exposure index for rollbacks and financial impact' },
      { label: 'Clean Core Compliance', value: 'Strict adherence to released public SAP APIs' },
    ],
    sapImplementation: 'S/4HANA ABAP Cloud RAP (RESTful Application Programming Model)',
    practicalExample:
      'Executing OData service API_SALES_ORDER_SRV to persist Sales Order #400019284 in company code 1010.',
  },

  'primitive_Generator / Synthesizer': {
    id: 'primitive_Generator / Synthesizer',
    category: 'primitive',
    categoryLabel: 'Tier 2: Cognitive Primitive',
    badgeColor: 'border-blue-700 bg-blue-950/60 text-blue-300',
    title: 'Generator / Synthesizer (Communications & Documents)',
    subtitle: 'Synthesizing customer confirmations, PDFs & outbound status notices',
    shortDesc:
      'Composes outgoing feedback to stakeholders: Renders PDF order confirmations, writes personalized email replies, or compiles discrepancy reports.',
    whyNeeded:
      'Completes the operational feedback loop. Transparent confirmations eliminate costly manual phone follow-ups.',
    parametersOrCharacteristics: [
      { label: 'Outbound Channels', value: 'Email, SAP Fiori Notifications, PDF Print, SMS' },
      { label: 'Tone & Localization', value: 'Professional, multi-language support (EN/DE/FR)' },
      { label: 'Entity Binding', value: 'Dynamic binding of SAP order IDs and delivery tracking URLs' },
      { label: 'Approval Requirement', value: 'Direct dispatch vs. save as draft in user inbox' },
    ],
    sapImplementation: 'SAP Forms by Adobe & BTP GenAI Hub Text Synthesis',
    practicalExample:
      'Generating personalized order confirmation with estimated delivery date of Oct 15 and attached PDF copy.',
  },

  // TIER 3: EXECUTION TIERS (ARCHETYPES)
  archetype_header: {
    id: 'archetype_header',
    category: 'archetype',
    categoryLabel: 'Tier 3: Execution Archetypes (Zwingmann Framework)',
    badgeColor: 'border-emerald-700 bg-emerald-950/60 text-emerald-300',
    title: 'The 5 Automation Execution Archetypes',
    subtitle: 'Deterministic ➔ Assistant ➔ Copilot ➔ Autopilot ➔ Agentic',
    shortDesc:
      'Governs WHICH technology executes the cognitive task and HOW the step behaves in the document flow (Straight-Through Processing vs. Human Gate).',
    whyNeeded:
      'Determines operational cost, latency, error rates, and throughput. Poor architectural choices result in either inflated token bills or stalled queues.',
    parametersOrCharacteristics: [
      { label: '1. Deterministic', value: '100% STP, < 50 ms latency, 0 CU inference (Strict logic)' },
      { label: '2. Assistant', value: '100% STP, background LLM preparing data without halting' },
      { label: '3. Copilot', value: '0% STP (Mandatory halt) – AI proposes, human approves' },
      { label: '4. Autopilot', value: '~90% STP – Single agent runs autonomously, halts at <85%' },
      { label: '5. Agentic', value: '~95% STP – Multi-agent swarm self-heals data via ReAct' },
    ],
    sapImplementation: 'Zwingmann Framework for Enterprise AI Architectures',
    practicalExample:
      'The same master data lookup can be solved deterministically (OData key), via Copilot (Joule suggestion), or agentically (swarm parses prior orders).',
  },

  archetype_deterministic: {
    id: 'archetype_deterministic',
    category: 'archetype',
    categoryLabel: 'Tier 3: Execution Archetype',
    badgeColor: 'border-slate-700 bg-slate-900 text-sky-300',
    title: 'Deterministic (Rules & Compiled Code)',
    subtitle: 'Strict rule engines: BRFplus, SQL queries, ABAP Regex, OData Filters',
    shortDesc:
      'Operates without generative AI based on exact boolean rules. Ultra-low latency (< 50 ms), 0 inference costs, 0% hallucination risk.',
    whyNeeded:
      'Ideal for standardized tasks with structured inputs. Compiled logic is 100x cheaper and faster than any LLM.',
    parametersOrCharacteristics: [
      { label: 'Throughput Rate', value: '100% STP (Straight-through background execution)' },
      { label: 'Latency & Cost', value: '< 50 ms, 0 CU inference cost' },
      { label: 'Ambiguity Tolerance', value: 'Zero (fails on unexpected formats or typos)' },
      { label: 'Maintenance', value: 'Rule modifications require explicit manual configuration' },
    ],
    sapImplementation: 'SAP BRFplus, S/4HANA ABAP CDS Views & Cloud Integration Rules',
    practicalExample:
      'Validating that invoice line total matches purchase order amount to the penny; regex email syntax checks.',
  },

  archetype_classic_ml: {
    id: 'archetype_classic_ml',
    category: 'archetype',
    categoryLabel: 'Tier 3: Execution Archetype',
    badgeColor: 'border-teal-700 bg-teal-950 text-teal-300',
    title: 'Assistant (Standard LLM & Semantic Search)',
    subtitle: 'Automated background text processing (Prompt in ➔ Data out)',
    shortDesc:
      'Leverages language models or vector similarity to understand free text, summarize correspondence, or extract typed JSON without UI interruptions.',
    whyNeeded:
      'Enables straight-through processing for unstructured text without dragging clerks in front of screens.',
    parametersOrCharacteristics: [
      { label: 'Throughput Rate', value: '100% STP (Runs dark in background pipelines)' },
      { label: 'Interaction Pattern', value: 'Single-turn prompt without multi-step dialogues' },
      { label: 'Latency & Cost', value: '~ 380 ms, ~ 0.02 CU inference cost' },
      { label: 'Constraint', value: 'Does not autonomously commit write mutations to ERP' },
    ],
    sapImplementation: 'SAP BTP Generative AI Hub (Foundation Models REST API) & HANA Vector',
    practicalExample:
      'Summarizing a 5-page customer complaint email into 3 bullet points for ticketing dispatch.',
  },

  archetype_copilot: {
    id: 'archetype_copilot',
    category: 'archetype',
    categoryLabel: 'Tier 3: Execution Archetype',
    badgeColor: 'border-blue-700 bg-blue-950 text-sky-300',
    title: 'Copilot (Joule / Human-in-the-Loop)',
    subtitle: 'Human leads, AI proposes (human_approved: true mandatory)',
    shortDesc:
      'Deliberately halts document execution! The AI drafts values or proposals. A human clerk must inspect and authorize the transaction in SAP Fiori / Joule.',
    whyNeeded:
      'Why choose a Copilot if it halts automated workflow? This is the central architectural question for enterprise designers!',
    parametersOrCharacteristics: [
      { label: 'Throughput Rate', value: '0% STP (Every document pauses for human review)' },
      { label: 'Human Labor Effort', value: 'Very low: 10s review instead of 15 min manual entry' },
      { label: 'Legal Accountability', value: '100% with the human clerk (SOX & audit compliance)' },
      { label: 'Latency & Cost', value: '~ 650 ms, ~ 0.02 CU inference + human wage time' },
    ],
    sapImplementation: 'SAP Joule Side-by-Side Assistant & SAP Fiori My Inbox',
    practicalExample:
      'Joule suggests: "Assign Debtor 0000100420 with 97% confidence". Clerk reviews in 2 seconds and clicks "Approve".',
    businessUseCases: [
      {
        title: '1. Regulatory Compliance, Liability & SOX (Dual Control)',
        desc: 'High-risk transactional mutations (e.g. procurement approvals > $50,000, contract cancellations, hazmat dispatch) CANNOT legally be committed autonomously by an AI under SOX, IFRS, or corporate Delegation of Authority policies. Copilot eliminates 90% of prep work while preserving mandatory human legal signature.',
      },
      {
        title: '2. Discretionary Business Judgments & Concessions',
        desc: 'Scenarios lacking binary mathematical certainty: An unsatisfied tier-1 customer requests a goodwill discount. No autonomous model should give away margins. Copilot evaluates customer lifetime value, annual margin, and drafts a 5% discount — the sales director makes the final call.',
      },
      {
        title: '3. Phased Rollout Safeguards (Maturity Model)',
        desc: 'No executive allows unmonitored straight-through processing on day one of an AI deployment. Phase 1 (Months 1–3) deploys as Copilot (100% human oversight). Once real production metrics demonstrate > 99.5% accuracy, the step is safely promoted to Autopilot (dark execution with exception routing).',
      },
    ],
  },

  archetype_autopilot: {
    id: 'archetype_autopilot',
    category: 'archetype',
    categoryLabel: 'Tier 3: Execution Archetype',
    badgeColor: 'border-violet-700 bg-violet-950 text-violet-300',
    title: 'Autopilot (Autonomous Single-Agent with Confidence Gate)',
    subtitle: 'Conditional dark processing: Runs automated, halts only on exceptions',
    shortDesc:
      'Operates autonomously by default (~90% STP). Only if input data is ambiguous or confidence dips below the configured threshold (e.g. < 85%) is the item escalated to a human clerk.',
    whyNeeded:
      'The economic sweet spot for modern enterprise workflows: 90% routine transactions process with zero labor costs, reserving clerks for complex edge cases.',
    parametersOrCharacteristics: [
      { label: 'Throughput Rate', value: '~ 90% STP (Exception-based routing)' },
      { label: 'Confidence Gate', value: 'Configurable (e.g. 0.85). Decides dark pass vs. escalation' },
      { label: 'Tool Calling', value: 'Bounded function calling in strict operational parameters' },
      { label: 'Latency & Cost', value: '~ 1,450 ms, ~ 0.08 CU inference cost' },
    ],
    sapImplementation: 'SAP Build Process Automation with AI Core Function-Calling',
    practicalExample:
      'Legible PDF orders process straight-through in 3 seconds; an illegible receipt with 62% confidence routes to Fiori Inbox.',
  },

  archetype_agentic: {
    id: 'archetype_agentic',
    category: 'archetype',
    categoryLabel: 'Tier 3: Execution Archetype',
    badgeColor: 'border-amber-700 bg-amber-950 text-amber-300',
    title: 'Agentic Swarm (Multi-Agent System with Self-Healing)',
    subtitle: 'Autonomous ReAct loops for complex exceptions & data reconstruction',
    shortDesc:
      'Multiple specialized agents collaborate (e.g., Triage Agent, History Investigator, Validator Agent). Missing data is reconstructed from past orders or IoT telemetry.',
    whyNeeded:
      'Delivers highest automation throughput (~95% STP) even on noisy exceptions, at the cost of higher token consumption and longer processing time.',
    parametersOrCharacteristics: [
      { label: 'Throughput Rate', value: '~ 95% STP (Maximum automation tier)' },
      { label: 'Architecture', value: 'Dynamic ReAct loops (Reason + Act), multi-agent coordination' },
      { label: 'Self-Healing', value: 'Autonomous recovery from missing data or API retries' },
      { label: 'Latency & Cost', value: '~ 3,800 ms, ~ 0.40 CU inference cost' },
    ],
    sapImplementation: 'SAP AI Core Orchestration Engine with LangGraph / Multi-Agent Swarm',
    practicalExample:
      'Customer orders without part number. Agentic swarm scans last 12 invoices, correlates delivery site, and binds correct flange ID.',
  },
};

export const getMethodologyItem = (id: string, lang: Language): MethodologyInfoItem | null => {
  const dictionary = lang === 'en' ? ITEMS_EN : ITEMS_DE;
  return dictionary[id] || ITEMS_DE[id] || null;
};

export const METHODOLOGY_INFO_ITEMS = ITEMS_DE;
