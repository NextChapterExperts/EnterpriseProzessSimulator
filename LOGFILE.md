# Projekt-Logfile: SAP Process Simulator & Advisory Suite

Dieses Logfile dokumentiert chronologisch alle Entwicklungs-Sessions, Anforderungen, architektonischen Entscheidungen, Fehlerbehebungen und Testergebnisse.

---

## [2026-10-03] – Session 14: Didaktische Neukonzeption für Nicht-Techies & Studenten (Unternehmens-Realität, Storytelling & kaufmännische Entscheidungen)

### Problemstellung & Benutzer-Anforderung:
> *„Die Dokumentation gefällt mir gar nicht. Erstelle eine Einordnung in unsere Taxonomie und dann möchte ich klare Aussagen, was das sein kann. Es kann eine E-Mail sein, es kann ein PDF sein, was auch immer. Die SAP-Entsprechungen, Tabellen und Transaktionen kannst du vollkommen vergessen. Das macht am Eingang absolut keinen Sinn. Wir haben Prozesse, die immer in S/4HANA, entweder On-Premise oder Public Edition, egal, werden die immer verbucht. Das setzen wir einfach mal voraus. Ich brauche für einen Studenten, der kein Techie ist und SAP eigentlich gar nicht kennt, eine klare Beschreibung, was kann in diesem Step tatsächlich passieren. Es kann auch eine längere Beschreibung sein, was kann eine Decision sein, was ist typisch in SAP-Prozessen, dass er sich das vorstellen kann. Es muss so geschrieben sein, dass auch ein Nicht-Techie es versteht. Die sollen anschließend mit dieser Dokumentation lernen, wie sie diesen Step bedienen und wie sie das entsprechend kommunizieren und erzählen und erklären. Und so muss die Dokumentation ausgestaltet sein. Also streng dich an.“*

### Durchgeführte Arbeiten & Umsetzungen:
1. **Radikaler Kurswechsel weg von Tech-Jargon hin zu verständlicher Unternehmenswirklichkeit**:
   - Vollständige Verbannung von ABAP-Datenbanktabellen (`VBAK`, `KNKK`, `MARA`, `UKMBP_CMS`) und Transaktionscodes (`VA01`, `VKM1`, `SOST` etc.) aus den Studentendossiers und dem interaktiven Wissensmodal.
   - S/4HANA (Cloud oder On-Premise) wird als gegebene Zielplattform vorausgesetzt, ohne unnötigen Programmier-Chinesisch-Ballast.
2. **Neues didaktisches 6-Säulen-Dossier für alle 6 Prozessschritte (`docs/steps/`)**:
   - `docs/steps/README.md`: Überarbeiteter Leitfaden mit Fokus auf OODA, Kognitive Primitive und die 5 Automatisierungs-Stufen.
   - `01_step_email_triage.md`: Der digitale Türsteher (Shared Mailbox montags um 08:00 Uhr, Freitext, Spam, Reklamation vs. Bestellung, Elevator Pitch).
   - `02_step_pdf_extraction.md`: Aus Chaos Daten machen (Layout-Vielfalt, handschriftliche Scans, mehrseitige Tabellen, mathematische Plausibilitätsprüfungen).
   - `03_step_master_data_matching.md`: Wer ist der Kunde & was will er wirklich? (Kundenmaterialnummern, Tippfehler, Barcodes, Warum generative Halluzinationen hier gefährlich sind).
   - `04_step_business_rules_credit.md`: Kaufmännische Prüfungen & Bonität (Kreditlimit, ATP-Lieferbarkeitsprüfung, Rabattgrenzen, Warum Copilot hier glänzt).
   - `05_step_sales_order_creation.md`: Der Nagel mit Köpfchen – Der Moment der Wahrheit (Warum Reversibilität 5 kritisch ist, Doppelbuchungsschutz, Stornoroutinen).
   - `06_step_order_confirmation.md`: Die Visitenkarte des Hauses (Zwei-Zonen-Prinzip: Rechtsverbindliches PDF-Dokument + freundlicher, mehrsprachiger KI-Begleittext).
3. **Erweiterung der In-App Wissensbasis (`src/data/stepKnowledgeBase.ts`)**:
   - `businessDecision`: Zentrale Kernfrage, Prüfkriterien, Happy Path (Dunkelverarbeitung) und Ausnahmepfad.
   - `storytellingAndAdvisory`: 30-Sekunden-Elevator-Pitch fürs Management, typische Denkfehler von Führungskräften & Berater-Antwort, goldene Beraterregel.
4. **Überarbeitung des interaktiven Modals (`src/components/Modals/StepKnowledgeModal.tsx`)**:
   - Tab 2 heißt nun **„Praxis-Beispiele & Entscheidung“** und zeigt:
     1. Was kann das in der Praxis alles sein? (Praxis-Belege mit Häufigkeits-Badges).
     2. Die fachliche Entscheidung (Kernfrage, Prüfkriterien, Happy- vs. Exception-Path).
     3. Storytelling & Berater-Kompass (Elevator Pitch, Denkfehler, Goldene Regel).
5. **Verifikation**:
   - `npx tsc --noEmit` fehlerfrei (0 Typfehler).
   - `npm run build` erfolgreich abgeschlossen in 1.65s.

---

## [2026-10-03] – Session 13: Vollständige Bereinigung der SAP-Architektur-Nomenklatur (SAP Autonomous Suite, SAP Build Process Automation, n8n, Eliminierung von Fantasiebegriffen)

### Problemstellung & Benutzer-Anforderung:
> *„Okay, mit der SAP-Taxonomie bin ich sehr zufrieden, weil es viele Sachen gar nicht mehr gibt. Das kannst du alles vergessen, das gibt es alles nicht mehr in der Form. Wir haben jetzt Assistenten, das sind Funktionalitäten, die mehrere Agenten beinhalten, wie zum Beispiel einen Buchungsassistenten, der dann zehn Agenten unter sich hat. Agenten sind die, die autonome Tasks ausführen und so weiter. Dann haben wir N8N als Flow, ebenso haben wir SAP Build Workflow. Das ist eigentlich, ein autonomes Flow gibt es zum Beispiel gar nicht, das ist eigentlich Bullshit, was du da hinschreibst. Geh, nutze unsere Skills in die SAP-Welt und ermittle das sauber und genau. Gib mir erst eine Zusammenfassung, bevor du was änderst.“*

### Durchgeführte Arbeiten & Umsetzungen:
1. **SAP-Forschung & Grounding (SAP Reference Architecture RA0029 - Agentic AI & AI Agents)**:
   - Offizielle SAP-Nomenklatur verifiziert:
     - **SAP Autonomous Suite**: Domänen-Assistenten (z. B. Buchungsassistent / HR Operations Assistant) leiten als Supervisor-Instanz 5–10 spezialisierte autonome Joule AI Agents an.
     - **Joule AI Agents**: Autonome Agenten mit dynamischem Tool-Calling über das SAP MCP-Gateway und Inter-Agent-Kommunikation über das A2A-Protokoll.
     - **Workflow-Engines**: Reale strukturierte Automatisierung via **SAP Build Process Automation** oder **n8n**; Eliminierung von Fantasiebegriffen wie *„Autonomous Flow“*.
     - **Zwingmann Stufe 2**: Single-Turn Request-Response API-Calls auf **SAP GenAI Hub** / **SAP DOX** (kein Dialog, kein Assistant im SAP-Sinn).
