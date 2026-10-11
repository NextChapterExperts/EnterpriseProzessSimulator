# Leitfaden für das Coaching: Entscheidungsfindung und Architektur bei Agentic AI im SAP-Umfeld

> **Dokument:** Einführung und didaktisches Fundament für Coaching und Training  
> **Zielgruppe:** Junior AI Consultants (Studentenprojekt V2), Berater und Architekten  
> **Fokus:** Methodische Entscheidungsfindung, Betriebsmodi-Prüfung und Architekturentwurf vor der technischen Realisierung  
> **Herausgeber:** NextChapter Experts (NCE)  
> **Stand:** Oktober 2026

---

## 1. Die Ausgangslage: Der Unterschied zwischen SAP-Schulungen und unserem Coaching

Wer heute Schulungen im Bereich SAP und Künstliche Intelligenz besucht, lernt vor allem den Umgang mit einzelnen Werkzeugen – beispielsweise, wie man in *Joule Studio* Prompts formuliert, Agenten anlegt oder Workflows in *SAP Build* klickt. Diese Angebote konzentrieren sich rein auf das technische **„Wie baue ich es?“**.

Thomas Göttsche (SAP) bringt dieses Branchenproblem in seiner Analyse (*Beyond tool training*) auf den Punkt: Die bestehenden Lernangebote vermitteln das Werkzeug-Bauen, lassen Berater und Kunden jedoch bei den grundlegenden Vorab-Entscheidungen allein.

Projekte scheitern fast nie am Werkzeug, sondern daran, dass vorab fundamentale Fragen ungeklärt blieben:
* Eignet sich der Prozessschritt überhaupt für probabilistische Modelle?
* Gibt es dafür bereits Standardfunktionalität oder reicht eine feste Regel (z. B. BRFplus, SQL)?
* Welche variablen Inferenz- und Lizenzkosten entstehen durch den Einsatz von Agenten?
* Wie sieht die saubere Zielarchitektur aus, bevor teure Entwicklerressourcen gebunden werden?

