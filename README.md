# SAP Process Simulator & Advisory Suite

> **Enterprise Decision & Simulation Tool for SAP Business Processes**  
> Pareto-Optimierung zwischen 100 % deterministischer Verbuchung und autonomer KI entlang des SAP Clean Core Paradigmas.

---

## 🚀 Schnellstart

Entwicklungsserver starten:

```bash
cd /home/peter/Projekte/active/ProzessSimulator
npm run dev -- -p 5000
```

Browser öffnen:  
👉 **[http://localhost:5000](http://localhost:5000)**

Produktions-Build erstellen:

```bash
npm run build
npm run start -- -p 5000
```

---

## 📖 Dokumentation, Roadmap & Logs

- 📘 **[DOKUMENTATION.md](DOKUMENTATION.md):** Ausführliches Benutzer- und Architekturhandbuch.
- 🗺️ **[ROADMAP.md](ROADMAP.md):** Strategische Roadmap (Meilensteine M1–M4 abgeschlossen, M5–M8 in Planung).
- 📋 **[LOGFILE.md](LOGFILE.md):** Chronologisches Entwicklungs- und Session-Log.
- 🎓 **[docs/METHODIK_SCHULUNGSLEITFADEN.md](docs/METHODIK_SCHULUNGSLEITFADEN.md):** Schulungsleitfaden zur 3-Ebenen-Hierarchie (OODA, 6 Primitives, Zwingmann).

---

## 🎯 Hauptmerkmale

1. **Kognitive OODA-Dekomposition:**
   Zerlegung von SAP-Prozessen in *Observe*, *Orient*, *Decide* und *Act* mit 6 atomaren kognitiven Primitives.
2. **Die 5 Zwingmann-Archetypen:**
   Deterministisch (BRFplus), Assistant (Klassisches ML / HANA Search), Copilot (Joule), Autopilot (Single-Agent) und Agentic Frameworks.
3. **Echtes Pareto-Optimum (100% Dunkelverarbeitung / STP):**
   Automatisierte Überführung aller Schritte in ihr Maximum: Deterministische Fast-Paths für Filter/Regeln/Verbuchung und unauffällige Assistants für Extraktion/Matching/Versand ohne störende künstliche Haltepunkte.
4. **Qualitative Effizienz-Bewertung:**
   Robuste relative Tendenzen (Dunkelverarbeitung, Token-Bedarf, Ressourceneffizienz) anstelle spekulativer Euro-Preise.
5. **Interaktive Human-in-the-Loop Konsole:**
   Gezielte Unterstützung für Copilot-Schritte mit Freigabe, Korrektur und Ablehnung direkt im Beleglauf.
6. **Workflow Creator (`+ Neuer Workflow`):**
   Erstellung eigener Szenarien per SAP-Vorlage (MIRO, QM-Claim) oder Freitext-Dekomposition.
7. **Zweisprachigkeit (🇩🇪 Deutsch / 🇬🇧 English):**
   Vollständige, nahtlose Umschaltung aller Oberflächen, Templates und Payloads zur Laufzeit.
8. **Clean Core Index & Blast Radius (Reversibilität 1–5):**
   Schutzplanken-System für GoBD- und SOX-Compliance.

---

## 📁 Projektstruktur

```
ProzessSimulator/
├── DOKUMENTATION.md         # Ausführliches Benutzer- & Architekturhandbuch
├── ROADMAP.md               # Strategische Meilenstein-Roadmap
├── LOGFILE.md               # Chronologisches Entwicklungs-Logfile
├── README.md                # Projektübersicht & Schnellstart
├── docs/
│   └── METHODIK_SCHULUNGSLEITFADEN.md # 3-Ebenen-Schulungsmatrix & Copilot-Kriterien
├── src/
│   ├── app/                 # Next.js App Router
│   ├── types/               # TypeScript Typdefinitionen (process.ts)
│   ├── i18n/                # Zentrales Übersetzungswörterbuch (translations.ts)
│   ├── data/                # SAP-Vorlagen (DE/EN), 13 Challenges & Zwingmann-Tiers
│   ├── lib/                 # Pareto-Solver, TCA-Calculator, Dry-Run Engine
│   ├── store/               # Zustand Store für Live-Simulation und UI-State
│   └── components/
│       ├── Header.tsx       # Tab-Navigation, Sprachwechsler & [+ Neuer Workflow]
│       ├── Canvas/          # React Flow Canvas & Simulations-Steuerung
│       ├── CleanWorkflow/   # Responsives Workflow-Design & Live-Payload-Monitor
│       ├── Timeline/        # Interaktive Step-Karten & HITL-Konsole
│       ├── TrainingMatrix/  # Interaktive Schulungstabelle mit (i)-Erklärungen
│       └── Modals/          # Pareto-Ergebnis-Modal, Workflow-Creator & Info-Drawers
```