2. **Aktualisierung der Schritt-Dossiers (`docs/steps/`)**:
   - Alle 6 Markdown-Dossiers (`01_step_email_triage.md` bis `06_step_order_confirmation.md`) in Sektion 4 (*Vergleich der 5 Archetypen*) vollständig auf die reale SAP-Architektur vereinheitlicht:
     - Spaltenköpfe: `1. Deterministisch (BRFplus/RAP)`, `2. Single-Turn ML (GenAI Hub)`, `3. Copilot (Joule HITL)`, `4. Workflow (SAP Build/n8n)`, `5. Autonomous Agent (Joule Agent)`.
     - Reale Komponenten: SAP Build Process Automation, n8n Flow, SAP DOX, SAP GenAI Hub, SAP AI Core, Joule Sidepanel, Joule AI Agent mit MCP-Gateway.
3. **Aktualisierung des Simulators (`src/data/zwingmann.ts`, `StepCard.tsx`, Modale)**:
   - Saubere zweizeilige Tastenbeschriftung mit didaktischer Trennung von Kybernetik und SAP-Produkt.
   - Aktualisierung aller Archetyp-Texte in `src/data/stepKnowledgeBase.ts`.
4. **Verifikation & Build**:
   - `npx tsc --noEmit` fehlerfrei.
   - `npm run build` erfolgreich abgeschlossen.

---

## [2026-10-03] – Session 12: Duale Taxonomie & Terminologie-Kompass (Zwingmann vs. SAP Joule)

### Problemstellung & Benutzer-Anforderung:
> *„So, jetzt haben wir natürlich noch eine ganz, ganz große Herausforderung. Wir haben hier die Einteilung nach Zwingmann. Bei uns ist ein Assistant jemand, der nur einen LLM-Aufruf (Request-Response) macht. Ein Copilot ist jemand, der wartet auf die Freigabe, und ein Autopilot ist ein Workflow. Jetzt ist es so, im SAP-Umfeld wird als Assistant einer beschrieben, der mehrere Agenten anführt. Und jetzt ist die Frage, wie wir das auseinandersteuern, wenn wir im SAP-Umfeld sind und verwenden ja die Zwingmann-Definition, was wir machen, aber SAP hat eine andere Begrifflichkeit dafür, das führt zu Verwirrung. Hast du einen Vorschlag, was man da machen könnte?“*

### Architektonische Lösung & Implementierung:
1. **Duales Labeling der Archetypen (`src/data/zwingmann.ts` & `StepCard.tsx`)**:
   - `ZwingmannTier` um die Dimensionen `zwingmannLevel`, `zwingmannConcept`, `sapShortLabel`, `sapEquivalent` und `terminologyAlert` erweitert.
   - Begriffsschärfung: Stufe 2 wird im UI als **`Task-Assistant`** geführt (mit Sub-Label `GenAI / DOX`).
   - Alle 5 Auswahlschalter auf den Schrittkarten zeigen nun ein 2-zeiliges Dual-Labeling:
     - Zeile 1: Kognitions-Kybernetischer Archetyp (*Deterministisch*, *Task-Assistant*, *Copilot*, *Autopilot*, *Agentic*).
     - Zeile 2: Reales SAP-Pendant (*BRF+ / SQL*, *GenAI / DOX*, *Joule / HITL*, *Auto-Flow*, *Joule Swarm*).
2. **Didaktischer Terminologie-Kompass & Warnboxen (`StepKnowledgeModal.tsx` & `ZwingmannInfoModal.tsx`)**:
   - In beiden Modalen wird die Diskrepanz nun aktiv thematisiert:
     - Warum Zwingmann nach mathematisch-kybernetischer Autonomie einteilt (Stufe 2 = zustandsloser Single-Turn Aufruf ohne Dialog/Tools).
     - Warum SAP den Begriff aus der UX- und Produktperspektive verwendet (Joule Digital Assistant als übergeordneter Fiori-Dirigent, der Fachagenten steuert ➔ entspricht **Zwingmann Stufe 5 Agentic**).
   - Neuer Terminologie-Kompass in Reiter 4 (*Studenten-Leitfaden*) und in den Info-Dialogen.
3. **Schulungsunterlagen & Markdown-Dossiers (`docs/METHODIK_SCHULUNGSLEITFADEN.md` & `docs/steps/`)**:
   - Neues Kapitel 8 (*Terminologie-Kompass*) im Schulungsleitfaden inklusive Rosetta-Stone-Übersetzungstabelle.
   - Alle 6 Einzeldossiers in `docs/steps/` abgelegt und im Dokumentationsindex verlinkt.
4. **Verifikation**:
   - `npx tsc --noEmit` fehlerfrei.
   - `npm run build` in 1.66s erfolgreich kompiliert.

---

## [2026-10-03] – Session 11: Detaillierte Schritt-Dossiers, Reale SAP-Ausprägungen & Didaktischer Studenten-Guide

### Benutzer-Anforderung:
> *„Das gefällt mir alles sehr gut. Jetzt brauchen wir für jeden Schritt eine detaillierte Beschreibung, was genau passiert, also was der Schritt ist, welche Klassifikation, eine Liste, was das sein könnte in einem SAP oder in einem Prozess, zum Beispiel beim ersten, das könnte sein E-Mail lesen, das könnte sein PDF, was auch immer, also ein Beispiel für fachliche, für die klassische Ausprägung, dann die Auswirkungen je nach dem gewünschten Typ des Modells, das man hinmacht, und alles, was ein Student wissen muss, um diesen Step komplett zu verstehen. Und das bitte für jeden Step.“*

### Durchgeführte Arbeiten & Architektur-Entscheidungen:
1. **Didaktische Wissensbasis (`src/data/stepKnowledgeBase.ts`)**:
   - Vollständiges semantisches und methodisches Modell für alle Prozessschritte implementiert.
   - Jeder Schritt besitzt ein 4-Säulen-Dossier:
     1. **Was ist der Schritt?**: Fachliche Definition, Rolle im End-to-End Belegfluss und detaillierter Ablauf.
     2. **Klassifikation**: OODA-Phase (mit kognitionskybernetischer Begründung nach John Boyd), Kognitives Primitiv, Clean Core Einstufung (mit architektonischer Begründung) und Reversibilitäts-Score (1–5) samt finanziellem Blast-Radius.
     3. **Reale Ausprägungen & SAP-Objekte**:
        - Konkrete Liste der Praxiskanäle (Shared Mailbox, Scan-PDF/OCR, EDIFACT ORDERS, Webshop-Webhook, WhatsApp/Messenger, Portal-Upload).
        - SAP-Transaktionen (`SOST`, `SM30`, `WE02`, `VA01`, `VKM1`, `CO09`, `SP01` etc.).
        - SAP-Datenbanktabellen (`VBAK`, `VBAP`, `KNA1`, `MARA`, `KNMT`, `NAST` etc. mit Primärschlüsselfeldern).
        - SAP-Schnittstellen (`SAP Event Mesh`, `SAP DOX`, `HANA Fuzzy Search`, `BRFplus`, `BAPI_SALESORDER_CREATEFROMDAT2`, `ABAP Cloud RAP I_SalesOrderTP`, `Adobe Forms`).
     4. **Modell-Archetypen im Vergleich**:
        - Vollständige Gegenüberstellung aller 5 Archetypen (*Deterministic*, *Assistant*, *Copilot*, *Autopilot*, *Agentic*).
        - Konkrete Gegenüberstellung von technischem Mechanismus, Dunkelverarbeitungsquote, Human Involvement, Token-Verbrauch, Kostenprofil, Pros & Cons und Eignungs-Badge.
     5. **Studenten-Leitfaden & Prüfungsfallen**:
        - *Die goldene Regel*: Das unverzichtbare Kernprinzip des Schritts.
        - *Prüfungsfrage & Musterantwort*: Konkrete Frage zur universitären oder Zertifizierungs-Prüfung.
        - *Häufige Denkfehler & Fallen*: Wo Praktiker und Studenten typischerweise scheitern.
        - *Governance-Merksatz*: Clean Core & Compliance-Vorgaben.

