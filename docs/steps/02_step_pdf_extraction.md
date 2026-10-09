# Schritt 2: Belegdaten auslesen (Aus Chaos strukturierte Daten machen)

In diesem Schritt verwandeln wir unordentliche Kundendokumente in saubere, digitale Datenfelder, mit denen Computersysteme überhaupt erst rechnen können.

---

## 1. 🧭 Einordnung in unsere Taxonomie

| Dimension | Wert | Bedeutung für Nicht-Techies |
|---|---|---|
| **Kognitives Primitiv** | **Extractor / Transformer** | Die Denkaufgabe ist wie das Ausfüllen eines Formulars anhand eines Textes: Was ist die Bestellnummer? Welche Artikel will der Kunde? |
| **OODA-Phase** | **Observe (Beobachten)** | Wir lesen und strukturieren die Information. Noch wird nichts im ERP-System gebucht oder verbindlich verändert. |
| **Reversibilität & Risiko** | **Stufe 1 von 5 (Gering)** | Wenn ein Feld falsch ausgelesen wird, merkt man es spätestens bei den Prüfungen in Schritt 3 und 4. Es entsteht noch kein finanzieller Schaden. |

---

## 2. 🏢 Worum geht es hier im echten Leben? (Die Unternehmens-Realität)

### Die Alltagsszene
Jeder Kunde schickt seine Bestellungen in einem völlig anderen Layout! Die Firma Müller nutzt ein modernes zweispaltiges PDF mit Firmenlogo rechts oben. Die Firma Meier faxt einen handgeschriebenen Bestellzettel mit Kaffeeflecken. Ein dritter Kunde schreibt einfach fünf Zeilen Text direkt in die E-Mail. 

Wenn Sachbearbeiter diese Daten von Hand abtippen müssen („Abtipp-Knechte“), verbringen sie 5 bis 10 Minuten pro Beleg mit stupider Copy-Paste-Arbeit – und tippen dabei unweigerlich Zahlendreher ein.

### Was kann das alles sein? (Praxis-Beispiele & Belege)
1. **Das digitale PDF mit Textschicht:** Erzeugt aus dem Warenwirtschaftssystem des Kunden. Perfekt lesbar.
2. **Der eingescannte Papierbeleg / Fax:** Als Bilddatei (JPEG oder Bitmap-PDF). Häufig schief eingescannt, Stempel verdecken Zahlen, handschriftliche Vermerke am Rand (*„Bitte bis Freitag liefern!“*).
3. **Mehrseitige Auftragstabellen:** 10 bis 50 einzelne Bestellpositionen, verteilt über mehrere Seiten mit Zwischensummen, Spaltenüberschriften und Rabattzeilen.
4. **Bestellungen direkt im E-Mail-Text:** Kein Anhang, sondern Fließtext: *„Guten Tag, wir bestellen hiermit 5x Schreibtisch Milano, 10x Bürostuhl Ergoflex und 2x Rollcontainer Grau.“*
5. **Kaufmännische Sonderwünsche:** Zusatzangaben wie *„Ihre Angebotsnummer: AN-2026-99“*, abweichende Lieferadressen oder projektbezogene Kostenstellen des Kunden.

### Typische Stolpersteine & Daten-Fallen
* **Dezimaltrennzeichen & Währungen:** Schreibt der Kunde `1.500,00 €` (deutsche Schreibweise: eintausendfünfhundert) oder `1,500.00 $` (US-Schreibweise)? Ein Fehler hier verhundertfacht den Bestellwert!
* **Datumsformate:** Bedeutet `03/04/2026` der 3. April oder der 4. März?
* **Mengeneinheiten:** Bestellt der Kunde *„10 Stück“*, *„10 Packungen à 12 Stück“*, *„10 Kartons“* oder *„2 Paletten“*?
* **Tabellenumbruch:** Eine lange Produktbezeichnung bricht über drei Zeilen um – ein dummes System hält jede Zeile für ein eigenes Produkt.

---

## 3. ⚖️ Die fachliche Entscheidung (Was muss geprüft werden?)

Die zentrale Aufgabe lautet: **Aus dem unstrukturierten Dokument müssen alle Pflichtfelder für einen gültigen Auftrag fehlerfrei extrahiert werden.**

* **Kopfdaten (Gilt für die gesamte Bestellung):**
  * Wer ist der Kunde? (Name, Anschrift, Absender)
  * Welche Bestellnummer hat der Kunde vergeben? (Purchase Order Number)
  * Wohin soll geliefert werden? (Lieferadresse vs. Rechnungsadresse)
  * Bis wann wird die Ware gebraucht? (Wunschlieferdatum)
* **Positionsdaten (Die einzelnen Zeilen):**
  * Positionsnummer (10, 20, 30...)
  * Artikelbezeichnung oder Teilenummer des Kunden
  * Bestellmenge und Mengeneinheit (z. B. 25 Stück)
  * Vereinbarter Einzelpreis und Währung
* **Mathematischer Plausibilitäts-Check:**
  * Ergibt `Menge × Einzelpreis = Positions-Gesamtpreis`?
  * Ergibt die Summe aller Positionen die Gesamtsumme auf dem Beleg?

---

## 4. 🎛️ Die 5 Automatisierungs-Stufen aus der Praxisperspektive

