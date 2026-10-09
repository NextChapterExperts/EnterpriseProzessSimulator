# Schritt 1: E-Mail-Triage & Posteingang (Der digitale Türsteher)

Willkommen im ersten Schritt der Auftragsabwicklung! Bevor irgendetwas im Unternehmen gebucht oder verarbeitet werden kann, muss die Flut an eingehenden Nachrichten geordnet werden.

---

## 1. 🧭 Einordnung in unsere Taxonomie

| Dimension | Wert | Bedeutung für Nicht-Techies |
|---|---|---|
| **Kognitives Primitiv** | **Filter / Gatekeeper** | Die Denkaufgabe ist wie die eines Türstehers: Reinkommen oder draußen bleiben? Um welche Art von Post handelt es sich? |
| **OODA-Phase** | **Observe (Beobachten)** | Das Unternehmen nimmt erstmals Kontakt mit der Außenwelt wahr. Noch wird nichts entschieden oder verändert. |
| **Reversibilität & Risiko** | **Stufe 1 von 5 (Sehr gering)** | Ein Fehler hier richtet keinen finanziellen Schaden im ERP an. Wenn eine Mail falsch sortiert wird, verschiebt man sie einfach in den richtigen Ordner. |

---

## 2. 🏢 Worum geht es hier im echten Leben? (Die Unternehmens-Realität)

### Die Alltagsszene
Montagmorgen, 08:00 Uhr im Vertriebsinnendienst. Im gemeinsamen Gruppenpostfach `auftrag@firma.de` liegen 1.200 ungelesene E-Mails. Wenn Sachbearbeiter jede Mail von Hand öffnen, überfliegen und in Unterordner verschieben müssen, vergehen 2–3 Stunden wertvolle Arbeitszeit, bevor die erste reale Bestellung überhaupt bearbeitet werden kann.

### Was kann das alles sein? (Praxis-Beispiele & Belege)
In diesem Postfach landet buchstäblich **alles**:
1. **Die klassische PDF-Bestellung:** Ein Kunde schreibt „Guten Tag, anbei unsere offizielle Bestellung Nr. 45012 als PDF.“ *(Der Standard-Traumfall).*
2. **Die Freitext-Bestellung im Fließtext:** Kein Anhang, sondern direkt im Mail-Body: *„Hallo Peter, bitte schickt mir noch mal 20 Kartons von den blauen Ordnern wie letztes Mal an die Baustelle in Kassel. Dringend!“*
3. **Die wütende Reklamation:** *„Wo bleibt unsere Lieferung vom Donnerstag?! Wenn die Teile heute nicht da sind, stornieren wir alles!“* *(Darf auf keinen Fall als Neubestellung verarbeitet werden, sondern muss sofort mit Priorität zum Kundenservice!)*
4. **Reine Werbe-Mails & Spam:** Newsletter, Phishing, Angebote für Büromaterial.
5. **Automatische Abwesenheitsnotizen (Out-of-Office):** *„Ich bin bis zum 15. Oktober im Urlaub...“*
6. **Angebots- und Preisanfragen:** *„Können Sie uns ein unverbindliches Angebot für 500 Tische machen?“*
7. **Nachrichten aus Webformularen oder Portalen:** Strukturierte Webshop-Benachrichtigungen.

### Typische Stolpersteine & Chaos im Posteingang
* **Kunde antwortet auf einen uralten Mail-Verlauf:** Der Betreff lautet noch *„Re: Frohe Weihnachten 2024“*, aber im Anhang hängt plötzlich ein Großauftrag über 200.000 €.
* **Kombinierte Nachrichten:** Ein Kunde schreibt im selben Satz: *„Die letzte Lieferung war beschädigt (Reklamation), aber bitte schicken Sie uns trotzdem schon 10 neue Stück (Neubestellung).“*
* **Unlesbare Anhänge:** Gescannte Faxe mit Kaffeeflecken oder passwortgeschützte ZIP-Dateien.

---

## 3. ⚖️ Die fachliche Entscheidung (Was muss geprüft werden?)

Die zentrale Frage lautet: **Handelt es sich um eine kaufmännische Bestellung, die in die Auftragsabwicklung gehört – oder um etwas anderes?**

* **Gutfall (Dunkelverarbeitung):** Die Nachricht wird eindeutig als „Bestellung“ erkannt und sofort an Schritt 2 (Daten auslesen) weitergereicht – ohne dass ein Mensch die Mail jemals anklicken musste.
* **Umlenkung:** Reklamationen gehen automatisch ins Ticket-System des Supports, Rechnungen an die Buchhaltung, Spam landet im Papierkorb.
* **Schlechtfall / Klärung:** Wenn der Absender völlig unklar ist oder die Mail nur aus einem unleserlichen Bild besteht, wird sie in ein Postfach für menschliche Sachbearbeiter gelegt.

---

## 4. 🎛️ Die 5 Automatisierungs-Stufen aus der Praxisperspektive

Wie fühlt sich die Umsetzung für den Sachbearbeiter und das Unternehmen an?

### 1. Deterministisch (Feste Regeln)
* **Wie es funktioniert:** Feste Filterregeln. Wenn der Betreff „Bestellung“ oder „Order“ enthält und ein PDF anhängt, wird die Mail weitergeleitet.
* **Vorteil:** Kostet 0 Cent Inferenz, läuft in einer Millisekunde, ist 100 % nachvollziehbar.
* **Nachteil:** Wenn der Kunde „Wir möchten ordern“ oder „Nachbestellung“ schreibt, greift die Regel nicht.