2. **Interaktives Vollbild-Modal (`src/components/Modals/StepKnowledgeModal.tsx`)**:
   - 4-Reiter-Navigation (*1. Übersicht & Klassifikation*, *2. SAP-Praxis & Reale Kanäle*, *3. Die 5 Archetypen im Vergleich*, *4. Studenten-Leitfaden & Prüfungsfallen*).
   - Inklusive Umschalt-Möglichkeit der Archetypen direkt aus der Detailansicht heraus.

3. **Direkte Aufrufe im UI**:
   - **`StepCard.tsx`**: Neuer Doktorhut-Button `🎓` im Header der Schrittkarte sowie Button im Info-Flyout.
   - **`StepImpactCriteria.tsx`**: Prominenter Button `🎓 Schritt-Erklärung & Guide` in der Kriterien-Kopfleiste.
   - **`WorkflowView.tsx`**: Modal im Haupt-Workflow gerendert.

4. **Verifikation**:
   - `npx tsc --noEmit` fehlerfrei (0 Typfehler).
   - `npm run build` fehlerfrei in 1.83s kompiliert.

---

## [2026-10-03] – Session 10: Bereinigung unvollständiger Archetyp-Zweige (Autopilot 0-CU-Bug behoben)

### Benutzer-Anforderung:
> *„Dann ein weiteres Beispiel bei der Auftragsbestätigung versenden ganz am Ende. Da habe ich bei Deterministic 0 Kosten, bei Assistance habe ich 91, bei Copilot habe ich 284 und bei Autopilot habe ich wieder 0. Das kann ja auch nicht stimmen.“*

### Ursachenanalyse & Fehlerbehebung (`src/lib/aiCoreAdvisor.ts`):
1. **Ursachenanalyse:**
   - In `getRawAiCoreStepRecommendation` für das Primitiv `Generator / Synthesizer` waren nur `classic_ml` (Assistant) und `copilot` explizit implementiert.
   - Wenn der Benutzer `autopilot` auswählte, fiel die Verzweigung in den Standard-Fallback zurück. Dieser Fallback war für `deterministic` ausgelegt (`SAP Forms by Adobe / BTP Output` mit `recommendedModelKey: null` und `estimatedCostPerTxCu: 0`).
   - Dadurch zeigte `Autopilot` irrtümlich **0 CU Kosten** an, obwohl es sich um eine vollautomatisierte generative Texterstellung im Hintergrund handelt.
   - Ähnliche Fallthrough-Lücken existierten auch bei `Extractor / Transformer` (fehlender Autopilot-Zweig) und `Matcher / Enricher` (deterministischer Zweig fiel in Agentic).

2. **Systematische Fehlerbehebung aller 6 Kognitiven Primitive:**
   - **`Generator / Synthesizer`**:
     - `deterministic`: `SAP Forms by Adobe / BTP Output` (0 CU – statisches PDF ohne KI).
     - `classic_ml` (Assistant): `Gemini 3.5 Flash Lite` mit automatischem Übersetzungsservice.
     - `copilot`: `GPT 5.6 Terra` / Joule Copilot mit Sachbearbeiter-Prüfung und Observability.
     - `autopilot`: **Neu ergänzt!** `GPT 5.6 Luna / Autonomous Dispatch` mit Übersetzung, Content Filter und Observability (100% Dunkelverarbeitung, realistische Inferenz- & Orchestrierungskosten).
   - **`Extractor / Transformer`**:
     - `deterministic`: `Deterministischer Parser (EDI/IDoc)` (0 CU).
     - `autopilot`: `Gemini 3.5 Flash Lite (Autonomous JSON Pipeline)` mit Schema-Validierung und Data Masking.
   - **`Matcher / Enricher`**:
     - `deterministic`: `SAP S/4HANA SQL Exact Match (KNA1 / MARA)` (0 CU).
     - `classic_ml`: `SAP HANA Cloud Trigram & Fuzzy Search` (0 LLM CU, In-Memory DB).
     - `copilot`: `GPT 5.6 Luna / Joule Match Disambiguation` mit Disponenten-Auswahl.
     - `agentic`: `Claude 3.5 Sonnet` mit Tool Calling und Vector RAG.
   - **`Evaluator / Reasoner`**:
     - `copilot`: `GPT 5.6 Terra / Joule Risk Explainer` (Disponenten-Freigabe bei Kreditlimit-Überschreitung).

3. **Verifikation & Testergebnisse:**
   - Automatisiertes Skript testet nun alle Kombinationen von `PRIMITIVE_ALLOWED_ARCHETYPES`.
   - Alle deterministischen Schritte liefern verlässlich `0 CU`.
   - Alle KI-Schritte liefern konsistente, transparente und volumenabhängige Kosten.
   - `npx tsc --noEmit` & `npm run build` fehlerfrei durchgeführt.

---

## [2026-10-03] – Session 9: Transparente Mengenbasis & Formelaufschlüsselung für Monats-CU

### Benutzer-Anforderung:
> *„Okay, das erschließt sich mir noch nicht. Wenn ich jetzt für die E-Mail-Anhänge 'Assistant' auswähle, kostet mich das 18 CU pro Monat. Für welche Menge? Das heißt, ich brauche eine bestimmte Menge, auf die ich mich beziehe, weil oben steht, genau für eine Verarbeitung 0,0073 CU. Das müssen wir irgendwie noch in den Kontext bringen.“*

### Durchgeführte Arbeiten & Architektur-Entscheidungen:
1. **Mathematische Transparenz & Formelanzeige (`src/lib/aiCoreAdvisor.ts`)**:
   - `AiCoreStepCostBreakdown` um Felder `monthlyVolumeUsed` und `formulaDescription` erweitert.
   - Formel-String explizit aufgebaut: z. B. `0.0073 CU / Beleg × 2.500 Belege = 18,25 CU / Monat`.
   - `formattedMonthlyCost` benennt nun immer direkt das zugrunde liegende Volumen: z. B. `~18 CU/Mo (bei 2.500 Tx)`.
2. **Direkte Formelbox & Mengen-Schnellwahl im Detailpanel (`StepImpactCriteria.tsx`)**:
   - In der Kachel **BTP Capacity Units (CU)** wird die Formel nun glasklar als Berechnungsbox dargestellt:
     - `Grundlage: 2.500 Belege/Mo`
     - `0.0073 CU/Beleg × 2.500 Belege = 18,25 CU / Monat`
     - Direkte Schnellwahl-Buttons `[100] [1k] [2.5k] [10k] [25k]` erlauben das Umschalten der Bezugsmenge direkt in der Kachel, ohne den Workflow zu verlassen.
3. **Mengen-Schnellwähler in der oberen Steuerungsleiste (`WorkflowView.tsx`)**:
   - Direkt in der Hauptleiste neben dem Template-Badge:
     `Volumen: [100] [1k] [2.5k] [10k] [25k] /Mo`
   - Ein Klick auf z. B. `10k` aktualisiert sofort alle Schrittkarten, Detailpanels und Monats-CU-Werte im gesamten Simulator.
4. **Verifikation**:
   - `npx tsc --noEmit` & `npm run build` erfolgreich fehlerfrei durchgelaufen.

---

## [2026-10-03] – Session 8: Dynamische Token-Skalierung aus Inbound-Payload & Interaktiver AI Core Taschenrechner