### 1. Deterministisch (Starre Koordinaten & Vorlagen)
* **Wie es funktioniert:** Man legt für jeden Kunden eine feste Schablone an: *„In Zentimeter 5 von oben und 10 von links steht immer die Bestellnummer.“*
* **Bewertung:** **Extrem fehleranfällig!** Sobald der Kunde sein Logo ändert oder eine Zeile mehr schreibt, rutschen alle Koordinaten ab und das System liest Unsinn.

### 2. Single-Turn KI (Isolierte Dokumenten-KI)
* **Wie es funktioniert:** Ein Dokumenten-KI-Service (wie SAP Document Information Extraction / GenAI Hub) schaut sich das Dokument wie ein Mensch an und füllt ein fest definiertes Daten-Schema aus.
* **Vorteil:** Versteht Layouts völlig flexibel. Erkennt Tabellenzeilen auch über Seitengrenzen hinweg.
* **Nachteil:** Kostet wenige Bruchteile eines Cents pro Seite.

### 3. Copilot (Split-Screen Überprüfung am Bildschirm)
* **Wie es funktioniert:** Der Sachbearbeiter sieht auf dem linken Bildschirm das Original-PDF und auf dem rechten Bildschirm die von der KI erkannten Daten. Er prüft jedes Feld und klickt auf „Bestätigen“.
* **Bewertung:** Sinnvoll als Übergangslösung bei extrem schlechter Scan-Qualität oder Handschriften. Für Standard-PDFs bremst es jedoch die Sachbearbeiter unnötig aus.

### 4. Workflow (SAP Build / n8n Flow) – Der Champion der Praxis!
* **Wie es funktioniert:** Die intelligente Dunkelverarbeitung:
  1. Die KI liest alle Datenfelder aus und vergibt für jedes Feld einen Konfidenzwert (z. B. `Bestellnummer: 99 % sicher`).
  2. Der Workflow rechnet die Summen gegen: Wenn alle Positionen aufgehen und alle Konfidenzen über 90 % liegen, läuft der Beleg **völlig dunkel** ohne Menschen durch!
  3. Nur wenn ein Wert unplausibel ist (z. B. Summe stimmt nicht), poppt die Split-Screen-Korrekturmaske für den Sachbearbeiter auf.
* **Ergebnis:** 90–95 % Dunkelverarbeitung, maximale Zeitersparnis.

### 5. Autonomer Agent (Joule AI Agent / KI-Team)
* **Wie es funktioniert:** Ein Agententeam vergleicht das Dokument mit alten Angeboten, diskutiert im Hintergrund über unleserliche Pixel und probiert verschiedene Lösungsansätze aus.
* **Bewertung:** Zu langsam und viel zu teuer für eine reine Leseaufgabe. Extraktion verlangt nach präziser Datenstruktur, nicht nach freiem Denken.

---

## 5. 🎤 Storytelling & Berater-Kompass (Wie erkläre ich das dem Kunden?)

### Der 30-Sekunden-Elevator-Pitch fürs Management
> *„Frau Leiterin Auftragsabwicklung, Ihre Mitarbeiter tippen heute jeden Tag hunderte Bestellnummern und Positionen manuell aus PDFs ab. Mit moderner Dokumenten-KI und einem schlanken Workflow lesen wir 95 % aller Belege innerhalb von Sekunden vollautomatisch aus. Ihre Mitarbeiter müssen nur noch bei unleserlichen Scans eingreifen – das spart hunderte Arbeitsstunden im Monat und verhindert teure Tippfehler.“*

### Typische Denkfehler von Führungskräften
* **Denkfehler:** *„Wir haben doch schon einen OCR-Scanner, der Text erkennt. Reicht das nicht?“*
* **Deine Antwort als Berater:** *„Reines OCR erkennt nur Buchstaben, versteht aber keinen Inhalt. Ein OCR-Scanner weiß nicht, ob die Zahl `100` eine Menge, ein Preis, eine Postleitzahl oder eine Seitenzahl ist. Erst unsere Dokumenten-KI versteht den kaufmännischen Sinn der Tabelle!“*

### Die goldene Beraterregel
> **„Extraktion erfordert mathematische Präzision und strikte Schematreue, keine dichterische Kreativität! Schütze den Prozess immer durch automatische Plausibilitätsprüfungen.“**

---

## 6. 🎓 Studenten-Spickzettel & Prüfungsfragen

### ❓ Prüfungsfrage 1
**Frage:** *Warum scheitern klassische, vorlagenbasierte OCR-Lösungen in der modernen Unternehmenspraxis so häufig?*  
**Musterantwort:** *Weil Vorlagen auf starren Positionskoordinaten basieren. Da jeder Kunde ein individuelles Beleglayout verwendet und sich Layouts durch Software-Updates oder Zwischenzeilen ständig verschieben, müssten tausende Schablonen manuell gepflegt werden. Moderne KI-Extraktion hingegen versteht semantische Konzepte unabhängig von der Position im Dokument.*

### ❓ Prüfungsfrage 2
**Frage:** *Wie sichert man eine vollautomatische Dunkelverarbeitung (STP) bei der Belegextraktion gegen KI-Fehler ab?*  
**Musterantwort:** *Durch programmatische Plausibilitätsprüfungen im Workflow: Wenn Pflichtfelder fehlen, die mathematische Quersumme (Menge × Preis) nicht mit der Gesamtsumme übereinstimmt oder der Konfidenzwert der KI unter einen definierten Schwellenwert (z. B. 90 %) fällt, wird der Beleg automatisch zur manuellen Prüfung ausgesteuert.*
