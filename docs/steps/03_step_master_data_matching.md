# Schritt 3: Stammdaten-Zuordnung (Wer ist der Kunde und was will er wirklich?)

In diesem Schritt schlagen wir die Brücke zwischen der Sprache des Kunden und den internen Katalogen unseres Unternehmens.

---

## 1. 🧭 Einordnung in unsere Taxonomie

| Dimension | Wert | Bedeutung für Nicht-Techies |
|---|---|---|
| **Kognitives Primitiv** | **Matcher / Enricher** | Die Denkaufgabe ist wie das Nachschlagen im Telefonbuch oder Katalog: Zu welchem realen Kunden und welchem Artikel in unserem ERP gehört der Text auf der Bestellung? |
| **OODA-Phase** | **Orient (Einordnen)** | Wir bringen die externe Information in Bezug zu unserem eigenen Unternehmen und reichern sie mit Stammdaten an. |
| **Reversibilität & Risiko** | **Stufe 2 von 5 (Moderat)** | Wenn wir den falschen Kunden oder das falsche Produkt zuordnen, fällt das meist bei der Kreditprüfung (Schritt 4) oder Auftragsbestätigung auf. Ein falsches Produkt zu liefern wäre allerdings peinlich und teuer. |

---

## 2. 🏢 Worum geht es hier im echten Leben? (Die Unternehmens-Realität)

### Die Alltagsszene
Ein Kunde schreibt in seine Bestellung: *„Wir bestellen 10x Bürostuhl Comfort rot zum Preis von je 250 €.“*  
Das Problem: In unserem ERP-System gibt es keinen Artikel, der so heißt! Bei uns im Katalog heißt der Artikel offiziell `ART-99238 Drehstuhl Ergonomic Pro (Polster: Bordeauxrot)`. 

Außerdem schreibt der Kunde als Absender: *„Siemens Berlin“*. Aber in unserem System gibt es zwanzig verschiedene Siemens-Einträge: *Siemens AG Berlin-Mitte*, *Siemens Healthineers Adlershof*, *Siemens Energy Spandau*... Zu welcher Niederlassung gehört die Bestellung? Welches Kundenkonto ist das richtige?

### Was kann das alles sein? (Praxis-Beispiele & Belege)
1. **Die eigene Teilenummer des Kunden („Kundenmaterial“):** Große Kunden (z. B. Automobilbauer) bestellen niemals mit deinen Teilenummern. Sie schreiben ihre eigene Artikelnummer `BMW-Teil-4401` auf die Bestellung. Dein System muss wissen: `BMW-Teil-4401 = Unser Teil XYZ-99`.
2. **Umgangssprachliche Bezeichnungen:** Der Kunde bestellt *„Die blauen Arbeitshandschuhe Größe 10“* oder *„Das Schmiermittel aus der Frühjahrsaktion“*.
3. **Internationale Barcodes (EAN / GTIN):** Der Kunde nennt den 13-stelligen Supermarkt-Barcode.
4. **Alte oder ausgelaufene Artikelnummern:** Der Kunde bestellt ein Produkt, das seit drei Monaten nicht mehr hergestellt wird. Das System muss wissen, was das offizielle Nachfolgeprodukt ist.
5. **Getrennte Adressen (Lieferort vs. Rechnungsempfänger):** Die Lieferung soll an die Baustelle in Dresden (*„Warenempfänger“*), aber die Rechnung muss an die Konzernzentrale in München geschickt werden (*„Rechnungsempfänger“*).

### Typische Stolpersteine & Chaos
* **Tippfehler in Nummern:** Aus Versehen `ART-108` statt `ART-1008` geschrieben – ein völlig anderes Produkt!
* **Verwechslungsgefahr bei Namen:** *„Müller Bäckerei OHG“* vs. *„Müller Backstube GmbH & Co. KG“*.
* **Mengenumrechnungen:** Der Kunde bestellt „10 Kartons“, aber im ERP wird in „Stück“ gelagert (1 Karton = 24 Stück). Wenn hier nicht richtig umgerechnet wird, bekommt der Kunde 10 Stück statt 240!

---

## 3. ⚖️ Die fachliche Entscheidung (Was muss geprüft werden?)

Die Kernfrage lautet: **Haben wir zweifelsfrei und eindeutig den richtigen Kunden und das richtige Produkt identifiziert?**

* **Gutfall (Eindeutiger Match):** Das System findet genau einen passenden Kunden und genau ein passendes Material mit einer Sicherheit von über 90 %. Der Beleg wird automatisch mit den Stammdaten (Zahlungsbedingungen, Steuernummer, Werk, Versandart) angereichert und wandert weiter zu Schritt 4.
* **Mehrdeutigkeit (Zweifelsfall):** Es gibt drei sehr ähnliche Produkte (z. B. mit Armlehne oder ohne Armlehne). Ein Mensch muss entscheiden!
* **Nicht vorhanden (Neuaufnahme):** Der Kunde existiert noch gar nicht im System (Neukunde) oder das Produkt wird nicht mehr geführt.

---

## 4. 🎛️ Die 5 Automatisierungs-Stufen aus der Praxisperspektive

### 1. Deterministisch (Exakte Suche)
* **Wie es funktioniert:** Das System sucht starr nach einer 100%igen Übereinstimmung der Nummer in der Datenbank.
* **Vorteil:** Schnell wie der Blitz, absolut fehlerfrei, 0 Inferenzkosten.
* **Nachteil:** Null Toleranz! Ein einziger Buchstabendreher führt zum Abbruch.

