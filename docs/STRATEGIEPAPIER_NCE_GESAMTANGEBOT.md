# Strategiepapier: Das NCE-Produkt- & Coaching-Konzept
## Reale Entscheidungsfindung und Architekturentwurf für Enterprise-KI im SAP-Umfeld

> **Dokument:** NCE Strategiepapier & Coaching-Fundament  
> **Autor:** Peter Alexander (NextChapter Experts)  
> **Kontext:** Synthese aus der SAP-Problemanalyse von Thomas Göttsche (*Beyond tool training*), dem Methoden-Benchmark zu Palantir (*Forward Deployed Operations & AIP Bootcamps*), der Prozess-Triage-Methodik und den drei NCE-Werkzeugen  
> **Stand:** Oktober 2026  
> **Klassifizierung:** Strategisches Produkt- und Ausbildungsdokument  

---

## 1. Ausgangslage: Der Befund von Thomas Göttsche (SAP)

In seiner Analyse *„Beyond tool training: a lifecycle approach to agentic AI enablement“* beschreibt Thomas Göttsche ein grundlegendes Defizit aktueller Enablement-Angebote im Enterprise- und SAP-Markt:

* **Das Klick-Dilemma:** Bestehende Schulungen (etwa zu *Joule Studio* oder *SAP Build*) vermitteln fast ausschließlich, **wie** man ein Werkzeug bedient und einen Agenten baut.
* **Die Leerstelle davor und danach:** Sie lassen Unternehmen und Berater genau bei den Fragen allein, an denen reale Kundenprojekte scheitern:
  1. **Die Frage nach dem Ob:** Eignet sich ein Prozess überhaupt für den Einsatz probabilistischer Sprachmodelle?
  2. **Die Frage nach der Triage:** Wann löst man ein Problem im SAP-Standard, wann mit festen deterministischen Regeln (z. B. BRFplus, SQL) und wann mit Agenten?
  3. **Die Kostenfalle:** Wie verhalten sich variable Inferenz- und Tokenkosten gegenüber planbaren Mitarbeiterkosten?
  4. **Die Architektur:** Wie fügt sich ein Agent in eine tragfähige, saubere BTP- und ERP-Zielarchitektur ein?

Göttsche schlägt vor, Enablement an den realen Lebenszyklus einer Implementierung zu koppeln. NextChapter Experts (NCE) greift diesen Befund auf, übersetzt ihn jedoch in konkrete, lauffähige Softwarewerkzeuge und ein darauf aufbauendes Coaching.

---

## 2. Klare Scope-Abgrenzung: Was wir liefern – und was ausdrücklich nicht

Um Missverständnissen im Vertrieb und in der Beratung vorzubeugen, zieht NCE eine strikte Grenze zwischen dem eigenen Leistungsbereich und den Aufgaben des Kunden bzw. der Systemintegratoren:

### Was wir NICHT liefern (Out of Scope):
* **Keine Betriebsführung und kein operativer Telemetrie-Betrieb:** Wir betreiben keine dauerhaften Monitoring-Plattformen für Agenten im Kundennetzwerk.
* **Keine Governance-Organisation:** Wir bauen keine unternehmensinternen Freigabegremien auf.
* **Keine Betriebsrat- und Mitbestimmungseinbindung:** Change Management, Mitarbeiterumschulung und Arbeitsrechts- bzw. Betriebsratsverhandlungen liegen vollumfänglich in der Verantwortung des Kundenunternehmens.
* **Keine laufende Wertnachweis-Organisation („Wirtschaftsfrüchte“):** Wir führen kein dauerhaftes Business-Value-Tracking über Jahre im produktiven ERP durch.

### Was wir liefern (In Scope):
Wir liefern die softwaregestützte **Entscheidungsfindung**, die **FinOps-Bewertung** und den **initialen Architekturentwurf** *vor* der eigentlichen Implementierung. Wir beantworten die Fragen: Welcher Prozessschritt gehört in welchen Modus? Welche vorhandenen SAP-Agenten gibt es dafür und was kosten sie? Wie sieht ein tragfähiger erster BTP-Architekturentwurf aus?

---

## 3. Die drei NCE-Werkzeuge

Das Produktangebot von NCE besteht aus drei aufeinander aufbauenden Softwarekomponenten:

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

---

### Werkzeug 1: Der technologie-agnostische Prozess-Simulator

Dieses Werkzeug analysiert Geschäftsprozesse völlig unabhängig von einem konkreten Softwarehersteller. Es eignet sich sowohl für individuelle, historisch gewachsene Unternehmensabläufe als auch für standardisierte SAP-Referenzprozesse.

