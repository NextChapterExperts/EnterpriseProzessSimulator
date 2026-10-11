# 🧭 Executive Briefing: SAP Connect Keynote (Christian Klein)

> **Dokumenten-Ablage:** Enterprise Prozess Simulator Docs  
> **Originaltitel:** Connected Intelligence: Bringing the Autonomous Enterprise to Life  
> **Datum der Keynote:** Oktober 2026 (SAP Connect Las Vegas)

---

## 📌 Die Kernbotschaften auf einen Blick

1. **Deterministische Workflows statt Wahrscheinlichkeitsrechnung:**
   * Reine LLMs sind probabilistisch und raten bei Geschäftsfragen (Einhorn-Analogie).
   * SAP bettet Agenten in deterministische ERP-Workflows ein (gleiche Daten, gleiche Geschäftsregeln, lückenloser Audit-Trail).

2. **Drei Architektursäulen:**
   * **Joule Work:** Neuer UI/Engagement-Layer für 400 Mio. Nutzer (*Conversations, Spaces, Joule Studio*). Intern bei 110.000 SAP-Mitarbeitern produktiv mit >20% Produktivitätsgewinn in HR, Finance und Beschaffung.
   * **Autonomous Suite:** 5 Domänen (*Finance, Spend, HCM, Supply Chain, CX + Industry AI*). >20 Assistenten und >200 Agenten GA (Ziel: >400 bis Jahresende).
   * **Business AI Platform:** *Build* (Joule Studio + n8n + 70 Modelle), *Context* (Knowledge Graph mit 7 Mio. Feldern, 500k Tabellen, 50k APIs; Business Data Cloud via HANA Cloud, Dremio, Reltio), *Govern* (SAP-managed Governance, ISO 42001, SOX).

3. **Strategische Neuankündigungen:**
   * **Akquisition von TechWolf:** KI-native Work Intelligence Plattform mit *Context Graph for Work* wandert in den Kern von SuccessFactors.
   * **SAP Pay:** Nativ in SAP Cloud ERP eingebetteter Zahlungsdienst für Rechnungen (Fiat, Cross-Border, Stablecoins; senkt TCO um 25%).
   * **Offenes Ökosystem:** Agent-to-Agent Gateway (A2A) und LeanIX als zentraler AI Agent Hub.

4. **Kunden-Ergebnisse:**
   * **Novartis:** 25% schnellere Beschaffungszyklen, +35% Produktivität mit Joule Sourcing Assistant.
   * **Morgan Foods:** Reaktionszeit auf Kundenanfragen von 3-4 Wochen auf 5 Minuten gesenkt (S/4HANA + IBP).
   * **Nestlé:** Globaler Rollout in >140 Ländern; Clean Core als Fundament für Accounts Receivable Agent & Touchless Order Management.
   * **PwC:** Co-Innovation am SAP Billing Assistant.

5. **Sicherheit & Governance (Marielle Ehrmann):**
   * Drei Stufen menschlicher Aufsicht: *Human in the loop* (Freigabe vor Aktion), *Human on the loop* (Echtzeit-Monitoring), *Human in command* (Übersteuerung).
   * DSGVO, EU AI Act, DORA, NIS2 ab Werk; Kundendaten werden nie für LLM-Training genutzt.

6. **Change Management Toolchain:**
   * SAP Signavio (Prozess-Simulation & Value-Quantifizierung), LeanIX (Agenten-Inventar), WalkMe (Digital Adoption).

---

# SAP Connect Keynote: Connected Intelligence – Das autonome Unternehmen zum Leben erwecken

> **Originaltitel:** Keynote: Connected Intelligence: Bringing the Autonomous Enterprise to Life  
> **Sprecher:** Christian Klein (CEO SAP), Manoj, Jan, Christoph Berkey (Novartis), Christina Riccorte, Rebecca Carr (SAP SuccessFactors), Steve Hankins (Morgan Foods), Luca Della Letta (Nestle), Jill Notes (PwC), Marielle Ehrmann  
> **Kontext:** SAP Connect Keynote  
> **Übersetzung & Aufbereitung:** Staff Assistant für Peter Alexander

---

## 1. Intro-Video: Der Dialog mit Joule

