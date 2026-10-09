export interface FieldMeta {
  label: string;
  description: string;
}

export const FIELD_DICTIONARY: Record<string, FieldMeta> = {
  // Klare fachliche Beleg- und Prozessfelder (Deutsch & Business-nah)
  vorgang: {
    label: 'Geschäftsvorfall',
    description: 'Klassifizierter Vorfall, z. B. verbindlicher Kundenauftrag, Störungsmeldung oder Zahlungsavis.',
  },
  absender: {
    label: 'Kunde / Absender',
    description: 'Aus der Nachricht identifizierter Geschäftspartner und Ansprechpartner.',
  },
  absenderFirma: {
    label: 'Kundenunternehmen',
    description: 'Eindeutig identifizierte Kundenorganisation laut Anschrift oder Signatur.',
  },
  betreff: {
    label: 'Betreffzeile',
    description: 'Originale Betreffzeile der Kundenmitteilung.',
  },
  anhangDokument: {
    label: 'Beigefügtes Dokument',
    description: 'Identifiziertes und digitalisiertes Belegdokument (z. B. PDF-Bestellung).',
  },
  belegdatei: {
    label: 'Belegdatei (Quelle)',
    description: 'Verarbeitete Eingangsdatei mit Dateigröße und Formatprüfung.',
  },
  referenz: {
    label: 'Vorbeleg-Referenz',
    description: 'Zitierte Angebots-, Vertrags- oder Vorgangsnummer.',
  },
  referenzBeleg: {
    label: 'Gefundene Referenz',
    description: 'Extrahierte Vorgangsreferenz (z. B. Vorangebot AN-2026-88).',
  },
  prioritaet: {
    label: 'Bearbeitungs-Priorität',
    description: 'Ermittelte Dringlichkeit der Kundenanforderung für den weiteren Ablauf.',
  },
  prozesspfad: {
    label: 'Verarbeitungspfad',
    description: 'Zielprozess in SAP für die nachgelagerte Belegverarbeitung.',
  },
  weiterleitung: {
    label: 'Ziel-Warteschlange',
    description: 'Zuständiger SAP-Folgebereich für die Datenübernahme.',
  },
  bestellnummer: {
    label: 'Kundenbestellnummer (PO)',
    description: 'Externe Bestellnummer des Kunden (z. B. PO-4711-AUG).',
  },
  belegdatum: {
    label: 'Belegdatum',
    description: 'Erstellungsdatum der Kundenbestellung bzw. des Vorgangs.',
  },
  liefertermin: {
    label: 'Wunsch-Liefertermin',
    description: 'Vom Besteller erbetenes Anlieferdatum vor Ort.',
  },
  lieferort: {
    label: 'Lieferort & Entladestelle',
    description: 'Konkreter Anlieferungsort, Werk und Entladetor beim Kunden.',
  },
  zahlungskonditionen: {
    label: 'Zahlungskonditionen',
    description: 'Vereinbarte Zahlungsbedingungen und Skontofristen.',
  },
  zahlungsziel: {
    label: 'Zahlungsziel',
    description: 'Fälligkeitsfrist und Skontobedingungen für diesen Beleg.',
  },
  positionen: {
    label: 'Bestellpositionen',
    description: 'Extrahierte Positionen mit Positionsnummer, Artikelbeschreibung, Menge, Einzelpreis und Gesamtpreis.',
  },
  gesamtbetragNetto: {
    label: 'Auftragswert (Netto)',
    description: 'Rechnerische Summe aller Bestellpositionen ohne Mehrwertsteuer.',
  },
  sapArtikel: {
    label: 'SAP Materialstammdaten (MARA)',
    description: 'Eindeutig im SAP-Artikelstamm zugeordnete Materialnummern und Auslieferungswerke.',
  },
  sapMaterialien: {
    label: 'Gefundene SAP Materialien',
    description: 'Im SAP S/4HANA MARA-Stamm validierte Materialnummern.',
  },
  bonitaet: {
    label: 'Kundenbonität',
    description: 'Bonitäts- und Risikoeinstufung laut SAP Credit Management.',
  },
  stammDatenStatus: {
    label: 'Stammdaten-Prüfung',
    description: 'Ergebnis des automatischen Abgleichs gegen Debitoren- und Materialstamm.',
  },
  kreditlimitPruefung: {
    label: 'Kreditlimit-Prüfung',
    description: 'Prüfung der Kunden-Kreditlinie und des aktuellen Obligos.',
  },
  verfuegbarkeitAtp: {
    label: 'Lieferbarkeitsprüfung (ATP)',
    description: 'Available-to-Promise: Physische Bestandsprüfung im Auslieferungswerk.',
  },
  terminPruefung: {
    label: 'Termin-Machbarkeit',
    description: 'Zusage, ob das Werk den Wunschtermin logistisch einhalten kann.',
  },
  freigabestatus: {
    label: 'Freigabe-Entscheidung',
    description: 'Automatisierte Freigabeentscheidung nach SAP BRFplus Regelwerk.',
  },
  sapBelegnummer: {
    label: 'SAP Belegnummer (VBELN)',
    description: 'Die verbindlich in SAP S/4HANA angelegte Kundenauftragsnummer.',
  },
  sapAuftragsnummer: {
    label: 'SAP Auftragsnummer (VBAK)',
    description: 'Erfolgreich im ERP erzeugter Standardauftrag (Belegtyp TA).',
  },
  verbuchungsStatus: {
    label: 'Verbuchungsstatus',
    description: 'Status der Transaktion in der SAP S/4HANA Datenbank.',
  },
  buchungsZeitpunkt: {
    label: 'Buchungszeitpunkt',
    description: 'Exakter Zeitstempel der Verbuchung in S/4HANA.',
  },
  belegwertNetto: {
    label: 'Verbuchter Nettowert',
    description: 'Gesamtwert des verbuchten SAP-Belegs vor Steuern.',
  },
  auftraggeber: {
    label: 'Auftraggeber (Debitor)',
    description: 'Verbuchter SAP-Debitor (KUNNR) im Kundenauftrag.',
  },
  erzeugtesDokument: {
    label: 'Erstelltes Belegdokument',
    description: 'Generiertes PDF-Dokument (z. B. Auftragsbestätigung).',
  },
  erstellterBeleg: {
    label: 'Generierter Ausgangsbeleg',
    description: 'Vollständig formatiertes Ausgangsdokument für den Kunden.',
  },
  versandKanal: {
    label: 'Versand-Kanal',
    description: 'Übertragungsmedium für das Ausgangsdokument.',
  },
  versandstatus: {
    label: 'Versandstatus',
    description: 'Bestätigung des Dokumentenversands und der SAP-Archivierung.',
  },
  trackingNummer: {
    label: 'Tracking-ID',
    description: 'Sendungsverfolgungsnummer für die Logistik.',
  },
  trackingReferenz: {
    label: 'Tracking-Referenz',
    description: 'Sendungsnummer zur Nachverfolgung der Auslieferung.',
  },

  // Service-Szenario (2F1) Felder
  stoermeldeNummer: {
    label: 'Störmelde-Nummer',
    description: 'Vorgangsnummer der Störungsmeldung im SAP Kundenservice.',
  },
  stillstandsBeginn: {
    label: 'Stillstandsbeginn',
    description: 'Zeitpunkt, an dem die Anlage ausgefallen ist.',
  },
  dringlichkeit: {
    label: 'Dringlichkeitsstufe',
    description: 'Einstufung des Produktionsstillstands (z. B. Prio 1 Sofort).',
  },
  benoetigteErsatzteile: {
    label: 'Benötigte Ersatzteile',
    description: 'Identifizierte Ersatzteil-Komponenten für die Reparatur.',
  },
  wartungsVertrag: {
    label: 'Wartungsvertrag & SLA',
    description: 'Hinterlegter Service-Level-Vertrag mit garantierter Reaktionszeit.',
  },
  geraetestandort: {
    label: 'Gerätestandort',
    description: 'Genaue Halle und Montageort der Maschine vor Ort.',
  },
  disponierterTechniker: {
    label: 'Disponierter Servicetechniker',
    description: 'Vom System automatisch eingeteilter Field-Service-Mitarbeiter.',
  },
  teilVerfuegbarkeit: {
    label: 'Ersatzteil-Verfügbarkeit',
    description: 'Bestandsprüfung der benötigten Teile im zentralen Servicelager.',
  },
  slaPruefung: {
    label: 'SLA-Deckungsprüfung',
    description: 'Vertragsprüfung auf vollständige Kosten- und Garantieübernahme.',
  },
  notfallFreigabe: {
    label: 'Notfall-Freigabe',
    description: 'Automatische Autorisierung zur sofortigen Entsendung.',
  },
  sapServiceauftrag: {
    label: 'SAP Serviceauftrag (CS/PM)',
    description: 'Angelegter Serviceauftrag (SM01) im SAP-System.',
  },
  dispatchSms: {
    label: 'Techniker-Benachrichtigung',
    description: 'Status der mobilen Alarmierung des Servicetechnikers vor Ort.',
  },

  // Zahlungsavis (J60) Felder
  avisNummer: {
    label: 'Avis-Nummer',
    description: 'Referenznummer des Zahlungsavis vom Kunden.',
  },
  avisBetrag: {
    label: 'Avis-Gesamtbetrag',
    description: 'Eingezahlter Gesamtbetrag der Kundenüberweisung.',
  },
  skontoAbzug: {
    label: 'Skonto-Abzug',
    description: 'Einbehaltener Skontoabzug laut Skontofrist.',
  },
  zugeordneteRechnungen: {
    label: 'Zugeordnete Rechnungen',
    description: 'Aufstellung aller ausgeglichenen Rechnungen mit Ursprungsbetrag, Skonto und Zahlbetrag.',
  },
  debitor: {
    label: 'Zahlender Debitor',
    description: 'Eindeutig zugeordneter SAP-Debitor der Zahlung.',
  },
  offenePostenGefunden: {
    label: 'Offene Posten (SAP BSID)',
    description: 'Anzahl der im SAP-Finanzwesen gefundenen offenen Posten.',
  },
  differenzBetrag: {
    label: 'Ausgleichs-Differenz',
    description: 'Verbleibende Restdifferenz (0,00 € = vollständiger Ausgleich).',
  },
  skontoFrist: {
    label: 'Skontofrist-Prüfung',
    description: 'Prüfung, ob die Zahlung innerhalb der vereinbarten Skontotage einging.',
  },
  skontofreigabe: {
    label: 'Skonto-Freigabe',
    description: 'Genehmigung des Skontoabzugs nach internen Finanzrichtlinien.',
  },
  sapAusgleichsbeleg: {
    label: 'SAP Ausgleichsbeleg (FI-AR)',
    description: 'Nummer des gebuchten OP-Ausgleichsbelegs im SAP Hauptbuch.',
  },

  // Eingangsrechnung & 3-Wege-Abgleich (2B6 / Procure-to-Pay) Felder
  rechnungsnummer: {
    label: 'Rechnungsnummer (Kreditor)',
    description: 'Vom Lieferanten ausgestellte Rechnungsnummer (z. B. RE-2026-8812).',
  },
  rechnungsdatum: {
    label: 'Rechnungsdatum',
    description: 'Ausstellungsdatum der Lieferantenrechnung.',
  },
  kreditorName: {
    label: 'Kreditor / Lieferant',
    description: 'Name und Rechtsform des rechnungsstellenden Lieferanten.',
  },
  kreditorNummer: {
    label: 'SAP Kreditor (LFA1)',
    description: 'Eindeutige Lieferantennummer im SAP Kreditorenstamm.',
  },
  kreditorIban: {
    label: 'Lieferanten-IBAN',
    description: 'Validierte Bankverbindung für den elektronischen Zahlungsverkehr.',
  },
  bestellbezug: {
    label: 'Bestellbezug (EKKO / PO)',
    description: 'Zugeordnete SAP-Einkaufsbestellnummer.',
  },
  wareneingangBeleg: {
    label: 'Wareneingangsbeleg (MIGO)',
    description: 'Zugehöriger Material- und Wareneingangsbeleg im SAP MM.',
  },
  nettoBetrag: {
    label: 'Rechnungsbetrag Netto',
    description: 'Nettobetrag vor Umsatzsteuer.',
  },
  steuerBetrag: {
    label: 'Umsatzsteuer (19%)',
    description: 'Ausgewiesener Steuerbetrag für den Vorsteuerabzug.',
  },
  bruttoBetrag: {
    label: 'Rechnungsbetrag Brutto',
    description: 'Zu zahlender Gesamtbetrag inklusive Mehrwertsteuer.',
  },
  preisAbweichung: {
    label: 'Preisabweichung zur Bestellung',
    description: 'Differenz zwischen Bestellpreis und in Rechnung gestelltem Preis.',
  },
  mengenAbweichung: {
    label: 'Mengenabweichung zum WE',
    description: 'Differenz zwischen gelieferter und abgerechneter Menge.',
  },
  dreiWegeMatch: {
    label: '3-Wege-Match Status',
    description: 'Ergebnis des Abgleichs: Bestellung (PO) ↔ Wareneingang (GR) ↔ Rechnung (IR).',
  },
  toleranzStatus: {
    label: 'Toleranzprüfung (≤ 5,00 €)',
    description: 'Einhaltung kaufmännischer Toleranzschwellen nach SAP Customizing.',
  },
  skontoBetrag: {
    label: 'Ermittelter Skontobetrag',
    description: 'Rechnerischer Skontoabzug bei fristgerechter Zahlung.',
  },
  skontoKondition: {
    label: 'Skontokondition',
    description: 'Skontosatz und Tagefrist laut Rechnungskonditionen.',
  },
  freigabeStatus: {
    label: 'Rechnungsfreigabe',
    description: 'Status der buchhalterischen und sachlichen Rechnungsfreigabe.',
  },
  sapMiroBeleg: {
    label: 'SAP Rechnungsbeleg (MIRO)',
    description: 'Verbindlich im Modul MM-IV erzeugte Belegnummer.',
  },
  sapFiBeleg: {
    label: 'SAP Buchhaltungsbeleg (BKPF)',
    description: 'Erzeugter Beleg im Haupt- und Nebenbuch (FI-AP).',
  },
  zahllaufStatus: {
    label: 'Zahllauf-Vormerkung (F110)',
    description: 'Vormerkung für die automatische Sammelzahlung im SAP Zahllauf.',
  },
  rechnungsPositionen: {
    label: 'Rechnungspositionen',
    description: 'Einzelpositionen mit Material, Menge, Einzel- und Gesamtpreis.',
  },
  duplikatsPruefung: {
    label: 'Duplikatsprüfung',
    description: 'Ausschluss doppelter Belege anhand von Kreditor, Belegnummer und Datum.',
  },
  zahlweg: {
    label: 'Zahlweg',
    description: 'SAP Zahlweg (z. B. SEPA-Überweisung oder Firmenlastschrift).',
  },
  extraktionsStatus: {
    label: 'Extraktionsstatus',
    description: 'Status der automatisierten OCR- und Dokumentenextraktion.',
  },
  matchingStatus: {
    label: 'Abgleichstatus',
    description: 'Status des automatischen Stammdaten- und Belegabgleichs.',
  },
  entscheidungsStatus: {
    label: 'Entscheidungsstatus',
    description: 'Ergebnis der kaufmännischen Regel- und Risikoprüfung.',
  },
  selbstheilung: {
    label: 'Autonome Selbstheilung',
    description: 'Durch den Multi-Agenten-Schwarm korrigierte oder ergänzte Daten.',
  },
  ausgangsDokument: {
    label: 'Ausgangsdokument',
    description: 'Erzeugtes Bestätigungs- oder Informationsdokument.',
  },

  // Allgemeine technische Felder
  classification: {
    label: 'Geschäftsvorfall',
    description: 'Einstufung der eingehenden Nachricht, z. B. als verbindliche Bestellung, Service-Notfall oder Zahlungsavis.',
  },
  confidence: {
    label: 'Konfidenz',
    description: 'Statistische Zuverlässigkeit (0 bis 100%), mit der das System sicher ist, dass das Zwischenergebnis fehlerfrei ist.',
  },
  kunnr: {
    label: 'SAP Debitor (KUNNR)',
    description: 'Eindeutige Stammdatennummer des Kunden im SAP-System.',
  },
  poNumber: {
    label: 'Kundenbestellnummer',
    description: 'Vom Kunden in der Nachricht angegebene externe Bestell- oder Vorgangsnummer.',
  },
  deliveryDate: {
    label: 'Gewünschter Liefertermin',
    description: 'Das vom Besteller erbetene Eintreffdatum der Ware vor Ort.',
  },
  destination: {
    label: 'Lieferort / Entladestelle',
    description: 'Konkreter Anlieferungsort, z. B. Werk, Lagerhalle oder Entladetor.',
  },
  orderTotalEur: {
    label: 'Auftragswert (Netto)',
    description: 'Rechnerischer Gesamtwert der Bestellung in Euro vor Steuern.',
  },
  equipment: {
    label: 'Equipment / Anlage',
    description: 'Im SAP Instandhaltungs- und Kundenservicestamm geführtes Maschinen- oder Anlagenobjekt.',
  },
  standort: {
    label: 'Betriebsstandort / Halle',
    description: 'Physischer Aufstellungsort der betroffenen Maschine oder Anlage beim Kunden.',
  },
  schaden: {
    label: 'Gemeldetes Schadensbild',
    description: 'Aus der Fehlermeldung oder Telemetrie isoliertes technisches Symptom.',
  },
  reaktionsfrist: {
    label: 'Garantierte Reaktionsfrist',
    description: 'Vertraglich im SLA festgeschriebene maximale Zeit bis zum Eintreffen vor Ort.',
  },
  serviceObjekt: {
    label: 'Serviceobjekt (SAP IBASE)',
    description: 'Genaue Typenbezeichnung des Aggregats laut Installed-Base-Verzeichnis.',
  },
  garantieStatus: {
    label: 'Vertrags- & Garantiestatus',
    description: 'Prüfung auf aktiven Wartungsvertrag mit 24/7 Notfallbereitschaft.',
  },
  vertragsKunde: {
    label: 'Vertragskunde',
    description: 'Vertragsinhaber und Rechnungsempfänger des Servicevertrags.',
  },
  verfuegbarkeitTechniker: {
    label: 'Techniker-Verfügbarkeit',
    description: 'Echtzeit-Einsatzstatus und kalkulierte Fahrzeit des nächstgelegenen Spezialisten.',
  },
  ersatzteilStatus: {
    label: 'Ersatzteil-Bereitstellung',
    description: 'Verfügbarkeit der Reparaturkomponenten im mobilen Servicefahrzeug oder Zentrallager.',
  },
  auftragsArt: {
    label: 'SAP Auftragsart',
    description: 'Klassifikation des Serviceauftrags im ERP (z. B. SM01 Notfalleinsatz).',
  },
  kostenstelle: {
    label: 'Verrechnete Kostenstelle',
    description: 'Interne SAP-Kostenstelle zur Verrechnung der Einsatz- und Materialaufwände.',
  },
  dispatchKanal: {
    label: 'Dispositionssystem',
    description: 'Verwendetes Zielsystem zur mobilen Auftragsübertragung (z. B. SAP FSM).',
  },
  technikerStatus: {
    label: 'Status Arbeitsvorbereitung',
    description: 'Bestätigung der Auftragsübernahme auf dem Mobilgerät des Field-Technikers.',
  },
  smsKundenbenachrichtigung: {
    label: 'Kunden-Vorabavis',
    description: 'Status der automatisierten SMS-/E-Mail-Vorwarnung an den Ansprechpartner vor Ort.',
  },
  voraussichtlicheAnkunft: {
    label: 'Voraussichtliche Ankunft (ETA)',
    description: 'Kalkulierter Zeitpunkt des Eintreffens am Werkstor des Kunden.',
  },
  bankKonto: {
    label: 'Auftraggeber-Bankverbindung',
    description: 'Ermittelte IBAN / BIC des überweisenden Geschäftspartners.',
  },
  rechnungsSumme: {
    label: 'Rechnungssumme (Brutto)',
    description: 'Summe der auf dem Avis ausgewiesenen Rechnungsbeträge vor Abzügen.',
  },
  gefundeneOffenePosten: {
    label: 'Offene Posten in SAP (BSID)',
    description: 'Anzahl und Status der im Debitorenkonto gefundenen offenen Rechnungen.',
  },
  buchungskreis: {
    label: 'SAP Buchungskreis',
    description: 'Buchungskreis im SAP FI-Hauptbuch (z. B. 1000 Inland).',
  },
  skontoGenehmigung: {
    label: 'Skonto-Prüfentscheidung',
    description: 'Prüfergebnis der Skontoberechtigung nach Zahlungsziel und Valuta.',
  },
  ausgleichsStrategie: {
    label: 'Ausgleichsstrategie',
    description: 'Vollständiger automatischer Postenausgleich ohne Differenzspaltung.',
  },
  genehmigungsStatus: {
    label: 'Hauptbuch-Freigabestatus',
    description: 'Freigabestufe zur autonomen Verbuchung im FI-Hauptbuch.',
  },
  ausgeglichenePosten: {
    label: 'Ausgeglichene OP-Positionen',
    description: 'Eindeutige Belegnummern der geschlossenen und ausgeglichenen Rechnungsbelege.',
  },
  differenzKonto: {
    label: 'Differenzenkonto (FI-AR)',
    description: 'Status von Restdifferenzen oder Unterzahlungen.',
  },
  archivStatus: {
    label: 'Revisionssichere Archivierung',
    description: 'Status der Ablage im SAP ArchiveLink / Clean-Core Document Store.',
  },
  benachrichtigung: {
    label: 'Interne Benachrichtigung',
    description: 'Buchungsprotokoll und Meldung an die zuständige Fachabteilung.',
  },
  kontoauszugsZeile: {
    label: 'Kontoauszug-Abstimmung',
    description: 'Automatischer Zuordnungsstatus zum elektronischen Kontoauszug (CAMT.053).',
  },
  partnerRolle: {
    label: 'SAP Partnerrollen',
    description: 'Zuordnung von Auftraggeber (AG), Warenempfänger (WE) und Rechnungsempfänger (RE).',
  },
  preisMargenPruefung: {
    label: 'Preis- & Margenprüfung',
    description: 'Prüfung der Konditionen und Mindestdeckungsbeiträge gemäß Vertriebsrichtlinie.',
  },
  fehler: {
    label: 'Fehlerursache',
    description: 'Vom System identifizierter Verarbeitungsfehler oder fehlendes Pflichtattribut.',
  },
  grund: {
    label: 'Begründung',
    description: 'Detaillierte fachliche Erklärung für einen Abbruch oder eine Eskalation.',
  },
  hinweis: {
    label: 'Prüfhinweis',
    description: 'Handlungsempfehlung oder Kontext für den zuständigen Sachbearbeiter.',
  },
};

