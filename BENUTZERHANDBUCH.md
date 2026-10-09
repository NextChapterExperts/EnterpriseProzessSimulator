# SAP Process Simulator – Benutzerhandbuch & Verfahrensdokumentation

Dieses Handbuch richtet sich an Prozessverantwortliche, Lösungsarchitekten, Berater, Dozenten und Studenten. Es dokumentiert die Bedienung, die methodischen Grundlagen, die Werkzeuge und Bewertungsmodelle des **SAP Process Simulators**. Ziel ist es, das Werkzeug eigenständig zu verstehen, Schulungen durchzuführen und fundierte Architektur- und Automatisierungsentscheidungen für SAP-Geschäftsprozesse zu treffen.

---

## Inhaltsverzeichnis

1. [Überblick und Zielsetzung](#1-überblick-und-zielsetzung)
2. [Schnellstart & Installation](#2-schnellstart--installation)
3. [Die Benutzeroberfläche (Navigation & Arbeitsbereiche)](#3-die-benutzeroberfläche-navigation--arbeitsbereiche)
   - 3.1 [Haupt-Navigation & Header-Funktionen](#31-haupt-navigation--header-funktionen)
   - 3.2 [Bereich 1: Live-Simulator (Hauptansicht)](#32-bereich-1-live-simulator-hauptansicht)
   - 3.3 [Bereich 2: TCO & KPI Cockpit](#33-bereich-2-tco--kpi-cockpit)
   - 3.4 [Bereich 3: Methodik- & Schulungsmatrix](#34-bereich-3-methodik---schulungsmatrix)
4. [Methodische Grundlagen & Verfahren](#4-methodische-grundlagen--verfahren)
   - 4.1 [Der OODA-Loop nach John Boyd](#41-der-ooda-loop-nach-john-boyd)
   - 4.2 [Die 6 Kognitiven Primitives](#42-die-6-kognitiven-primitives)
   - 4.3 [Die 5 Zwingmann-Automatisierungsstufen (Archetypen)](#43-die-5-zwingmann-automatisierungsstufen-archetypen)
   - 4.4 [Das Pareto-Optimum (Dunkelverarbeitung vs. Kosten vs. Risiko)](#44-das-pareto-optimum-dunkelverarbeitung-vs-kosten-vs-risiko)
5. [Die 4 Analyse-Perspektiven (Workflow-Layer)](#5-die-4-analyse-perspektiven-workflow-layer)
   - 5.1 [Layer 1: Belegfluss (Flow)](#51-layer-1-belegfluss-flow)
   - 5.2 [Layer 2: Kosten & TCA (Cost)](#52-layer-2-kosten--tca-cost)
   - 5.3 [Layer 3: Risiken & Guardrails (Risk)](#53-layer-3-risiken--guardrails-risk)
   - 5.4 [Layer 4: SAP-Architektur & Clean Core (Architecture)](#54-layer-4-sap-architektur--clean-core-architecture)
6. [Die 13 Enterprise-AI-Herausforderungen (Radar & Student Bands)](#6-die-13-enterprise-ai-herausforderungen-radar--student-bands)
7. [Integrierte SAP Best Practice Prozesse](#7-integrierte-sap-best-practice-prozesse)
8. [Eigene Workflows erstellen (`+ Neuer Workflow`)](#8-eigene-workflows-erstellen--neuer-workflow)
9. [Human-in-the-Loop (HITL) Konsole & Beleg-Editor](#9-human-in-the-loop-hitl-konsole--beleg-editor)
10. [Didaktischer Leitfaden für Dozenten und Studenten](#10-didaktischer-leitfaden-für-dozenten-und-studenten)
11. [Technologischer Stack & Projektstruktur](#11-technologischer-stack--projektstruktur)

---

## 1. Überblick und Zielsetzung

Herkömmliche Prozessdiagramme (BPMN) stellen Abläufe als statische Ketten dar. In der modernen Unternehmenspraxis mit generativer KI, intelligenten Dokumentenservices und autonomen Agenten reicht diese Sicht nicht mehr aus. Ein Prozessschritt ist nicht einfach nur „automatisiert“ oder „manuell“, sondern bewegt sich auf einem Kontinuum kognitiver Fähigkeiten – von fest verdrahteten ABAP-Regeln bis hin zu mehrstufigen Agenten-Workflows.

Der **SAP Process Simulator** löst drei konkrete Aufgaben:

1. **Entscheidungs-Sandbox für Lösungsarchitekten:** Welche Automatisierungsstufe (Deterministisch, Klassisch ML, Autopilot oder Copilot) ist für welchen Schritt betriebswirtschaftlich und technisch optimal?
2. **Risiko- und Governance-Transparenz:** Welche der 13 typischen Enterprise-AI-Risiken (Halluzinationen, Schema-Divergenz, Latenzspitzen, Prompt-Injections, Audit-Lücken) treten auf, wenn eine Stufe unbedacht gewählt wird?
3. **Schulungswerkzeug für Teams & Studenten:** Konkretes, interaktives Erleben von Belegläufen anhand von 7 SAP Best Practice Prozessen mit Echtdaten-Simulation, Payload-Inspektion und Vorher-Nachher-Vergleich.

---

## 2. Schnellstart & Installation

### Voraussetzungen
- Node.js (Version 18.x oder 20.x LTS)
- npm oder pnpm
- Moderner Webbrowser (Chrome, Edge, Firefox, Safari)

### Installation und Start
```bash
# 1. In das Projektverzeichnis wechseln
cd /home/peter/Projekte/active/ProzessSimulator

# 2. Abhängigkeiten installieren
npm install

# 3. Lokalen Entwicklungsserver starten
npm run dev -- -p 5000
```
Die Anwendung ist anschließend im Browser erreichbar unter:
👉 **`http://localhost:5000`**

### Test-Suite ausführen
```bash
npm run test:run
# Führt alle 593 automatisierten Verifikationstests (Unit-, TCA- und Golden-Path-Tests) aus.
```

---

## 3. Die Benutzeroberfläche (Navigation & Arbeitsbereiche)

### 3.1 Haupt-Navigation & Header-Funktionen

Die Kopfzeile steht in allen Ansichten sticky zur Verfügung:

- **App-Titel & Status:** Zeigt den aktuellen Arbeitsmodus und die Projektidentität.
- **Haupt-Tabs:** Umschalten zwischen **Simulator**, **Cockpit** und **Methodik & Schulungsmatrix**.
- **Prozess-Auswahl (Dropdown):** Schneller Wechsel zwischen den 7 hinterlegten Standard-Prozessen sowie selbst definierten Workflows.
- **`+ Neuer Workflow`:** Öffnet das Modal zur Erstellung eigener Prozesse (per Vorlage oder Freitext-Dekomposition).
- **Sprachumschalter `[ 🇩🇪 DE | 🇬🇧 EN ]`:** Vollständige Umschaltung der gesamten Anwendung (Texte, Feldbezeichnungen, Payloads, Hilfetexte, Diagramme) zur Laufzeit.
- **Theme-Umschalter `[ ☀️ / 🌙 ]`:** Wechsel zwischen Dark-Mode und Light-Mode.

---

### 3.2 Bereich 1: Live-Simulator (Hauptansicht)

Der Simulator ist die primäre Arbeitsfläche und teilt sich in drei funktionale Abschnitte:

#### A. Obere Aktions- und Steuerungsleiste
- **Prozess-Titel & Scope-Code Badge** (z. B. `BD9`, `J45`, `1GA`).
- **`Info`-Button:** Öffnet das Glossar mit betriebswirtschaftlichem Zweck, SAP-Modulzuordnung, Hauptbelegen und Transaktionscodes.
- **`Parameter` (Schieberegler-Modal):** Einstellung von Monatsvolumen (z. B. 10.000 bis 500.000 Belege), Rauschrate (0–100 % unstrukturierte/fehlerhafte Belege) und Stundensatz des Fachbereichs (€/h).
- **`★ Pareto-Optimum`:** Berechnet in Echtzeit die optimale Stufenverteilung für den aktuellen Prozess.
- **`Durchlauf testen` / `Pause`:** Startet die synchrone Belegverarbeitung von Schritt 1 bis Schritt 6 mit Latenz-Animation.
- **`Zurücksetzen`:** Setzt Belegstatus, Entscheidungen und Log-Ausgaben auf den Ausgangszustand zurück.

#### B. 4-Layer Perspektiven-Umschalter
Filtert und fokussiert die Darstellung der gesamten Schrittkette auf eine von vier Dimensionen:
1. **1. Prozess & Belegfluss (Flow):** Fachliche Aktionen, OODA-Phasen, Status, Latenzen.
2. **2. Kosten & Capacity Units (Cost):** SAP Capacity Units (CUs), Tokenverbrauch, manuelle Klärungskosten, Fehlerrisikokosten.
3. **3. Risiko & Governance (Risk):** Ausgelöste Challenges, Schweregrad, Abhilfestrategien.
4. **4. SAP Architecture & Tools (Architecture):** Clean Core Index, SAP BTP Ziel-Services, BAPIs, OData-Services, Event Mesh.

#### C. Geteilte Hauptansicht (Split-Screen)
- **Linke Spalte (Schritt-Karten):** Vertikale Prozesskette mit 6 Schritten. Jede Karte zeigt:
  - OODA-Phasen-Kennzeichnung mit Farbcodierung.
  - Schrittname und SAP-Schnittstellenreferenz.
  - **Zwingmann-Stufenleiste:** 4 klickbare Buttons (`Deterministisch`, `Single-Turn ML`, `Autopilot`, `Copilot`), um die Verarbeitungsart dieses Einzelschritts festzulegen.
  - Spezifischer Hinweistext, was diese Stufe in genau diesem Schritt bewirkt.
  - Aufklappbarer Bereich **„Schritt-Spezifikation & I/O“** mit Vorbedingung, Eingangsdaten, Ausgangsdaten und SAP-Interface.
  - Challenge-Badges: Grün (welche Risiken dieser Schritt löst) und Rot/Gelb (welche Risiken er induziert).
- **Rechte Spalte (Live Payload Monitor):**
  - **Aktuelle Eingangs- und Ausgangsdaten:** Strukturierte, fachlich verständliche Tabellenansicht aller Datenfelder des gewählten Schritts.
  - **Echtdaten-Umschalter:** Wechsel zwischen Gut-Fall (`★ Gut`) und Schlecht-Fall (`⚠ Schlecht`).
  - **Beleg bearbeiten (`Eingang editieren`):** Ermöglicht das Ändern des eingehenden Freitexts zur Laufzeit.
  - **Human-in-the-Loop Konsole:** Stoppt ein Schritt im Copilot-Modus, erscheinen hier die Freigabe-Buttons (`Freigeben & Weiter`, `Manuell korrigieren`, `Ablehnen`).

---

### 3.3 Bereich 2: TCO & KPI Cockpit

Das Cockpit berechnet die betriebswirtschaftliche Gesamtrechnung über die gesamte Belegkette:

- **Gesamtkosten der Automatisierung (TCA):**
  $$\text{TCA} = \text{BTP Lizenz- \& Rechenkosten} + \text{Menschliche Eskalationskosten} + \text{Restrisiko-Schadenskosten}$$
- **Dunkelverarbeitungsquote (Lights-Out Rate):** Prozentsatz der Belege, die ohne jeglichen manuellen Eingriff das ERP erreichen.
- **Ersparnis vs. Manuell:** Monatlicher Kostenvorteil gegenüber rein manueller Bearbeitung.
- **Clean Core Index:** Anteil der Schritte, die 100 % upgrade-sicher über Standard-APIs und BTP Extensions angebunden sind.
- **Interaktives 13-Challenges Radar:** Grafische Übersicht der 4 Risikocluster mit direkter Sprungmarke in die Detailanalyse.

---

### 3.4 Bereich 3: Methodik- & Schulungsmatrix

Die Matrix ist das didaktische Nachschlagewerk des Projekts:
- Systematische Verknüpfung aller **4 OODA-Phasen**, **6 Kognitiven Primitives** und **5 Automatisierungsstufen**.
- Für jede Kombination: Konkreter Systemablauf, SAP-Technologiekomponente, Standard-Prüfungen und didaktische Empfehlung.
- Direkte Aufrufe von Erklärungs-Modals für jedes theoretische Konzept.

---

## 4. Methodische Grundlagen & Verfahren

### 4.1 Der OODA-Loop nach John Boyd

Jeder Geschäftsprozess im Simulator folgt dem kybernetischen Regelkreis von John Boyd:

```
[ Umweltreiz / Beleg ]
         │
         ▼
 1. OBSERVE (Wahrnehmung)    ──> Filterung, Spam-Schutz, Extraktion unstrukturierter Daten
         │
         ▼
 2. ORIENT  (Kontextualisierung) ──> Abgleich mit SAP ERP Stammdaten (Grounding, Fuzzy Match)
         │
         ▼
 3. DECIDE  (Entscheidung)   ──> Prüfung von Geschäftsregeln, Limits, Kreditprüfungen
         │
         ▼
 4. ACT     (Handlung)       ──> Transaktionale Verbuchung (RAP/OData) & Dokumentenversand
```

**Warum diese Trennung wichtig ist:**
Klassische Workflows vermischen oft Wahrnehmung und Verbuchung. Im Simulator ist strikt geregelt: Ein Sprachmodell darf niemals direkt in `ACT` eine Datenbankzeile schreiben. Erst muss in `ORIENT` der Primärschlüssel (Debitorennr., Materialnr.) gegen das SAP-System verifiziert werden.

---

### 4.2 Die 6 Kognitiven Primitives

Jeder einzelne Prozessschritt gehört genau einem kognitiven Grundbaustein an:

| Primitive | OODA-Phase | Primäre Funktion | Typische SAP-Technologie |
|---|---|---|---|
| **Filter / Gatekeeper** | Observe | Relevanzprüfung, Spam-Filter, Schema-Validierung | SAP Event Mesh, Cloud Integration Header-Check |
| **Extractor / Transformer** | Observe | Strukturierung von PDF/Freitext in JSON | SAP Document Information Extraction (DOX) |
| **Matcher / Enricher** | Orient | Primärschlüssel-Ermittlung, Dublettenprüfung | SAP HANA Fuzzy Search, Vector Engine, CDS Views |
| **Evaluator / Reasoner** | Decide | Regelwerk- & Richtlinienauswertung | SAP Build Process Automation Business Rules (BRFplus) |
| **Executor / Actuator** | Act | Transaktionales Schreiben ins Core-ERP | ABAP Cloud RAP, S/4HANA OData v4 APIs, BAPIs |
| **Generator / Synthesizer**| Act | Erstellung von Belegen, E-Mails, Statusmeldungen | SAP BTP Output Management, Document Service |

---

### 4.3 Die 5 Zwingmann-Automatisierungsstufen (Archetypen)

Entwickelt in Anlehnung an das Automatisierungs-Stufenmodell für Enterprise-AI:

1. **Stufe 1 – Deterministisch (Code & Regeln):**
   - *Verhalten:* 100 % regelbasiert (BRFplus, ABAP, SQL-Logik).
   - *Vorteile:* Sub-Sekunden-Latenz (< 50 ms), 0 Token-Kosten, 100 % deterministisch & GoBD-konform.
   - *Grenzen:* Null Toleranz gegenüber Syntaxfehlern, Formatabweichungen oder Freitext.
2. **Stufe 2 – Assistant / Klassisch ML (Single-Turn Modell):**
   - *Verhalten:* Dediziert trainierte Modelle (z. B. OCR/Fuzzy Matching).
   - *Vorteile:* Robust gegenüber Tippfehlern und Layout-Änderungen, keine Halluzinationen von Entitäten.
   - *Grenzen:* Kein freies Sprachverständnis für komplexe Sonderklauseln.
3. **Stufe 3 – Copilot (Human-in-the-Loop):**
   - *Verhalten:* KI bereitet Beleg vor, Prozess stoppt zwingend zur Bestätigung durch den Sachbearbeiter.
   - *Einsatz:* Gesetzliches Vier-Augen-Prinzip (SOX), Kulanzfälle, Einführungsphase („Stützräder“).
   - *Grenzen:* Dunkelverarbeitung sinkt auf 0 %, hohe Personalkosten und Wartezeiten.
4. **Stufe 4 – Autopilot (Single-Agent mit Guardrails):**
   - *Verhalten:* Autonomer Agent führt Tools aus; stoppt nur, wenn das Konfidenz-Gate unterschritten wird.
   - *Vorteile:* ~90 % Dunkelverarbeitung bei gleichzeitiger Absicherung gegen Ausreißer.
5. **Stufe 5 – Agentic (Multi-Agenten-System mit ReAct-Schleifen):**
   - *Verhalten:* Mehrere spezialisierte Agenten korrigieren sich gegenseitig (Self-Correction).
   - *Vorteile:* Löst hochkomplexe Ausnahmefälle mit mehrfachen Rückfragen autonom.
   - *Grenzen:* Hohe Latenz (mehrere Sekunden) und erhöhter Token-Bedarf.

---

### 4.4 Das Pareto-Optimum (Dunkelverarbeitung vs. Kosten vs. Risiko)

Wird der Button **`★ Pareto-Optimum`** betätigt, konfiguriert der Simulator alle Schritte so, dass **maximale Automatisierung bei minimalem Risiko und Aufwand** entsteht:

- Reine Filter- und Schreibschritte (`Gatekeeper`, `Actuator`) werden **deterministisch** ausgeführt.
- Extraktion und Matching werden als **Assistant (Klassisch ML / DOX)** betrieben.
- Regelprüfungen verbleiben **deterministisch** in BRFplus.
- **Ergebnis:** Künstliche Sachbearbeiter-Stopps (Copilot) werden eliminiert; der Beleg läuft zu über 95 % dunkel durch.

---

## 5. Die 4 Analyse-Perspektiven (Workflow-Layer)

Mit den Layer-Buttons oberhalb der Schrittkette wechselt der Simulator den Blickwinkel:

### 5.1 Layer 1: Belegfluss (Flow)
Zeigt den operativen Ablauf: Welcher Beleg kommt an? Welche Datenfelder werden angereichert? Welche Latenzen entstehen pro Schritt?

### 5.2 Layer 2: Kosten & TCA (Cost)
Zeigt die monetäre Zusammensetzung:
- SAP BTP Capacity Units (CUs) für Rechenleistung und Speicher.
- Token-Kosten für Inferenz.
- Manuelle Nacharbeitskosten bei Eskalationen (Berechnet aus Stundensatz $\times$ Bearbeitungsdauer).

### 5.3 Layer 3: Risiken & Guardrails (Risk)
Zeigt pro Schritt, welche der 13 Enterprise-AI-Herausforderungen schlagend werden und welches Konfidenz-Gate (`50%` bis `99%`) definiert ist.

### 5.4 Layer 4: SAP-Architektur & Clean Core (Architecture)
Prüft die Architektur auf Zukunftsfähigkeit:
- **Clean Core Index:** `COMPLIANT` (ABAP Cloud / BTP Extension), `LEGACY` (Klassisches BAPI im Core), oder `VIOLATION` (Direkter Tabellenzugriff).
- **SAP Golden Path:** Welches Standardwerkzeug empfiehlt die SAP-Referenzarchitektur (z. B. *SAP Document AI*, *SAP Integration Suite*, *SAP Event Mesh*)?

---

## 6. Die 13 Enterprise-AI-Herausforderungen (Radar & Student Bands)

Im Simulator sind 13 systemische Herausforderungen hinterlegt, aufgeteilt in 4 Cluster. Für Schulungen sind diese in **4 Studenten-Bänder** aufgeteilt:

| Band | Student | Challenge-IDs | Themenschwerpunkt |
|---|---|---|---|
| **Band 1** | Student 1 | `CH_01` (Context Drift), `CH_02` (Stale Embeddings), `CH_03` (Lost in the Middle) | **Data & Context Integrity:** Wie bleiben Daten konsistent und aktuell? |
| **Band 2** | Student 2 | `CH_04` (Halluzination), `CH_05` (Flaky APIs), `CH_06` (Non-Determinism), `CH_07` (Cascading Errors) | **Reliability & Determinism:** Wie verhindert man Fehlerfortpflanzung? |
| **Band 3** | Student 3 | `CH_08` (Prompt Injection), `CH_09` (Data Leakage / PII), `CH_10` (Unbounded Authority) | **Security, Privacy & Audit:** Compliance, GoBD, Berechtigungen und Angriffe. |
| **Band 4** | Student 4 | `CH_11` (Human Bottleneck), `CH_12` (Token Starvation), `CH_13` (Model Drift / SLA) | **Operational Resilience & SLAs:** Kostenexplosionen, Latenzen und Überlastung. |

Klickt man im Simulator auf ein Challenge-Badge (z. B. `[C4: Halluzination]`), öffnet sich die **Challenge-Drawer** mit:
- Problembeschreibung und Fehlerursache.
- Betroffene Schritte im aktuellen Prozess.
- Konkrete SAP-Abhilfestrategie (Mitigation Strategy).
- Zuweisung zum zuständigen Studenten-Band.

---

## 7. Integrierte SAP Best Practice Prozesse

Der Simulator enthält 7 vollständig ausmodellierte Prozesse nach SAP Best Practice Standard:

1. **`BD9` – Sell from Stock (Order-to-Cash / SD):**
   - E-Mail-Triage ➔ PDF-Extraktion ➔ SAP-Stammdaten-Matching ➔ Kredit- & ATP-Prüfung ➔ Kundenauftragsanlage (VA01/RAP) ➔ Auftragsbestätigung.
2. **`J45` – Sourcing & Procurement (Procure-to-Pay / MM):**
   - Bestellanforderungs-Erfassung ➔ Banf-Positionsextraktion ➔ Lieferanten- & Kontrakt-Matching ➔ Budget- & Genehmigungsprüfung ➔ Bestellungsanlage (ME21N) ➔ Bestellübermittlung.
3. **`1GA` – Make-to-Stock Production (Plan-to-Produce / PP):**
   - Produktionsbedarfs-Signal ➔ Stücklisten- & Arbeitsplanauflösung ➔ Materialverfügbarkeitsprüfung (PIR) ➔ Fertigungsauftrags-Kalkulation ➔ Fertigungsauftragsanlage (CO01) ➔ Werkstatt-Rückmeldeaviso.
4. **`1MB` – Quality Management in Procurement (Inspection-to-Disposition / QM):**
   - Wareneingangs-Signal ➔ Prüflos-Extraktion & Prüfplan-Zuordnung ➔ Prüfmerkmale-Matching ➔ Verwendungsentscheid-Regelprüfung ➔ Buchung des Verwendungsentscheids (QA11) ➔ Lieferanten-Qualitätsbenachrichtigung.
5. **`BJ2` – Corrective Plant Maintenance (Plan-to-Maintain / PM):**
   - Instandhaltungsmeldungseingang ➔ Schadensbild- & Fehlercode-Extraktion ➔ Equipment- & Technische-Platz-Zuordnung ➔ Dringlichkeits- & Ersatzteilprüfung ➔ Instandhaltungsauftragsanlage (IW31) ➔ Techniker-Aviso & Einsatzplan.
6. **`1B6` – Warehouse Inbound & Putaway with EWM (Logistics Execution / EWM):**
   - Lieferavis-Eingang (ASN) ➔ Packstück- & Handling-Unit-Extraktion ➔ Lagerplatz- & Einlagerstrategie-Matching ➔ Gefahrgut- & Kapazitätsprüfung ➔ Lageraufgabenerzeugung ➔ Einlagerbestätigung.
7. **`1E6` – Customer Service & Warranty Management (Claim-to-Resolution / CS):**
   - Reklamations- & Garantieantragseingang ➔ Anspruchsdaten-Extraktion ➔ Serialnummern- & Garantiestatus-Matching ➔ Kulanz- & Deckungsprüfung ➔ Serviceauftrag- / Gutschriftsanlage ➔ Kundenbescheid.

---

## 8. Eigene Workflows erstellen (`+ Neuer Workflow`)

Über den Button `[+ Neuer Workflow]` im Header können eigene Geschäftsprozesse angelegt werden:

- **Option 1 – Schnell-Start Presets:** Vordefinierte Industrieprozesse (z. B. *Rechnungseingangsprüfung MIRO / 2B6* oder *Lieferanten-Reklamation PR01*) mit einem Klick laden.
- **Option 2 – Freitext-Dekomposition:**
  - Geben Sie eine formlose Prozessbeschreibung ein (z. B.: *„Ein Lieferant sendet ein PDF mit einer Rechnung. Wir lesen die Daten aus, prüfen die USt-IdNr. gegen das Finanzamt, gleichen die Rechnung mit der Bestellung ab und verbuchen die Rechnung im SAP.“*).
  - Der Simulator zerlegt den Text automatisch in die 4 OODA-Phasen, ordnet die passenden Kognitiven Primitives zu und lädt den neuen Workflow sofort in die interaktive Ansicht.

---

## 9. Human-in-the-Loop (HITL) Konsole & Beleg-Editor

### Das HITL-Verfahren in der Praxis
Wenn ein Schritt auf **Copilot** konfiguriert ist, simuliert das System einen realen Arbeitsplatz-Stopp:
1. Die Simulation hält bei diesem Schritt an (`Eskalation / Freigabe erforderlich`).
2. Im rechten Bereich erscheint die Freigabe-Maske mit den konkreten Werten.
3. Der Anwender hat drei Möglichkeiten:
   - **`[ Freigeben & Weiter ]`:** Übernimmt die Daten unverändert und setzt den Prozess fort.
   - **`[ Manuell korrigieren ]`:** Ermöglicht das Anpassen einzelner Felder vor der Verbuchung.
   - **`[ Ablehnen ]`:** Bricht die Verarbeitung des Belegs ab und dokumentiert den Grund.

### Der Beleg-Editor
Über das Stift-Symbol im Live-Payload-Monitor kann der eingehende E-Mail-Freitext direkt verändert werden (z. B. Einbau von widersprüchlichen Bestellmengen oder unklaren Adressen), um zu testen, wie die verschiedenen Stufen und Filter auf fehlerhafte Eingaben reagieren.

---

## 10. Didaktischer Leitfaden für Dozenten und Studenten

### Empfohlener 4-Schritte-Übungsablauf

1. **Schritt 1: Ist-Zustand simulieren**
   - Wählen Sie den Prozess `BD9 (Order-to-Cash)`.
   - Starten Sie die Simulation mit dem Button `Testlauf starten`.
   - Beobachten Sie, wie der Beleg in Schritt 2 stoppt (Standardeinstellung: Copilot).
   - Prüfen Sie im Tab `Cockpit` die Dunkelverarbeitungsquote (0 %) und die hohen Personalkosten.

2. **Schritt 2: Das Pareto-Optimum anwenden**
   - Klicken Sie auf `★ Pareto-Optimum`.
   - Beobachten Sie, wie die Schritte automatisch auf `Deterministisch` und `Assistant` umgestellt werden.
   - Führen Sie die Simulation erneut aus.
   - Prüfen Sie im Cockpit: Der Beleg läuft vollständig dunkel durch, die Durchlaufzeit sinkt von Minuten auf Millisekunden.

3. **Schritt 3: Risikobewertung (Studenten-Bänder)**
   - Schalten Sie in Layer 3 (`Risiken & Guardrails`).
   - Jeder der vier Studenten prüft die Challenges seines Bands (z. B. Student 2 prüft `C4: Halluzination` bei Schritt 3).
   - Verstellen Sie Schritt 3 versuchsweise auf `Autopilot`: Welche neuen Risiken tauchen auf?

4. **Schritt 4: Architektur-Validierung**
   - Schalten Sie in Layer 4 (`SAP-Architektur`).
   - Diskutieren Sie anhand der Golden Path Empfehlungen: Welche SAP BTP Services (z. B. *Document AI*, *Event Mesh*, *HANA Cloud Vector Engine*) sind für das Szenario erforderlich?

---

## 11. Technologischer Stack & Projektstruktur

### Verwendete Technologien
- **Framework:** Next.js 14 (React 18, App Router, TypeScript)
- **Styling:** Tailwind CSS (Dark/Light Mode Support, Responsive Design)
- **State Management:** Zustand (Persistenter Store für Simulation, Konfiguration und Historie)
- **Icons:** Lucide React
- **Tests:** Vitest (593 Unit- & Regressionstests)

### Wichtige Verzeichnisse und Dateien
```
ProzessSimulator/
├── BENUTZERHANDBUCH.md               <-- Dieses Dokument
├── DOKUMENTATION.md                  <-- Technische Architektur & Modell-Doku
├── ROADMAP.md                        <-- Meilensteine und Release-Plan
├── docs/
│   ├── METHODIK_SCHULUNGSLEITFADEN.md <-- Didaktischer Workshop-Leitfaden
│   └── steps/                        <-- Detail-Dossiers zu jedem Prozessschritt
├── src/
│   ├── app/                          <-- Next.js Pages & Layout
│   ├── components/
│   │   ├── CleanWorkflow/            <-- StepCard, LivePayloadMonitor, Layer-Switcher
│   │   ├── Cockpit/                  <-- TCA-Berechnung, Radar-Chart, Kostengrafiken
│   │   ├── TrainingMatrix/           <-- Interaktive Methodik- & Schulungsmatrix
│   │   └── Modals/                   <-- ChallengeDrawer, ParetoModal, ProcessInfo
│   ├── data/
│   │   ├── templates.ts              <-- Alle 7 SAP Best Practice Prozesse
│   │   ├── challenges.ts             <-- Die 13 Enterprise-AI-Challenges
│   │   ├── dryRunSample.ts           <-- Echtdaten-Payloads für Simulationen
│   │   └── methodologyTraining.ts    <-- Inhalte der Schulungsmatrix
│   ├── lib/
│   │   ├── dryRunEngine.ts           <-- Ausführungs- und Latenz-Engine
│   │   ├── paretoSolver.ts           <-- Algorithmus zur Pareto-Optimierung
│   │   └── tcaCalculator.ts          <-- Berechnung der Total Cost of Automation
│   └── store/
│       └── useSimulatorStore.ts      <-- Zentraler Zustandsspeicher
```

---

*Stand: Oktober 2026 – NextChapterExperts / ProzessSimulator*