**Sprecher im Video:**  
Das autonome Unternehmen – der Beginn von etwas Besserem. Besser? Was macht es besser? Joule.  
*„Kann Joule herausfinden, warum diese Konten nicht abgestimmt sind?“* – Abgestimmt. Zudem erfordern drei Posten Ihre Aufmerksamkeit. Das ist besser.  
*„Hier drüben! Kann Joule mir sagen, welche meiner Kundenaufträge gefährdet sind?“* – Ja, kann es. *„Und das Problem beheben?“* – Erledigt. Perfekt.  
*„Ventildichtungen. Kann Joule mir sagen, was passiert, wenn uns die Ventildichtungen ausgehen?“* – Genau das. *„Kann Joule Nachschub bestellen?“* – Bestellung vorbereitet. Klicken Sie zur Freigabe. Freigegeben. Viel besser.  
*„Kann es jemanden finden, der schon einmal einen Produkt-Rollout in Mexiko betreut hat?“* – Sicher. Hier ist Ihr Kollege. *„Ich? Und spricht er Spanisch?“* – Neue Talente werden gesucht. Habla espanol? Ja, sie ist besser geeignet. Tut mir leid, Sie sind ein guter Typ.  
*„Wir sprechen seit März die falsche Zielgruppe für unser meistverkauftes Produkt an. Hältst du zu mir?“* – Nun, nein. Aber Joule kann Ihre Zielgruppenansprache verbessern. Machen wir zuerst das.  
*„Kann es diesen Vertrag pruefen und alles markieren, worüber ich mir Sorgen machen sollte?“* – Kann es. *„Und die Änderungen abschicken, bevor das Unagi-Sushi da ist?“* – Überarbeiteter Vertrag liegt zur Pruefung vor. Das war ein Kopf-an-Kopf-Rennen!  
*„Kann es mir sagen, ob uns irgendetwas über das Budget bringt?“* – Aber sicher. Sogar die Straußenfedern.  
*„Mein Flug wurde gestrichen!“* – Vor 11 Minuten. Ich habe bereits einen Ersatzflug für Sie gefunden.  
*„Kann Joule ein besseres Team für mein Kind finden?“* – Papa, schau mal, ein Schmetterling! Bist du sicher, dass es am Team liegt?  
*„Kann Joule mir ein Update zu unserem Lieferanten geben? Werden sie puenktlich liefern? Und was kostet es uns, wenn sie es nicht tun? Kannst du mir drei Optionen geben?“* – Ja.  
*„Zeig mir unsere Cashflows. Priorisiere... Es ist kompliziert.“* – Sicher. Absolut. Erledigt. Besser geht es nicht.  
*Begruessen Sie Christian Klein, Chief Executive Officer von SAP.*

---

## 2. Eröffnung: Das Einhorn und die Grenzen von Standard-LLMs

**Christian Klein:**  
Das Video hat es auf den Punkt gebracht. Vor so einem Publikum die Keynote zu halten – besser wird es wirklich nicht. Willkommen zur SAP Connect in Las Vegas! Vor gerade einmal fuenf Monaten, auf der Sapphire, haben wir das autonome Unternehmen vorgestellt. Wir nannten es den Beginn von etwas Besserem.  
Und um es für Sie wirklich besser zu machen, hatten unsere Entwickler einen extrem arbeitsintensiven Sommer. Ihre Arbeit hat den Weg geebnet, um Ihnen heute das autonome Unternehmen live im Einsatz zu zeigen – untermauert durch echte Kundenberichte.

Auf der Sapphire habe ich die Zeichnung eines Einhorns gezeigt, vollständig generiert von einem fuehrenden Frontier-KI-Modell. Es sah gut aus, aber meine Tochter erkannte sofort: Dieses Einhorn hat drei Ohren.  
Meine Botschaft war einfach: KI kann beeindruckend sein, aber im Geschäftsleben reicht „beeindruckend“ nicht aus. KI muss präzise sein.  
Im Sommer fragte mich meine Tochter, ob ich auf der Arbeit immer noch Einhörner zeichne. Also haben wir wieder eines zusammen gezeichnet. Diesmal waren zwei Dinge anders:  
1. Das Einhorn steht direkt vor unserem Hauptsitz. Es sieht fantastisch aus.  
2. Es hat tatsächlich nur zwei Ohren.  
Die Frontier-Modelle sind besser geworden, daran haben wir keinen Verdienst.