Unser Coaching setzt genau an dieser Lücke an. Wir bilden keine Klick-Bediener aus, sondern methodisch fundierte Berater und Architekten.

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
│ • Rein technische Übungsbeispiele          │ • Verbindung von Prozesslogik mit         │
│                                            │   realen BTP-Zielarchitekturen            │
└────────────────────────────────────────────┴───────────────────────────────────────────┘
```

---

## 2. Klare Grenzen: Unser Fokus und was wir bewusst ausschließen

Um im Coaching und in Kundenprojekten klare Verhältnisse zu schaffen, definieren wir eindeutige Grenzen:

### Was wir NICHT machen (Out of Scope):
* **Keine Betriebsführung und kein operativer Telemetrie-Betrieb:** Wir betreiben keine dauerhaften Monitoring-Plattformen für Agenten im Kundennetzwerk.
* **Keine Governance-Organisation & Gremienarbeit:** Wir bauen keine unternehmensinternen Freigabegremien auf.
* **Keine Betriebsrat- und Mitbestimmungseinbindung:** Mitarbeiterumschulung, Arbeitsrechts- und Betriebsratsverhandlungen liegen vollumfänglich in der Verantwortung des Kundenunternehmens.
* **Keine laufende Wertnachweis-Organisation („Wirtschaftsfrüchte“):** Wir führen kein dauerhaftes Business-Value-Tracking über Jahre im produktiven ERP durch.

### Was wir vermitteln und liefern (In Scope):
Wir liefern die fundierte Vorbereitung von Einführungsentscheidungen:
1. Technologie-neutrale Bewertung der Prozessschritte (Triage).
2. Zuordnung vorhandener SAP-Agenten und -Assistenten inklusive Kosten- und Lizenzrahmen.
3. Den ersten fundierten BTP-Architekturentwurf über offizielle Wissensschnittstellen (MCPs).

---

## 3. Benchmark aus der Praxis: Was wir vom Palantir-FDE-Modell lernen

Im Enterprise-Markt gilt **Palantir** mit seinem *Forward Deployed Engineering (FDE)* und den 5-Tage-*AIP Bootcamps* als Referenz für schnelle KI-Einführungen. Im Coaching analysieren wir dieses Modell, um Stärken zu übernehmen und Schwächen zu vermeiden:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      VERGLEICH: PALANTIR TECHNOLOGIES VS. NCE                          │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│ Dimension                  │ Modell Palantir             │ Modell NextChapter Experts  │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 1. Einstieg & Bindung      │ Sofortige Bindung an den    │ Herstellerneutralität:      │
│                            │ proprietären Foundry-Stack  │ Agnostische Triage vor      │
│                            │ über 5-Tage-Bootcamps       │ jeder Plattform-Festlegung  │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 2. Rollenmodell            │ Strikte Teilung in:         │ Hybridprofil:               │
│                            │ • Deltas (Technik/Daten)    │ Ein Berater vereint Prozess-│
│                            │ • Echos (Strategie/Ops)     │ Triage und Architektur      │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 3. Kosten & FinOps         │ Intransparente Großverträge │ Vorab-Kostenwahrheit:       │
│                            │ mit unklaren Stückkosten    │ Exakte BTP-Inferenzkosten   │
│                            │                             │ (0,02 AIU/Aktion) & Lizenzen│
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 4. Governance              │ Approval Controls in        │ Deterministische TVA-Gates  │
│                            │ geschützten Branches        │ vor dem ERP-Core-Writeback  │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

### Die zwei Kernlektionen für angehende Consultants:
1. **Das hybride Beraterprofil (Delta + Echo):**  
   Palantir schickt oft zwei Personen zum Kunden: Einen Strategen (*Echo*), der den Prozess versteht, und einen Coder (*Delta*), der die Pipeline baut. In unserem Coaching lernen die Teilnehmenden, beides in Personalunion zu beherrschen: Prozessverständnis am Verhandlungstisch und fundierte Architektur am Rechner.
2. **Keine unkontrollierte KI im Core:**  
   Selbst Palantirs internes Tool *AI FDE* darf in produktiven Branches nicht autonom schalten und walten – es erbt Benutzerrechte und verlangt Freigaben. Für uns gilt: Wer im ERP bucht, braucht deterministische Schutzschranken (*TVA-Gates*).

---

## 4. Die drei Werkzeuge als roter Faden des Coachings

Die Ausbildung folgt exakt der Kette unserer drei Softwarewerkzeuge:

```text
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                DIE DREI NCE-WERKZEUGE                                 │
└───────────────────────────────────────────────────────────────────────────────────────┘

  WERKZEUG 1:                         WERKZEUG 2:                       WERKZEUG 3:
  Technologie-agnostischer            Enterprise-Prozess-               Architektur-Modul
  Prozess-Simulator                   Simulator (SAP-Katalog)           (MCP-basiert)
 ┌─────────────────────────┐         ┌─────────────────────────┐       ┌─────────────────────────┐
 │ • Analyse auf Step-     │         │ • Zuweisung vorhandener │       │ • Zieht Daten aus       │
 │   Ebene                 │────────►│   SAP-Agenten & Joule   │──────►│   Werkzeug 1 & 2        │
 │ • Individuell oder      │         │   Assistenten           │       │ • 14/16 SAP MCP Server  │
 │   SAP-Standard          │         │ • BTP AIU & Lizenz-     │       │ • Zerlegt SAP-Welt      │
 │ • 4 Betriebsmodi-Triage │         │   berechnung            │       │ • Erster BTP-Architektur│
 │ • Kosten/Risiko-Profile │         │ • Erkennung weißer      │       │   Zielentwurf           │
 │   (Vor- & Nachteile)    │         │   Flecken (Gaps)        │       │   (Nächster Ausbauschritt)
 └─────────────────────────┘         └─────────────────────────┘       └─────────────────────────┘