### 2. Single-Turn ML (Intelligente Ähnlichkeitssuche / Fuzzy Matching)
* **Wie es funktioniert:** Eine smarte Text-Ähnlichkeitssuche in der Datenbank (sogenannte Fuzzy- oder Trigramm-Suche) verzeiht Rechtschreibfehler. Sie erkennt, dass *„Bürostuhl Comfrot“* zu 92 % mit *„Bürostuhl Comfort“* übereinstimmt.
* **Vorteil:** Läuft in Millisekunden, kostet keine KI-Tokens und löst 90 % aller Tippfehler völlig lautlos im Hintergrund.

### 3. Copilot (Der Disponent wählt am Bildschirm aus)
* **Wie es funktioniert:** Wenn die Ähnlichkeitssuche mehrere Kandidaten findet (z. B. Score 75–85 %), öffnet sich ein kleines Fenster: *„Kunde schrieb: Stuhl Comfort. Meinen Sie: A) Comfort mit Lehne, B) Comfort ohne Lehne oder C) Comfort Leder?“* Der Sachbearbeiter klickt die richtige Option an.
* **Bewertung:** **Perfekt für Zweifelsfälle!** Schützt vor teuren Fehl-Lieferungen.

### 4. Workflow (SAP Build / n8n Flow) – Der Champion der Praxis!
* **Wie es funktioniert:**
  1. Zuerst exakter Abgleich. Treffer? Sofort weiter!
  2. Kein Treffer? Intelligente Ähnlichkeitssuche (Fuzzy-Match).
  3. Liegt die Trefferwahrscheinlichkeit über 88 %? Automatisch zuordnen und durchlaufen lassen.
  4. Nur wenn zwei Produkte fast gleich wahrscheinlich sind, poppt die Copilot-Auswahlmaske für den Menschen auf.
* **Ergebnis:** 94 % Dunkelverarbeitung bei 0 % Fehlerrisiko.

### 5. Autonomer Agent (Joule AI Agent / KI-Team)
* **Wie es funktioniert:** Ein generatives Sprachmodell versucht freihändig zu erraten, welches Material gemeint ist.
* **Bewertung:** **Sehr gefährlich!** Warum? Weil generative KI zu Halluzinationen neigt. Sie erfindet im Zweifel plausible Artikelnummern, die es im Lager gar nicht gibt. Stammdaten-Matching gehört in eine strukturierte Datenbank-Suche, nicht in kreative KI-Texterzeugung!

---

## 5. 🎤 Storytelling & Berater-Kompass (Wie erkläre ich das dem Kunden?)

### Der 30-Sekunden-Elevator-Pitch fürs Management
> *„Sehr geehrte Damen und Herren, Kunden bestellen selten mit Ihren exakten internen Katalognummern. Wenn Ihre Mitarbeiter jedes Mal händisch im System suchen müssen, welches Teil gemeint ist, verlieren Sie pro Auftrag mehrere Minuten. Mit einer automatischen Ähnlichkeitssuche und einem schlanken Workflow ordnen wir 95 % aller Produkte und Kunden in Sekundenbruchteilen fehlerfrei zu. Nur wenn wirklich Verwechslungsgefahr besteht, fragen wir den Sachbearbeiter.“*

### Typische Denkfehler von Führungskräften
* **Denkfehler:** *„Wir lassen die Kundenbestellung einfach von ChatGPT matchen, das ist doch so schlau!“*
* **Deine Antwort als Berater:** *„Vorsicht! Ein großes Sprachmodell ist ein kreativer Schreiber, kein Buchhalter. Wenn es eine Artikelnummer nicht kennt, erfindet es im schlimmsten Fall eine, die es gar nicht gibt. Nutzen Sie stattdessen eine bewährte In-Memory Ähnlichkeitssuche in der Datenbank – das ist schneller, kostenlos und 100 % sicher gegen Halluzinationen.“*

### Die goldene Beraterregel
> **„Kreativität ist an Schritt 3 der Feind! Verwende deterministische Datenbank-Suchen und intelligente Ähnlichkeitsabgleiche statt generativer Halluzinationen.“**

---

## 6. 🎓 Studenten-Spickzettel & Prüfungsfragen

### ❓ Prüfungsfrage 1
**Frage:** *Warum stellt das generative Halluzinieren von Sprachmodellen bei der Stammdaten-Zuordnung ein so großes Risiko dar?*  
**Musterantwort:** *Große Sprachmodelle (LLMs) sind darauf trainiert, sprachlich plausible Antworten zu generieren, nicht aber Fakten exakt auf Datenbanken abzubilden. Halluziniert ein Modell eine falsche Artikelnummer, wird im schlimmsten Fall Ware im Wert von tausenden Euro kommissioniert und versendet, die der Kunde nie bestellt hat.*

### ❓ Prüfungsfrage 2
**Frage:** *Was versteht man unter einer „Kundenmaterial-Nummer“ und warum ist sie für die Auftragsabwicklung so wichtig?*  
**Musterantwort:** *Großkunden verwalten eingekaufte Teile unter ihren eigenen internen Materialnummern. Da sie diese auf ihren Bestellungen angeben, muss das Lieferanten-System eine Übersetzungstabelle (Kunden-Material-Info-Satz) pflegen, um die Kunden-Teilenummer automatisch der internen ERP-Artikelnummer zuzuordnen.*
