# Methodik- & Schulungsleitfaden: Kognitive Prozessautomatisierung in SAP

Dieses Dokument dient als Schulungsunterlage und Architektur-Referenz für das Zusammenspiel aus **OODA-Loop**, **Kognitiven Primitives**, der **Zwingmann-Methodologie** und dem gezielten Einsatz von **Human-in-the-Loop (Copilot)** in modernen SAP S/4HANA & BTP Architekturen.

---

## 1. Die 3-Ebenen-Hierarchie der Automatisierung

Jeder Geschäftsprozess im Simulator folgt einer dreistufigen Hierarchie, die sicherstellt, dass Geschäftslogik, kognitive Aufgaben und technische Ausführungsarten sauber entkoppelt sind:

```
┌────────────────────────────────────────────────────────────────────────┐
│ EBENE 1: Der Kognitive OODA-Loop                                       │
│ [Observe] ➔ [Orient] ➔ [Decide] ➔ [Act]                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ bestimmt den Prozessfortschritt
┌───────────────────────────────────▼────────────────────────────────────┐
│ EBENE 2: Die 6 Kognitiven Primitives                                   │
│ Filter ➔ Extractor ➔ Matcher ➔ Evaluator ➔ Executor ➔ Generator        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ definiert die fachliche Aufgabe
┌───────────────────────────────────▼────────────────────────────────────┐
│ EBENE 3: Die 5 Ausführungsarten (Zwingmann-Archetypen)                 │
│ 1. Deterministisch │ 2. Assistant │ 3. Copilot │ 4. Autopilot │ 5. Ag. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ebene 1: Der OODA-Loop im SAP-Kontext

Ursprünglich von John Boyd für adaptive Entscheidungszyklen entwickelt, beschreibt der OODA-Loop, wie ein autonomes oder KI-unterstütztes System mit der Umwelt interagiert:

### 1. Observe (Wahrnehmung & Reizaufnahme)
* **Aufgabe:** Eingehende Rohdaten abfangen (E-Mails, PDF-Bestellungen, EDI-Dateien, Kundenportal-Anfragen).
* **Zweck:** Rauschen, Spam und Duplikate sofort aussortieren; Rohinhalte für die Weiterverarbeitung digitalisieren.
* **SAP BTP Schnittstelle:** SAP Event Mesh, Cloud Integration (CPI), Document Information Extraction (DOX).

### 2. Orient (Kontextualisierung & Grounding)
* **Aufgabe:** Abgleich der erkannten Entitäten gegen das Unternehmensgedächtnis (SAP Stammdaten).
* **Zweck:** Verhindert KI-Halluzinationen. Eine Modell-Aussage wie *„Kunde Müller will Flansche“* wird mit realen Tabellen verknüpft: Debitor `0000100420` (KNA1), Material `FL-9021` (MARA), Servicevertrag `SV-88102`.
* **SAP BTP Schnittstelle:** SAP HANA Cloud Vector Engine, Core Data Services (CDS Views), OData v4 Lookup.

### 3. Decide (Regelprüfung & Richtlinien)
* **Aufgabe:** Betriebswirtschaftliche Bewertung und Prüfung von Schutzplanken (Guardrails).
* **Zweck:** Schützt vor unkontrollierten Risiken: Reicht das Kreditlimit? Gilt die Gewährleistung? Liegt der Auftragswert über der Freigabegrenze?
* **SAP BTP Schnittstelle:** SAP Build Process Automation Decision Service (BRFplus / DMN), Credit Management.

### 4. Act (ERP-Mutation & Systeminteraktion)
* **Aufgabe:** Schreibende, persistente Zustandsänderung im SAP-Kernsystem und Abschlusskommunikation.
* **Zweck:** Der rechtlich bindende Commit (z. B. Kundenauftrag SO01 anlegen, FI-Zahlung buchen) und Versand der Auftragsbestätigung.
* **SAP BTP Schnittstelle:** S/4HANA ABAP Cloud RAP (RESTful Application Programming Model), SAP Forms by Adobe.

---

## 3. Ebene 2: Die 6 Kognitiven Primitives & ihre Steuerparameter

Unabhängig von Branche und Fachbereich lässt sich jeder Arbeitsschritt auf genau 6 kognitive Primitives abbilden:

| Primitiv | Kognitive Aufgabe | Wesentliche Steuerparameter |
| :--- | :--- | :--- |
| **1. Filter / Gatekeeper** | Triage, Spam-Schutz, Vorfilterung | `Relevanz-Schwellwert (0.0-1.0)`, `Format-Schema`, `Duplikat-Prüffenster`, `Quarantäne-Queue` |
| **2. Extractor / Transformer** | Freitext/PDF in Belegdaten überführen | `JSON-Schema`, `Feld-Konfidenz-Gate`, `OCR-Engine`, `Normalisierungs-Regeln` |
| **3. Matcher / Enricher** | Stammdaten-Auflösung & Grounding | `Matching-Strategie (Exakt/Fuzzy/Vektor)`, `Fuzzy-Threshold (>=0.85)`, `Stammdaten-Objekt (KNA1/MARA)` |
| **4. Evaluator / Reasoner** | Policy- & Geschäftsregel-Prüfung | `DMN-Entscheidungstabelle`, `Betragsgrenzen (Delegation of Authority)`, `Eskalations-Matrix` |
| **5. Executor / Actuator** | Schreibende ERP-Mutation (Commit) | `S/4HANA RAP Endpoint`, `Idempotenz-Schlüssel`, `Blast Radius (1-5)`, `Clean Core Index` |
| **6. Generator / Synthesizer** | Bestätigungen & Dokumentenerstellung | `Ausgabekanal (Mail/PDF/Portal)`, `Tonalität`, `Beleg-Referenz-Binding`, `Genehmigungspflicht` |

---

## 4. Ebene 3: Die 5 Ausführungsarten (Zwingmann-Methodologie)

Die Ausführungsart legt fest, **welche Technologie** eingesetzt wird und **wie sich der Beleg im Prozessfluss verhält**:

```
Durchsatz (STP)            Latenz & Kosten              Technologie
100% STP (Dunkel)    │  < 50 ms   │ 0 CU           │ Deterministisch (BRFplus/SQL)
100% STP (Dunkel)    │  ~ 380 ms  │ 0.02 CU        │ Assistant (LLM Prompt-in/Text-out)
  0% STP (Stoppt)    │  ~ 650 ms  │ 0.02 CU + Lohn │ Copilot (Joule / Human-in-the-Loop)
 ~90% STP (Bedingt)  │  ~ 1.450 ms│ 0.08 CU        │ Autopilot (Single-Agent + Gate)
 ~95% STP (Autonom)  │  ~ 3.800 ms│ 0.40 CU        │ Agentic Swarm (Multi-Agent ReAct)