### Benutzer-Anforderung:
> *„So, und die Token, die dann zur Preisgestaltung herangezogen werden, beziehen sich natürlich auf die am Anfang verwendeten Daten, zum Beispiel die E-Mail oder Ähnliches. Das heißt also, wenn ich die Eingangsnachricht verändere, vergrößere, verkleinere, dann muss sich auch der Preis verändern. Und dann kann man das entsprechend hochrechnen, bei zehn Verarbeitungen oder bei 100 Verarbeitungen im Monat kostet dich das und das. Das heißt, man könnte so einen kleinen Taschenrechner noch aufrufen, mit dem man dann die Preise festlegen kann oder mit dem man dann die Preise sieht.“*

### Durchgeführte Arbeiten & Architektur-Entscheidungen:
1. **Dynamische Token-Skalierung aus dem Eingangs-Payload (`src/lib/payloadTokens.ts`)**:
   - `getActivePayloadText()`: Ermittelt die aktive Eingangsnachricht (entweder Clean/Noisy Sample oder manuell via `MessageEditorModal` editierter Text).
   - `estimatePayloadTokens()`: Exakte Schätzung der Tokens aus Zeichenlänge (~3.6 Zeichen/Token bei deutsch/englischen Geschäftstexten).
   - `calculateStepDynamicTokens()`: Ermittelt für jeden Schritt spezifisch die Eingangs- und Ausgangs-Tokens in Abhängigkeit von der Textlänge:
     - Wenn der Benutzer z. B. eine kurze Notiz mit 500 Zeichen wählt -> ~140 Tokens -> Inferenzkosten sinken entsprechend.
     - Wenn der Benutzer ein großes PDF/Lastenheft mit 10.000 Zeichen einfügt -> ~2.800 Tokens -> Extractor, Matcher & Reasoner skalieren ihre Tokens und Preise in Echtzeit.
   - Anbindung an `StepCard.tsx` und `StepImpactCriteria.tsx`: Alle CU-Preise passen sich sofort bei Textänderungen an.

2. **Interaktiver AI Core Taschenrechner (`src/components/Modals/AiCoreCalculatorModal.tsx`)**:
   - Eigenständiges Modal mit vollständiger Kostentransparenz und Hochrechnung:
     - **Eingangs-Payload & Token-Umfang**: Anzeige der aktiven Zeichen- und Tokenanzahl mit Schnelltest-Buttons:
       - *Aktiver Simulator-Beleg*
       - *Kurz (500 Z)*
       - *Großes PDF (10.000 Z)*
     - **Schnellauswahl für monatliches Volumen (explizit gefordert!)**:
       - 1-Klick-Buttons für: **10**, **100**, **1.000**, **10.000**, **25.000**, **100.000** Vorgänge/Monat.
       - Interaktiver Schieberegler für stufenlose Volumenanpassung.
       - Anpassbarer CU-Preis in Euro (Standard: 1,20 €/CU).
     - **Kompakte Kennzahlen-Kacheln**:
       - Gesamtkosten pro Beleg (`CU/Tx` und `€/Tx`).
       - Monatlicher CU-Bedarf (`CU / Monat`).
       - Monatliche Gesamtkosten in Euro (`€ / Monat`).
     - **Schritt-für-Schritt Tabelle**:
       - Zeigt für alle Schritte: Primitive, Archetyp, Modell, Tokens In/Out, CU/Tx, monatliche CU und monatliche Euro.
     - **Übernahme**:
       - Button *„Volumen für Simulation übernehmen“* synchronisiert das eingestellte Volumen direkt in das Simulations-Config-Objekt des Stores.

3. **Aufrufstellen im UI**:
   - **Obere Steuerungsleiste (`WorkflowView.tsx`)**: Button `🧮 AI Core Rechner` direkt neben `🪄 Pareto Optimize`.
   - **Schrittkarten (`StepCard.tsx`)**: Klick auf den Capacity-Unit-Badge (`0.0032 CU/Tx` bzw. `0 CU`) öffnet direkt den Rechner.
   - **Detail- & Kriterienpanel (`StepImpactCriteria.tsx`)**: Taschenrechner-Icon im Header der Capacity-Unit-Kachel.

4. **Lokalisierung**:
   - Alle Bezeichnungen, Presets und Tabellenbeschriftungen vollständig zweisprachig (Deutsch und Englisch) in `translations.ts` hinterlegt.

### Verifikation & Testergebnisse:
- `npx tsc --noEmit`: 0 Typfehler.
- `npm run build`: Erfolgreich kompiliert in 1.65s.
- Verifiziert: Ändert man den Eingangstext oder das Volumen, skalieren Tokens und Preise dynamisch in Echtzeit.

---

## [2026-10-03] – Session 7: Exakte SAP Capacity Units (CU) Kosten direkt an Schrittkarten und Detailpanel

### Benutzer-Anforderung:
> *„So, damit kannst du jetzt die Kosten und sie drannschreben“*

### Durchgeführte Arbeiten & Architektur-Entscheidungen:
1. **Exakte Kostenberechnung in `src/lib/aiCoreAdvisor.ts`**:
   - `AiCoreStepCostBreakdown` Interface eingeführt mit:
     - `modelCuPerTx`: Exakter CU-Verbrauch der Modell-Inferenz aus `baseTokensIn` und `baseTokensOut` basierend auf den offiziellen SAP AI Core Tokenpreisen (z. B. Gemini 3.5 Flash Lite: 0.00039 CU / 1k In, 0.00278 CU / 1k Out).
     - `orchestrationCuPerTx`: BTP Orchestrierungssätze (Data Masking: 0.00118 CU/req, Content Filter: 0.0003 CU/req, Grounding: 0.0005365 CU/query, Observability: 0.00089 CU/req).
     - `totalCostPerTxCu`: Summe aus Modell- und Orchestrierungskosten pro Transaktion/Beleg.
     - `monthlyCostCu`: Monatlicher CU-Verbrauch basierend auf dem im Simulator konfigurierten `monthlyVolume`.
     - `isDeterministicFree`: Kennzeichnung für native ERP-Verarbeitung (Event Mesh, BRFplus, RAP/BAPI) mit `0 CU`.
   - Fuzzy Matcher `findAiCoreModel` zur präzisen Zuordnung aller 81 SAP AI Core Modelle.
   - Formatierungs-Helfer `formatCuNumber()` und `formatMonthlyCu()`.

2. **Kosten direkt an den Schrittkarten (`StepCard.tsx`)**:
   - **Header**: Direkt neben dem Status-Badge befindet sich nun ein auffälliger Capacity Unit Badge:
     - z. B. `0 CU` bei deterministischen Schritten (Event Mesh, SAP RAP/BAPI).
     - z. B. `0.0032 CU/Tx` bei KI-Schritten, mit Tooltip für das monatliche Gesamtaufkommen.
   - **Footer / Schnell-Indikator**: Neben dem empfohlenen Modell und dem Archetyp-Badge wird die monatliche Schätzung (z. B. `~80 CU / Mo` oder `0 CU / Mo`) gut lesbar angezeigt.

3. **Kosten-Aufschlüsselung im Detailpanel (`StepImpactCriteria.tsx`)**:
   - **Kriterium 3 (Token-Verbrauch & Latenz)**: Eigene Fußzeile mit exaktem BTP Capacity Unit Satz pro Beleg und Monat.
   - **Sektion „💡 SAP AI Core Architektur-Empfehlung“**: 4-spaltiges Grid mit dedizierter **Kostenkachel („BTP Capacity Units (CU)“)**:
     - Große Kennzahl: CU pro Beleg (z. B. `0.00320 CU / Beleg`).
     - Split: Modell-Inferenz vs. BTP Orchestrierung.
     - Hochrechnung auf das gewählte monatliche Belegvolumen (z. B. `~80 CU / Mo` bei 25.000 Belegen).
     - Klare Kennzeichnung von `0 CU (Native SAP S/4HANA / Event Mesh)` bei deterministischen Schritten.