* **Arbeitsweise auf Step-Ebene:** Der Prozess wird in seine einzelnen Teilschritte zerlegt. Für jeden Schritt wird geprüft, in welchem Betriebsmodus er am sinnvollsten ausgeführt werden sollte:
  1. **Deterministischer Modus:** Feste Regeln, Validierungen, Berechnungslogik (z. B. BRFplus, SQL).
     * *Vorteil:* 100 % reproduzierbar, Latenz im Millisekundenbereich, null Inferenzkosten, null Halluzinationsrisiko.
     * *Nachteil:* Keine Flexibilität bei unstrukturierten Eingangsdaten.
  2. **Assistenz-Modus:** Semantische Suche, RAG, Informationsextraktion.
     * *Vorteil:* Schneller Überblick bei großen Datenmengen, rein lesend.
     * *Nachteil:* Führt keine Transaktion durch, Mensch muss die Aktion manuell anstoßen.
  3. **Copilot-Modus (Human-in-the-Loop):** KI bereitet die Entscheidung oder den Buchungssatz vor; ein menschlicher Sachbearbeiter prüft und gibt frei.
     * *Vorteil:* Hohe Fehlertoleranz bei mittlerer Komplexität.
     * *Nachteil:* Personalkosten bleiben anteilig bestehen.
  4. **Autonomer Modus (Agentik / Dunkelverarbeitung):** Vollautomatische Durchführung der Transaktion.
     * *Vorteil:* Hoher Durchsatz ohne manuellen Eingriff.
     * *Nachteil:* Höchstes stochastisches Fehlerrisiko; erfordert zwingende Validierungsschranken.
* **Ergebnis:** Eine tabellarische und grafische Gegenüberstellung der Prozessschritte mit ihren Kosten-, Risiko- und Latenzprofilen. Der Kunde sieht, wo KI technisch und wirtschaftlich sinnvoll ist – und wo sie verboten gehört.

---

### Werkzeug 2: Der Enterprise-Prozess-Simulator (SAP-Katalog & FinOps)

Entscheidet sich ein Kunde dafür, die im ersten Schritt identifizierten agentischen oder assistierenden Schritte auf der SAP-Plattform zu realisieren, kommt Werkzeug 2 zum Einsatz.

* **Live-Mapping gegen den SAP AI-Katalog:**  
  Das Tool gleicht die Prozessschritte mit dem offiziellen SAP Discovery Center und dem AI Agent Hub ab (über 700 Positionen an Standard-Agenten, Partner-Agenten und Joule-Assistenten).
* **Lizenz- und Kostenrahmen:**  
  Das Werkzeug ermittelt die konkreten Lizenzen und berechnet auf Basis von Inferenzpreisen (z. B. 0,02 BTP AI Units pro Inferenz-Aktion) den voraussichtlichen Kostenrahmen für den Betrieb.
* **Erkennung weißer Flecken (Gaps):**  
  Findet das Tool keinen passenden Standard-Agenten im SAP-Portfolio, wird der Schritt als *Custom Gap* markiert. Hier weiß der Kunde sofort, dass eine Eigenentwicklung (z. B. als BTP-Microservice oder Joule-Studio-Erweiterung) erforderlich ist.

---

### Werkzeug 3: Das Architektur-Modul (MCP-gestützter Zielentwurf)

Das dritte Werkzeug geht aus unserem bestehenden Analysetool für Kundenprobleme und Fehlermuster hervor. Während es bisher dazu diente, konkrete Kunden-Issues zu untersuchen, erweitern wir es zu einer Architektur-Engine.

* **Funktionsweise:**  
  Das Modul übernimmt die strukturierte Datenbasis aus beiden Simulatoren:
  1. Die Step-Triage aus Werkzeug 1 (welcher Schritt braucht welchen Modus?).
  2. Die zugewiesenen SAP-Komponenten und identifizierten Gaps aus Werkzeug 2.
* **Zerlegung der SAP-Welt über 14 bis 16 MCP-Server:**  
  Das Modul nutzt spezialisierte FastMCP-Server, um die technische SAP-Landschaft strukturiert zu erschließen:
  * `sap-notes`: Relevante Sicherheits-, Versions- und Architekturhinweise.
  * `sap-docs-community`: Clean-Core-Richtlinien, ABAP-Freigaben und Integrationsmuster.
  * `sap-developers-search`: Referenzarchitekturen, BTP-Best-Practices und Tutorials.
  * `sap_discovery_center`: Service-Abhängigkeiten und BTP-Service-Pläne.