### 2. Single-Turn KI (Isolierter KI-Aufruf)
* **Wie es funktioniert:** Ein schnelles, kostengünstiges Sprachmodell (z. B. Gemini Flash Lite) liest Betreff und die ersten Zeilen und entscheidet: `Kategorie: BESTELLUNG, Konfidenz: 98 %`.
* **Vorteil:** Versteht Synonyme, Slang und Rechtschreibfehler. Versteht auch „Schickt uns bitte noch mal das Gleiche“.
* **Nachteil:** Verbraucht winzige Token-Kosten (Bruchteile eines Cents).

### 3. Copilot (Der Mensch muss klicken)
* **Wie es funktioniert:** Die KI sortiert die Mail vor, aber der Sachbearbeiter muss am Bildschirm jede einzelne Mail anklicken und auf „Kategorie bestätigen“ tippen.
* **Bewertung in Schritt 1:** **Ein schweres Anti-Pattern!** Warum? Weil der Prozess stoppt! Bei 1.000 Mails am Tag sitzt der Sachbearbeiter wieder stundenlang da und klickt Knöpfe, anstatt Kaffee zu trinken oder Kunden zu beraten.

### 4. Workflow (SAP Build / n8n Flow) – Der Champion der Praxis!
* **Wie es funktioniert:** Die clevere Kombination: 
  1. Zuerst filtern einfache Regeln 80 % des Standard-Mülls und eindeutige Bestellungen sofort weg.
  2. Nur die unklaren Fälle werden an die KI übergeben.
  3. Bei einer KI-Sicherheit von über 95 % läuft alles vollautomatisch (dunkel) weiter.
  4. Nur die letzten 2 % echten Zweifelsfälle landen in einer Aufgabe für den Menschen.
* **Ergebnis:** Höchste Effizienz bei minimalen Kosten und maximaler Sicherheit.

### 5. Autonomer Agent (Joule AI Agent / KI-Team)
* **Wie es funktioniert:** Ein hochgradig intelligenter Agent durchsucht das ERP, prüft alte Angebote, liest Kundenkorrespondenzen der letzten drei Jahre und überlegt minutenlang.
* **Bewertung in Schritt 1:** **Völliger Overkill!** Das ist so, als würde man einen Universitätsprofessor an die Werkspforte stellen, um LKWs die Schranke zu öffnen. Viel zu teuer, viel zu langsam.

---

## 5. 🎤 Storytelling & Berater-Kompass (Wie erkläre ich das dem Kunden?)

### Der 30-Sekunden-Elevator-Pitch fürs Management
> *„Herr Geschäftsführer, an Schritt 1 entscheiden wir, ob Ihr Vertriebsteam morgens zwei Stunden lang E-Mails sortiert oder ob ab der ersten Minute automatisch Aufträge erfasst werden. Mit einem smarten Workflow filtern wir Spam und Reklamationen in Millisekunden aus und leiten 98 % aller echten Bestellungen vollautomatisch in den Prozess – ohne Risiko für Ihre Bestandsdaten.“*

### Typische Denkfehler von Führungskräften
* **Denkfehler:** *„Wir müssen gleich zu Beginn das teuerste KI-Modell einsetzen, damit bloß kein Fehler passiert!“*
* **Deine Antwort als Berater:** *„Nein! Schritt 1 hat Reversibilität 1. Wenn hier ein Fehler passiert, ist nichts verloren. Verwenden Sie an der Pforte einfache Regeln und ein leichtes, günstiges Modell. Sparen Sie das KI-Budget für die kniffligen Schritte auf.“*

### Die goldene Beraterregel
> **„Stelle niemals einen teuren, langsamen Denker als Türsteher an den Eingang! Schnelligkeit und Kosteneffizienz schlagen hier jedes Riesen-Modell.“**

---

## 6. 🎓 Studenten-Spickzettel & Prüfungsfragen

### ❓ Prüfungsfrage 1
**Frage:** *Warum ist der Einsatz eines Copiloten (Human-in-the-Loop) bei der E-Mail-Triage für einen Massenprozess wirtschaftlich unklug?*  
**Musterantwort:** *Ein Copilot senkt die Dunkelverarbeitungsquote auf 0 %, weil jeder Beleg auf eine manuelle Freigabe wartet. Dadurch entstehen Latenzen von Minuten bis Stunden und hohe Personalkosten. Da Schritt 1 ein extrem geringes Fehlerrisiko hat (Reversibilität 1), sollte hier stattdessen eine automatisierte Dunkelverarbeitung (Workflow) mit Ausnahme-Routing gewählt werden.*

### ❓ Prüfungsfrage 2
**Frage:** *Was unterscheidet eine deterministische Filterung von einer KI-gestützten Triage?*  
**Musterantwort:** *Deterministische Filter suchen starr nach vorgegebenen Schlüsselwörtern oder Absendern. Sie scheitern, wenn ein Kunde Tippfehler macht, Umgangssprache nutzt oder das Anliegen umschreibt. KI versteht die semantische Absicht („Intent“) des Absenders unabhängig von der genauen Wortwahl.*
