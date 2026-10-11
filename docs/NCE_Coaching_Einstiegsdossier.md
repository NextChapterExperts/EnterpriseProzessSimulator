# Leitfaden für das Coaching: Entscheidungsfindung und Architektur bei Agentic AI im SAP-Umfeld

> **Dokument:** Einführung und didaktisches Fundament für Coaching und Training  
> **Zielgruppe:** Berater, Enterprise Architekten und Projektteams  
> **Fokus:** Methodische Entscheidungsfindung, Betriebsmodi-Prüfung und Governance vor der technischen Realisierung  
> **Herausgeber:** NextChapter Experts (NCE)  
> **Stand:** Oktober 2026

---

## 1. Die Ausgangslage: Der Unterschied zwischen SAP-Schulungen und unserem Coaching

Wer heute Schulungen im Bereich SAP und Künstliche Intelligenz besucht, lernt vor allem den Umgang mit einzelnen Werkzeugen – beispielsweise, wie man in *Joule Studio* Prompts formuliert, Agenten anlegt oder Workflows in *SAP Build* klickt. Diese Angebote konzentrieren sich rein auf das technische **„Wie baue ich es?“**.

In der Praxis von Unternehmen und Beratungshäusern zeigt sich jedoch, dass das Scheitern von Projekten selten am Werkzeug liegt. Projekte geraten ins Stocken, weil die grundlegenden unternehmerischen und architektonischen Entscheidungen vorab nicht getroffen wurden.

Unser Coaching setzt genau an dieser Lücke an. Wir vermitteln nicht die Bedienung einer Benutzeroberfläche, sondern die fundierte Vorbereitung von Einführungsentscheidungen entlang des gesamten Lebenszyklus.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DER UNTERSCHIED IM SCHULUNGSANSATZ                              │
├────────────────────────────────────────────┬───────────────────────────────────────────┤
│ Klassische Werkzeug-Schulungen (SAP)       │ Unser Coaching-Ansatz (NCE)               │
├────────────────────────────────────────────┼───────────────────────────────────────────┤
│ • Fokus auf das Werkzeug (Joule Studio)    │ • Fokus auf die Entscheidungsfindung      │
│ • Vermittlung: Wie klicke/baue ich das?    │ • Klärung: Ob, wo und warum automatisieren?│
│ • Annahme: KI ist immer die Lösung         │ • Systematische Triage der Prozessschritte│
│ • Ausblendung variabler Betriebskosten     │ • Genaue FinOps- und Kostenmodellierung   │
│ • Governance als nachträgliches Thema      │ • Governance, Audit & Rollen von Beginn an│
│ • Schulung von Entwickler-Funktionen       │ • Vorbereitung tragfähiger Architekturen  │
└────────────────────────────────────────────┴───────────────────────────────────────────┘
```

### Die zentralen Fragestellungen, die in der Praxis fehlen:
1. **Die Frage nach dem „Ob“:** Welcher Prozessschritt eignet sich überhaupt für kognitive Automatisierung, und wo ist der Einsatz von generativer KI schlicht ungeeignet oder riskant?
2. **Die Triage als Grundprinzip:** Bevor über Agenten nachgedacht wird, muss geprüft werden:
   * Gibt es dafür bereits eine solide **SAP-Standardfunktionalität**?
   * Lässt sich das Problem **deterministisch mit festen Regeln** (z. B. BRFplus, klassische Validierungen) lösen, weil das Ergebnis jedes Mal ausnahmslos identisch sein muss?
   * Bleibt nur für den Restbedarf der Einsatz von **agentischen Modellen** vorbehalten?
3. **Kostenplanbarkeit (FinOps) vs. Personalaufwand:**
   * Ein Mitarbeitergehalt ist eine planbare, feste Budgetposition.
   * Der Einsatz von KI-Agenten ersetzt diese Fixkosten durch variable, oft unberechenbare Kosten. Inferenzkosten steigen mit dem Belegvolumen, komplexen Prompt-Ketten und wiederholten API-Aufrufen.
   * Berater und Architekten müssen vorab berechnen können, ab wann ein Agent pro Beleg teurer wird als die manuelle Bearbeitung.
4. **Betrieb, Governance und Telemetrie:**
   * Wie wird ein Agent nach dem Go-Live überwacht?
   * Welche Protokolle werden geführt? Wer haftet für Fehlentscheidungen?
   * Wie greifen Prüfer (Interne Revision, Wirtschaftsprüfer nach IDW PS 880 / GoBD) auf die Entscheidungswege zu?
5. **Organisatorische Rahmenbedingungen:**
   * Wenn Aufgaben entfallen, müssen Mitarbeiter neu eingesetzt und weitergebildet werden.
   * In vielen Unternehmen, besonders im DACH-Raum, sind Betriebsräte und Mitbestimmungsgremien zwingend frühzeitig einzubinden. Diese Themen gehören vor das Projekt, nicht erst nach den Rollout.

---

## 2. Die Methodik: Systematisches Erproben der Betriebsmodi an Geschäftsprozessen

Im Coaching arbeiten wir nicht abstrakt, sondern prüfen reale Geschäftsprozesse (z. B. Rechnungsprüfung, Kundenauftragsabwicklung, Lieferantenbewertung) Schritt für Schritt gegen vier klar definierte Betriebsmodi.

Es geht darum, experimentell und nachvollziehbar zu ermitteln, welcher Autonomiegrad für welchen Prozessabschnitt die sachlich und wirtschaftlich beste Wahl ist.

```text
  [Eingehender Prozessschritt]
               │
               ▼
     ┌───────────────────┐      JA
     │ SAP Standard /    │─────────────► [ 1. DETERMINISTISCHER MODUS ]
     │ feste Regeln?     │               Keine KI · 0 ms · 0 Inferenzkosten · 100% reproduzierbar
     └───────────────────┘
               │ NEIN
               ▼
     ┌───────────────────┐      JA
     │ Reines Informieren│─────────────► [ 2. ASSISTENZ-MODUS ]
     │ & Daten-Matching? │               Nur lesend · RAG / Fuzzy Search · Mensch führt Transaktion
     └───────────────────┘
               │ NEIN
               ▼
     ┌───────────────────┐      JA
     │ Kognitive Vor-    │─────────────► [ 3. COPILOT-MODUS ]
     │ bereitung nötig?  │               Vorschlag durch KI · Zwingende Freigabe (Human in the loop)
     └───────────────────┘
               │ NEIN (Vollautomatisierung gefordert)
               ▼
  [ 4. AUTONOMER AGENTEN-MODUS ]
  Dunkelverarbeitung · Zwingende BTP-Validierungsgates (TVA) · Human in command bei Anomalien