export const ENUM_VALUE_TRANSLATIONS: Record<string, { de: string; en: string }> = {
  BINDING_PURCHASE_ORDER: {
    de: 'Verbindliche Kundenbestellung',
    en: 'Binding Purchase Order',
  },
  VALID_PAYMENT_ADVICE: {
    de: 'Valides Zahlungsavis',
    en: 'Valid Payment Advice',
  },
  AVIS_RECONSTRUCTED: {
    de: 'Zahlungsavis (Rekonstruiert via MCP)',
    en: 'Payment Advice (Reconstructed via MCP)',
  },
  AVIS_REVIEW_REQUIRED: {
    de: 'Zahlungsavis (Prüfung erforderlich)',
    en: 'Payment Advice (Review Required)',
  },
  SLA_GOLD: {
    de: 'SLA Gold (Reaktionszeit < 2h)',
    en: 'SLA Gold (Response < 2h)',
  },
  DISPATCH_IMMEDIATE: {
    de: 'Sofortige Notfall-Disposition',
    en: 'Immediate Emergency Dispatch',
  },
  DISPATCHED_TO_MOBILE: {
    de: 'An mobile Techniker-App übermittelt',
    en: 'Dispatched to Mobile Field App',
  },
  AUFK_DATABASE_COMMITTED: {
    de: 'In SAP S/4HANA Datenbank verbucht',
    en: 'Committed to SAP S/4HANA DB',
  },
  SO01: {
    de: 'SM01 / SO01 (Notfall-Serviceauftrag)',
    en: 'SM01 / SO01 (Emergency Service Order)',
  },
  ACTIVE: {
    de: 'Aktiv',
    en: 'Active',
  },
  SALES_PROCESSING: {
    de: 'Automatische Belegextraktion (Auftragswesen)',
    en: 'Automated Sales Processing',
  },
  CLR_2026_8819: {
    de: 'Klärfall-Ticket CLR-2026-8819',
    en: 'Clearing Ticket CLR-2026-8819',
  },
  NO_EQUIPMENT_FOUND: {
    de: 'Kein Equipment im SAP Stamm auffindbar',
    en: 'No Equipment Found in SAP',
  },
  MULTIPLE_CANDIDATES: {
    de: 'Mehrere passende Stammdaten-Objekte',
    en: 'Multiple Master Data Matches',
  },
  SLA_INDETERMINATE: {
    de: 'SLA-Vertragsklasse unbestimmt',
    en: 'SLA Contract Tier Indeterminate',
  },
  MANUAL_DISPATCH_CONFIRMATION_REQUIRED: {
    de: 'Manuelle Disponenten-Bestätigung erforderlich',
    en: 'Manual Dispatcher Confirmation Required',
  },
  SYNTAX_PARSE_ERROR: {
    de: 'Syntax-Fehler im Freitext',
    en: 'Syntax Parse Error in Free Text',
  },
  FEHLENDE_PFLICHTFELDER: {
    de: 'Fehlende Pflichtfelder',
    en: 'Missing Mandatory Fields',
  },
  STAMMDATEN_NICHT_GEFUNDEN: {
    de: 'Stammdaten nicht gefunden',
    en: 'Master Data Not Found',
  },
};

