# 🧭 Strategischer Berater-Leitfaden: Unterschied zwischen SAP Signavio und dem ProzessSimulator (WAQAM V2)

> **Dokumenten-Klassifizierung:** Executive Consulting Whitepaper & Argumentationsleitfaden  
> **Zielgruppe:** Management-Beratung (CIO, CFO, Head of Enterprise Architecture, Lead Process Owner)  
> **Gültig für:** NextChapter Experts (NCE) ProzessSimulator (Studenten- & Enterprise-Edition)  
> **Stand:** Oktober 2026

---

## 🎯 1. Executive Summary & Die 30-Sekunden-Antwort für das C-Level

### Die typische Kundenfrage im Erstgespräch:
> *„Wir setzen im Konzern bereits SAP Signavio (oder Celonis) für unsere Geschäftsprozesse ein. Warum brauchen wir für den Einstieg in KI und autonome Agenten euren Prozesssimulator?“*

### Die präzise 30-Sekunden-Antwort:
> **„SAP Signavio modelliert und misst die Welt der menschlichen Sachbearbeiter und klassischen ERP-Transaktionen.** Es analysiert historische Logs und berechnet statische Warteschlangen in BPMN.  
> **Unser Prozesssimulator hingegen bewertet die kognitive Ausführung durch autonome KI-Agenten.** Er simuliert vor der ersten Zeile Code auf der SAP BTP, wie sich stochastische KI-Risiken (Halluzinationen, Prompt-Drift, Formatbrüche), Inferenzkosten (BTP AI Units) und Clean-Core-Validierungsgates auf Ihren Belegfluss auswirken – und ermittelt den betriebswirtschaftlich optimalen Autonomiegrad (Pareto-Optimum).  
> **Signavio sagt Ihnen, *wo* ein Prozess hakt. Unser Simulator prüft, *ob und wie* Sie ihn gefahrlos durch KI automatisieren dürfen.“**

---

## 🔍 2. Tiefenvergleich der Architekturen & Funktionsweisen

| Dimension | **SAP Signavio (Process Transformation Suite)** | **NCE ProzessSimulator (WAQAM V2 / Enterprise)** |
| :--- | :--- | :--- |
| **Architektur-Fokus** | **Klassisches Business Process Management (BPM)** & Process Mining für deterministische ERP-Transaktionen. | **Kognitive Prozessführung & AI-Agenten-Governance** auf der SAP BTP. |
| **Simulationstyp** | **Diskrete Ereignissimulation (BPMN 2.0)**: Berechnet Durchlaufzeiten, Ressourcenverbrauch und Engpässe anhand vorgegebener Wahrscheinlichkeiten. | **Stochastische KI-Verhaltenssimulation**: Simuliert reale LLM-Interaktionen, Prompt-Drifts, Belegmutationen und Validierungsabbrüche. |
| **Betriebsarten** | Binär: Ein Prozessschritt ist entweder manuell (Mensch) oder automatisiert (starre RPA / API-Skript). | **4 WAQAM-Betriebsmodi**: *Assistenz*, *Copilot*, *Autopilot*, *Autonomous Agent*. |
| **Voraussetzung** | *Process Insights/Intelligence:* Benötigt zwingend produktive ERP-Event-Logs (`CDHDR`, `CDPOS`, `BKPF`). | Läuft **vollständig autark vor der Implementierung** (Greenfield, Pre-Flight-Testing für BTP-Entwicklung). |
| **Fehler- & Risikomodell** | Organisatorische Medienbrüche, Durchlaufzeit-Überschreitungen, Prozess-Schleifen. | **13 stochastische KI-Gefahren**: Halluzinationen, Context Poisoning, Schema-Drift, Prompt-Injection, Compliance-Verletzungen. |
| **FinOps & Kosten** | Stundensätze menschlicher Vollzeitkräfte (FTE) und Prozesskosten. | **BTP AI Units (AIU) & Token-Kosten**: 0,02 AIU/Aktion, Tokenverbrauch, Gegenüberstellung von Haftungskosten vs. Personaleinsparung. |
| **Katalog-Matching** | Abgleich mit Standard-BPMN-Referenzmodellen der SAP. | **SAP Discovery Center Matching**: Prüfung gegen 718 reale SAP-KI-Positionen (Joule, 147 Standard-Agenten) zur Erkennung von *Custom Gaps*. |
| **Gate-Architektur** | Vier-Augen-Genehmigung im Workflow. | **BTP Clean Core Validation Gates (TVA-Gates)**: Pre-Gates, Dual-View Bot-Provokation, Schema-Validatoren vor ERP-Writeback. |

---

## 🧩 3. Warum man mit Signavio keine KI-Agenten simulieren kann

Ein weit verbreiteter Irrtum in klassischen Architekturteams lautet:  
*„Wir zeichnen den Prozess in Signavio, nennen den Task 'Joule Agent' und setzen die Bearbeitungszeit auf 2 Sekunden.“*

Das scheitert in der Realität aus vier fundamentalen Gründen:

### 1. Das Stochastik-Dilemma (Probabilistik vs. Determinismus)
Ein ERP-System ist deterministisch: Input A führt immer zu Buchung B. Signavio modelliert Prozesse genau nach dieser Annahme.  
LLMs und autonome Agenten sind jedoch **probabilistisch**: Sie erraten statistische Wahrscheinlichkeiten. Signavio kann nicht simulieren, was passiert, wenn ein Modell sonntags durch ein Cloud-Provider-Update plötzlich Fließtext statt striktem JSON liefert oder ein Attribut halluziniert.