Aber hier ist der entscheidende Punkt: Wenn Sie ein Modell bitten, ein Einhorn zu zeichnen, erhalten Sie ein tolles Bild. Wenn Sie dasselbe Modell jedoch fragen, welcher Ihrer Lieferanten naechste Woche liefern wird, raet es blind. LLMs haben nach wie vor keine Ahnung, wie Ihr Unternehmen funktioniert.  
Genau deshalb haben wir das Einhorn diesmal nicht in einem einfachen Chat-Fenster generiert, sondern in **Joule Work**. Denn Joule Work kann beides: ein Einhorn zeichnen und gleichzeitig Ihr Unternehmen von Grund auf verstehen.

---

## 3. Joule Work: Der neue Interaktions-Layer für 400 Millionen Nutzer

**Christian Klein:**  
Seit der Sapphire haben wir mit Hunderten von Kunden daran gearbeitet, Joule Work als neue zentrale Interaktionsebene (Engagement Layer) einzufuehren. Ab diesem Monat rollen wir Joule Work für alle SAP-Kunden aus.  
Für SAP und für Sie ist das ein Meilenstein. Seit Jahrzehnten mussten Anwender lernen, wie SAP funktioniert: Transaktionscodes auswendig lernen, Daten nach Excel exportieren, Folien bauen. Die Endanwender mussten jede Aktion manuell anstoßen.  
Mit Joule Work koennen nun über 400 Millionen SAP-Nutzer in ihrer eigenen Sprache mit SAP interagieren – und Joule erledigt die Arbeit.

Joule Work stützt sich auf drei Säulen:
1. **Conversations (Dialoge):** Hier stellen Sie Fragen und delegieren Aufgaben. Joule leitet sie an den passenden Agenten weiter.
2. **Spaces (Arbeitsbereiche):** Hier visualisiert Joule SAP- und Non-SAP-Inhalte, analysiert Ihr Geschäft, unterstützt fundierte Entscheidungen und fördert die Zusammenarbeit im Team.
3. **Joule Studio:** Hier erweitern Sie SAP-Agenten über No-Code/n8n oder erstellen maßgeschneiderte eigene Agenten für Ihre Geschäftsanforderungen.

Joule Work läuft auf dem Desktop, auf dem Smartphone und direkt in den Tools, die Sie heute bereits nutzen. Dahinter sitzt die leistungsfähigste Business-AI-Engine der Branche. Joule greift auf unser Herzstück zu: den tiefen Geschäfts- und Datenkontext von SAP.  
Unser **Knowledge Graph** verknuepft über **7 Millionen Datenfelder, 500.000 Tabellen, mehr als 50.000 APIs** (inklusive interner APIs), 400 Datenprodukte und unser fundiertes SAP-Prozesswissen.  
Andere KI-Assistenten verstehen nur Teilaspekte – Daten aus einer PowerPoint-Folie, einer Excel-Tabelle oder einer E-Mail. Joule führt alles zusammen: den vollen Kontext Ihres Unternehmens aus SAP- und Drittsystemen. Genau deshalb raet Joule nicht.

Bei SAP nutzen unsere 110.000 Mitarbeiter Joule Work bereits produktiv für Hunderttausende Aufgaben pro Tag. In Kernfunktionen wie HR, Finance und Beschaffung verzeichnen wir Produktivitätssteigerungen von über 20 % – bei komplexen Analyse- und Planungsaufgaben liegt der Wert noch deutlich höher.

Joule verändert jede Rolle, auch meine als CEO. Frueher dauerte die Vorbereitung auf den vierteljährlichen Earnings Call drei Wochen – mit Abstimmungen zwischen Finance, Investor Relations und Kommunikation. Mit Joule schaffen wir das in Tagen. Ich frage Joule: *„Hilf mir bei der Vorbereitung auf den Q2 Earnings Call.“* Joule aggregiert interne Finanzdaten mit externen Analystenberichten, fasst das Quartal zusammen, stellt die KPIs in Joule Tables dar und antizipiert typische Analystenfragen samt Kernbotschaften.

