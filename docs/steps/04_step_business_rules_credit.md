# Schritt 4: Kaufmännische Prüfungen & Bonität (Dürfen und können wir liefern?)

In diesem Schritt schlägt das kaufmännische Gewissen des Unternehmens zu. Umsatz ist erst dann ein Gewinn, wenn das Geld auch auf dem Bankkonto landet und wir die Ware tatsächlich liefern können.

---

## 1. 🧭 Einordnung in unsere Taxonomie

| Dimension | Wert | Bedeutung für Nicht-Techies |
|---|---|---|
| **Kognitives Primitiv** | **Evaluator / Reasoner** | Die Denkaufgabe ist wie die eines Kreditprüfers und Disponenten: Passt das Risiko? Haben wir genug Ware? Halten wir unsere Regeln ein? |
| **OODA-Phase** | **Decide (Entscheiden)** | Hier fällt die geschäftliche Entscheidung über Annahme, Ablehnung oder Sonderprüfung der Bestellung. |
| **Reversibilität & Risiko** | **Stufe 3 von 5 (Erheblich)** | Eine Fehlentscheidung hier kostet bares Geld: Entweder liefern wir an einen Kunden, der pleitegeht (Forderungsausfall), oder wir verärgern einen guten Kunden durch unberechtigte Lieferstopps. |

---

## 2. 🏢 Worum geht es hier im echten Leben? (Die Unternehmens-Realität)

### Die Alltagsszene
Ein Kunde bestellt 50 Spezialmotoren im Gesamtwert von 120.000 € auf Rechnung mit 30 Tagen Zahlungsziel. Der Vertriebsmitarbeiter jubelt schon über seine Provision. 

Doch jetzt kommt Schritt 4: Das System stellt fest, dass der Kunde ein Kreditlimit von 150.000 € hat, aber bereits offene Rechnungen über 90.000 € unbezahlt sind. Mit der neuen Bestellung würde das Limit um 60.000 € überzogen! Gleichzeitig zeigt das Lager: Wir haben nur 20 Motoren vorrätig, die restlichen 30 können erst in vier Wochen produziert werden. 

Darf der Auftrag trotzdem angenommen werden? Wer haftet, wenn der Kunde nicht bezahlt?

### Was kann das alles sein? (Praxis-Beispiele & Belege)
1. **Die Kreditlimit- und Bonitätsprüfung:** Ist der Kunde liquide? Gibt es negative Schufa-/Creditreform-Auskünfte? Hat er alte Rechnungen trotz Mahnung nicht bezahlt?
2. **Die Lieferbarkeitsprüfung (ATP – Available to Promise):** Ist die Ware im Lager physisch vorhanden oder bereits für einen anderen Kunden reserviert? Wann kann frühestens geliefert werden?
3. **Preis- und Konditionsprüfungen:** Stimmen die Preise auf der Bestellung mit den vereinbarten Konditionen überein? Wurden unberechtigte Sonderrabatte (z. B. 15 % Skonto) eigenmächtig abgezogen? Liegt der Auftrag über dem Mindestbestellwert?
4. **Gesetzliche Embargo- und Sanktionsprüfungen:** Steht der Kunde oder das Zielland auf einer Anti-Terror-Liste? Handelt es sich um Dual-Use-Güter, die militärisch genutzt werden könnten? *(Rechtliches Totalrisiko bei Verstößen!)*
5. **Kunden-Sperren:** Wurde der Kunde wegen wiederholter Streitigkeiten manuell mit einer Liefersperre belegt?

### Typische Stolpersteine & Konflikte im Unternehmen
* **Der ewige Krieg zwischen Vertrieb und Finanzbuchhaltung:** Der Vertrieb will verkaufen („Der Kunde zahlt schon, das ist ein wichtiger Partner!“), die Finanzabteilung will Risiken minimieren („Kein Cent ohne Vorkasse!“).
* **Der unberechtigte Stopp von Top-Kunden:** Ein langjähriger VIP-Kunde überschreitet sein Limit um lächerliche 500 € – ein starres System stoppt die Lieferung sofort und verärgert den wichtigsten Kunden des Hauses.
* **Geisterbestände:** Das System zeigt 10 Stück im Lager an, aber in der Realität sind drei davon im Hochregal beschädigt oder unauffindbar.

---

## 3. ⚖️ Die fachliche Entscheidung (Was muss geprüft werden?)

Hier werden vier klare Fragen beantwortet:
1. **Bonität:** Liegt der offene Gesamtwert (bestehende Schulden + neuer Auftrag) innerhalb des genehmigten Kreditlimits?
2. **Bestand:** Können wir die gewünschte Menge zum Wunschtermin liefern (Voll- oder Teillieferung)?
3. **Marge:** Liegt der Preis innerhalb der erlaubten Rabattrichtlinien?
4. **Recht:** Ist der Kunde export- und sanktionsrechtlich unbedenklich?

* **Gutfall (Grünes Licht):** Alle vier Ampeln sind grün. Der Auftrag wird sofort für die automatische Verbuchung in Schritt 5 freigegeben.
* **Kreditwarnung / Kreditsperre:** Der Beleg wird automatisch angehalten. Ein Kreditmanager muss den Fall prüfen und gegebenenfalls eine Sonderfreigabe erteilen.
* **Lieferengpass:** Der Kunde muss über eine Teillieferung oder ein neues Lieferdatum informiert werden.

---

## 4. 🎛️ Die 5 Automatisierungs-Stufen aus der Praxisperspektive

### 1. Deterministisch (Feste Geschäftsregeln / Entscheidungstabellen)
* **Wie es funktioniert:** Klare, unverrückbare Regeln: *„WENN Gesamtwert > Kreditlimit DANN Liefersperre setzen.“*
* **Vorteil:** 100 % transparent, absolut auditierbar, vom Wirtschaftsprüfer sofort genehmigt, 0 € KI-Kosten.
* **Nachteil:** Null Fingerspitzengefühl. Erkennt keine Ausnahmen für gute Kunden.