```

---

## 5. Das Copilot-Dilemma: Warum Copilot in einem automatisierten Workflow?

### Das scheinbare Paradoxon:
Ein Workflow hat das Ziel: **Dunkelverarbeitung (Straight-Through Processing / STP)** – Daten sollen ohne menschliche Berührung von A nach B fließen.
Ein Copilot hingegen **stoppt den Prozess ganz bewusst** und wartet auf eine menschliche Aktion (`human_approved: true`). Rechnerisch sinkt die Dunkelverarbeitungsquote dieses Schritts auf **0%**.

### Warum setzen Enterprise-Architekten Copiloten dennoch gezielt ein?

Es gibt **drei fundamentale Business- und Governance-Gründe**:

#### 1. Compliance, SOX & Haftung (Das Vier-Augen-Prinzip)
* **Problem:** Rechtsverbindliche Handlungen mit hohem finanziellem oder juristischem Risiko dürfen laut Gesetz (SOX, GoBD, IFRS, Medizinprodukte-Verordnung) oder internen Unterschriftenrichtlinien (*Delegation of Authority*) **nicht vollautomatisch von einer KI gezeichnet werden**.
* **Beispiele:**
  * Bestellfreigaben > 50.000 €
  * Stornierung von Verträgen
  * Zuteilung von Gefahrgut oder pharmazeutischen Wirkstoffen
  * Entlassungen oder Disziplinarmaßnahmen
* **Lösung durch Copilot:** Der Copilot nimmt dem Sachbearbeiter 90% der manuellen Arbeit ab (Zusammenfassung lesen, historische Belege matchen, Risiko analysieren). Der Sachbearbeiter prüft die Vorlage in 10 Sekunden und setzt seine rechtsverbindliche Unterschrift.

#### 2. Ermessensspielraum & Kulanzentscheidungen
* **Problem:** Viele Geschäftsentscheidungen haben keine binäre Wenn-Dann-Wahrheit.
* **Beispiel:** Ein verärgerter A-Kunde fordert nach Lieferverzögerung einen Sondernachlass von 5%. Ein starres Regelwerk würde ablehnen; eine autonome KI könnte unkontrolliert Marge vernichten.
* **Lösung durch Copilot:** SAP Joule analysiert den Kundenwert (LTV), den Deckungsbeitrag des laufenden Jahres und schlägt vor: *„Kunde erwirtschaftet 1,2 Mio. € Umsatz. Kulanznachlass von 350 € wird zur Kundenerhaltung empfohlen.“* Die finale Freigabe erteilt der Vertriebsleiter.

#### 3. Das Reifegrad-Modell („Stützräder vor dem Autopiloten“)
* **Problem:** Bei der Ersteinführung von Machine Learning oder LLMs vertraut keine Unternehmensleitung dem Modell am Tag 1 eine unüberwachte Dunkelverarbeitung an.
* **Rollout-Phasen:**
  * **Phase 1 (Monat 1–3) – Copilot-Modus:** Jeder Beleg wird der Fachabteilung als Joule-Vorschlag vorgelegt. Der Mensch prüft 100% der Fälle. Gleichzeitig werden Metriken gesammelt (Acceptance Rate).
  * **Phase 2 (Monat 4–6) – Autopilot-Modus:** Nachgewiesen liegt die KI bei 99,2% Genauigkeit. Nun wird auf **Autopilot** umgeschaltet: Alle Belege mit Konfidenz >= 85% laufen dunkel durch. Nur die verbleibenden 0,8% Grenzfälle stoppen noch zur manuellen Klärung.

---

## 6. Die Human-in-the-Loop (HITL) Interaktion im Simulator

Im Simulator wurde das passive Stopp-Signal durch eine echte **Entscheidungskonsole** ersetzt:

1. **Joule KI-Vorschlag:** Zeigt die erkannten Daten und die berechnete Konfidenz.
2. **Interaktive Optionen des Sachbearbeiters:**
   * **`[✓ Freigeben & Weiter]`**: Der Beleg wird mit den vorgeschlagenen Werten freigegeben. Die Simulation setzt ihren Lauf automatisch zum nächsten Schritt fort.
   * **`[✏️ Manuell anpassen]`**: Der Sachbearbeiter übersteuert Werte oder erfasst einen Revisionsvermerk (z. B. *„Kunde telefonisch erreicht, Skonto gewährt“*).
   * **`[✕ Ablehnen]`**: Der Beleg wird gestoppt und als abgewiesen gekennzeichnet.
3. **Simulations-Verhalten:**
   Startet man die Simulation über *„Durchlauf testen“*, stoppt sie bei Erreichen eines Copilot-Schritts sanft (*„⏸️ Human-in-the-Loop: Wartet auf Sachbearbeiter-Freigabe“*). Erst durch den Klick auf *Freigeben* läuft der Prozess weiter.

---

## 7. Zusammenfassung für Schulungen & EAM-Reviews

* **Merksatz 1:** Ein einziger Copilot-Schritt im Workflow verhindert 100% Dunkelverarbeitung – er ist aber oft die einzige gesetzeskonforme Lösung.
* **Merksatz 2:** Der Copilot ist das ideale Werkzeug für Phase 1 des KI-Rollouts. Das Zielbild für Standardprozesse ist der **Autopilot** (Dunkelverarbeitung mit Ausnahme-Gate).
* **Merksatz 3:** Vor der Systemmutation (Act) muss immer ein Grounding (Orient) gegen SAP Stammdaten stattfinden, um Halluzinationen auszuschließen.

---

## 8. 🧭 Terminologie-Kompass: Zwingmann-Autonomie vs. SAP Joule Begrifflichkeiten

In der industriellen Praxis und in universitären Vorlesungen führt das Aufeinandertreffen wissenschaftlicher KI-Taxonomien und SAP-Produktmarketing regelmäßig zu Missverständnissen. 

### Der scheinbare Widerspruch beim Begriff „Assistant“:
* **In der Zwingmann-Methodologie:**  
  Ein **Assistant (Stufe 2)** ist die **einfachste KI-Ausprägung**: Ein isolierter, zustandsloser **Single-Turn-Aufruf** (Request ➔ Response ohne Dialog, ohne Gedächtnis und ohne Tool-Calling). Beispiele: SAP DOX Belegextraktion, HANA In-Memory Fuzzy Search, Textübersetzung via GenAI Hub.
* **In der offiziellen SAP-Produktwelt:**  
  Als **Joule Digital Assistant** bezeichnet SAP hingegen den **übergeordneten Supervisor / Dirigenten** im Fiori Launchpad, der Benutzeranfragen entgegennimmt, zerlegt und an spezialisierte Fachagenten delegiert.

### Rosetta-Stone: Die Übersetzungstabelle

| Zwingmann-Stufe (Kognitions-Kybernetik) | Name im Simulator | Offizielles SAP BTP / S/4HANA Äquivalent | Didaktischer Merksatz |
|---|---|---|---|
| **1. Deterministisch** | **Deterministisch** | SAP S/4HANA Core / BRFplus / RAP / SQL | 0 CU, 0 Tokens, 100% GoBD- & revisionssicher |
| **2. Single-Turn ML** | **Single-Turn ML** | SAP GenAI Hub API / SAP DOX / Classic ML | Isolierter, zustandsloser API-Call (Prompt ➔ Text/JSON); **kein** Dialog |
| **3. Copilot** | **Copilot** | SAP Joule Sidepanel / Fiori Freigabe-Workflow | Human-in-the-Loop (`human_approved: true`); stoppt Belegfluss für SOX |
| **4. Workflow** | **Workflow** | **SAP Build Process Automation / n8n Flow** | **Echte Workflow-Orchestrierung** (~90–95% STP) mit Schwellwertprüfung & Klärungs-Queue |
| **5. Autonomous Agent** | **Autonomous Agent** | **SAP Joule AI Agents & Domain-Assistent** | **Autonome Agenten mit MCP-Tools**, geführt von Fachassistenten (z. B. Buchungsassistent) |

> 🎓 **Prüfungshinweis für Studenten & Enterprise-Architekten:**  
> 1. **Assistenten vs. Agenten:** In der modernen SAP-Architektur (SAP Autonomous Suite) ist ein **Assistant** (z. B. *Buchungsassistent*, *HR Operations Assistant*) eine übergeordnete Fachfunktion, die **5 bis 10 autonome Joule Agents** führt. Die Agenten führen die Aufgaben autonom über MCP-Tools aus.
> 2. **Workflows:** Es gibt keinen fiktiven „Autonomous Flow“ – standardisierte Abläufe laufen über **SAP Build Process Automation** oder Workflow-Engines wie **n8n**.
> 3. **Single-Turn:** Was Zwingmann historisch als „Assistant“ bezeichnete, ist in SAP ein reiner zustandsloser Single-Turn Aufruf über den **SAP GenAI Hub** oder **SAP DOX**.