export const FIELD_DICTIONARY_EN: Record<string, FieldMeta> = {
  vorgang: {
    label: 'Business Transaction',
    description: 'Classified transaction, e.g. binding sales order, maintenance ticket, or payment remittance advice.',
  },
  absender: {
    label: 'Customer / Sender',
    description: 'Business partner and contact person identified from inbound message.',
  },
  absenderFirma: {
    label: 'Customer Company',
    description: 'Uniquely identified customer organization according to address or signature.',
  },
  betreff: {
    label: 'Subject Line',
    description: 'Original subject line of customer communication.',
  },
  anhangDokument: {
    label: 'Attached Document',
    description: 'Identified and digitized document (e.g. PDF purchase order).',
  },
  belegdatei: {
    label: 'Document File (Source)',
    description: 'Processed inbound file with size and format verification.',
  },
  referenz: {
    label: 'Reference Document',
    description: 'Quoted quotation, contract, or reference number.',
  },
  referenzBeleg: {
    label: 'Identified Reference',
    description: 'Extracted transaction reference (e.g. quote AN-2026-88).',
  },
  prioritaet: {
    label: 'Processing Priority',
    description: 'Determined urgency of customer requirement for downstream routing.',
  },
  prozesspfad: {
    label: 'Processing Path',
    description: 'Target SAP workflow for downstream document posting.',
  },
  weiterleitung: {
    label: 'Target Queue',
    description: 'Responsible SAP department queue for transaction processing.',
  },
  bestellnummer: {
    label: 'Purchase Order Number (PO)',
    description: 'External customer purchase order reference (e.g. PO-4711-AUG).',
  },
  belegdatum: {
    label: 'Document Date',
    description: 'Creation date of customer order or transaction.',
  },
  liefertermin: {
    label: 'Requested Delivery Date',
    description: 'Customer requested on-site delivery date.',
  },
  lieferort: {
    label: 'Delivery Location & Unloading Point',
    description: 'Specific shipping address, plant, and unloading gate.',
  },
  zahlungskonditionen: {
    label: 'Payment Terms',
    description: 'Agreed commercial payment terms and cash discount periods.',
  },
  zahlungsziel: {
    label: 'Payment Due Date',
    description: 'Due date and discount terms for this document.',
  },
  positionen: {
    label: 'Order Line Items',
    description: 'Extracted items with item number, material description, quantity, unit price, and total price.',
  },
  gesamtbetragNetto: {
    label: 'Net Order Value',
    description: 'Calculated sum of all line items excluding VAT.',
  },
  sapArtikel: {
    label: 'SAP Material Master (MARA)',
    description: 'Uniquely matched SAP material numbers and supplying plants.',
  },
  sapMaterialien: {
    label: 'Identified SAP Materials',
    description: 'Validated material IDs in SAP S/4HANA MARA master data.',
  },
  bonitaet: {
    label: 'Customer Credit Rating',
    description: 'Credit rating and risk classification according to SAP Credit Management.',
  },
  stammDatenStatus: {
    label: 'Master Data Verification',
    description: 'Result of automated verification against customer and material master records.',
  },
  kreditlimitPruefung: {
    label: 'Credit Limit Check',
    description: 'Verification of customer credit line and current exposure.',
  },
  verfuegbarkeitAtp: {
    label: 'Availability Check (ATP)',
    description: 'Available-to-Promise: Physical inventory check in supplying plant.',
  },
  terminPruefung: {
    label: 'Schedule Feasibility',
    description: 'Confirmation whether plant logistics can meet requested date.',
  },
  freigabestatus: {
    label: 'Approval Decision',
    description: 'Automated release decision based on SAP BRFplus rules.',
  },
  sapBelegnummer: {
    label: 'SAP Document Number (VBELN)',
    description: 'Committed sales order number created in SAP S/4HANA.',
  },
  sapAuftragsnummer: {
    label: 'SAP Order Number (VBAK)',
    description: 'Standard sales order (type OR/TA) successfully created in ERP.',
  },
  verbuchungsStatus: {
    label: 'Posting Status',
    description: 'Transaction status in SAP S/4HANA database.',
  },
  buchungsZeitpunkt: {
    label: 'Posting Timestamp',
    description: 'Exact timestamp of posting in S/4HANA.',
  },
  belegwertNetto: {
    label: 'Committed Net Value',
    description: 'Total net value of posted SAP document before tax.',
  },
  auftraggeber: {
    label: 'Sold-To Party (Customer)',
    description: 'Committed SAP customer number (KUNNR) in sales order.',
  },
  erzeugtesDokument: {
    label: 'Generated Document',
    description: 'Generated PDF document (e.g. order confirmation).',
  },
  erstellterBeleg: {
    label: 'Generated Outbound Document',
    description: 'Fully formatted outbound document for the customer.',
  },
  versandKanal: {
    label: 'Dispatch Channel',
    description: 'Transmission channel for the outbound document.',
  },
  versandstatus: {
    label: 'Dispatch Status',
    description: 'Confirmation of document transmission and SAP archiving.',
  },
  trackingNummer: {
    label: 'Tracking ID',
    description: 'Logistics tracking number for shipment.',
  },
  trackingReferenz: {
    label: 'Tracking Reference',
    description: 'Shipment tracking reference for delivery monitoring.',
  },
  stoermeldeNummer: {
    label: 'Malfunction Notification No.',
    description: 'Service notification ID in SAP Customer Service (CS/PM).',
  },
  stillstandsBeginn: {
    label: 'Downtime Start',
    description: 'Timestamp when equipment went offline.',
  },
  dringlichkeit: {
    label: 'Urgency Tier',
    description: 'Production outage classification (e.g. Priority 1 Urgent).',
  },
  benoetigteErsatzteile: {
    label: 'Required Spare Parts',
    description: 'Identified replacement components for repair.',
  },
  wartungsVertrag: {
    label: 'Service Contract & SLA',
    description: 'Associated service level agreement with response time guarantee.',
  },
  geraetestandort: {
    label: 'Equipment Location',
    description: 'Specific building, hall, and machine installation site.',
  },
  disponierterTechniker: {
    label: 'Dispatched Field Technician',
    description: 'Field service technician automatically assigned by system.',
  },
  teilVerfuegbarkeit: {
    label: 'Spare Parts Availability',
    description: 'Stock check of required parts in central service warehouse.',
  },
  slaPruefung: {
    label: 'SLA Coverage Verification',
    description: 'Contract verification for full cost and warranty coverage.',
  },
  notfallFreigabe: {
    label: 'Emergency Authorization',
    description: 'Automated authorization for immediate technician dispatch.',
  },
  sapServiceauftrag: {
    label: 'SAP Service Order (CS/PM)',
    description: 'Created service order (SM01) in SAP system.',
  },
  dispatchSms: {
    label: 'Technician Notification',
    description: 'Mobile alert status of on-site service technician.',
  },
  avisNummer: {
    label: 'Remittance Advice No.',
    description: 'Reference number of customer payment advice.',
  },
  avisBetrag: {
    label: 'Remittance Total',
    description: 'Total bank remittance amount from customer.',
  },
  skontoAbzug: {
    label: 'Cash Discount Deducted',
    description: 'Withheld cash discount based on payment term.',
  },
  zugeordneteRechnungen: {
    label: 'Assigned Invoices',
    description: 'List of all cleared invoices with original amount, discount, and paid amount.',
  },
  debitor: {
    label: 'Paying Customer',
    description: 'Uniquely assigned SAP customer ID of the payment.',
  },
  offenePostenGefunden: {
    label: 'Open Items (SAP BSID)',
    description: 'Number of open items located in SAP Financials.',
  },
  differenzBetrag: {
    label: 'Clearing Variance',
    description: 'Remaining variance (€0.00 = complete matching).',
  },
  skontoFrist: {
    label: 'Discount Deadline Check',
    description: 'Verification whether payment occurred within agreed discount days.',
  },
  skontofreigabe: {
    label: 'Discount Approval',
    description: 'Approval of cash discount per financial guidelines.',
  },
  sapAusgleichsbeleg: {
    label: 'SAP Clearing Document (FI-AR)',
    description: 'Document number of posted open-item clearing in SAP General Ledger.',
  },
  rechnungsnummer: {
    label: 'Invoice Number (Vendor)',
    description: 'Vendor invoice reference (e.g. INV-2026-8812).',
  },
  rechnungsdatum: {
    label: 'Invoice Date',
    description: 'Issuance date of vendor invoice.',
  },
  kreditorName: {
    label: 'Vendor / Supplier',
    description: 'Name and company details of billing supplier.',
  },
  kreditorNummer: {
    label: 'SAP Vendor (LFA1)',
    description: 'Unique supplier ID in SAP vendor master.',
  },
  kreditorIban: {
    label: 'Supplier IBAN',
    description: 'Validated bank details for electronic payment processing.',
  },
  bestellbezug: {
    label: 'Purchase Order Ref (EKKO)',
    description: 'Associated SAP purchase order number.',
  },
  wareneingangBeleg: {
    label: 'Goods Receipt Doc (MIGO)',
    description: 'Associated material and goods receipt document in SAP MM.',
  },
  nettoBetrag: {
    label: 'Net Invoice Amount',
    description: 'Net amount before value-added tax.',
  },
  steuerBetrag: {
    label: 'Tax Amount (VAT 19%)',
    description: 'Stated VAT amount for input tax deduction.',
  },
  bruttoBetrag: {
    label: 'Gross Invoice Amount',
    description: 'Total payable amount including sales tax.',
  },
  preisAbweichung: {
    label: 'Price Variance vs PO',
    description: 'Difference between PO purchase price and invoiced price.',
  },
  mengenAbweichung: {
    label: 'Quantity Variance vs GR',
    description: 'Difference between delivered goods and invoiced quantity.',
  },
  dreiWegeMatch: {
    label: '3-Way Match Status',
    description: 'Matching result: Purchase Order (PO) ↔ Goods Receipt (GR) ↔ Invoice (IR).',
  },
  toleranzStatus: {
    label: 'Tolerance Check (≤ €5.00)',
    description: 'Compliance with commercial tolerance thresholds in SAP.',
  },
  skontoBetrag: {
    label: 'Calculated Discount',
    description: 'Calculated discount deduction for prompt payment.',
  },
  skontoKondition: {
    label: 'Discount Condition',
    description: 'Discount percentage and payment terms.',
  },
  freigabeStatus: {
    label: 'Invoice Release',
    description: 'Accounting and substantive invoice approval status.',
  },
  sapMiroBeleg: {
    label: 'SAP Invoice Doc (MIRO)',
    description: 'Document number created in MM-IV logistics invoice verification.',
  },
  sapFiBeleg: {
    label: 'SAP Accounting Doc (BKPF)',
    description: 'Created document in General and Subledger (FI-AP).',
  },
  zahllaufStatus: {
    label: 'Payment Run Status (F110)',
    description: 'Scheduled for automated payment run execution.',
  },
  rechnungsPositionen: {
    label: 'Invoice Line Items',
    description: 'Line items with material ID, quantity, unit price, and total.',
  },
  duplikatsPruefung: {
    label: 'Duplicate Check',
    description: 'Exclusion of duplicate invoices by vendor, reference, and date.',
  },
  zahlweg: {
    label: 'Payment Method',
    description: 'SAP payment method (e.g. SEPA credit transfer).',
  },
  extraktionsStatus: {
    label: 'Extraction Status',
    description: 'Status of automated OCR and document extraction.',
  },
  matchingStatus: {
    label: 'Matching Status',
    description: 'Status of automated master data and document matching.',
  },
  entscheidungsStatus: {
    label: 'Decision Status',
    description: 'Outcome of commercial rule and policy verification.',
  },
  selbstheilung: {
    label: 'Autonomous Self-Healing',
    description: 'Data corrected or enriched by multi-agent swarm.',
  },
  ausgangsDokument: {
    label: 'Outbound Document',
    description: 'Generated confirmation or notification document.',
  },
  classification: {
    label: 'Business Transaction',
    description: 'Classification of inbound message (e.g. binding order, emergency service, remittance advice).',
  },
  confidence: {
    label: 'Confidence',
    description: 'Statistical reliability score (0–100%) indicating processing accuracy.',
  },
  kunnr: {
    label: 'SAP Customer (KUNNR)',
    description: 'Unique master customer ID in SAP system.',
  },
  poNumber: {
    label: 'Customer PO Number',
    description: 'External purchase order number provided by customer.',
  },
  deliveryDate: {
    label: 'Requested Delivery Date',
    description: 'Customer requested arrival date for shipment.',
  },
  destination: {
    label: 'Delivery Location',
    description: 'Specific delivery site, plant, warehouse, or receiving gate.',
  },
  orderTotalEur: {
    label: 'Order Value (Net)',
    description: 'Total net value of order in Euros before taxes.',
  },
  equipment: {
    label: 'Equipment / Asset',
    description: 'Plant or machinery asset registered in SAP Plant Maintenance.',
  },
  standort: {
    label: 'Operating Site / Hall',
    description: 'Physical installation site of machine at customer facility.',
  },
  schaden: {
    label: 'Reported Symptom',
    description: 'Technical failure symptom identified from error report or telemetry.',
  },
  reaktionsfrist: {
    label: 'Guaranteed Response Window',
    description: 'Contractually agreed maximum time window until arrival on site.',
  },
  serviceObjekt: {
    label: 'Service Object (SAP IBASE)',
    description: 'Precise equipment model according to Installed Base registry.',
  },
  garantieStatus: {
    label: 'Warranty & Contract Status',
    description: 'Verification of active 24/7 emergency service contract.',
  },
  vertragsKunde: {
    label: 'Contract Customer',
    description: 'Contract owner and billing recipient of service agreement.',
  },
  verfuegbarkeitTechniker: {
    label: 'Technician Availability',
    description: 'Real-time deployment status and travel time of nearest specialist.',
  },
  ersatzteilStatus: {
    label: 'Spare Parts Readiness',
    description: 'Availability of repair components in service vehicle or warehouse.',
  },
  auftragsArt: {
    label: 'SAP Order Type',
    description: 'Classification of service order in ERP (e.g. SM01 emergency).',
  },
  kostenstelle: {
    label: 'Settlement Cost Center',
    description: 'Internal SAP cost center for labor and material expense allocation.',
  },
  dispatchKanal: {
    label: 'Dispatch System',
    description: 'Target system for mobile field execution (e.g. SAP FSM).',
  },
  technikerStatus: {
    label: 'Work Preparation Status',
    description: 'Confirmation of order acceptance on technician mobile device.',
  },
  smsKundenbenachrichtigung: {
    label: 'Customer Dispatch Notice',
    description: 'Status of automated notification sent to on-site contact.',
  },
  voraussichtlicheAnkunft: {
    label: 'Estimated Arrival (ETA)',
    description: 'Calculated arrival time at customer gate.',
  },
  bankKonto: {
    label: 'Bank Account (Payer)',
    description: 'Identified IBAN / BIC of the remitting business partner.',
  },
  rechnungsSumme: {
    label: 'Invoice Sum (Gross)',
    description: 'Sum of invoiced amounts listed on remittance advice.',
  },
  gefundeneOffenePosten: {
    label: 'Open Items in SAP (BSID)',
    description: 'Number and status of open invoices found on customer account.',
  },
  buchungskreis: {
    label: 'SAP Company Code',
    description: 'Company code in SAP FI general ledger (e.g. 1000).',
  },
  skontoGenehmigung: {
    label: 'Discount Decision',
    description: 'Verification result of cash discount eligibility.',
  },
  ausgleichsStrategie: {
    label: 'Clearing Strategy',
    description: 'Full automatic open-item clearing without dispute splitting.',
  },
  genehmigungsStatus: {
    label: 'General Ledger Release',
    description: 'Authorization level for automated posting in FI ledger.',
  },
  ausgeglichenePosten: {
    label: 'Cleared Open Items',
    description: 'Document numbers of cleared and closed invoices.',
  },
  differenzKonto: {
    label: 'Discrepancy Account (FI-AR)',
    description: 'Status of residual variances or short payments.',
  },
  archivStatus: {
    label: 'Audit-Proof Archiving',
    description: 'Storage status in SAP ArchiveLink / Clean-Core Document Store.',
  },
  benachrichtigung: {
    label: 'Internal Notification',
    description: 'Posting log and dispatch confirmation to responsible department.',
  },
  kontoauszugsZeile: {
    label: 'Bank Statement Reconciliation',
    description: 'Reconciliation status with electronic bank statement (CAMT.053).',
  },
  partnerRolle: {
    label: 'SAP Partner Roles',
    description: 'Assignment of sold-to (SP), ship-to (SH), and bill-to (BP) parties.',
  },
  preisMargenPruefung: {
    label: 'Price & Margin Verification',
    description: 'Verification of pricing conditions and contribution margins.',
  },
  fehler: {
    label: 'Failure Reason',
    description: 'System-identified processing failure or missing mandatory attribute.',
  },
  grund: {
    label: 'Reason',
    description: 'Detailed business explanation for abort or escalation.',
  },
  hinweis: {
    label: 'Review Note',
    description: 'Action recommendation or context for the human clerk.',
  },
};

export const formatFieldValue = (val: any, language: 'de' | 'en' = 'de'): any => {
  if (typeof val === 'string' && ENUM_VALUE_TRANSLATIONS[val]) {
    return ENUM_VALUE_TRANSLATIONS[val][language] || ENUM_VALUE_TRANSLATIONS[val].de;
  }
  return val;
};

export const getFieldMeta = (key: string, language: 'de' | 'en' = 'de'): FieldMeta => {
  if (language === 'en') {
    if (FIELD_DICTIONARY_EN[key]) {
      return FIELD_DICTIONARY_EN[key];
    }
  } else {
    if (FIELD_DICTIONARY[key]) {
      return FIELD_DICTIONARY[key];
    }
  }

  const formattedLabel = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  return {
    label: formattedLabel,
    description:
      language === 'en'
        ? `Structured payload attribute: ${key}`
        : `Strukturiertes Beleg-Attribut: ${key}`,
  };
};