Und noch ein wesentlicher Aspekt: **Joule Work ist offen.**  
Über unser **Agent-to-Agent Gateway** koennen Sie Joule aus beliebigen Dritt-KIs heraus aufrufen und erhalten dieselben abgesicherten Antworten. Umgekehrt koennen Sie über den SAP AI Agent Hub jeden registrierten Drittanbieter-Agenten finden und anbinden.

---

## 4. Deterministische Workflows statt Wahrscheinlichkeitsrechnung

**Christian Klein:**  
Bei vielen geschäftlichen Aufgaben reicht eine einfache Antwort nicht aus. Wenn Sie Gelder bewegen oder eine Gehaltsabrechnung durchfuehren, genügt keine Antwort, die „wahrscheinlich richtig“ ist. Sie brauchen jedes einzelne Mal das exakte, rechtskonforme und nachvollziehbare Ergebnis.  
Hier greifen die KI-Assistenten und Agenten unserer **Autonomous Suite**. Wir haben unser gesamtes Anwendungsportfolio in fuenf autonome Domänen unterteilt:
* Finance
* Spend (Beschaffung)
* Human Capital Management (HCM)
* Supply Chain
* Customer Experience (CX)  
sowie Industry AI.

Schulwerk wählt automatisch den passenden KI-Assistenten für die jeweilige Domäne aus (z. B. für Beschaffung oder Personalwesen). Der Assistent orchestriert die spezialisierten Agenten, die die operative Arbeit verrichten.  
Wie garantieren wir das richtige Ergebnis, obwohl LLMs von Natur aus probabilistisch sind und nur das statistisch wahrscheinlichste Wort raten?  
**Weil unsere KI-Agenten in die deterministischen Workflows unserer Applikationen eingebettet sind.** Sie greifen auf dieselben Daten zu, befolgen dieselben Geschäftsregeln und hinterlassen denselben lückenlosen Audit-Trail wie unsere Kernanwendungen.

Sie bestimmen den Grad der Autonomie: *Human in the loop* bei höheren Risiken, oder vollständig autonome Ausführung mit direktem Schreibzugriff in die Anwendungen.  
Seit der Sapphire haben wir über 20 Assistenten und mehr als 200 Agenten allgemein verfügbar gemacht. Bis Jahresende peilen wir über 400 Agenten an. Entscheidend ist aber nicht die Anzahl, sondern das betriebswirtschaftliche Ergebnis.

---

## 5. Die drei Säulen der SAP Business AI Platform

**Christian Klein:**  
Joule Work und die Assistenten funktionieren nur deshalb so präzise, weil sie auf der **Business AI Platform** aufsetzen. Sie besteht aus drei Säulen:
1. **Build (Erstellen):** Joule Studio bietet einen nahtlosen Übergang von No-Code zu Pro-Code. Sie koennen Agenten mit n8n erweitern oder voellig neue Agenten bauen. Zudem bieten wir Zugriff auf über 70 Modelle, um Lock-ins zu vermeiden und den Token-Verbrauch zu optimieren.
2. **Context (Kontext):** Das eigentliche Gehirn. Unser Knowledge Graph und die **Business Data Cloud** liefern die Ontologie und den Geschäftskontext sofort einsatzbereit – für SAP- und Non-SAP-Daten.
3. **Govern (Steuerung & Sicherheit):** Jeder Agent wird von SAP gesteuert und betrieben. SAP garantiert Identitaets- und Authentifizierungsmanagement, die Einhaltung gesetzlicher Vorgaben in über 60 Ländern und 26 Branchen sowie die Zertifizierung für Ihre Wirtschaftspruefer. Über LeanIX als AI Agent Hub haben Sie ein zentrales Inventar aller Agenten im Unternehmen.

Warum sollte man Agenten isoliert auf einer reinen LLM-Plattform bauen? Die Business AI Platform bietet freie Modellwahl, tiefsten Kontext und SAP-geführte Governance.

---

## 6. Architektur-Demo: M&A Onboarding & n8n-Erweiterung

