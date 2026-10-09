# SAP Process Simulator – Dokumentation

Ein fokussiertes Simulations- und Bewertungswerkzeug für SAP-Geschäftsprozesse basierend auf dem **OODA-Loop**, den **6 kognitiven Primitives**, der **Zwingmann-Methodologie** und dem **SAP Clean Core Paradigma**.

---

## 🧭 Inhaltsverzeichnis

1. [Das methodische Fundament](#1-das-methodische-fundament)
2. [Die 6 Kognitiven Primitives & ihre Pareto-Optimierung](#2-die-6-kognitiven-primitives--ihre-pareto-optimierung)
3. [Qualitative Effizienz & Vermeidung von Preisspekulation](#3-qualitative-effizienz--vermeidung-von-preisspekulation)
4. [Step-Boxen, Live-Simulation & Human-in-the-Loop Konsole](#4-step-boxen-live-simulation--human-in-the-loop-konsole)
5. [Eigener Workflow Creator (`+ Neuer Workflow`)](#5-eigener-workflow-creator--neuer-workflow)
6. [Zweisprachigkeit (🇩🇪 DE / 🇬🇧 EN)](#6-zweisprachigkeit--de---en)
7. [Projekt-Ressourcen, Logfiles & Roadmaps](#7-projekt-ressourcen-logfiles--roadmaps)

---

## 1. Das methodische Fundament

Jeder Prozess wird nach zwei standardisierten Säulen zerlegt:

### Säule 1: Der OODA-Loop (John Boyd) & die 6 Kognitiven Primitives
1. **👁️ 1. OBSERVE (Wahrnehmung & Reizaufnahme):**
   - `Filter / Gatekeeper`: Triage, Spam-Filter, Relevanzprüfung, MIME/Header-Check via SAP Event Mesh.
   - `Extractor / Transformer`: Strukturierung von unstrukturiertem Freitext/PDF in tabellarische Belegdaten (SAP DOX).
2. **🧭 2. ORIENT (Kontextualisierung & Grounding):**
   - `Matcher / Enricher`: Stammdatenabgleich gegen SAP (KNA1 Debitor, MARA Material, Verträge) via SAP HANA Fuzzy Search.
3. **⚖️ 3. DECIDE (Entscheidungsfindung & Regeln):**
   - `Evaluator / Reasoner`: Deterministische Regelauswertung (Kreditlimit, ATP-Prüfung, Toleranzen) via SAP BRFplus.
4. **⚡ 4. ACT (Mutation & Synthese):**
   - `Executor / Actuator`: Schreibende ERP-Verbuchung (Kundenauftrag via ABAP Cloud RAP / OData BAPI).
   - `Generator / Synthesizer`: Abschlusskommunikation (Auftragsbestätigung, Aviso) via SAP BTP Output Management.

### Säule 2: Die Zwingmann-Methodologie (Stufen der Automatisierung)
Jeder Schritt kann direkt an der Box auf 5 Stufen eingestellt werden:
1. **Deterministisch:** Klassisches Regelwerk (BRFplus, SQL). < 50 ms Latenz, 0 CU Inferenz. Ambiguitätstoleranz = 0.
2. **Assistant:** Klassisches ML & Search (SAP HANA Fuzzy Search / RAG / JSON-Mode). 0 Halluzination, rein lesend / vorbereitend im Hintergrund.
3. **Copilot (Human-in-the-Loop):** Mensch führt, KI schlägt vor (z. B. SAP Joule). Der Prozess stoppt zwingend für die menschliche Freigabe (`human_approved: true`).
   - *Legitime Anwendungsfälle für Copilot:*
     - 1. **Gesetzliche Compliance & Revisionssicherheit (SOX / GoBD):** Vier-Augen-Prinzip vor unwiderruflichen Buchungen.
     - 2. **Ermessens- & Kulanzentscheidungen:** Menschliche Bewertung bei Goodwill-Regelungen außerhalb harter Tabellen.
     - 3. **Stützräder in Phase 1 (Trust & Adoption):** Temporäre Absicherung vor der Aktivierung des Autopiloten.
4. **Autopilot:** Autonomer Single-Agent nach Zwingmann mit Tool-Calling im engen Korridor und Konfidenz-Gate (~90% STP; stoppt nur bei Ausnahmen).
5. **Agentic:** Multi-Agenten-System mit dynamischen ReAct-Schleifen für komplexe Freitexte und autonome Daten-Selbstheilung (~95% STP).

Ausführlicher Leitfaden: Siehe [`docs/METHODIK_SCHULUNGSLEITFADEN.md`](docs/METHODIK_SCHULUNGSLEITFADEN.md).

---

## 2. Die 6 Kognitiven Primitives & ihre Pareto-Optimierung

Die **Pareto-Optimierung** berechnet mit einem Klick das architektonische Optimum, bei dem maximale Dunkelverarbeitung (Straight-Through Processing / STP) bei minimalem Token- und Ressourcenaufwand erzielt wird.

Im Pareto-Optimum wird **kein einziger Schritt auf Copilot gesetzt**, um künstliche Prozessblockaden zu vermeiden:

| OODA-Phase | Kognitives Primitive | Pareto-Archetyp | Konfidenz | Architektonische Begründung |
|---|---|---|---|---|
| **Observe** | **Filter / Gatekeeper** | **Deterministisch** | **99%** | Fast-Path via SAP Event Mesh / Header-Regex: 100% Dunkelverarbeitung (STP), 0 Tokens. |
| **Observe** | **Extractor / Transformer** | **Assistant** (`classic_ml`) | **92%** | SAP DOX / BTP Document Information Extraction im Hintergrund: Strukturierte Extraktion ohne manuelles Abtippen. |
| **Orient** | **Matcher / Enricher** | **Assistant** (`classic_ml`) | **95%** | SAP HANA Trigram & Fuzzy Search: Stammdatenabgleich im Millisekundenbereich, 0 CU Inferenz, Null Halluzinationsrisiko. |
| **Decide** | **Evaluator / Reasoner** | **Deterministisch** | **99%** | SAP BRFplus Decision Tables: 100% rechtssichere Regelausführung, revisionssicher nach GoBD. |
| **Act** | **Executor / Actuator** | **Deterministisch** | **99%** | S/4HANA Clean Core RAP / OData BAPI: Vollautomatische Dunkelverbuchung nach Clean-Core-Standards (`COMPLIANT`). |
| **Act** | **Generator / Synthesizer** | **Assistant** (`classic_ml`) | **92%** | SAP BTP Output Management: Automatisierte Beleg- und Benachrichtigungsgenerierung im Hintergrund ohne Sachbearbeiter-Stopp. |

---

## 3. Qualitative Effizienz & Vermeidung von Preisspekulation

Da für unternehmensspezifische Szenarien noch keine verbindlichen Token-Preise oder Rollen-Stundensätze festgelegt sind, zeigt die Pareto-Optimierung **keine spekulativen Euro-Beträge** an. Stattdessen bewertet das System drei fundierte qualitative Tendenzen:

1. **Dunkelverarbeitung (STP):** `▲ Signifikant gesteigert`  
   Der Belegfluss wird von künstlichen Stopps befreit und läuft durchgehend automatisiert.
2. **Token- & Modell-Bedarf:** `▼ Stark reduziert`  
   Deterministische Fast-Paths und In-Memory Fuzzy Search eliminieren unnötige LLM-Aufrufe.
3. **Ressourcen-Tendenz:** `▼ Deutlich günstiger`  
   Sub-Sekunden-Latenz und massive Entlastung des operativen Personals von repetitiven Standardfällen.

---

## 4. Step-Boxen, Live-Simulation & Human-in-the-Loop Konsole

Jeder Schritt im Workflow bietet eine vollständige Einsicht:
- **Header:** Schrittnummer, Name, kognitives Primitiv und SAP-Schnittstellen-Referenz.
- **Zwingmann-Leiste:** Interaktives Umschalten zwischen den 5 Archetypen inklusive `(ℹ️)`-Erklärungen.
- **Live-Simulation:** Play-Button startet den Beleglauf von Schritt 1 bis 6 mit Latenz-Simulation.
- **HITL-Konsole (Human-in-the-Loop):**
  - Wird ein Schritt auf **Copilot** konfiguriert (z. B. zur Demonstration manueller Kontrollen vor der Pareto-Optimierung), stoppt die Simulation gezielt.
  - Der Sachbearbeiter kann über `[Freigeben & Weiter]`, `[Manuell anpassen]` oder `[Ablehnen]` interaktiv entscheiden.
  - Ein Klick auf `[ Reales JSON anzeigen ]` zeigt die exakte Payload-Struktur für Entwickler.

---

## 5. Eigener Workflow Creator (`+ Neuer Workflow`)

Über den Header-Button `[+ Neuer Workflow]` können beliebige neue Prozesse definiert werden:
1. **Schnell-Start Presets:**
   - *Rechnungseingangsprüfung (MIRO / Scope 2B6)*
   - *Lieferanten-Reklamation & QM-Meldung (Scope PR01)*
2. **Freitext-Dekomposition:**
   - Eingabe einer formlosen Beschreibung eines Prozesses.
   - Automatische Zerlegung in die 4 OODA-Phasen und Zuordnung zu den 6 kognitiven Primitives.
   - Sofortiges Laden als aktiver, simulierbarer Workflow im Simulator.

---

## 6. Zweisprachigkeit (🇩🇪 DE / 🇬🇧 EN)

Über den Umschalter `[ 🇩🇪 DE | 🇬🇧 EN ]` im Header wird das gesamte System zur Laufzeit übersetzt:
- Alle Navigationselemente, Step-Karten, Badges und Kriterienleisten.
- Prozessinhalte, Beschreibungen und SAP-Referenzen.
- Live-Payloads und Log-Meldungen.
- Die gesamte Schulungsmatrix und alle modale Erklärungen.

---

## 7. Projekt-Ressourcen, Logfiles & Roadmaps

- 📋 **[LOGFILE.md](LOGFILE.md):** Chronologisches Entwickler- und Session-Log aller Fehlerbehebungen und Implementierungen.
- 🗺️ **[ROADMAP.md](ROADMAP.md):** Strategische Produkt-Roadmap mit allen abgeschlossenen (M1–M4) und geplanten (M5–M8) Meilensteinen.
- 🎓 **[docs/METHODIK_SCHULUNGSLEITFADEN.md](docs/METHODIK_SCHULUNGSLEITFADEN.md):** Detaillierter Leitfaden für Workshops und SAP-Architektur-Schulungen.
- 📚 **[docs/steps/](docs/steps/README.md):** Didaktische Schritt-Dossiers zu jedem einzelnen Prozessschritt (1 bis 6) inkl. SAP-Tabellen, BAPIs, 5-Archetypen-Vergleich und Prüfungsfragen.