* **Das Ergebnis:** Ein erster strukturierter Architekturentwurf für den Gesamtprozess (z. B. Event-Mesh-Kopplung, Platzierung von Validierungsgates, Trennung zwischen Core und Side-by-Side BTP).
* **Ehrlicher Entwicklungsstatus:**  
  *Dieser dritte Schritt ist konzeptionell ausgearbeitet, muss aber als nächster Entwicklungsschritt in der Praxis getestet und implementiert werden.* Das Werkzeug stellt das Bindeglied dar, das die Erkenntnisse der beiden Simulatoren in eine umsetzbare technische Struktur überführt.

---

## 4. Benchmark & Marktvergleich: Das Modell Palantir vs. der NCE-Ansatz

Um die Eigenständigkeit unseres Ansatzes zu verstehen, lohnt sich der direkte Vergleich mit dem derzeit am stärksten diskutierten Vorreiter für operative Enterprise-KI-Einführungen: **Palantir Technologies** (mit *AIP Bootcamps*, dem *Forward Deployed Engineering*-Modell und dem internen Werkzeug *AI FDE*).

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      VERGLEICH: PALANTIR TECHNOLOGIES VS. NCE                          │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│ Dimension                  │ Modell Palantir             │ Modell NextChapter Experts  │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 1. Einstieg & Plattform-   │ Zwingender Einstieg in den  │ Herstellerneutralität:      │
│    Bindung                 │ proprietären Foundry/AIP-   │ Vorab-Bewertung mit agnos-  │
│                            │ Stack über 5-Tage-Bootcamps │ tischem Simulator (Step-    │
│                            │                             │ Triage vor Tool-Bindung)    │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 2. Vor-Ort-Personal        │ Hoher Personaleinsatz vor   │ Befähigung des Kunden:      │
│    (Field Engineering)     │ Ort über FDE-Teams:         │ Ausbildung von Junior AI    │
│                            │ • Deltas (Technik/Daten)    │ Consultants, die Business-  │
│                            │ • Echos (Strategie/Ops)     │ Triage und Architektur in   │
│                            │                             │ einer Person vereinen       │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 3. Kosten- & Lizenz-       │ Hohe Einstiegshürden, indi- │ Vorab-Kostenwahrheit:       │
│    transparenz (FinOps)    │ viduelle Großverträge       │ Transparente Inferenzkosten │
│                            │ (Top-20-Kunden im Schnitt   │ (0,02 BTP AIU/Aktion) und   │
│                            │ $93,9 Mio. Umsatz lt. SEC)  │ Lizenzkatalog vor dem Bau   │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 4. Zielarchitektur &       │ Proprietäre Plattform-      │ Offene Clean-Core-Standards:│
│    Ökosystem               │ Ontologie im Foundry-       │ Zielentwurf über 14/16 offi-│
│                            │ Ökosystem                   │ zielle SAP-MCP-Schnittstellen│
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 5. Governance & Schutz-    │ Strikte Approval Controls:  │ Deterministische Validie-   │
│    gitter bei Agentik      │ Selbst „AI FDE“ erbt        │ rungsgates (TVA-Gates) vor  │
│                            │ Benutzerrechte und sperrt   │ jedem schreibenden ERP-     │
│                            │ geschützte Branches         │ Transaktionsaufruf          │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

### Die zwei zentralen Erkenntnisse aus dem Palantir-Vergleich:
1. **Kein Agent ohne Schutzschranke:**  
   Die offizielle Dokumentation zu Palantirs *AI FDE* widerlegt den Mythos der schrankenlosen KI-Autonomie. Mutierende Aktionen in geschützten Umgebungen erfordern zwingend Freigabeprozesse (*Approval Controls*). Dies bestätigt die NCE-Doktrin: Schreibende Aktionen im ERP-Core dürfen niemals rein stochastisch ausgeführt werden, sondern müssen deterministische Validierungsgates passieren.
2. **Die Stärke des FDE-Profils für unser Coaching:**  
   Palantir unterscheidet zwischen *Deltas* (technische Implementierer) und *Echos* (Deployment Strategists). Im NCE-Coaching führen wir diese beiden Welten zusammen: Unsere Consultants lernen, betriebswirtschaftliche Belegabläufe zu hinterfragen (*Echo*) und gleichzeitig die technische Triage und BTP-Architektur (*Delta*) fundiert zu entwerfen.

---