**Manoj:**  
Joule Studio ist nativ mit unserer Kontextschicht verzahnt. Unser Knowledge Graph bildet Prozesse, Datenfluesse und Regeln ab, sodass Agenten unter Tausenden von Prozessen und über 7 Millionen Feldern die richtige Information finden.  
Die **SAP Business Data Cloud** harmonisiert diese Sicht: **SAP HANA Cloud und Dremio** ermöglichen den Zugriff auf verteilte Datenquellen; **Reltio** harmonisiert Stammdaten zu verlässlichen Profilen von Kunden, Produkten und Lieferanten. Für Vorhersagen nutzen wir zwei Engines: **RPT** (unsere eigene, auf SAP-Daten trainierte Modellfamilie) und **Tabular AI von Prior Labs**.

*Das Praxisszenario: M&A-Integration*  
Das Unternehmen Blue Peak hat NorthStar übernommen. 25 neue Mitarbeiter sollen starten. Normalerweise erfordert die Systemintegration pro Mitarbeiter mindestens 20 Stunden und Tausende Dollar. Mit Joule und der Autonomous Suite sinkt dieser Aufwand auf einen Bruchteil:

1. **Automatischer Arbeitsbereich:** Ana (HR Business Partner) oeffnet Joule Work. Ihr HR-Assistent hat bereits unmittelbar nach Unterzeichnung der Übernahme einen Onboarding-Plan und einen Arbeitsbereich erstellt – ohne dass Ana danach fragen musste.
2. **Non-SAP-Integration:** NorthStar nutzte ein anderes HR-System. Über **Dremio** werden die Datensätze direkt in SuccessFactors übernommen, ohne Kontextverlust.
3. **Lieferengpass & Wissensgraph:** Büroräume und Ausweise sind freigegeben, aber bei den Laptops droht ein Engpass: Nur 2 von 25 Geräten wären puenktlich lieferbar. Joule schlägt einen alternativen Lieferanten vor. Da der HR-Assistent diesen Vorgang noch nicht beherrscht, wandelt Ana die Empfehlung in eine Entwicklungsanforderung um. Fristen, Lieferant und Genehmigungsregeln werden über den Knowledge Graph automatisch angehaengt.
4. **Intent-based Development in Joule Studio:** Entwickler Brett erhält die Anforderung in natuerlicher Geschäftssprache. Joule Studio generiert die Loesung als **n8n-Workflow**. Der Workflow prueft den Primärlieferanten, wählt bei Engpässen einen freigegebenen Alternativlieferanten oder leitet die Anfrage an einen Beschaffungsassistenten weiter. Nach Tests schaltet Brett den Agenten frei.
5. **Freigabe & Ausführung:** Der erweiterte Agent findet im Lieferantennetzwerk sofort verfügbare Bestände. Ana gibt die Eilbestellung frei, der Einkaufsassistent schliesst den Vorgang ab, und die Onboarding-Pläne werden mit einem Klick an alle 25 Mitarbeiter verteilt.

---

## 7. Die Praxisreise: Von Beschaffung bis Kundenerlebnis

**Jan („Jerseys from Jersey“):**  
Jan führt als roter Faden durch ein fiktives Geschäftsmodell: ein Trikot-Unternehmen in New Jersey. Um die fuenf Domänen der Autonomous Suite greifbar zu machen, holt er echte Führungskräfte auf die Bühne.

### A. Beschaffung bei Novartis (Christoph Berkey, Head of Procurement)
* **Ausgangslage:** Hochreguliertes Pharma-Umfeld, Hunderte Kategorien, Tausende Lieferanten. Ausschreibungen, Angebotsanalysen und Verhandlungsvorbereitungen waren stark manuell und fehleranfaellig.
* **Einsatz:** Pilot mit dem **SAP Joule Sourcing Assistant** und Event Builder Agent.
* **Ergebnisse:**
  * **25 % schnellere Zykluszeiten** von der Anfrage bis zur Vergabe.
  * **35 % Produktivitätssteigerung** bei den Einkäufern.