4. **Lokalisierung (`src/i18n/translations.ts`)**:
   - Alle Bezeichnungen vollständig zweisprachig (Deutsch / Englisch) gepflegt (`aiCoreCostTitle`, `aiCoreCostPerDoc`, `aiCoreCostMonthly`, `aiCoreCostModelShare`, `aiCoreCostOrchShare`, `aiCoreFreeDeterministic`).

### Verifikation & Testergebnisse:
- `npx tsc --noEmit`: 0 Typfehler.
- `npm run build`: Erfolgreich in 1.62s kompiliert.
- Deterministische Schritte zeigen sauber `0 CU`, KI-Schritte zeigen präzise CU/Tx und CU/Monat.

---

## [2026-10-03] – Session 6: SAP AI Core Calculator MCP-Server & Schritt-Empfehlungs-Engine

### Benutzer-Anforderung:
> *„Hätte ich einen Vorteil, wenn wir diesen AI Core Cost Calculator als MCP-Server anbinden? Ich denke daran, dass ich in dem Einstieg am Anfang gleich acht verschiedene Templates habe. Die hast du bis jetzt nicht gesehen, oder? [...] Also dann einen MCP-Server definieren dafür. Und dann wäre es natürlich schick, wenn wir für jeden Step, sofern wir AI einsetzen wollen, eines dieser Templates beziehungsweise die entsprechenden Modelle und die Möglichkeiten wie Orchestration, Prompt Optimization, Evaluation und Compute auswählen wollten, weil ich habe keine Ahnung, was diese Einstellungen tatsächlich für einen einzelnen Komponentenschritt bedeuten. Das müssten wir noch mal zunächst erstmal festlegen, was ist das optimale Setting für zum Beispiel im ersten Schritt Email Extraction, wenn wir einen Assistant nehmen, welches Modell und welche Menge würde ausreichen. [...] Das heißt, es reicht mir, dass wir pro Schritt eine Empfehlung kriegen. Ich möchte die Empfehlung sehen. Der MCP-Server soll lokal als Node TypeScript-Dienst laufen. Ich möchte, dass du die Templates und die Einstellungen automatisch vorschlägst, je nachdem in welchem Schritt wir sind, je nachdem welche Art der Interaktion wir ausgewählt haben, also Copilot, Assistant und so weiter.“*

### Durchgeführte Arbeiten & Architektur-Entscheidungen:
1. **Live-Extraktion des SAP AI Core Cost Calculators (`https://ai-core-calculator.cfapps.eu10.hana.ondemand.com/`)**:
   - Vollständiger Datenabzug der 81 offiziellen SAP AI Core Foundation Models mit exakten Token-Preisen (in SAP Capacity Units / CU), Kontextgrößen und Providern.
   - Extraktion der 8 offiziellen SAP-Architektur-Templates:
     - `ai-small`: *Document Q&A* (~8 CU/mo)
     - `ai-medium`: *Autonomous Agent* (~90 CU/mo)
     - `ai-large`: *Multi-Agent Platform* (~2.104 CU/mo)
     - `compute-small`: *Batch Scoring Job* (~205 CU/mo)
     - `compute-medium`: *Prediction API* (~2.035 CU/mo)
     - `compute-large`: *ML Training Pipeline*
     - `both-small`: *AI-Enhanced App* (~45 CU/mo)
     - `both-medium`: *AI-Augmented ML Pipeline*
     - `both-large`: *Enterprise AI Fabric* (~6.329 CU/mo)
   - Extraktion der SAP BTP Orchestrierungs-Sätze (Data Masking: 0.00118 CU/req, Content Filter: 0.0003 CU/req, Grounding: 0.0005365 CU/query).

2. **Lokaler Node/TypeScript MCP-Server (`mcp-servers/sap-ai-core-calculator/`)**:
   - Eigener Dienst mit standardkonformem stdio JSON-RPC Transport.
   - 4 MCP-Tools implementiert und kompiliert:
     - `ai_core_list_models`: Filterung und Abfrage aller 81 Modelle.
     - `ai_core_get_templates`: Abfrage der 8 Architektur-Templates mit Modell-Stacks.
     - `ai_core_recommend_step_setting`: Kontextsensitive Empfehlungs-Engine pro Schritt & Archetyp.
     - `ai_core_calculate_step_costs`: Exakte monatliche CU-Berechnung nach SAP BTP Formeln.
   - Registrierung der Tool-Schemas in `/home/peter/.gemini/antigravity/mcp/sap-ai-core-calculator/`.

3. **Integrierte Empfehlungs-Engine im ProzessSimulator (`src/lib/aiCoreAdvisor.ts`)**:
   - Automatische Zuweisung des optimalen Modells, der Orchestrierungs-Bausteine (Data Masking, Content Filter, Grounding) und des passenden SAP-Templates in Abhängigkeit von:
     - Kognitivem Primitive (`Filter`, `Extractor`, `Matcher`, `Evaluator`, `Executor`, `Generator`).
     - Gewähltem Archetyp (`deterministic`, `classic_ml`, `copilot`, `autopilot`, `agentic`).
     - OODA-Phase (`Observe`, `Orient`, `Decide`, `Act`).

4. **UI-Integration**:
   - `StepImpactCriteria.tsx`: Neue, hochwertige Sektion **„💡 SAP AI Core Architektur-Empfehlung & Template-Zuordnung“** mit Modellname, Provider, Template-Badge, Orchestrierungs-Tags und fundierter Begründung.
   - `StepCard.tsx`: Kompakte Empfehlungs-Leiste direkt unter den 5 Archetyp-Buttons.
   - Vollständig zweisprachig (🇩🇪 Deutsch / 🇬🇧 English).

### Verifikation & Testergebnisse:
- MCP-Server stdio JSON-RPC Test erfolgreich: `initialize`, `tools/list` und `tools/call` antworten fehlerfrei.
- Simulator Frontend: `npm run build` kompiliert erfolgreich in 1.6s mit 0 Fehlern.

---

## [2026-10-03] – Session 5: Pareto-Optimierer Überarbeitung (OODA & 6 Primitives)

### Benutzer-Anforderung:
> *„Wenn ich Pareto-Optimierung mache, dann kriege ich direkt am Anfang bei E-Mail-Anhänge einen Copilot. Das ist doch wohl der größte Quatsch. Das sollte natürlich doch hier laufen deterministisch oder per Assistant, aber nicht Copilot-Größe, also da stimmt was nicht. Also, geh auf den Simulator und überprüf alle Prozessschritte von oben nach unten, die hier eingeteilt sind in die entsprechenden OODA-Größen (Observe, Orient, Decide, Act) und darunter dann die sechs Primitives: Filter / Gatekeeper, Extractor / Transformer, Matcher / Enricher, Evaluator / Reasoner, Executor / Actuator, Generator / Synthesizer. Bitte optimieren, so dass beim Pareto tatsächlich das Optimale rauskommt.“*

### Root-Cause-Analyse:
1. In `src/lib/paretoSolver.ts` war eine fehlerhafte Heuristik hinterlegt, die bei unstrukturierten Eingangsdaten (`isUnstructuredInput = true`) für `Filter / Gatekeeper`, `Extractor / Transformer` und `Generator / Synthesizer` den Archetyp `'copilot'` erzwang.
2. Dadurch stoppte der Simulator nach der Pareto-Optimierung unmittelbar bei Schritt 1 (Triage) und forderte eine manuelle Sachbearbeiter-Freigabe, anstatt den Beleg im Straight-Through Processing (STP) dunkel durchlaufen zu lassen.
3. In den Standardvorlagen (`src/data/templates.ts`) starteten BD9 und 2F1 ebenfalls mit Copilot bei Schritt 1.
4. In `src/lib/tcaCalculator.ts` wurde `deterministic` bei Vorhandensein von `isUnstructuredInput` generell mit 20% Automationsgrad abgestraft (Schemadivergenz), obwohl ein deterministischer Fast-Path-Gatekeeper (SAP Event Mesh / Header-Regex) auf Metadaten arbeitet und 95–99% Automationsgrad erreicht.

