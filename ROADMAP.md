# Projekt-Roadmap: SAP Process Simulator & Advisory Suite

Diese Roadmap visualisiert den strategischen Entwicklungsplan, bereits abgeschlossene Meilensteine und die geplanten Ausbaustufen des SAP Process Simulators.

---

## 🗺️ Meilenstein-Übersicht

```
[ v1.0 Kernarchitektur ] ──► [ v1.1 Interaktive HITL ] ──► [ v1.2 Methodenmatrix & i18n ]
         │
         ▼
[ v1.3 Workflow Creator & Qualitative Pareto ] ──► [ v1.4 OODA-Primitives Optimum (Aktuell) ]
         │
         ▼ (Geplante Ausbaustufen)
[ v2.0 Granular Pricing & Sizing ] ──► [ v2.1 Import/Export & Signavio ] ──► [ v2.2 SAP BTP Live-Bridge ]
```

---

## ✅ Abgeschlossene Meilensteine

### Meilenstein 1 (v1.0): Fundament & SAP Clean Core Architektur
- [x] **OODA-Dekomposition:** Zerlegung von SAP-Standardprozessen (BD9, 2F1, J60) in *Observe*, *Orient*, *Decide* und *Act*.
- [x] **6 Kognitive Primitives:** Filter/Gatekeeper, Extractor/Transformer, Matcher/Enricher, Evaluator/Reasoner, Executor/Actuator, Generator/Synthesizer.
- [x] **5 Zwingmann-Archetypen:** Deterministisch (BRFplus), Assistant (Klassisches ML/Search), Copilot (Joule), Autopilot (Single-Agent), Agentic (Multi-Agent Swarm).
- [x] **Schutzplanken & Blast Radius:** Reversibilitätsscores (1–5) und Clean Core Compliance Index (`COMPLIANT`, `LEGACY`, `VIOLATION`).
- [x] **13 Risikochallenges:** Reaktiv getriggerte Risiken und Mitigationsstrategien nach 4 Clustern.

### Meilenstein 2 (v1.1): Interaktive Simulation & Human-in-the-Loop Konsole
- [x] **Live-Simulation:** Animierter Beleglauf mit Play-, Pause- und Taktzeitsteuerung.
- [x] **HITL-Entscheidungskonsole:** Interaktive Freigabe-Box bei Copilot-Schritten (`Freigeben & Weiter`, `Manuell anpassen`, `Ablehnen`).
- [x] **Kompaktes Workflow-Design:** Responsives Tabellendesign mit zentriertem Layout auf Großbildschirmen.
- [x] **Dezente Statusmeldungen:** Beseitigung redundanter Fehlalarme zugunsten präziser Status-Badges.

### Meilenstein 3 (v1.2): Methodik-Schulung & Zweisprachigkeit
- [x] **Methodik-Schulungsmatrix:** Vollständige 3-Ebenen-Übersicht (OODA, Primitives, Zwingmann-Tiers).
- [x] **Interaktive `(i)`-Badges:** Modale Erläuterungsfenster für Ausführungselemente, OODA-Phasen und Primitives-Steuerparameter.
- [x] **Copilot-Schulungsunterlage:** Explizite Dokumentation der drei legitimen Copilot-Einsatzfälle (Compliance/SOX, Ermessen/Kulanz, Stützräder).
- [x] **Laufzeit-Lokalisierung (🇩🇪 DE / 🇬🇧 EN):** Zentrales i18n-Modul mit synchronisierter Sprachumschaltung für alle Oberflächen, Templates und Payloads.

### Meilenstein 4 (v1.3 & v1.4): Workflow Creator & Echtes Pareto-Optimum
- [x] **Qualitative Pareto-Optimierung:** Ersatz spekulativer Euro-Preise durch relative Tendenzen (Dunkelverarbeitung, Token-Bedarf, Ressourceneffizienz).
- [x] **Workflow Creator Modal (`+ Neuer Workflow`):** Vordefinierte Presets (MIRO 2B6, QM Claim PR01) und Freitext-Dekomposition beliebiger Prozesse.
- [x] **Pareto-Solver Überarbeitung:**
  - Beseitigung fehlerhafter Copilot-Zuweisungen auf den Schritten 1, 2 und 6.
  - Echte 100% Dunkelverarbeitung (Straight-Through Processing / STP) im Optimum.
  - Präzise Zuordnung aller 6 Primitives:
    - *Filter / Gatekeeper:* Deterministisch (Fast-Path, 0 Tokens, 99%)
    - *Extractor / Transformer:* Assistant (SAP DOX / LLM JSON-Mode im Hintergrund, 92%)
    - *Matcher / Enricher:* Assistant (SAP HANA Trigram & Fuzzy Search, 95%)
    - *Evaluator / Reasoner:* Deterministisch (SAP BRFplus Decision Tables, 99%)
    - *Executor / Actuator:* Deterministisch (S/4HANA Clean Core RAP / OData BAPI, 99%)
    - *Generator / Synthesizer:* Assistant (SAP BTP Output Management im Hintergrund, 92%)