* **Empfehlungen für die Praxis:**
  1. Zuerst die Datenbasis in Ordnung bringen (unzuverlässige Daten fuehren zu unzuverlässigen Agenten).
  2. Mit Prozessen starten, bei denen Fehlentscheidungen revidierbar sind.
  3. Die operativen Mitarbeiter einbinden und Change Management nicht unterschaetzen.

### B. Produktion & Qualitätskontrolle (Christina Riccorte)
* **Szenario:** Plötzlicher Nachfrageschub nach Trikots bei gleichzeitigem Qualitätsfehler: Aufdrucke lösen sich ab.
* **Wirkung der Agenten:**
  * Zusammenführung von Echtzeit-Verkaufs-, Bestands- und Produktionsdaten.
  * Ursachenanalyse: Stoff eines neuen Zulieferers erfüllt die Spezifikationen nicht.
  * Klare Differenzierung zwischen fehlerhaften Chargen zur Nacharbeit und echtem Ausschuss.
  * Automatischer Vergleich von Alternativlieferanten (Qualität, Preis, Lieferzeit: 1 Tag).
  * Nach Freigabe sofortige Anpassung der Produktions- und Transportplaene.

### C. HR & Belegschaft: Übernahme von TechWolf (Rebecca Carr, SAP SuccessFactors)
* **Herausforderung:** Die Kluft zwischen vorhandenen und kuenftig benoetigten Mitarbeiter-Skills ist eine der größten strategischen Hürden für Unternehmen.
* **Grosse Ankündigung: SAP übernimmt TechWolf.**
* **Technologie & Nutzen:**
  * TechWolf ist eine KI-native Work-Intelligence-Plattform mit einem **Context Graph for Work**.
  * Verknuepft Arbeitsaufgaben, vorhandene Mitarbeiterfähigkeiten und externe Arbeitsmarktsignale.
  * Integration direkt in den Core von SAP SuccessFactors (Workforce Planning, Recruiting, Talent Mobility, internes Weiterbildungsangebot).

### D. End-to-End Supply Chain bei Morgan Foods (Steve Hankins, CFO)
* **Hintergrund:** 125 Jahre altes Traditionsunternehmen, 800 Mitarbeiter, produziert private Label-Lebensmittel (Suppen, Bohnen) für alle großen US-Handelsketten mit extremen Saisonschwankungen.
* **Ergebnisse mit S/4HANA und IBP:**
  * Service-Level konstant über **99 %**.
  * Reaktionszeit auf grosse Kundenanfragen von **3 bis 4 Wochen auf 5 Minuten** gesenkt.
* **Kernbotschaft von Steve Hankins:**
  * Technologie ermöglicht Prozesse, aber das Fundament sind saubere Stammdaten.
  * **Menschliche Aufsicht ist unverzichtbar:** KI besitzt kein Urteilsvermoegen. Urteilsvermoegen basiert auf Erfahrung und bleibt dem Menschen vorbehalten.

### E. Finance & Zahlungsverkehr: Ankündigung von SAP Pay & Nestle (Luca Della Letta)
* **Grosse Ankündigung: SAP Pay**
  * Nativ in SAP Cloud ERP eingebetteter Zahlungsdienst für ausgehende Rechnungen.
  * Automatische Ausführung und Abstimmung (Reconciliation) direkt im ERP.
  * Unterstützt klassische Überweisungen, grenzüberschreitenden Zahlungsverkehr und digitale Währungen/Stablecoins.
  * Verkuerzt Implementierungszeiten von Monaten auf Tage und senkt die TCO um durchschnittlich **25 %**.

* **Forderungsmanagement bei Nestle (Luca Della Letta, IT & Digital Innovation Head):**
  * Globaler RISE with SAP S/4HANA Rollout über mehr als **140 Länder**.
  * **Clean Core als Voraussetzung:** Wenn Daten über fragmentierte Altsysteme verstreut sind, hat KI keine verlässliche Basis.
  * **Accounts Receivable Agent:** Priorisiert offene Posten automatisch nach Ausfallrisiko, Kundenhistorie, Rechnungsbetrag und Verzugstagen. Schlaegt naechste Aktionen vor und entwirft Mahnschreiben.
  * **Touchless Order Management:** Vollautomatisierter Auftragseingang und Durchlauf.
  * **Paradigmenwechsel:** Übergang von periodischen Planungszyklen zu kontinuierlicher Finanzplanung in Echtzeit.