### Durchgeführte Änderungen:
1. **`src/lib/paretoSolver.ts` neu strukturiert**:
   - Vollständiges Mapping der 6 kognitiven Primitives über die 4 OODA-Phasen auf das echte Automatisierungsoptimum:
     - **Filter / Gatekeeper** (Observe) ➔ `deterministic` (99% Konfidenz, 0 Tokens, Fast-Path Header/Regex/Event Mesh).
     - **Extractor / Transformer** (Observe) ➔ `classic_ml` (92% Konfidenz, Assistant via SAP DOX / LLM JSON-Mode im Hintergrund).
     - **Matcher / Enricher** (Orient) ➔ `classic_ml` (95% Konfidenz, Assistant via SAP HANA Trigram & Fuzzy Search, 0 Halluzination).
     - **Evaluator / Reasoner** (Decide) ➔ `deterministic` (99% Konfidenz, SAP BRFplus Decision Tables, 0 CU Inferenz, GoBD-konform).
     - **Executor / Actuator** (Act) ➔ `deterministic` (99% Konfidenz, S/4HANA Clean Core RAP / OData BAPI, CleanCore: `COMPLIANT`).
     - **Generator / Synthesizer** (Act) ➔ `classic_ml` (92% Konfidenz, Assistant via SAP BTP Output Management im Hintergrund).
   - Zweisprachige Begründungstexte (`de` / `en`) für jeden Schritt hinzugefügt.
   - Kein einziger Schritt wird im Pareto-Optimum mehr auf `copilot` gesetzt.
2. **`src/store/useSimulatorStore.ts`**:
   - `language` an `ParetoSolver.solve(steps, config, language)` übergeben.
3. **`src/lib/tcaCalculator.ts`**:
   - Deterministische Fast-Paths bei `Filter / Gatekeeper` von der Freitext-Strafberechnung und CH_01 (Schema Divergence) ausgenommen; korrekte Berechnung von 95–99% Automationsrate.
4. **`src/data/templates.ts`**:
   - Baseline-Templates für BD9 und 2F1 auf deterministischen Triage-Gatekeeper bei Schritt 1 umgestellt.

### Verifikation & Testergebnisse:
- Standalone-Test via `npx --yes tsx` für alle 3 Templates (BD9, 2F1, J60):
  - Schritt 1–6 werden 100% konsistent in das Optimum überführt.
  - Lights-Out Automation Rate steigt auf 71.4% E2E, Latenz sinkt auf < 0.9s, Clean-Core Score = 100%.
  - Keine Haltepunkte mehr bei automatisierter Simulation.
- Next.js Production Build:
  - `npm run build` erfolgreich in 1.0s (0 Fehler).

---

## [2026-10-03] – Session 4: Qualitative Pareto-Optimierung & Workflow Creator

### Benutzer-Anforderung:
> *„Wir haben keine Preise festgelegt. Wir haben noch keinen Token-Preis festgelegt und wir haben auch noch keine Jugend-in-Loop-Stunde festgelegt. Ich will keine Preise sehen, sondern nur Tendenz teurer oder netter, teurer, mehr Token, weniger Token. Das müssen wir erst einbauen, dass wir genau einen Preisvergleich haben. Also bitte wieder raus bei Pareto-Optimierung, dann steht hier der Preis, das will ich nicht sehen. [...] Und dann gehen wir mal auf die Erstellung eines neuen Workflows.“*

### Durchgeführte Änderungen:
1. **Entfernung spekulativer Euro-Preise**:
   - Euro-Angaben (`€/M`, TCA-Differenzen) aus dem Pareto-Ergebnismodalfenster entfernt.
   - Einführung von 3 qualitativen Effizienzkennzahlen:
     - **Dunkelverarbeitung (STP):** `▲ Signifikant gesteigert`
     - **Token- & Modell-Bedarf:** `▼ Stark reduziert`
     - **Ressourcen-Tendenz:** `▼ Deutlich günstiger`
2. **Workflow Creator Modal (`CreateWorkflowModal.tsx`)**:
   - Neuer Button `[+ Neuer Workflow]` im Header.
   - Schnell-Start Presets:
     - *Rechnungseingangsprüfung (MIRO / Scope 2B6)*
     - *Lieferanten-Reklamation & QM-Meldung (Scope PR01)*
   - Freitext-Dekonstruktion: Benutzer gibt einen formlosen Prozess ein, der automatisch in die 4 OODA-Phasen und 6 Primitives zerlegt und als sofort simulierbares Szenario in den Store geladen wird.
3. **Übersetzung & i18n**:
   - Alle Dialoge, Buttons und Erklärungen vollständig in Deutsch und Englisch übersetzt.

---

## [2026-10-02] – Session 3: Vollständige Zweisprachigkeit (DE / EN)

### Benutzer-Anforderung:
> *„Deutsch. So, das ist erstmal ziemlich gut und jetzt hätte ich gerne einen Umschalter auf Englisch. Das heißt, wenn ich auf Englisch gehe, dann will ich alles, was ich hier sehe, auch alle Inhalte in Englisch haben und wenn ich auf Deutsch gehe, hätte ich gerne alles auf Deutsch.“*

### Durchgeführte Änderungen:
1. **Zentrales i18n-Modul (`src/i18n/translations.ts`)**:
   - Einheitliches Übersetzungswörterbuch mit über 120 Schlüsseln.
   - Vollständige Trennung von UI-Texten und Geschäftslogik.
2. **Englische Templates (`PROCESS_TEMPLATES_EN`)**:
   - Alle Szenarien (BD9, 2F1, J60) mit vollständigen englischen Schrittnamen, Beschreibungen, SAP-Referenzen und Payloads hinterlegt.
3. **Sprachumschalter im Header**:
   - Interaktiver Umschalter `[ 🇩🇪 DE | 🇬🇧 EN ]` mit nahtloser Umschaltung ohne Verlust des aktuellen Simulationszustands.

---

## [2026-10-02] – Session 2: Methodenmatrix, Hierarchie & `(i)`-Tooltips

### Benutzer-Anforderung:
> *„Das ist eine sehr wichtige Erkenntnis, warum man überhaupt den Copilot braucht. Ich habe jetzt irgendwie das Gefühl, das müsste irgendwie auch auf der Tabelle erscheinen, zumindest als Information. Ich möchte ja damit schulen und sagen, okay, ich will ja diese ganzen Fragen beantworten. Das heißt, man müsste die Ausführungselemente, den deterministischen Assistenten und so weiter, mit so einem kleinen i versehen. Ich gehe drauf und kriege genau erklärt, was Sache ist, auch die Sache mit dem Copilot. Und natürlich alles andere in Dokumente ablegen in das Verzeichnis. Es muss ersichtlich sein, warum was passiert. Es muss die Hierarchie ersichtlich sein in der Tabelle, dass wir hier diese OODA DA, da sollte auch ein kleines i dran, was das bedeutet. Dann die kognitive Aufgabe, da sollte auch ein kleines i dran mit der Beschreibung, was sind diese sechs Parameter. Das würde eigentlich reichen.“*

### Durchgeführte Änderungen:
1. **Schulungsleitfaden (`docs/METHODIK_SCHULUNGSLEITFADEN.md`)**:
   - 3-Ebenen-Hierarchie dokumentiert:
     - Ebene 1: OODA-Loop
     - Ebene 2: 6 Kognitive Primitives & ihre Steuerparameter
     - Ebene 3: Zwingmann-Archetypen & Copilot-Business-Use-Cases