- [x] **TCA-Kalkulation für Fast-Paths:** Deterministische Gatekeeper erzielen realistische 95–99% Automationsgrad ohne unberechtigten Schemadivergenz-Abzug.

### Meilenstein 5 (v1.5): SAP AI Core Calculator MCP-Server & Schritt-Empfehlungs-Engine
- [x] **Live-Katalog-Daten:** Vollständiger Datenabzug der 81 offiziellen SAP AI Core Foundation Models & 8 Templates aus dem BTP Cost Calculator.
- [x] **Lokaler Node/TypeScript MCP-Server (`sap-ai-core-calculator-mcp`):**
  - Stdio JSON-RPC Dienst mit 4 Tools (`ai_core_list_models`, `ai_core_get_templates`, `ai_core_recommend_step_setting`, `ai_core_calculate_step_costs`).
  - Tool-Schemas in `/home/peter/.gemini/antigravity/mcp/sap-ai-core-calculator/` hinterlegt.
- [x] **Kontextsensitive Schritt-Empfehlungs-Engine (`aiCoreAdvisor.ts`):**
  - Automatische Ableitung von Modell, BTP-Orchestrierung (Data Masking, Content Filter, Grounding) und Template-Preset je nach Schritt, Primitive und Archetyp.
- [x] **UI-Integration im Simulator:**
  - Neue Sektion *„💡 SAP AI Core Architektur-Empfehlung & Template-Zuordnung“* in `StepImpactCriteria.tsx`.
  - Schneller Modell-Indikator direkt auf jeder `StepCard.tsx`.
  - Vollständige Zweisprachigkeit (🇩🇪 DE / 🇬🇧 EN).

---

## 🚀 Geplante Meilensteine (Future Releases)

### Meilenstein 5 (v2.0): Granulares BTP-Pricing & Rollenbezogenes Sizing
*Ziel: Fundierte, reale Kostenkalkulation nach offiziellen SAP Preismodellen.*
- [ ] **SAP Capacity Unit (CU) & AI Unit Konfigurator:**
  - Konfigurierbare Preise für BTP AI Units (LLM Tokens per 1k Input/Output) und BTP Document Information Extraction (DOX) pro Seite.
- [ ] **Rollenbasierte Stundensätze:**
  - Differenzierung der Human-in-the-Loop Kosten nach Rollen (z. B. Junior Sachbearbeiter: 45 €/h, Senior Disponent: 70 €/h, Fachexperte/Jurist: 120 €/h).
- [ ] **Break-Even & ROI Rechner:**
  - Visualisierung des Amortisationszeitpunkts für Clean Core Refactoring vs. Legacy-Betrieb.

### Meilenstein 6 (v2.1): Workflow-Export, Import & SAP Signavio Brücke
*Ziel: Interoperabilität und kollaborativer Austausch von Prozessmodellen.*
- [ ] **JSON/YAML Import & Export:**
  - Speichern, Teilen und Laden von selbst erstellten Workflows als strukturierte Dateien.
- [ ] **BPMN 2.0 / SAP Signavio Parser:**
  - Automatischer Import von Standard-BPMN-XML aus SAP Signavio Process Manager.
  - Automatisches Mapping von BPMN-Tasks auf OODA-Phasen und Primitives.
- [ ] **PDF-Management-Report Export:**
  - Export druckfertiger Architektur-Entscheidungsvorlagen für Lenkungsausschüsse und Enterprise Architects.

### Meilenstein 7 (v2.2): SAP BTP AI Core & Joule Live-Bridge
*Ziel: Optionale Anbindung realer SAP-Services zur Live-Validierung.*
- [ ] **BTP AI Core Verbindung:**
  - Optionaler API-Key-Modus für Live-Extraktion über SAP DOX oder GenAI Hub (z. B. Claude 3.5 Sonnet / GPT-4o über BTP).
- [ ] **SAP Event Mesh Webhook Receiver:**
  - Live-Einspeisung echter Test-Ereignisse aus SAP S/4HANA Cloud in die Simulator-Pipeline.
- [ ] **Joule Prompt Preview:**
  - Automatische Generierung der passenden SAP Joule Copilot Prompt-Vorlagen für Schritte mit HITL.

### Meilenstein 8 (v2.3): Monte-Carlo Simulation & Stresstest-Generator
*Ziel: Statistische Absicherung vor Produktivstart.*
- [ ] **Monte-Carlo Rausch-Simulation:**
  - Tausendfacher Durchlauf mit variablen Rauschmustern zur Ermittlung statistischer Ausfallwahrscheinlichkeiten.
- [ ] **Prompt Injection & Adversarial Testing:**
  - Automatisierter Test gegen CH_08 (Direct Prompt Injection) in unstrukturierten Freitexten.
- [ ] **Thread Lock & API Rate-Limit Stresstest:**
  - Simulation von Lastspitzen (Monatsabschluss) zur Dimensionierung von SAP AI Core Concurrency Quotas.