### F. Branchen-KI & Kundenerlebnis bei PwC (Jill Notes, CAO)
* **These:** Generische KI scheitert an Branchenspezifika. Jede Industrie hat eigene regulatorische Anforderungen, Risikoprofile und Prozessdefinitionen.
* **Co-Innovation:** Entwicklung des **SAP Billing Assistant** mit PwC, um Fehlerquellen bei komplexen Abrechnungsprozessen direkt an der Quelle zu beseitigen.
* Ziel: Übergang zu autonomer Projektabwicklung im Professional Services Bereich.

---

## 8. Sicherheit, Zero Trust & KI-Governance

**Marielle Ehrmann:**  
Unternehmen fragen heute nicht mehr nur, wie schnell sie KI einfuehren koennen, sondern wie sie dies tun, ohne morgen auf den Titelseiten der Zeitungen zu landen.  
* **Bedrohungslage:** Ransomware-Angriffe werden durch KI heute in unter **22 Sekunden** ausgeführt (frueher 8 Stunden). Waehrend 83 % der Unternehmen taeglich KI nutzen, haben nur 13 % echte Transparenz über deren Aktivitäten. Die größte Bedrohung ist ungesteuerte KI.

**Was unter der Wasserlinie liegt:**
* **Zero Trust:** Pruefung von Identitaet, Geschäftszweck und Datensensibilitaet bei jedem einzelnen Agenten-Aufruf.
* **Compliance by Design:** DSGVO/GDPR, EU AI Act, DORA und NIS2 sind fest in der Architektur verankert.
* **Datenschutzgarantie:** Kundendaten bleiben Kundendaten und werden niemals zum Trainieren von Basismodellen genutzt.
* **ISO 42001 & SOX:** Unabhaengig zertifiziertes Governance-Framework.

**Die drei Kernfragen der Live-Governance:**
1. Wer verantwortet diese KI-Entscheidung?
2. Wer sieht in Echtzeit, was die KI gerade tut?
3. Wer kann sie stoppen?

**Die drei Stufen menschlicher Aufsicht:**
1. **Human in the loop:** Verbindliche Vorab-Genehmigung vor Ausführung der Aktion.
2. **Human on the loop:** Kontinuierliche Überwachung mit Möglichkeit zu Echtzeit-Interventionen.
3. **Human in command:** Letztinstanzliche Übersteuerungsgewalt bei kritischen Entscheidungen.  
*„Freedom within boundaries“:* Je autonomer ein Agent agiert, desto engmaschiger greifen die architektonischen Schutzplanken.

---

## 9. Abschluss & Change Management

**Christian Klein:**  
KI erfordert tiefgreifendes Change Management. Technologie allein führt nicht zum Ziel, wenn die Organisation nicht mitzieht. Dafür stellt SAP eine integrierte Toolchain bereit:
* **SAP Signavio:** Prueft, simuliert und analysiert Geschäftsprozesse vor und nach der KI-Einfuehrung und quantifiziert den betriebswirtschaftlichen Mehrwert.
* **LeanIX:** Erkennt und verwaltet alle SAP- und Non-SAP-Agenten in der Unternehmensarchitektur.
* **WalkMe:** Stellt sicher, dass Endanwender die Agenten workflow-übergreifend korrekt anwenden.
* **AI Migration Toolchain:** Beschleunigt Cloud-ERP-Migrationen und beendet die Ära langwieriger Multi-Millionen-Dollar-Projekte.
* **Ein Augenzwinkern für Nostalgiker:** Für GUI-Fans gibt es eine Retro-Version von Joule Work – im klassischen 90er-Jahre-Look, mit Statusleiste und komplett tastaturbedienbar ohne Maus.

**Fazit:**  
Der Wandel vollzieht sich jetzt: von manuellen Schritten zu vernetzten Workflows, von reaktivem Handeln zu praediktiven Entscheidungen, von isolierten Tabellenkalkulationen zu deterministischen, gesteuerten Prozessen mit menschlicher Aufsicht. Das autonome Unternehmen ist Realitaet.