2. **Interaktive `(i)`-Badges**:
   - Alle Tabellenköpfe, Phasen und Primitives mit modalen Erklärfenstern ausgestattet.
3. **Copilot-Begründungen**:
   - Feste Definition der 3 legitimen Einsatzszenarien für Copiloten (Rechtliche Compliance / Vier-Augen-Prinzip, Kulanz- und Ermessensspielräume, Stützräder in Phase 1).

---

## [2026-10-02] – Session 1: Tabellen-Konsolidierung & Human-in-the-Loop Konsole

### Benutzer-Anforderung:
> *„So, wenn wir Copilot auswählen, dann habe ich an fünf Stellen gleichzeitig Prozess steht. Das reicht an einer Stelle zu sagen Prozess steht... Und der zweite Punkt ist, es geht jetzt um die Tabelle. Bitte die Tabelle auf dem Bildschirm etwas zusammenfügen. Das sieht scheiße aus, wenn das komplett im großen Bildschirm auseinanderreißt. Und da ist noch mal die Frage, warum sollte ich einen Copilot nehmen? Welche Anwendungsfälle gibt es für einen Copilot, wenn da es immer ganz bewusst stoppt? ... Wo ist überhaupt dann der Human-in-the-Loop UI? Ich brauche dann auch irgendwas, wo dann ein Step und der Step sagt dann ja, okay oder nicht okay...“*

### Durchgeführte Änderungen:
1. **Kompaktes Workflow-Layout**:
   - Tabelle auf max. `7xl` zentriert, Zeilenabstände optimiert, unschönes Auseinanderreißen auf Ultrawide-Monitoren beseitigt.
2. **Entschärfung der Statusanzeigen**:
   - Entfernung redundanter „Prozess steht“-Schreie; dezente, zielgerichtete Badges (`⏸️ HITL Freigabe erforderlich`).
3. **Human-in-the-Loop Konsole**:
   - Interaktive Entscheidungsleiste direkt in der Step-Box mit `[Freigeben & Weiter]`, `[Manuell anpassen]` und `[Ablehnen]`.
   - Simulation stoppt geregelt bei Copilot und setzt nach Freigabe nahtlos fort.

---

## [2026-10-03] – Session 15: 4-Layer-Sicht (Ebenen-Trennung) & SAP AI Golden Path Wizard (Architecture Decision Tree)

### Benutzer-Anforderungen:
1. **SAP Architecture Center als Fundament (`https://github.com/SAP/architecture-center`)**:
   - Vollständiger Abgleich aller SAP-Begrifflichkeiten und Werkzeuge gegen den offiziellen SAP AI Golden Path (`Technology Decision Tree for AI` Graphs 1, 2.a, 2.b, 3, 4 und `RA0034 SAP AI Agent Hub`).
   - Verbindliche Werkzeugnamen: `sap-rpt-1` (Relational Foundation Model), `SAP Document AI` (statt generischem DOX), `Joule Studio Agent Builder`, `A2A Protocol` (Agent-to-Agent), `MCP Protocol Gateway`, `SAP LeanIX` (Agent Registry) und `SAP Signavio Process Intelligence` (Agent Mining).
2. **4-Layer Perspektiven-Sicht (Ebenen-Umschalter zur didaktischen Entlastung)**:
   - Der Simulator hat verschiedene didaktische Ebenen, die nicht gleichzeitig auf den Bildschirm geworfen werden dürfen, damit Studenten nicht überfordert werden:
     - **Layer 1 (`flow`)**: *Prozess & Belegfluss* (Didaktik, Payload, OODA-Logik, Copilot-Freigaben).
     - **Layer 2 (`cost`)**: *Kosten & Capacity Units* (BTP CU, Tokens, monatliche Projektion, Modell-Split).
     - **Layer 3 (`risk`)**: *Risiko & Governance* (Reversibilität 1–5, Blast Radius €, EU AI Act Risikoklasse `MINIMAL`/`LIMITED`/`HIGH`, Signavio Agent Mining).
     - **Layer 4 (`architecture`)**: *SAP Architecture & Tools* (Golden Path Blueprint, `sap-rpt-1`, `SAP Document AI`, `Joule Studio`, A2A/MCP).
3. **Interaktiver SAP AI Golden Path Wizard für Kundenprozesse**:
   - Erstellung eigener Kundenprozesse und Schritte entlang des offiziellen SAP Entscheidungsbaums (Graph 1: Regeln vs. KI ➔ Graph 2.a: Datenmodalität & Tabellen ➔ Graph 2.b & 3: Agency & HITL ➔ Graph 4: Agenten-Scope & A2A/MCP).

### Durchgeführte Arbeiten & Architektur-Entscheidungen:
1. **Typ- & Store-Erweiterungen (`src/types/process.ts`, `src/store/useSimulatorStore.ts`)**:
   - `WorkflowLayer`: `'flow' | 'cost' | 'risk' | 'architecture'`.
   - `EuAiActRiskLevel`: `'MINIMAL' | 'LIMITED' | 'HIGH'`.
   - `ProcessStep`: Optionale Felder `sapGoldenPathTool`, `sapGoldenPathGraph`, `euAiActRisk`.
   - Globaler Store: `activeWorkflowLayer` mit Standard `'flow'` und `setActiveWorkflowLayer`.

2. **Globaler 4-Layer Perspektiven-Umschalter (`src/components/CleanWorkflow/WorkflowView.tsx`)**:
   - Prominente, übersichtliche Umschaltleiste direkt unter der Simulationsleiste.
   - 4 klar gekennzeichnete Tabs mit Icons, Titeln und Untertiteln.

3. **Didaktische Anpassung der Schrittkarten (`src/components/CleanWorkflow/StepCard.tsx`)**:
   - **Layer 1 (`flow`)**: Reduziert auf den reinen didaktischen Belegfluss. Versteckt störende Token-/CU-Kosten im Header. Zeigt saubere OODA- und Primitive-Aufgaben und hebt HITL-Freigabegates hervor.
   - **Layer 2 (`cost`)**: Hebt Capacity Units pro Beleg und monatliche Kostenprognose hervor. Zeigt In/Out-Tokens und Modellraten. Klick auf CU-Badge öffnet den BTP-Rechner.
   - **Layer 3 (`risk`)**: Zeigt den EU AI Act Risikostatus (`MINIMAL`/`LIMITED`/`HIGH`), Reversibilitäts-Score (1–5), Blast Radius in Euro und bei Agenten den Signavio Agent Mining Schutzhinweis.
   - **Layer 4 (`architecture`)**: Zeigt das offizielle SAP Tool (`sap-rpt-1`, `SAP Document AI`, `Joule Studio`), den Decision-Tree-Knoten (`Graph 1–4`), Integrationsprotokolle (`A2A`, `MCP`, `RAP/BAPI`) und LeanIX Governance.

4. **Layer-spezifische Kriterienanzeige (`src/components/CleanWorkflow/StepImpactCriteria.tsx`)**:
   - **Layer 1**: Dunkelverarbeitung vs. Human-in-the-Loop Kacheln + ausführliche Didaktik-Box für Studenten (Eingehender Beleg, unstrukturiert vs. strukturiert, warum HITL greift).
   - **Layer 2**: Token-Verbrauch + BTP Capacity Units Rechner mit Mengenauswahl und Formel.
   - **Layer 3**: 3 fokussierte Governance-Kacheln (EU AI Act, Blast Radius €, Clean Core Index) + Signavio Agent Mining Deep Dive bei Agenten.
   - **Layer 4**: 4 Golden Path Architekturkacheln (Graph Node, SAP Tool, Integrationsstandard, LeanIX Agent Hub).