```

### Die vier Betriebsmodi im Detail:

1. **Deterministischer Modus (Regelbasiert):**
   * **Charakteristik:** Klassische Logik, mathematische Formeln, Schwellenwerte, BRFplus-Entscheidungstabellen.
   * **Einsatz:** Überall dort, wo dieselben Eingangsdaten ausnahmslos zum selben Ergebnis führen müssen (z. B. Steuerberechnungen, Freigabegrenzen, formale Pflichtfeldprüfungen).
   * **Vorteil:** Keine Halluzinationsgefahr, keine Tokenkosten, Latenz im Millisekundenbereich.

2. **Assistenz-Modus (Informierend / Lesend):**
   * **Charakteristik:** Semantische Suche, Dokumenten-Extraktion (SAP Document AI), Kontextanreicherung über Knowledge Graphs.
   * **Einsatz:** Das System bereitet Daten auf und stellt sie dem Mitarbeiter bereit (z. B. Lieferanteninformationen aggregieren, ähnliche historische Reklamationen heraussuchen).
   * **Rolle des Menschen:** Der Mensch behält die volle Kontrolle und führt die eigentliche Buchung im ERP selbst durch.

3. **Copilot-Modus (Vorbereitend / Human in the loop):**
   * **Charakteristik:** Die KI analysiert den Sachverhalt und erzeugt einen fertigen Transaktionsvorschlag (z. B. vollständiger Buchungssatz für eine Rechnung).
   * **Einsatz:** Für Belege mit mittlerer Komplexität oder geringer Abweichung.
   * **Bedingung:** Das System stoppt vor der Verbuchung. Ein qualifizierter Mitarbeiter muss den Vorschlag sichten und explizit freigeben (*Human in the loop*).

4. **Autonomer Agenten-Modus (Ausführend / Dunkelverarbeitung):**
   * **Charakteristik:** Der Agent führt schreibende Aktionen im ERP eigenständig aus.
   * **Einsatz:** Nur für klar abgegrenzte, standardisierte Standardfälle mit geringem finanziellem Risiko.
   * **Zwingende Voraussetzung:** Es müssen vorgeschaltete Validierungsschleusen (*TVA-Gates: Transactional Validation & Audit*) aktiv sein, die Prüfungen auf Gültigkeit, Datenintegrität und Budgetgrenzen erzwingen. Bei Unregelmäßigkeiten wird der Vorgang sofort an einen Menschen eskaliert (*Human in command*).

---

## 3. Der Fokus unserer Werkzeuge: Entscheidungs- und Prüfunterstützung (Keine Implementierung)

Es ist wichtig, den Zweck unserer Werkzeuge präzise abzugrenzen:  
**Wir entwickeln keine individuellen Anwendungs-Produkte und wir betreiben keine Software-Implementierung.**

Unsere Werkzeuge dienen ausschließlich der **Analyse, der Simulation und der Vorbereitung tragfähiger Architekturentscheidungen**, bevor ein Kunde Implementierungsgelder bindet.

### Werkzeug 1: Der ProzessSimulator (Port 5000 / 5001)
* **Zweck:** Ein Prüfstand für Prozess-Szenarien.
* **Was er leistet:**
  * Er erlaubt es, einen Prozess abzubilden und die vier Betriebsmodi Schritt für Schritt durchzuspielen.
  * Er berechnet das Kostenverhalten: Wie verändern sich die Aufwände, wenn ein Schritt von *Copilot* auf *Autonom* umgestellt wird? Er kalkuliert den Verbrauch an BTP AI Units (AIU) und setzt ihn ins Verhältnis zu eingesparten Bearbeitungszeiten.
  * Er ermöglicht Stresstests: Was passiert mit dem Belegfluss, wenn Belege unvollständig sind, Formate abweichen oder Lieferantendaten fehlen?
* **Ergebnis:** Eine fundierte Entscheidungsmatrix (Pareto-Betrachtung), die dem Management zeigt, welcher Automatisierungsgrad betriebswirtschaftlich und risikoseitig vernünftig ist.

### Werkzeug 2: Die Solution Engine (Lösungsarchitektur)
* **Zweck:** Architektur- und Machbarkeitsprüfung über offizielle SAP-Schnittstellen.
* **Was sie leistet:**
  * Über **11 standardisierte Schnittstellen (FastMCP Server)** greift das Werkzeug auf offizielle SAP-Quellen zu: SAP Security Notes, Dokumentationen, Discovery Center Service-Kataloge und APIs.
  * Es prüft, ob die im Simulator ermittelte Lösung mit den offiziellen SAP Clean Core Richtlinien (Tier 1 Core, Tier 2 On-Stack, Tier 3 Side-by-Side) übereinstimmt.
  * Es identifiziert vorhandene SAP-Standarddienste und grenzt diese von tatsächlichen Lücken (*Custom Gaps*) ab, für die kundenspezifische Erweiterungen nötig wären.
* **Ergebnis:** Ein neutraler, nachvollziehbarer Architektur-Blueprint, der als saubere Ausschreibungs- oder Entwicklungsgrundlage dient.

---

## 4. Was die Teilnehmer im Coaching lernen und liefern

Nach Abschluss des Coachings beherrschen die Teilnehmer eine Arbeitsweise, die in der Beratungspraxis händeringend gesucht wird:

1. **Strukturierte Prozessaufnahme:**  
   Geschäftsprozesse so zerlegen, dass klar wird, an welcher Stelle Regeln genügen und wo kognitive Modelle Mehrwert schaffen.
2. **Belastbare Wirtschaftlichkeitsrechnungen:**  
   Keine pauschalen KI-Versprechungen, sondern konkrete Gegenüberstellungen von Fixkosten, Inferenzkosten (AIU) und Fehlerrisiken.
3. **Risikobewusste Governance:**  
   Festlegen, welche Kontrollen, Freigabestufen und Prüfpfade für Wirtschaftsprüfer und Fachbereiche zwingend erforderlich sind.
4. **Verständliche Management-Vorlagen:**  
   Entscheidungsvorlagen für CFOs, CIOs und Lenkungsausschüsse erstellen, die klar begründen, warum bestimmte Schritte automatisiert werden sollten – und warum andere Schritte bewusst im Standard oder bei menschlicher Bearbeitung verbleiben.