```

### Werkzeug 1: Der technologie-agnostische Prozess-Simulator
* **Zweck:** Prüfung von Prozessen (ob individuell oder SAP-Standard) auf Teilschritt-Ebene.
* **Die 4 Betriebsmodi im Vergleich:**
  1. *Deterministisch:* Feste Regeln, Validierungen, BRFplus, SQL. Null Inferenzkosten, null Halluzination, Millisekunden-Latenz.
  2. *Assistenz:* Semantische Suche, Informationsextraktion, rein lesend. Der Mensch führt die Buchung aus.
  3. *Copilot:* KI bereitet Buchungssatz vor, Mensch prüft und gibt verbindlich frei (*Human in the loop*).
  4. *Autonom:* Dunkelverarbeitung für standardisierte Routinefälle mit vorgeschalteten Validierungsgates.
* **Didaktisches Ziel:** Die Teilnehmenden lernen zu begründen, warum bestimmte Schritte *nicht* mit generativer KI automatisiert werden dürfen.

### Werkzeug 2: Der Enterprise-Prozess-Simulator (SAP-Katalog & FinOps)
* **Zweck:** Spezialisierung auf die SAP-Welt, wenn der Kunde auf SAP-Agenten setzen will.
* **Was gelehrt wird:**
  * Abgleich mit dem SAP Discovery Center und dem AI Agent Hub (über 700 Standard-Agenten, Partner-Agenten und Joule-Assistenten).
  * Berechnung des echten Kostenrahmens: BTP AI Units (AIU) und Lizenzen.
  * Identifikation weißer Flecken (*Custom Gaps*), bei denen keine Standard-Agenten existieren und Eigenentwicklungen erforderlich werden.

### Werkzeug 3: Das Architektur-Modul (MCP-gestützter Architekturentwurf)
* **Zweck:** Entwurf einer tragfähigen BTP-Zielarchitektur basierend auf den Ergebnissen aus Werkzeug 1 und 2.
* **Hintergrund:** Entstanden aus unserem Tool zur Analyse von Kundenproblemen und Fehlermustern (Issue-Finder), ausgebaut zu einer Architektur-Engine.
* **Technologie:** Nutzt 14 bis 16 spezialisierte SAP FastMCP Server (u. a. SAP Notes, Community Docs, Developers Search, Discovery Center), um die SAP-Welt strukturiert aufzuschlüsseln.
* **Status:** *Konzeptionell definiert als nächster Ausbauschritt, um den Teilnehmern und Kunden den Weg von der Triage zur konkreten Zielarchitektur aufzuzeigen.*

---

## 5. Didaktischer Einstieg in das Praxistraining

### Modul 0: Das Berater-Mindset
* Wir sind keine Werkzeug-Verkäufer, sondern unabhängige Lösungsberater.
* Der beste Ratschlag an einen Kunden ist oft: *„Diesen Schritt lösen wir mit zwei Zeilen SQL oder einer BRFplus-Regel – hier verbieten wir den Einsatz von KI.“*

### Fallbeispiel für den Start: Der Belegprüfungslauf
1. **Schritt 1 (Eingang & Text-Extraktion):** Assistenz-Modus (OCR / Document AI).
2. **Schritt 2 (Stammdatenabgleich & 3-Way-Match):** Deterministischer Modus (feste Toleranzgrenzen). *Keine KI.*
3. **Schritt 3 (Klärung von Mengenabweichungen):** Copilot-Modus (Vorschlag für Rückfrage, Freigabe durch Einkäufer).
4. **Schritt 4 (Standardverbuchung):** Standardfunktionalität im ERP.

Mit diesem Einstieg erhalten Teilnehmende sofort ein klares, professionelles Profil: Sie verstehen Prozesse, beherrschen die Triage, kalkulieren die Kosten und bereiten saubere Architekturentscheidungen vor.