### 2. Single-Turn ML (Statistischer Bonitäts-Score)
* **Wie es funktioniert:** Ein Rechenmodell analysiert das Zahlungsverhalten der letzten zwei Jahre und berechnet eine präzise Ausfallwahrscheinlichkeit (z. B. *„Ausfallrisiko: 0,8 %“*).
* **Vorteil:** Viel schlauer als starre Grenzwerte. Erkennt frühzeitig Kunden, deren Zahlungsdisziplin langsam nachlässt.

### 3. Copilot (Der Kreditmanager entscheidet mit KI-Zusammenfassung) – Hier ein echter Star!
* **Wie es funktioniert:** Bei einer Kreditlimit-Überschreitung öffnet sich die Prüfmaske des Finanzleiters. Ein Copilot fasst den Fall in drei Sätzen zusammen:  
  *„Achtung: Limit um 8 % überschritten. Kunde Müller ist seit 12 Jahren Kunde, hat bisher 1,2 Mio. € Umsatz ohne einen einzigen Ausfall generiert. Aktuelle Verzögerung liegt an einem bekannten Großprojekt. Empfehlung: Einmalige Ausnahme für 14 Tage genehmigen.“*  
  Der Manager klickt auf **„Genehmigen“**.
* **Bewertung:** **Perfekter Einsatzort für einen Copiloten!** Der Mensch behält die finanzielle Verantwortung, spart aber 15 Minuten manuelle Recherche in alten Rechnungen.

### 4. Workflow (SAP Build / n8n Flow mit DMN-Regeln) – Der Standardweg
* **Wie es funktioniert:** 
  1. 90 % aller Standard-Aufträge (Kunde solvent, Ware da) laufen vollautomatisch im Hintergrund durch.
  2. Bei VIP-Kunden erlaubt der Workflow eine automatische Toleranz von bis zu 5 % Überziehung.
  3. Nur wenn echte Schwellenwerte gerissen werden, erzeugt der Workflow eine Freigabe-Aufgabe für den zuständigen Abteilungsleiter.
* **Ergebnis:** Maximale Geschwindigkeit bei lückenloser Risikokontrolle.

### 5. Autonomer Agent (Joule AI Agent / KI-Team)
* **Wie es funktioniert:** Ein autonomer Agent verhandelt im Hintergrund selbstständig mit der Bank oder dem Kunden über Kreditlinien.
* **Bewertung:** **Extrem riskant!** Im Finanz- und Kreditwesen verbieten Compliance- und Revisionsvorschriften (SOX, MaRisk), dass eine generative KI eigenmächtig Kreditrisiken übernimmt oder Kreditsperren löscht.

---

## 5. 🎤 Storytelling & Berater-Kompass (Wie erkläre ich das dem Kunden?)

### Der 30-Sekunden-Elevator-Pitch fürs Management
> *„Herr Finanzvorstand, an Schritt 4 sichern wir Ihre Liquidität ab. Anstatt dass Aufträge tagelang in E-Mail-Schleifen zwischen Vertrieb und Buchhaltung hängen, laufen 90 % aller unkritischen Bestellungen in Sekunden durch. Bei echten Risikofällen liefert unser System dem Kreditmanager alle Fakten auf einen Blick zur sofortigen Freigabe. So verhindern Sie Zahlungsausfälle, ohne den Vertrieb auszubremsen.“*

### Typische Denkfehler von Führungskräften
* **Denkfehler:** *„Lassen wir die Kreditprüfung einfach von einer autonomen KI entscheiden, dann sparen wir die Stelle des Kreditmanagers!“*
* **Deine Antwort als Berater:** *„Vorsicht! Wenn eine KI eigenmächtig riskante Kredite vergibt und die Firma pleitegeht, haftet die Geschäftsführung persönlich wegen mangelhafter Kontrollsysteme. Die Entscheidung über finanzielle Großrisiken muss immer beim Menschen bleiben (Human-in-the-Loop)!“*

### Die goldene Beraterregel
> **„Vertrauen ist gut, Revisionssicherheit ist besser: Deterministische Regeln für die Compliance, KI-Zusammenfassungen für die menschliche Ausnahmeentscheidung!“**

---

## 6. 🎓 Studenten-Spickzettel & Prüfungsfragen

### ❓ Prüfungsfrage 1
**Frage:** *Was versteht man unter einer ATP-Prüfung (Available-to-Promise) und warum muss sie vor der Auftragsbestätigung erfolgen?*  
**Musterantwort:** *Die ATP-Prüfung ermittelt die reale Lieferfähigkeit eines Produkts unter Berücksichtigung von aktuellem Lagerbestand, offenen Kundenreservierungen und geplanten Produktionszugängen. Sie verhindert, dass dem Kunden Liefertermine rechtsverbindlich zugesagt werden, die logistisch unmöglich einzuhalten sind.*

### ❓ Prüfungsfrage 2
**Frage:** *Warum ist ein Copilot mit menschlicher Freigabe an Schritt 4 betriebswirtschaftlich und rechtlich legitim, während er an Schritt 1 (Triage) ein Anti-Pattern darstellt?*  
**Musterantwort:** *An Schritt 1 herrscht geringes Risiko (Reversibilität 1), weshalb ein manueller Prüfstopp nur Kosten verursacht. An Schritt 4 hingegen geht es um existenzielle Kreditrisiken und rechtliche Haftung (Reversibilität 3). Hier schützt das Vier-Augen-Prinzip (Compliance / SOX) vor millionenschweren Zahlungsausfällen.*
