# Governance, Halluzinationsschutz & Quellen-Integrität in SAP Business AI

> **Status:** Verbindliche Architektur-Dokumentation für Kunden-Audits & Architektur-Reviews  
> **Projekt:** EnterpriseProzessSimulator (Port 5001)  
> **Kontext:** Next Chapter Experts (NCE) — Enterprise AI Advisory & Process Simulation  

---

## 1. Fragestellung: „Woher weiß ich, dass diese Agenten echt sind?“

### Die Herausforderung:
Kunden, CIOs und Wirtschaftsprüfer vermuten häufig, dass KI-Berater Fantasie-Agenten oder Marketing-Begriffe erfinden, die es im SAP-Standard überhaupt nicht gibt.

### Der verbindliche Faktenbeweis:
1. **Offizieller Datenabzug:**  
   Alle im Simulator verwendeten Agenten und Assistenten stammen aus der Datei `src/data/sap-ai-catalog.json`. Dies ist ein direkter JSON-Abzug des offiziellen **SAP Discovery Center AI Catalogs** über die SAP REST API:
   ```
   https://discovery-center.cloud.sap/service-catalog/v2/services/ai-catalog
   ```
   Der Katalog umfasst **718 von der SAP SE zertifizierte AI Use Cases, Agenten und Assistenten**.

2. **Offizielle SAP GUIDs und Jarvis-IDs:**  
   Jeder Eintrag führt eine unveränderliche interne SAP-Kennung:
   * **Sales Operations Assistant:** `GUID 10cc5d3d-d756-43ff-9a96-e1535635613a` (Joule Base Package)
   * **Invoicing Assistant:** `GUID 301818f6-68d6-4518-bb7f-b9a2e000584d`
   * **Sourcing Assistant:** `GUID 2f81c285-9835-451f-aa61-2d3d4e2c1cc7`
   * **Automated PDF Invoice Processing & 3-Way Matching Agent:** `GUID 3878b2d1-21c6-47b2-841f-d7d8123efb11`
   * **Central Purchase Contract Agent:** `GUID 72e411b2-11c2-4aa8-bbf3-4f91e0a2931a`

3. **Funktionsweise der Deep-Links:**  
   Das SAP Discovery Center ist eine OpenUI5 Single-Page Application (SPA). Parameter wie `?id=GUID` werden vom UI5-Router ignoriert und führen auf die Übersicht.  
   **Lösung:** Der Simulator verlinkt mit dem offiziellen Suchparameter:
   ```
   https://discovery-center.cloud.sap/ai-catalog/?search=Sales%20Operations%20Assistant
   ```
   Beim Klick öffnet sich der SAP-Katalog sofort mit dem gefilterten, exakten Profil des Agenten.

---

## 2. Fragestellung: „Wie verhindert SAP Halluzinationen und Fehlbuchungen?“

### Das Problem freier LLM-Lösungen (Der Eigenbau-Fehler):
Baut ein Unternehmen ein eigenes Python-Skript mit OpenAI oder Gemini, das Belege interpretieren und buchen soll, entstehen systemische Halluzinationen:
* Das Modell erfindet Materialnummern, die im ERP nicht existieren.
* Steuersätze oder Zahlungsbedingungen werden falsch berechnet.
* Es entstehen unbemerkt fehlerhafte Buchungen im Haupt- und Nebenbuch.

### Die 3-stufige Zero-Halluzination-Architektur der SAP:

```
[Kundenbeleg (PDF / EDI)]
           │
           ▼
┌───────────────────────────────────────────────┐
│ 1. SAP Document Grounding (HANA Cloud)        │  ──> Vektor- & Trigram-Fuzzy-Suche gegen KNA1/MARA.
│    (Knowledge Graph & echte Stammdaten)       │      Das Modell darf KEINE Daten aus dem Gedächtnis
└───────────────────────────────────────────────┘      erfinden, sondern nur verifizierte ERP-Objekte matchen.
           │
           ▼
┌───────────────────────────────────────────────┐
│ 2. Konfidenz-Gate & Eskalations-Schwelle      │  ──> Unterschreitet die Konfidenz 90%, wird die autonome
│    (z. B. < 90% Konfidenz)                    │      Verarbeitung sofort gestoppt (Eskalation an Menschen).
└───────────────────────────────────────────────┘
           │
           ▼
┌───────────────────────────────────────────────┐
│ 3. Deterministische Commit-Barriere (RAP API) │  ──> DAS ZENTRALE SCHUTZSCHILD:
│    (ABAP CDS Schemaprüfung & Rollback)        │      Ein LLM schreibt NIEMALS direkt SQL!
└───────────────────────────────────────────────┘      Verbuchung erfolgt über typisierte SAP RAP Business
           │                                           Objects. Bei Validierungsfehlern: harter ACID Rollback.
           ▼
     [ACID Commit]
```

1. **SAP Document Grounding:**  
   Das LLM arbeitet niemals „frei schwebend“. Die semantische Extraktion wird sofort über HANA Cloud Vector Engines und Trigram-Fuzzy-Matching gegen reale `KNA1`- (Kunden) und `MARA`- (Material) Tabellen geerdet.