## 5. Der konkrete Mehrwert für den Kunden

Durch diesen dreistufigen Aufbau erhält der Kunde einen greifbaren geschäftlichen Wert:

1. **Investitionsschutz:** Bevor teure Entwicklungstage für Agenten gebucht werden, steht fest, welche Schritte der Standard bereits abdeckt und welche zwingend deterministisch bleiben müssen.
2. **Kostenwahrheit vor Projektstart:** Keine bösen Überraschungen bei der monatlichen BTP-Rechnung durch vorab modellierte AIU-Verbräuche.
3. **Fundierte Verhandlungsgrundlage:** Der Kunde geht nicht mit vagen Wünschen in Beratungsgespräche, sondern mit einer klaren Spezifikation: Triage-Tabelle, SAP-Katalog-Zuweisung und Architekturentwurf.

---

## 6. Didaktischer Startteil für unser Coaching

Dieser Abschnitt bildet das Einstiegsmodul für Schulungen, Workshops und das Ausbildungsprogramm (z. B. Studentenprojekt V2 / Junior AI Consultants).

### Modul 0: Das Mindset – Vom Prompt-Bastler zum Lösungsarchitekten

Bevor die Teilnehmer Werkzeuge bedienen, müssen sie das grundlegende Problem verstehen:

> *„Ein schlechter Prozess wird durch einen KI-Agenten nicht besser, sondern nur schneller falsch ausgeführt. Eure Aufgabe als Consultants ist nicht, dem Kunden zu zeigen, wie man einen Agenten baut. Eure Aufgabe ist, dem Kunden zu beweisen, wo er gar keinen Agenten bauen darf.“*

#### Kernfragen für den Einstieg:
1. **Warum scheitern 80 % der aktuellen Enterprise-KI-Piloten?**
   * Weil probabilistische Modelle (die raten) auf Geschäftsprozesse losgelassen werden, die buchhalterisch exakt sein müssen.
2. **Was ist der Unterschied zwischen Fixkosten und Inferenzkosten?**
   * Ein Sachbearbeiter kostet ein festes Monatsgehalt. Ein Agent erzeugt pro Beleg variable Kosten, die bei schlechtem Design explodieren.
3. **Warum reicht Joule Studio allein nicht aus?**
   * Joule Studio liefert die Entwicklungsumgebung, aber keine Antwort auf die Frage, ob der Prozessschritt überhaupt gebaut werden sollte.

---

### Der Ablauf des Praxistrainings im Coaching

Die Ausbildung folgt exakt der Kette unserer drei Werkzeuge:

```text
  TAG / PHASE 1:                   TAG / PHASE 2:                   TAG / PHASE 3:
  Technologie-neutrale Triage      SAP-Matching & FinOps            Architekturentwurf
 ┌───────────────────────────────┐┌───────────────────────────────┐┌───────────────────────────────┐
 │ • Analyse eines echten Beleg- ││ • Abgleich mit dem SAP AI-    ││ • Einführung in SAP-MCPs      │
 │   laufs (z. B. Rechnung)      ││   Katalog                     ││ • Extrahieren von Hinweisen   │
 │ • Zuordnung zu den 4 Modi     ││ • Berechnung der BTP AIU      ││   und Architekturmustern      │
 │ • Begründung von Ausschlüssen ││ • Identifikation von Gaps     ││ • Erstellung eines ersten     │
 │   („Warum hier KEINE KI?“)    ││   (Eigenentwicklungen)        ││   Clean-Core-Zielbilds        │
 └───────────────────────────────┘└───────────────────────────────┘└───────────────────────────────┘
```

#### Übungsbeispiel für den Start: Der Belegeingang (Rechnungsprüfung)
* **Schritt 1 (Eingang & OCR):** Assistenz-Modus (Informationsextraktion).
* **Schritt 2 (Prüfung gegen Bestellung & Wareneingang):** Deterministischer Modus (3-Way-Match nach festen Toleranzen). *Hier ist KI verboten.*
* **Schritt 3 (Klärung bei Mengendiskrepanz):** Copilot-Modus (Vorschlag für Rückfrage beim Lieferanten, Freigabe durch Einkäufer).
* **Schritt 4 (Standardbuchung bei Übereinstimmung):** Standardfunktionalität (Dunkelbuchung im ERP-Core, keine AIU nötig).

Mit diesem methodischen Einstieg lernen die Teilnehmenden von Tag 1 an, als vollwertige Prozessberater aufzutreten, statt nur Werkzeugbediener zu sein.