5. **Interaktiver SAP AI Golden Path Wizard (`src/components/Modals/CreateWorkflowModal.tsx`)**:
   - Tab 1: *⚡ Vorlagen & Dekonstruktion* (Klassische Presets & 6-Schritte-Parser).
   - Tab 2: *🧙 SAP AI Golden Path Wizard (Decision Tree)*:
     - Interaktiver Entscheidungsbaum entlang der offiziellen SAP Leitlinien:
       - **Frage 1 (Graph 1)**: Feste Regeln/DMN vs. KI-Notwendigkeit.
       - **Frage 2 (Graph 2.a)**: Tabellarische Geschäftsdaten (`sap-rpt-1`) vs. Zeitreihen (`HANA PAL`) vs. unstrukturierte Daten.
       - **Frage 3 (Graph 2.b & 3)**: Low Agency Extraktion (`SAP Document AI`) vs. Copilot HITL (`SAP Joule Skill`) vs. Autonomer Agent.
       - **Frage 4 (Graph 4 & RA0034)**: Low-Code Process Agent (`Joule Studio` + `MCP Gateway`) vs. Pro-Code Multi-Agent (`SAP Cloud SDK for AI` + `A2A Protocol`).
     - Live-Empfehlungsbox mit Tool, Archetyp, Risikoklasse und Rationale.
     - 1-Klick-Übernahme auf jeden beliebigen Einzelschritt (`selectedStepIdx`).
     - Neue offizielle Golden Path Referenz-Vorlage: `Order-to-Cash (SAP AI Golden Path)` (`BD9-GPT`).

6. **Zweisprachigkeit & Übersetzungen (`src/i18n/translations.ts`)**:
   - Vollständige Lokalisierung aller 4 Layers, aller Wizard-Fragen und Tool-Beschreibungen in Deutsch und Englisch.

### Verifikation & Testergebnisse:
- `npx tsc --noEmit`: 0 Typfehler.
- `npm run build`: Erfolgreicher Next.js 15 Produktions-Build (alle Routen statisch vorgerendert).
- Funktional verifiziert:
  - Umschaltung der 4 Ebenen filtert die UI-Elemente exakt wie gefordert.
  - Der Wizard führt interaktiv durch die 4 offiziellen Graph-Entscheidungen und mappt zuverlässig die echten SAP-Werkzeuge.
  - 1:1 Symmetrie aller Templates (`scope-bd9`, `scope-2f1`, `scope-j60`) in Deutsch und Englisch mit vollständigen `sapGoldenPathTool`-, `sapGoldenPathGraph`- und `euAiActRisk`-Annotationen.

---

## [2026-10-03] – Session 16: Radikale Didaktik auf Ebene 1 (Input ➔ Intention ➔ Output) & Die 3 Leitfragen (Kosten, Risiko, Lizenzen)

### Benutzer-Anforderung:
> *„Auf der ersten Ebene möchte ich einfach nur, dass man den Prozess ganz einfach verstehen kann. Und sieh, das ist der Prozess, das ist eingehen, das ist ausgehen, und keine Konsequenzen, dass man einfach sieht, was Sache ist. Es muss sehr einfach sein und immer komplexer je nach Step, und jeder Step muss eine bestimmte fachliche Intention haben. Will ich die Kosten wissen? Will ich das Risiko wissen? Will ich wissen, welche Tools ich dazu lizenzieren muss? Das sind ganz klare Kriterien, die dann da letztlich mit in Betracht gezogen werden müssen.“*

### Durchgeführte Arbeiten & Didaktisches Konzept:
1. **Erweiterung des Datenmodells (`src/types/process.ts`)**:
   - `ProcessStep` um 4 didaktische Kernfelder erweitert:
     - `businessIntent`: Klare betriebswirtschaftliche Intention (Warum gibt es diesen Schritt?).
     - `inputDescription`: Was fließt konkret hinein? (z. B. Kunden-E-Mail mit 2-seitigem Bestell-PDF).
     - `outputDescription`: Was kommt als Ergebnis heraus? (z. B. Strukturierter JSON-Datensatz oder persistierte SAP-Auftragsnummer).
     - `requiredLicense`: Welche SAP-Lizenz / BTP-Service ist zur produktiven Nutzung erforderlich?

2. **Template-Anreicherung (DE & EN, `src/data/templates.ts`)**:
   - Alle 18 Einzelschritte der Kernszenarien (`BD9` Order-to-Cash, `2F1` Service Order Management, `J60` Accounts Receivable Clearing) vollständig mit verständlichen, nicht-technischen Beschreibungen für `businessIntent`, `inputDescription`, `outputDescription` und `requiredLicense` ausgestattet.

3. **Neugestaltung der StepCard auf Layer 1 (`flow`) (`src/components/CleanWorkflow/StepCard.tsx`)**:
   - **Radikale Entlastung**: Die 5 technischen Zwingmann-Buttons werden auf Ebene 1 komplett ausgeblendet, damit Studierende und Fachbereichsentscheider nicht von KI-Architektur-Begriffen erschlagen werden.
   - **Prominente Fachliche Intention**: Direkt unter dem Step-Namen hebt eine Kachel das geschäftliche Ziel hervor (z. B. *„Eingehende E-Mails sichten, Spam herausfiltern und echte Kundenbestellungen isolieren“*).
   - **Belegfluss-Pipeline**: Zwei Kacheln zeigen auf einen Blick:
     - 📥 **Eingang**: Eingehender Beleg (z. B. Kunden-E-Mail mit Anhang)
     - 📤 **Ausgang**: Ausgehendes Zwischenergebnis (z. B. Reines Bestell-PDF)
   - **Fluss-Zustand & Schnellumschaltung**: Klare Anzeige, ob der Schritt dunkel durchläuft (`⚡ 100% Dunkelverarbeitung`) oder auf menschliche Prüfung wartet (`⏸️ Human-in-the-Loop`), mit intuitivem 1-Klick-Umschalter zum direkten Ausprobieren.
   - Auf den Ebenen 2 (`cost`), 3 (`risk`) und 4 (`architecture`) bleiben die technischen Zwingmann-Schalter und fachspezifischen Tiefenmetriken voll erhalten.

4. **Die 3 Leitkriterien im Detailbereich (`src/components/CleanWorkflow/StepImpactCriteria.tsx`)**:
   - **Ebene 1 Belegfluss-Übersicht**: Detaillierte Dreiteilung des Steps in `📥 Eingang (Input)`, `🎯 Fachliche Intention` und `📤 Ausgang (Output)`.
   - **Die 3 Kernfragen als interaktive Kacheln**:
     1. 💰 **„Will ich die Kosten wissen?“**: Zeigt sofort BTP Capacity Units pro Beleg (`0 CU` bis `0.003 CU`), Monatskosten und Token-Bedarf. Klick führt direkt in Layer 2.
     2. 🛡️ **„Will ich das Risiko wissen?“**: Zeigt sofort EU AI Act Klasse (`MINIMAL`/`LIMITED`/`HIGH`), Reversibilität (1–5) und finanziellen Blast Radius in €. Klick führt direkt in Layer 3.
     3. 📦 **„Welche Tools muss ich lizenzieren?“**: Zeigt sofort die benötigte SAP-Lizenz / SKU (`step.requiredLicense`), das offizielle SAP Tool (`sap-rpt-1`, `SAP Document AI`, `Joule Studio`) und den Golden Path Graph. Klick führt direkt in Layer 4.
   - **Layer 4**: Prominentes Lizenzierungs-Banner mit offizieller SKU/Cloud-Service-Voraussetzung.

### Verifikation:
- `npx tsc --noEmit`: 0 Fehler.
- `npm run build`: Erfolgreicher Next.js 15 Produktions-Build (`Compiled successfully in 1822ms`).