2. **Deterministische Commit-Barriere (ABAP RAP):**  
   Ein LLM hat in SAP keine Schreibberechtigung auf Datenbanktabellen. Es generiert lediglich typisierte JSON-Payloads für das *ABAP RESTful Application Programming Model (RAP)*. S/4HANA führt dieselben strengen Business-Checks wie bei einer manuellen Eingabe durch (Gültigkeit Buchungskreis, Kontenfindung, Kreditsperren). Schlägt ein Check fehl, bricht die Transaktion mit einem **ACID-Rollback** ab.
3. **Revisions- und Auditsicherheit (GoBD / SOX / EU AI Act):**  
   * **EU AI Act:** Transaktionsbezogene Verbuchungs-Agenten fallen unter die Transparenzpflichten und Risikoklasse *Limited/High*. SAP isoliert Tenant-Daten vollständig.
   * **Kein Modelltraining:** Kundendaten werden niemals zum Training der Basismodelle verwendet.
   * **Vollständiges Audit-Logging:** Jeder Prompt, jede Inferenz und jedes Konfidenz-Ergebnis wird im BTP Audit Log unveränderbar protokolliert.

---

## 3. Fragestellung: „End-to-End Joule Assistent vs. Modulare Agenten-Kette — Wann nehme ich was?“

| Entscheidungskriterium | 💬 End-to-End Joule Assistent (Turnkey) | 🤖 Modulare Agenten-Kette (Custom Pipeline) |
| :--- | :--- | :--- |
| **Philosophie** | **Digitaler Beifahrer** (Human-in-the-Loop) | **Fahrerloser Autopilot** (Dunkelverarbeitung / STP) |
| **Wie wird es implementiert?** | **3 Klicks in Fiori:**<br>1. App *„Manage AI Capabilities“* öffnen<br>2. Assistent suchen (z. B. *Sales Operations Assistant*)<br>3. Schalter auf **ON / Aktiviert** setzen | **BTP Integrationsprojekt:**<br>• SAP Build Process Automation (BPMN)<br>• Advanced Event Mesh als Inbound-Trigger<br>• SAP AI Core / GenAI Hub REST-Aufrufe |
| **Entwicklungsaufwand** | **0 Zeilen Code, 2 bis 5 Tage** (reine Rollen- und Konfigurationsprüfung) | **3 bis 6 Wochen** (BTP-Projekt mit Schnittstellen-Mapping) |
| **Lizenzmodell** | **Flatrate (0 € Zusatzkosten)** in der SAP Cloud ERP Joule Base Edition enthalten | **Verbrauchsabhängig** über SAP BTP Capacity Units (CU) |
| **Typischer Einsatzzweck** | Standard-ERP-Prozesse beschleunigen; Sachbearbeiter bei komplexen Aufträgen im Chat unterstützen | Extrem hohe Belegvolumina (z. B. > 50.000 Aufträge/Monat); Einbindung von Altsystemen (AS400, Salesforce) |

---

## 4. Fragestellung: „Warum kostet die naive KI-Kette 2.500 CU und das Pareto-Optimum nur 31 CU?“

### Die Kostenfalle unüberlegter GenAI-Architekturen:
Wenn ein Implementierer jeden Schritt eines Prozesses mit einem generativen LLM-Call versieht:
* 25.000 Belege $\times$ 5 Prozessschritte $\times$ 0,02 CU = **2.500 Capacity Units (ca. 3.000 € / Monat)**.
* **Ergebnis:** Wirtschaftlich untragbar für Standard-Geschäftsvorfälle.

### Das NCE Pareto-Kalkül (85 % Dunkelquote):
Im Pareto-Optimum übernimmt der **Clean Core Fast-Path** die Standardfälle kostenlos:
1. **Eingang & Triage (Event Mesh):** 0 CU (Clean Core)
2. **Extraktion (Document AI):** Fällt nur für die 20 % unstrukturierten Belege an $\rightarrow$ **20,0 CU** (~24,00 €)
3. **Matching (HANA In-Memory):** In bestehender HANA Compute enthalten $\rightarrow$ **0 CU**
4. **ATP- & Kreditentscheidung (Agent):** Fällt nur für 15 % Risikofälle an $\rightarrow$ **11,3 CU** (~13,50 €)
5. **Verbuchung (RAP API):** 0 CU (Clean Core ACID Commit)
6. **Ausgang & Bestätigung (Joule):** 0 CU (Joule Base Package)
* **Gesamtkosten mit Pareto:** **~31,3 CU / Monat (~37,50 € / Monat)**.
* **Ersparnis:** **Über 98 % gegenüber naiven GenAI-Konzepten.**

---

*Zugehörige Code-Dateien im Projekt:*
* `src/data/sap-ai-catalog.json`: Offizieller SAP Discovery Center Katalog (718 Einträge)
* `src/lib/sapAiCatalogMatcher.ts`: Semantischer Matcher mit Deep-Links (`?search=`) und CU-Abrechnungslogik
* `src/components/CleanEnterprise/EnterpriseBoard.tsx`: Interaktive Visualisierung auf Port 5001