### 2. Das Fehlerrisiko und die Haftung
In Signavio kostet ein Fehler im Prozess Wartezeit.  
Im KI-gestützten Beleglauf führt ein ungefangener Agentenfehler zu **Fehlbuchungen, falschen Lieferantenbestellungen oder DSGVO-Verletzungen**. Unser Simulator quantifiziert das finanzielle Risiko eines Modellfehlers im Verhältnis zur Arbeitsersparnis (Pareto-Analyse).

### 3. Die 4 Autonomiegrade (WAQAM)
Klassische Workflows kennen nur 0 % (Mensch) oder 100 % (Dunkelverarbeitung).  
Autonome Unternehmensprozesse erfordern ein dynamisches Spektrum:
* **Modus 1 (Assistenz):** Mensch bucht, KI fasst Daten zusammen (0 % KI-Writeback-Risiko).
* **Modus 2 (Copilot):** KI bereitet Buchungssatz vor, Mensch quittiert per Klick (geringes Risiko).
* **Modus 3 (Autopilot):** KI bucht Standardfälle dunkel, Mensch greift nur bei Anomalien ein (*Human on the loop*).
* **Modus 4 (Autonomous Agent):** Vollständige Dunkelverarbeitung mit automatisierten BTP-Validierungsgates (*Human in command*).  
*Signavio kann diese Abstufungen weder simulieren noch gegeneinander abwägen.*

### 4. BTP AIU & FinOps Transparenz
Signavio kennt keine Inferenzkosten. Ein Agent, der für jede banale Rechnungszeile drei Multi-Agenten-Runden dreht, frisst tausende Tokens und BTP AI Units. Der NCE Simulator deckt auf, ob ein Prozessschritt durch die KI-Ausführung teurer wird als der Sachbearbeiter.

---

## 🏛️ 4. Der Berater-Leitfaden: Das gemeinsame 4-Phasen-Vorgehensmodell

Im Beratungsgespräch positionieren wir den Simulator niemals als Konkurrenz zu Signavio, sondern als **die zwingend erforderliche KI-Erweiterung**:

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│                      DAS END-TO-END BERATUNGS-FRAMEWORK                      │
└───────────────────────────────────────────────────────────────────────────────┘

 [Phase 1: IST-Aufnahme]        [Phase 2: KI-Scoping & Härtung]
   SAP SIGNAVIO                    NCE PROZESSSIMULATOR
   * Process Mining                * 4 Betriebsmodi durchspielen
   * Ist-Engpässe identifizieren   * 13 KI-Risiken & Bot-Provokation testen
   * BPMN-Sollprozess zeichnen     * FinOps & BTP AIU berechnen
             │                                   │
             ▼                                   ▼
 [Phase 4: RUN & Wertnachweis]  [Phase 3: BTP IMPLEMENTIERUNG]
   SAP SIGNAVIO                    SAP BTP CLEAN CORE
   * Live-Monitoring der KPIs      * Clean Core Joule / Custom Agents
   * Wertbeitrag quantifizieren    * BTP Validation Gates (TVA) scharfschalten
   * Reale Zykluszeiten messen     * ERP Writeback anbinden
```

### Der Wertbeitrag der Phasen:
1. **Phase 1 (Signavio):** Der Kunde identifiziert mit Signavio Process Insights seine ineffizienten Kernprozesse (z. B. Purchase-to-Pay mit langer Liegezeit).
2. **Phase 2 (NCE ProzessSimulator):** Bevor Geld in teure BTP-Entwicklung fließt, wird der Prozess im Simulator gestresst:
   * Welcher der 4 Autonomiegrade liefert den höchsten ROI?
   * Welche Belege überleben die Bot-Provokation?
   * Welche BTP Validation Gates (TVA-Gates) müssen implementiert werden?
   * Welche Services existieren bereits im SAP Discovery Center und wo liegen Custom Gaps?
3. **Phase 3 (BTP Clean Core):** Entwicklung der Agenten und Validation Gates auf Basis der exakten Simulator-Spezifikation.
4. **Phase 4 (Signavio):** Messung der erreichten Zykluszeit- und Produktivitätsverbesserungen im operativen Betrieb.

---

## 💬 5. FAQ-Spickzettel für Kunden- und Vorstandstermine

#### Q1: „Können wir den ProzessSimulator nutzen, wenn wir noch gar kein S/4HANA oder Signavio haben?“
> **Antwort:** Ja, absolut. Der Simulator benötigt keine ERP-Anbindung. Er arbeitet mit standardisierten Beleg-Mustern (JSON, XML, PDF) und simuliert die Validierungsgates und Inferenzkosten vollständig autark. Er dient gerade dazu, Investitionsentscheidungen für S/4HANA und BTP fundiert vorzubereiten.

#### Q2: „Wir haben bereits Celonis / Signavio. Verwerfen wir damit unsere bestehende Tool-Landschaft?“
> **Antwort:** Auf keinen Fall. Signavio liefert Ihnen das Prozessmodell. Unser Simulator nimmt dieses Modell und prüft dessen Eignung für den Einsatz von Künstlicher Intelligenz. Sie schützen damit Ihre Investition in Signavio vor teuren Fehlentwicklungen auf der BTP.

#### Q3: „Was ist der greifbare Output für unseren Vorstand (CFO/CIO)?“
> **Antwort:** Ein belastbares **Pareto-Entscheidungsblatt**: Sie sehen schwarz auf weiß, welcher Autonomiegrad für Ihre Belege den höchsten wirtschaftlichen Nutzen bringt, welche Fehlerrate kalkuliert werden muss, wie hoch die BTP-Inferenzkosten ausfallen und an welchen Stellen zwingend ein Mensch im Prozess bleiben muss (*Human in the loop*).
