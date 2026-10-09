import { Language } from '@/i18n/translations';

export type MessageQuality = 'good' | 'poor';

export interface ProcessSampleMessage {
  id: string;
  templateId: string;
  quality: MessageQuality;
  qualityLabel: string;
  filename: string;
  documentType: string;
  sender: string;
  subject: string;
  receivedAt: string;
  rawText: string;
  rawEmail?: string;
  sapReferenceDoc: string;
  summary: string;
  // Strukturierte Daten für die Simulation
  structuredData: {
    customerOrPlant: string;
    targetReference: string;
    itemsOrEquipment: Array<{ id: string; name: string; detail: string; qty?: number; priceEur?: number }>;
    totalAmountEur?: number;
    urgency: string;
    specialNote: string;
  };
}

export const SAMPLE_MESSAGES_DE: Record<string, Record<MessageQuality, ProcessSampleMessage>> = {
  // 1. Sell from Stock (BD9)
  'scope-bd9': {
    good: {
      id: 'bd9-good',
      templateId: 'scope-bd9',
      quality: 'good',
      qualityLabel: 'Best Practice (Vollständig & Sauber)',
      filename: 'Kundenbestellung_PO4711.eml',
      documentType: 'RFC822 E-Mail mit PDF-Anhang',
      sender: 'einkauf@mueller-maschinenbau-gmbh.de',
      subject: 'Dringende Bestellung: Flansche & Dichtungssätze gem. Angebot AN-2026-88',
      receivedAt: '2026-10-01T08:15:22+02:00',
      summary: 'Vollständige Kundenbestellung mit Artikelnummern, Preisen, Wunschtermin und Tor-3-Hinweis.',
      sapReferenceDoc: 'SAP Kundenauftrag (TA / VBAK)',
      rawText: `Von: Einkaufsabteilung <einkauf@mueller-maschinenbau-gmbh.de>
An: orders@sap-enterprise-showcase.com
Datum: 01.10.2026 08:15
Betreff: Dringende Bestellung: Flansche & Dichtungssätze gem. Angebot AN-2026-88

Sehr geehrte Damen und Herren,

hiermit bestellen wir gemäß Ihrem Angebot AN-2026-88 verbindlich für unser Werk Augsburg:

Position 1:
- 12 Stück Präzisionsflansch Stahl DIN 2633 (Ihre Art.-Nr. FL-9021 / unsere Ref: MMB-9021)
- Preis: 145,00 EUR / Stk.
- Gewünschter Liefertermin: 15.10.2026

Position 2:
- 24 Stück Hochdruck-Dichtungssatz EPDM (Ihre Art.-Nr. DI-4410)
- Preis: 22,50 EUR / Stk.
- Gewünschter Liefertermin: 15.10.2026

Wichtiger Hinweis:
Lieferung bitte zwingend an Tor 3 (Wareneingang Schwermaschinenbau).
Rechnung bitte elektronisch im ZUGFeRD-Format an rechnung@mueller-maschinenbau-gmbh.de.
Bestellnummer unseres Hauses: PO-4711-AUG

Mit freundlichen Grüßen,
Klaus Weber
Leiter Einkauf | Müller Maschinenbau GmbH | Augsburg`,
      structuredData: {
        customerOrPlant: 'Müller Maschinenbau GmbH, Augsburg (KUNNR 0000100420)',
        targetReference: 'PO-4711-AUG (Angebot AN-2026-88)',
        itemsOrEquipment: [
          { id: 'FL-9021', name: 'Präzisionsflansch Stahl DIN 2633', detail: 'Pos 10 • Lager: 85 ST verfügbar', qty: 12, priceEur: 145.0 },
          { id: 'DI-4410', name: 'Hochdruck-Dichtungssatz EPDM', detail: 'Pos 20 • Lager: 320 ST verfügbar', qty: 24, priceEur: 22.5 },
        ],
        totalAmountEur: 2280.0,
        urgency: 'Standard / Express (15.10.2026)',
        specialNote: 'Tor 3 (Wareneingang Schwermaschinenbau)',
      },
    },
    poor: {
      id: 'bd9-poor',
      templateId: 'scope-bd9',
      quality: 'poor',
      qualityLabel: 'Schlecht / Verrauscht (Unvollständig & Vage)',
      filename: 'Eilauftrag_Freitext_unvollstaendig.eml',
      documentType: 'Freitext-Mail ohne Belegstruktur',
      sender: 'klaus.baustelle88@web.de',
      subject: 'Brauche ganz schnell wieder Flansche für die Baustelle',
      receivedAt: '2026-10-01T08:42:10+02:00',
      summary: 'Chaotische Freitext-Nachricht ohne Artikelnummern, private Absenderadresse, unklare Mengen.',
      sapReferenceDoc: 'SAP Kundenauftrag (TA / VBAK)',
      rawText: `Von: Klaus Baustelle <klaus.baustelle88@web.de>
An: orders@sap-enterprise-showcase.com
Datum: 01.10.2026 08:42
Betreff: Brauche ganz schnell wieder Flansche für die Baustelle

Moin,

schickt mir bitte nochmal 10 von den runden Flanschen wie beim letzten Mal und noch ein paar Dichtungen dazu.
Muss morgen früh um 7 Uhr unbedingt da sein, sonst steht die Baustelle still!
Preise macht bitte wie besprochen und Rechnung wie immer an die Firma.

Grüße Klaus`,
      structuredData: {
        customerOrPlant: 'Unklar (Absender web.de, evtl. Müller Maschinenbau)',
        targetReference: 'Keine PO-Nummer vorhanden',
        itemsOrEquipment: [
          { id: 'UNKNOWN-1', name: 'Runde Flansche ("wie beim letzten Mal")', detail: 'Artikelnummer fehlt • Menge: 10 ST' },
          { id: 'UNKNOWN-2', name: 'Dichtungen ("ein paar dazu")', detail: 'Artikelnummer & Stückzahl unbestimmt' },
        ],
        totalAmountEur: 0.0,
        urgency: 'Morgen früh 07:00 Uhr (Nicht erfüllbar ohne ATP)',
        specialNote: 'Baustelle droht Stillstand • Keine Abladestelle angegeben',
      },
    },
  },

  // 2. Service Order Management (2F1)
  'scope-2f1': {
    good: {
      id: '2f1-good',
      templateId: 'scope-2f1',
      quality: 'good',
      qualityLabel: 'Best Practice (Prio 1 Notfall mit Equipment-ID)',
      filename: 'Stoerungsmeldung_KSB_Pumpe_P204.eml',
      documentType: 'Service-Ticket & Notfall-Meldung',
      sender: 'instandhaltung@chemiepark-bavaria.de',
      subject: 'NOTFALL Prio 1: Lagerschaden Hochdruckpumpe P-204 (Equip: 10084721)',
      receivedAt: '2026-10-01T09:12:05+02:00',
      summary: 'Präziser Notfallbericht mit Equipment-ID, Fehlercode E-4402, SLA Gold Vertrag und Kontakt vor Ort.',
      sapReferenceDoc: 'SAP Serviceauftrag (SO01 / AUFK)',
      rawText: `Von: Instandhaltung Chemiepark Bavaria <instandhaltung@chemiepark-bavaria.de>
An: service-hotline@sap-enterprise-showcase.com
Datum: 01.10.2026 09:12
Betreff: NOTFALL Prio 1: Lagerschaden Hochdruckpumpe P-204 (Equip: 10084721)

Sehr geehrte Damen und Herren,

an unserer Hauptpolymerisationslinie 2 ist soeben die Hochdruckpumpe ausgefallen:

- Betroffenes Equipment: 10084721 (KSB Multitec A50)
- Seriennummer: SN-9941-K
- Einbauort: Werk Burghausen, Halle 4B (Pumpenstation Süd)
- Fehlerbild: Massiver Druckabfall auf 0 Bar, Schwingungssensor alarmiert (Fehlercode E-4402 Lagerschaden)
- Dringlichkeit: PRODUKTIONSSTILLSTAND (Line Down - Prio 1 Notfall)
- Servicevertrag: SLA Gold Vertrag Nr. SV-88102 (Garantierte Reaktionszeit < 2 Stunden, 100% Deckung)
- Notwendige Ersatzteile: Lagersatz Keramik LK-22 & Dichtungssatz KSB-50
- Ansprechpartner vor Ort: Markus Huber, Schichtleiter, Mobil: +49 8677 992-411

Bitte entsenden Sie unverzüglich einen Servicetechniker!

Mit freundlichen Grüßen,
Markus Huber | Chemiepark Bavaria Werk Burghausen`,
      structuredData: {
        customerOrPlant: 'Chemiepark Bavaria Werk Burghausen (KUNNR 0000200810)',
        targetReference: 'Equip 10084721 • Vertrag SV-88102 (SLA Gold)',
        itemsOrEquipment: [
          { id: '10084721', name: 'KSB Multitec A50 Hochdruckpumpe', detail: 'Seriennr: SN-9941-K • Fehler: E-4402' },
          { id: 'LK-22', name: 'Ersatzteil: Lagersatz Keramik LK-22', detail: 'Disponiert aus Zentrallager Burghausen' },
        ],
        totalAmountEur: 1450.0,
        urgency: 'Prio 1 NOTFALL (Reaktion < 2h gem. SLA Gold)',
        specialNote: 'Werk Burghausen, Halle 4B • Ansprechpartner Markus Huber',
      },
    },
    poor: {
      id: '2f1-poor',
      templateId: 'scope-2f1',
      quality: 'poor',
      qualityLabel: 'Schlecht / Verrauscht (Keine Maschinennummer & Vage)',
      filename: 'Maschine_kaputt_keine_Nummer.eml',
      documentType: 'Unstrukturiertes Reklamations-Ticket',
      sender: 'schichtleiter-nord@chemiepark-bavaria.de',
      subject: 'Pumpe macht Krach und geht aus',
      receivedAt: '2026-10-01T09:35:18+02:00',
      summary: 'Vage Störungsmeldung ohne Equipment-Nummer, ohne Fehlercode und ohne Seriennummer.',
      sapReferenceDoc: 'SAP Serviceauftrag (SO01 / AUFK)',
      rawText: `Von: Schichtleiter Nord <schichtleiter-nord@chemiepark-bavaria.de>
An: service-hotline@sap-enterprise-showcase.com
Datum: 01.10.2026 09:35
Betreff: Pumpe macht Krach und geht aus

Hallo Service,

hier geht gar nichts mehr. Die große blaue Pumpe hinten im Eck stinkt verbrannt und ist vorhin einfach ausgegangen.
Weiß nicht welche Nummer die genau hat, müsst ihr bitte in euren alten Rechnungen nachschauen.
Wir brauchen heute noch jemanden der das repariert, sonst gibt es Ärger mit der Werkleitung.

Danke, Schicht Nord`,
      structuredData: {
        customerOrPlant: 'Chemiepark Bavaria (Standort/Kunde ungenau)',
        targetReference: 'Keine Equipment-ID • Keine Seriennummer',
        itemsOrEquipment: [
          { id: 'UNKNOWN-EQUIP', name: 'Große blaue Pumpe ("hinten im Eck")', detail: 'Identifikation fehlgeschlagen (Mehrdeutigkeit)' },
        ],
        totalAmountEur: 0.0,
        urgency: 'Unbestimmt ("heute noch")',
        specialNote: 'Geruchsbelästigung ("stinkt verbrannt") • Rückfrage erforderlich',
      },
    },
  },

  // 3. Accounts Receivable & Clearing (J60)
  'scope-j60': {
    good: {
      id: 'j60-good',
      templateId: 'scope-j60',
      quality: 'good',
      qualityLabel: 'Best Practice (Sauberes Zahlungsavis mit Skonto)',
      filename: 'Zahlungsavis_Siemens_Healthineers.pdf',
      documentType: 'Elektronisches Zahlungsavis (PDF)',
      sender: 'accounting@siemens-healthineers.com',
      subject: 'Zahlungsavis zur Überweisung 14.280,00 EUR per 02.10.2026',
      receivedAt: '2026-10-01T10:05:40+02:00',
      summary: 'Rechnerisch exaktes Zahlungsavis mit Rechnungsbezug, 2% Skontoabzug und IBAN.',
      sapReferenceDoc: 'SAP FI-AR Zahlungsausgleich (FB05 / BSEG)',
      rawText: `Absender: Siemens Healthineers AG | Corporate Accounting
An: debitoren@sap-enterprise-showcase.com
Datum: 01.10.2026 10:05
Betreff: Zahlungsavis zur Überweisung 14.280,00 EUR per 02.10.2026

Sehr geehrte Damen und Herren,

wir haben heute eine Sammelüberweisung über 14.280,00 EUR veranlasst:

Ausgleichs-Positionen:
1. Rechnungsnummer: RE-2026-9011
   - Rechnungsbetrag: 8.000,00 EUR
   - Skonto (2% innerhalb 14 Tage): -160,00 EUR
   - Zahlbetrag: 7.840,00 EUR

2. Rechnungsnummer: RE-2026-9012
   - Rechnungsbetrag: 6.571,43 EUR
   - Skonto (2% innerhalb 14 Tage): -131,43 EUR
   - Zahlbetrag: 6.440,00 EUR

Überweisungsbetrag gesamt: 14.280,00 EUR
Valuta: 02.10.2026
Bankverbindung: DE89 7001 0080 0982 1120 00

Mit freundlichen Grüßen,
Zentralregulierung | Siemens Healthineers AG`,
      structuredData: {
        customerOrPlant: 'Siemens Healthineers AG (KUNNR 0000300192)',
        targetReference: 'Rechnungen RE-2026-9011 & RE-2026-9012',
        itemsOrEquipment: [
          { id: 'RE-2026-9011', name: 'Wartungsrechnung Q3', detail: '8.000,00 € • Skonto 2%: -160,00 € = 7.840,00 €' },
          { id: 'RE-2026-9012', name: 'Sensorik-Lieferung', detail: '6.571,43 € • Skonto 2%: -131,43 € = 6.440,00 €' },
        ],
        totalAmountEur: 14280.0,
        urgency: 'Valuta 02.10.2026 (Fristgerecht für 2% Skonto)',
        specialNote: 'Automatischer FI-Ausgleich gegen OP-Tabelle BSID',
      },
    },
    poor: {
      id: 'j60-poor',
      templateId: 'scope-j60',
      quality: 'poor',
      qualityLabel: 'Schlecht / Verrauscht (Differenzen & Ohne Rechnungsnummer)',
      filename: 'Sammelueberweisung_Avis_unleserlich.pdf',
      documentType: 'Scanned Fax / Unstrukturierter Zahlungsbeleg',
      sender: 'buchhaltung@schmidt-metallbau.de',
      subject: 'Zahlung 5.400 EUR eingewiesen',
      receivedAt: '2026-10-01T10:22:15+02:00',
      summary: 'Überweisung mit pauschalem Abzug ohne Rechnungsnummer und ohne Skontogrundlage.',
      sapReferenceDoc: 'SAP FI-AR Zahlungsausgleich (FB05 / BSEG)',
      rawText: `Von: Buchhaltung Schmidt Metallbau <buchhaltung@schmidt-metallbau.de>
Datum: 01.10.2026 10:22
Betreff: Zahlung 5.400 EUR eingewiesen

Hallo Buchhaltung,

wir haben heute 5.400 Euro überwiesen für alte Rechnungen aus dem Sommer.
Wir haben pauschal 600 Euro einbehalten wegen der beschädigten Lieferung letzte Woche.
Bitte bucht das aus unserem Kundenkonto aus.

Schmidt Metallbau`,
      structuredData: {
        customerOrPlant: 'Schmidt Metallbau (KUNNR unklar)',
        targetReference: 'Keine Rechnungsnummer genannt',
        itemsOrEquipment: [
          { id: 'DIFF-600', name: 'Pauschalabzug Reklamation', detail: '600,00 € Abzug ohne Gutschrift oder Beleg' },
        ],
        totalAmountEur: 5400.0,
        urgency: 'Zahlungseingang verbucht • Restbetrag im Klärungsbestand',
        specialNote: 'Konto nicht ausgleichbar (Differenz 600 €) • Klärungsfall FI',
      },
    },
  },
  // 4. Supplier Invoice Verification & 3-Way Match (2B6)
  'scope-2b6': {
    good: {
      id: '2b6-good',
      templateId: 'scope-2b6',
      quality: 'good',
      qualityLabel: 'Best Practice (ZUGFeRD PDF & Bestellbezug)',
      filename: 'Rechnung_RE-2026-8812.pdf',
      documentType: 'ZUGFeRD 2.2 / PDF Inbound Rechnung',
      sender: 'rechnung@bosch-rexroth-partner.de',
      subject: 'Rechnung RE-2026-8812 zu Bestellung PO-88201',
      receivedAt: '2026-10-01T09:12:00+02:00',
      summary: 'Lieferantenrechnung mit Bestellbezug PO-88201, Lieferschein LS-7710, 19% MwSt und 3% Skonto.',
      sapReferenceDoc: 'SAP MM-IV Rechnungsprüfung (MIRO)',
      rawText: `Von: Bosch Rexroth Partner Vertrieb <rechnung@bosch-rexroth-partner.de>
An: eingangsrechnung@sap-enterprise-showcase.com
Datum: 01.10.2026 09:12
Betreff: Rechnung RE-2026-8812 zu Bestellung PO-88201

Sehr geehrte Damen und Herren,

anbei übermitteln wir Ihnen unsere Rechnung RE-2026-8812 zur Bestellung PO-88201:

Lieferant: Bosch Rexroth Partner GmbH (Kreditor 0000400120)
Ihre Bestellnummer: PO-88201
Unser Lieferschein: LS-7710 (Wareneingang 29.09.2026)

Rechnungspositionen:
Pos 10: 10 Stk. Proportional-Wegeventil 4WRAE (Art.-Nr. R900952011)
Einzelpreis: 380,00 EUR | Gesamt: 3.800,00 EUR netto

Nettobetrag: 3.800,00 EUR
Umsatzsteuer (19%): 722,00 EUR
Gesamtbetrag (Brutto): 4.522,00 EUR

Zahlungskonditionen: Innerhalb 14 Tagen 3% Skonto (135,66 EUR), innerhalb 30 Tagen netto.
Bankverbindung: DE44 6005 0101 0001 2345 67

Mit freundlichen Grüßen,
Kreditorenbuchhaltung Bosch Rexroth Partner`,
      structuredData: {
        customerOrPlant: 'Bosch Rexroth Partner GmbH (Kreditor 0000400120)',
        targetReference: 'PO-88201 / RE-2026-8812',
        itemsOrEquipment: [
          { id: 'R900952011', name: 'Proportional-Wegeventil 4WRAE', detail: 'Pos 10 • 10 Stk. à 380,00 €', qty: 10, priceEur: 380.0 },
        ],
        totalAmountEur: 4522.0,
        urgency: 'Skontofrist 14 Tage bis 15.10.2026 (3% = 135,66 €)',
        specialNote: '3-Wege-Match gegen Bestellung PO-88201 und Wareneingang WE-500129',
      },
    },
    poor: {
      id: '2b6-poor',
      templateId: 'scope-2b6',
      quality: 'poor',
      qualityLabel: 'Schlecht / Verrauscht (Preisentwicklung & Unklare Nebenkosten)',
      filename: 'Scan_Rechnung_Rexroth_schraeg.pdf',
      documentType: 'Gescannte Papier-Rechnung (Fuzzy OCR)',
      sender: 'scan-service@extern-logistik.com',
      subject: 'Eingangsbeleg Lieferant RE-8812 (Fuzzy Scan)',
      receivedAt: '2026-10-01T09:44:18+02:00',
      summary: 'Gescannte Rechnung mit leichter Preisabweichung (+4,50 € Verpackung) und unvollständiger IBAN.',
      sapReferenceDoc: 'SAP MM-IV Rechnungsprüfung (MIRO)',
      rawText: `Von: Scan-Service <scan-service@extern-logistik.com>
Datum: 01.10.2026 09:44
Betreff: Eingangsbeleg Lieferant RE-8812 (Fuzzy Scan)

[OCR Scan Ergebnis - Dokument leicht gedreht, 150 DPI]
Lieferant: Rexroth Partner Vertrieb
Beleg-Nr: RE-8812
Bestellung: PO-88201 (?)

10x Wegeventil 4WRAE: 3.800,00 EUR
Verpackungszuschlag: 4,50 EUR (Nicht in Bestellung vereinbart)
Summe netto: 3.804,50 EUR
Gesamt inkl. MwSt: 4.527,36 EUR
IBAN: DE44 6005 **** **** **** 67`,
      structuredData: {
        customerOrPlant: 'Rexroth Partner Vertrieb (Kreditor 0000400120)',
        targetReference: 'PO-88201 / RE-8812',
        itemsOrEquipment: [
          { id: 'R900952011', name: 'Wegeventil 4WRAE', detail: 'Pos 10 • 10 Stk. à 380,00 €', qty: 10, priceEur: 380.0 },
          { id: 'NEBEN-01', name: 'Verpackungszuschlag', detail: '4,50 € Kleinbetragsabweichung', qty: 1, priceEur: 4.5 },
        ],
        totalAmountEur: 4527.36,
        urgency: 'Toleranzprüfung erforderlich (Differenz 4,50 € ≤ 5,00 € Schwelle)',
        specialNote: 'Preisabweichung 4,50 € innerhalb Toleranzgrenze • IBAN aus Lieferantenstamm ermittelt',
      },
    },
  },
  // 5. Sourcing & Procurement (J45)
  'scope-j45': {
    good: {
      id: 'j45-good',
      templateId: 'scope-j45',
      quality: 'good',
      qualityLabel: 'Best Practice (Vollständig & Budgetgedeckt)',
      filename: 'Bedarfsanforderung_Banf_10004521.json',
      documentType: 'Interne Bedarfsanforderung (SAP MM-PUR)',
      sender: 'fertigungsleitung@werk-augsburg.de',
      subject: 'Banf: 500x Rillenkugellager 6205-2RS & 10x Hochleistungsfett für Montagelinie 2',
      receivedAt: '2026-10-02T07:30:00+02:00',
      summary: 'Vollständige Bedarfsanforderung mit Kostenstelle 4210, Kontierung und Rahmenvertrag SKF.',
      sapReferenceDoc: 'SAP Bestellanforderung (EBAN Beleg 10004521)',
      rawText: `Von: Dr. Stefan Huber <fertigungsleitung@werk-augsburg.de>
An: einkauf-zentrale@sap-enterprise-showcase.com
Datum: 02.10.2026 07:30
Betreff: Banf: 500x Rillenkugellager 6205-2RS & 10x Hochleistungsfett für Montagelinie 2

Hallo Einkaufsteam,

wir benötigen für die Serienfertigung der Montagelinie 2 folgende Komponenten:
- Pos 1: 500 Stück Rillenkugellager DIN 625 (SKF 6205-2RS / SAP-Mat: KL-6205-RS)
  Kostenstelle: 4210 (Montage Seriengetriebe) | Sachkonto: 400000 | Liefertermin: 24.10.2026
- Pos 2: 10 Kartuschen Hochtemperaturfett LGHP 2/0.4 (SAP-Mat: FT-9920)
  Kostenstelle: 4210 | Sachkonto: 400000 | Liefertermin: 24.10.2026

Rahmenvertrag RV-SKF-2024 ist hinterlegt. Budget für Q4 ist freigegeben.

Beste Grüße,
Stefan Huber | Fertigungsleiter Werk Augsburg`,
      structuredData: {
        customerOrPlant: 'Werk Augsburg (Werk 1000) / Kostenstelle 4210',
        targetReference: 'BANF-2026-4521 (Rahmenvertrag RV-SKF-2024)',
        itemsOrEquipment: [
          { id: 'KL-6205-RS', name: 'Rillenkugellager DIN 625 6205-2RS', detail: '500 Stk. • Rahmenvertragspreis 8,50 €', qty: 500, priceEur: 8.5 },
          { id: 'FT-9920', name: 'Hochtemperaturfett SKF LGHP 2', detail: '10 Stk. • Rahmenvertragspreis 24,00 €', qty: 10, priceEur: 24.0 },
        ],
        totalAmountEur: 4490.0,
        urgency: 'Standardbeschaffung (Bedarfstermin 24.10.2026)',
        specialNote: 'Rahmenvertrag RV-SKF-2024 aktiv • Budgetprüfung bestanden',
      },
    },
    poor: {
      id: 'j45-poor',
      templateId: 'scope-j45',
      quality: 'poor',
      qualityLabel: 'Schlecht / Unvollständig (Fehlende Kostenstelle & Menge)',
      filename: 'Notiz_Lagerbestand_Kugellager.txt',
      documentType: 'Freitext-Bedarf ohne Kontierung',
      sender: 'montage-schicht3@werk-augsburg.de',
      subject: 'Kugellager gehen aus bitte nachbestellen',
      receivedAt: '2026-10-02T08:05:12+02:00',
      summary: 'Dringender Bedarf ohne genaue Mengenangabe, keine Kostenstelle, unklare Spezifikation.',
      sapReferenceDoc: 'SAP Bestellanforderung (EBAN Beleg 10004521)',
      rawText: `Von: Schicht 3 Montage <montage-schicht3@werk-augsburg.de>
An: einkauf@sap-enterprise-showcase.com
Betreff: Kugellager gehen aus bitte nachbestellen

Wir haben fast keine Lager mehr für das große Getriebe. Bitte ein paar Kisten bestellen. Weiß nicht wer unterschreiben muss.`,
      structuredData: {
        customerOrPlant: 'Werk Augsburg (Werk 1000)',
        targetReference: 'UNBEKANNT',
        itemsOrEquipment: [
          { id: 'KL-UNKNOWN', name: 'Kugellager (Typ unklar)', detail: 'Menge vage: ein paar Kisten', qty: 1, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Kritisch / Unvollständig',
        specialNote: 'Kostenstelle fehlt • Sachkonto fehlt • Spezifikation unklar',
      },
    },
  },
  // 6. Make-to-Stock Production (1GA)
  'scope-1ga': {
    good: {
      id: '1ga-good',
      templateId: 'scope-1ga',
      quality: 'good',
      qualityLabel: 'Best Practice (Produktionsplan & Stückliste intakt)',
      filename: 'Fertigungsplan_Auftrag_10009823.json',
      documentType: 'SAP PP Fertigungsauftragsdisposition',
      sender: 'produktionsplanung@werk-augsburg.de',
      subject: 'Fertigungsauftrag freigeben: 50x Industrie-Planetengetriebe PG-200',
      receivedAt: '2026-10-02T09:00:00+02:00',
      summary: 'Fertigungsauftrag für 50 Baugruppen mit vollständiger Stückliste, Arbeitsplatz AP-40 und Material-ATP.',
      sapReferenceDoc: 'SAP Fertigungsauftrag (AFKO / AFPO 10009823)',
      rawText: `System-Meldung: SAP S/4HANA MRP Live
Planauftrag 0010048821 umgewandelt in Fertigungsauftrag 10009823.
Material: PG-200-ST (Industrie-Planetengetriebe i=10)
Menge: 50 Stück | Werk: 1000 | Fertigungssteuerer: 002 (Getriebebau)
Eckstarttermin: 12.10.2026 | Eckendtermin: 23.10.2026
Stückliste: Stücklistenvariante 01 aufgelöst (7 Komponenten)
Arbeitsplan: Gruppe AP-GETR-01 (Arbeitsgänge 10, 20, 30, 40)
ATP-Prüfung: Alle 7 Komponenten vollständig verfügbar (Grün).`,
      structuredData: {
        customerOrPlant: 'Werk 1000 (Halle 3 - Getriebemontage)',
        targetReference: 'FA-10009823 (Planauftrag 0010048821)',
        itemsOrEquipment: [
          { id: 'PG-200-ST', name: 'Planetengetriebe PG-200', detail: '50 Stk. • Planzeit 120 Std.', qty: 50, priceEur: 680.0 },
        ],
        totalAmountEur: 34000.0,
        urgency: 'Termingerecht (Fertigstellung 23.10.2026)',
        specialNote: 'Alle Komponenten verfügbar • Arbeitsplatz AP-40 kapazitiv belegt',
      },
    },
    poor: {
      id: '1ga-poor',
      templateId: 'scope-1ga',
      quality: 'poor',
      qualityLabel: 'Schlecht / Fehlteilwarnung (Materialengpass)',
      filename: 'Fertigungsengpass_Fehlteil.txt',
      documentType: 'SAP PP Fehlteilmeldung',
      sender: 'mrp-daemon@sap-enterprise-showcase.com',
      subject: 'Fehlteile bei Fertigungsauftrag 10009823 - Gehäuse fehlt',
      receivedAt: '2026-10-02T09:15:00+02:00',
      summary: 'ATP-Prüfung schlägt fehl: 50x Getriebegehäuse fehlen im Lagerbestand.',
      sapReferenceDoc: 'SAP Fertigungsauftrag (AFKO / AFPO 10009823)',
      rawText: `Warnung: Dynamische ATP-Prüfung für Fertigungsauftrag 10009823 fehlgeschlagen.
Komponente GH-200-ALU (Getriebegehäuse Aluminium) Fehlbestand: 50 Stück.
Wiederbeschaffungszeit: 14 Arbeitstage. Geplanter Start 12.10.2026 kann nicht gehalten werden.`,
      structuredData: {
        customerOrPlant: 'Werk 1000',
        targetReference: 'FA-10009823',
        itemsOrEquipment: [
          { id: 'GH-200-ALU', name: 'Getriebegehäuse Aluminium', detail: 'Fehlmenge: 50 Stk.', qty: 50, priceEur: 110.0 },
        ],
        totalAmountEur: 5500.0,
        urgency: 'Auftragsstopp (Materialengpass)',
        specialNote: 'ATP Rot • Fehlteil GH-200-ALU • Terminverschiebung nötig',
      },
    },
  },
  // 7. Quality Management (1MB)
  'scope-1mb': {
    good: {
      id: '1mb-good',
      templateId: 'scope-1mb',
      quality: 'good',
      qualityLabel: 'Best Practice (Werkszeugnis EN 10204 3.1 konform)',
      filename: 'Werkszeugnis_3.1_Charge_C8891.pdf',
      documentType: 'Abnahmeprüfzeugnis nach DIN EN 10204 3.1',
      sender: 'qm-zertifikate@stahlwerk-oberpfalz.de',
      subject: 'Werksprüfzeugnis EN 10204 3.1 für Charge C8891 (12x Präzisionsflansch)',
      receivedAt: '2026-10-02T10:12:00+02:00',
      summary: 'Prüfzeugnis mit Zugfestigkeit, Streckgrenze, Kerbschlagarbeit und Härte. Alle Werte in der Toleranz.',
      sapReferenceDoc: 'SAP Prüflos (QALS 01000038291)',
      rawText: `Abnahmeprüfzeugnis DIN EN 10204 3.1
Hersteller: Stahlwerk Oberpfalz GmbH | Zeugnis-Nr: WZ-2026-9912
Kunde: SAP Enterprise Showcase | Bestell-Nr: 4500028911 | Lieferschein: LS-44109
Material: 1.4404 / 316L Präzisionsflansch DIN 2633 | Charge: C8891

Chemische Analyse (%):
C: 0.022 (Soll <= 0.030) | Cr: 17.20 (Soll 16.5-18.5) | Ni: 12.10 (Soll 10.0-13.0) | Mo: 2.15 (Soll 2.0-2.5)

Mechanische Prüfwerte:
- Dehngrenze Rp0.2: 285 MPa (Soll >= 240 MPa) -> In Toleranz
- Zugfestigkeit Rm: 580 MPa (Soll 500 - 700 MPa) -> In Toleranz
- Bruchdehnung A5: 46 % (Soll >= 40 %) -> In Toleranz
- Härte Brinell: 175 HB (Soll <= 215 HB) -> In Toleranz

Befund: Alle Anforderungen der Norm und Prüfvorgabe QM-FL-01 vollständig erfüllt.`,
      structuredData: {
        customerOrPlant: 'Wareneingang Tor 3 / QM-Labor Werk 1000',
        targetReference: 'Prüflos 01000038291 (Charge C8891)',
        itemsOrEquipment: [
          { id: 'CHARG-C8891', name: 'Präzisionsflansch 1.4404 (Charge C8891)', detail: 'Rp0.2: 285 MPa | Rm: 580 MPa | Härte: 175 HB', qty: 12, priceEur: 145.0 },
        ],
        totalAmountEur: 1740.0,
        urgency: 'Freigabefähig (Toleranzen 100% eingehalten)',
        specialNote: 'Alle 6 Merkmale im Soll • Verwendungsentscheid Annahme empfohlen',
      },
    },
    poor: {
      id: '1mb-poor',
      templateId: 'scope-1mb',
      quality: 'poor',
      qualityLabel: 'Schlecht / Grenzwertverletzung (Härte überschritten)',
      filename: 'Mangelbericht_Gussgehaeuse.pdf',
      documentType: 'Fehlerprotokoll Werkstoffprüfung',
      sender: 'labor@sap-enterprise-showcase.com',
      subject: 'Prüflos 01000038291: Härtewert überschreitet Obergrenze',
      receivedAt: '2026-10-02T10:45:00+02:00',
      summary: 'Härteprüfung ergibt 238 HB (Maximal zulässig: 215 HB). Rissgefahr bei Weiterverarbeitung.',
      sapReferenceDoc: 'SAP Prüflos (QALS 01000038291)',
      rawText: `QM-Prüfbericht: Abweichung bei Wareneingangsprüfung
Prüflos: 01000038291 | Material: 1.4404 Flansch | Charge: C8891
Gemessener Härtewert: 238 HB.
Oberer Grenzwert: 215 HB.
Abweichung: +23 HB (Toleranzverletzung).
Empfehlung: Rückweisung der Charge an Lieferanten oder Sonderfreigabe durch Konstruktionsleiter.`,
      structuredData: {
        customerOrPlant: 'QM-Labor Werk 1000',
        targetReference: 'Prüflos 01000038291',
        itemsOrEquipment: [
          { id: 'CHARG-C8891', name: 'Flansch Charge C8891', detail: 'Härte 238 HB überschreitet 215 HB Obergrenze', qty: 12, priceEur: 145.0 },
        ],
        totalAmountEur: 1740.0,
        urgency: 'Sperrlager / Klärung',
        specialNote: 'Toleranzverletzung Merkmal Härte • Q-Meldung erforderlich',
      },
    },
  },
  // 8. Corrective Plant Maintenance (BJ2)
  'scope-bj2': {
    good: {
      id: 'bj2-good',
      templateId: 'scope-bj2',
      quality: 'good',
      qualityLabel: 'Best Practice (Präzise Störungsmeldung)',
      filename: 'Stoermeldung_Hydraulik_P4.json',
      documentType: 'SAP PM Störungsmeldung (IW21 / QMEL)',
      sender: 'schichtmeister.presse@werk-augsburg.de',
      subject: 'Dringende Störung: Druckverlust Hauptzylinder Hydraulikpresse 4 (Equipment 10048201)',
      receivedAt: '2026-10-02T11:00:00+02:00',
      summary: 'Druckabfall auf 80 bar an Presse 4 in Halle 2. Dichtungspaket defekt, Stillstand droht. Prio 1.',
      sapReferenceDoc: 'SAP Instandhaltungsmeldung (QMEL 10005423)',
      rawText: `Störungsanzeige Instandhaltung
Equipment: 10048201 (Hydraulikpresse Schuler 500t - P4)
Technischer Platz: DE-AUG-H2-PRS4 (Halle 2 / Umformtechnik)
Schadensbild: Druckabfall im Hauptsteuerkreis von 220 bar auf 80 bar. Leckage am Zylinderflansch.
Auswirkung: Pressvorgang gestoppt. Montagelinie 1 läuft in 90 Minuten leer.
Dringlichkeit: Priorität 1 (Sehr hoch / Produktionsstillstand).
Erforderliche Reparatur: Dichtungssatz HD-PRS4 tauschen und Hydrauliköl HLP-46 nachfüllen.`,
      structuredData: {
        customerOrPlant: 'Halle 2 (Umformtechnik) / Tech. Platz DE-AUG-H2-PRS4',
        targetReference: 'Equipment 10048201 (Meldung 10005423)',
        itemsOrEquipment: [
          { id: '10048201', name: 'Hydraulikpresse Schuler 500t', detail: 'Leckage Zylinderflansch • Druckabfall 80 bar', qty: 1, priceEur: 850.0 },
        ],
        totalAmountEur: 1250.0,
        urgency: 'Prio 1 - Dringender Stillstand',
        specialNote: 'Dichtungssatz HD-PRS4 im Vorratslager reservieren • Schlosserteam alarmieren',
      },
    },
    poor: {
      id: 'bj2-poor',
      templateId: 'scope-bj2',
      quality: 'poor',
      qualityLabel: 'Schlecht / Vage (Anlagenteil & Fehlerbild unklar)',
      filename: 'Notiz_Presse_tropft.txt',
      documentType: 'Mündliche Notiz ohne Kennzeichnung',
      sender: 'werker-unbekannt@werk-augsburg.de',
      subject: 'Da tropft was in Halle 2',
      receivedAt: '2026-10-02T11:22:00+02:00',
      summary: 'Vage Meldung: Tropfendes Öl in Halle 2, unklar welche der drei Pressen betroffen ist.',
      sapReferenceDoc: 'SAP Instandhaltungsmeldung (QMEL 10005423)',
      rawText: `Hier tropft Öl auf den Boden bei den großen Pressen hinten links. Macht auch laute Geräusche wenn man drückt. Schaut mal bitte vorbei.`,
      structuredData: {
        customerOrPlant: 'Halle 2',
        targetReference: 'UNBEKANNT',
        itemsOrEquipment: [
          { id: 'EQUIP-UNKLAR', name: 'Unbekannte Presse Halle 2', detail: 'Ölleckage unklarer Herkunft', qty: 1, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Unbekannt',
        specialNote: 'Equipment nicht identifiziert • Vor-Ort-Inspektion zwingend notwendig',
      },
    },
  },
  // 9. Warehouse Inbound & Putaway with EWM (1B6)
  'scope-1b6': {
    good: {
      id: '1b6-good',
      templateId: 'scope-1b6',
      quality: 'good',
      qualityLabel: 'Best Practice (ASN EDI 856 mit NVE/SSCC Barcodes)',
      filename: 'Lieferavis_DESADV_80001923.xml',
      documentType: 'Elektronisches Lieferavis (EDIFACT DESADV)',
      sender: 'dispatch@dachser-logistics.com',
      subject: 'ASN Lieferavis: 4 Europaletten Stahlflansche zu Bestellung 4500028911',
      receivedAt: '2026-10-02T12:00:00+02:00',
      summary: 'Lieferavis mit Ankunftszeit 14:00 Uhr, Kennzeichen A-DL-8821, 4 Handling Units mit SSCC Barcodes.',
      sapReferenceDoc: 'SAP EWM Anlieferung (/SCWM/PRDO 80001923)',
      rawText: `EDIFACT DESADV / SAP Inbound ASN
Spediteur: Dachser SE | Lkw-Kennzeichen: A-DL-8821 | Fahrer: M. Horvath
Geplante Ankunft: 02.10.2026 14:00 Uhr | Werk: 1000 | Lager: EWM-01
Bestellreferenz: 4500028911 | Lieferschein: LS-992014

Handling Units (Packstücke):
- HU 1 (SSCC 340123456789012341): Europalette 800 kg, 3x Flansch FL-9021
- HU 2 (SSCC 340123456789012342): Europalette 800 kg, 3x Flansch FL-9021
- HU 3 (SSCC 340123456789012343): Europalette 800 kg, 3x Flansch FL-9021
- HU 4 (SSCC 340123456789012344): Europalette 800 kg, 3x Flansch FL-9021
Gesamtgewicht: 3.200 kg | Ladevolumen: 4 Stellplätze`,
      structuredData: {
        customerOrPlant: 'Logistikzentrum Süd / EWM Lager 0001',
        targetReference: 'ASN-80001923 (Lkw A-DL-8821)',
        itemsOrEquipment: [
          { id: 'HU-01', name: 'Palette 1 (NVE 340123456789012341)', detail: '3 Stk. FL-9021 • Gewicht 800 kg', qty: 3, priceEur: 435.0 },
          { id: 'HU-02', name: 'Palette 2 (NVE 340123456789012342)', detail: '3 Stk. FL-9021 • Gewicht 800 kg', qty: 3, priceEur: 435.0 },
          { id: 'HU-03', name: 'Palette 3 (NVE 340123456789012343)', detail: '3 Stk. FL-9021 • Gewicht 800 kg', qty: 3, priceEur: 435.0 },
          { id: 'HU-04', name: 'Palette 4 (NVE 340123456789012344)', detail: '3 Stk. FL-9021 • Gewicht 800 kg', qty: 3, priceEur: 435.0 },
        ],
        totalAmountEur: 1740.0,
        urgency: 'Eintreffend (14:00 Uhr Tor 4 reserviert)',
        specialNote: 'Alle 4 NVE-Barcodes validiert • Hochregallager-Strategie ermittelt',
      },
    },
    poor: {
      id: '1b6-poor',
      templateId: 'scope-1b6',
      quality: 'poor',
      qualityLabel: 'Schlecht / Unangekündigt (Fehlende NVE & falsches Tor)',
      filename: 'Lieferschein_Handzettel_Spedition.jpg',
      documentType: 'Gescannter Handlieferschein ohne EDI',
      sender: 'rampe-ost@werk-augsburg.de',
      subject: 'Unangemeldeter Lkw steht an Tor 1',
      receivedAt: '2026-10-02T12:30:00+02:00',
      summary: 'Lkw steht ohne Avisierung an Tor 1. Keine Barcodes auf Paletten, Lieferschein nur auf Papier.',
      sapReferenceDoc: 'SAP EWM Anlieferung (/SCWM/PRDO 80001923)',
      rawText: `Handschein: Lieferung von Fa. Spedition Schnell. 4 Paletten Metallwaren.
Kein Barcode auf den Kisten. Keine Vorankündigung im System. Steht an Tor 1 und blockiert die Ausfahrt.`,
      structuredData: {
        customerOrPlant: 'Lager Tor 1',
        targetReference: 'KEIN-AVIS',
        itemsOrEquipment: [
          { id: 'PAL-UNKLAR', name: '4 ungelabelte Paletten', detail: 'Kein Barcode / Kein SSCC', qty: 4, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Rampenstau / Manuelle Klärung',
        specialNote: 'Kein ASN Beleg • Paletten müssen manuell erfasst und etikettiert werden',
      },
    },
  },
  // 10. Customer Service & Warranty Returns (1E6)
  'scope-1e6': {
    good: {
      id: '1e6-good',
      templateId: 'scope-1e6',
      quality: 'good',
      qualityLabel: 'Best Practice (Garantiefall mit Seriennummer & Beleg)',
      filename: 'Reklamation_Garantie_SN882910K.eml',
      documentType: 'Kundenreklamation mit Kaufbeleg & Seriennummer',
      sender: 'service@bayern-maschinenpark.de',
      subject: 'Gewährleistungsantrag: Ausfall Steuerungseinheit CU-400 (SN: SN-882910-K)',
      receivedAt: '2026-10-02T13:15:00+02:00',
      summary: 'Garantieantrag für Steuergerät, Seriennummer SN-882910-K, Kaufdatum vor 9 Monaten. Garantielaufzeit aktiv.',
      sapReferenceDoc: 'SAP Serviceticket (SR-2026-9901)',
      rawText: `Von: Bayern Maschinenpark GmbH <service@bayern-maschinenpark.de>
An: customer-service@sap-enterprise-showcase.com
Datum: 02.10.2026 13:15
Betreff: Gewährleistungsantrag: Ausfall Steuerungseinheit CU-400 (SN: SN-882910-K)

Sehr geehrte Damen und Herren,

wir müssen leider einen Gewährleistungsfall zu folgendem Gerät geltend machen:
Gerätetyp: Elektronische Antriebssteuerung CU-400
Seriennummer: SN-882910-K
Rechnungsnummer Ihres Hauses: RE-2026-1102 vom 15.01.2026 (Garantiestatus: 24 Monate ab Kauf)
Fehlerbeschreibung: Display bleibt dunkel, interner DC-DC Wandler liefert keine Betriebsspannung. Sicherungen extern intakt. Kein Feuchtigkeitsschaden.

Wir bitten um Bereitstellung eines RMA-Rücksendescheins und Zusendung eines Vorabaustausch-Geräts.

Mit freundlichen Grüßen,
Markus Leitner | Leiter Instandhaltung | Bayern Maschinenpark GmbH`,
      structuredData: {
        customerOrPlant: 'Bayern Maschinenpark GmbH (KUNNR 0000100880)',
        targetReference: 'SN-882910-K (Rechnung RE-2026-1102)',
        itemsOrEquipment: [
          { id: 'CU-400', name: 'Antriebssteuerung CU-400', detail: 'SN: SN-882910-K • Display dunkel', qty: 1, priceEur: 1250.0 },
        ],
        totalAmountEur: 1250.0,
        urgency: 'Garantie aktiv (Gültig bis 15.01.2028)',
        specialNote: 'Garantieprüfung positiv • RMA-Label und Vorabaustausch autorisiert',
      },
    },
    poor: {
      id: '1e6-poor',
      templateId: 'scope-1e6',
      quality: 'poor',
      qualityLabel: 'Schlecht / Unvollständig (Keine Seriennummer & Eigenverschulden)',
      filename: 'Beschwerde_Geraet_kaputt.eml',
      documentType: 'Emotionaler Kundenfreitext ohne Belegnachweis',
      sender: 'werner.bastler@gmx.net',
      subject: 'Das Ding ist explodiert will sofort Geld zurück',
      receivedAt: '2026-10-02T13:45:00+02:00',
      summary: 'Kunde verlangt Geld zurück. Gerät wurde selbst geöffnet und verpolt. Keine Rechnung oder Gerätenummer.',
      sapReferenceDoc: 'SAP Serviceticket (SR-2026-9901)',
      rawText: `Hallo,
habe gestern das Gerät angeschlossen, da hat es geknallt und geraucht. Habe das Gehäuse aufgeschraubt und gesehen dass da was verschmort ist. Ich will mein Geld sofort zurück sonst schalte ich meinen Anwalt ein. Rechnung habe ich nicht mehr.`,
      structuredData: {
        customerOrPlant: 'Unbekannter Privatkunde',
        targetReference: 'KEIN-BELEG',
        itemsOrEquipment: [
          { id: 'DEV-UNKNOWN', name: 'Unbekanntes Gerät', detail: 'Verschmort nach Eigenöffnung', qty: 1, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Garantieausschluss vermutet',
        specialNote: 'Kaufbeleg fehlt • Gehäuse eigenmächtig geöffnet • Klärungsfall',
      },
    },
  },
};

export const SAMPLE_MESSAGES_EN: Record<string, Record<MessageQuality, ProcessSampleMessage>> = {
  // 1. Sell from Stock (BD9)
  'scope-bd9': {
    good: {
      id: 'bd9-good',
      templateId: 'scope-bd9',
      quality: 'good',
      qualityLabel: 'Best Practice (Complete & Clean)',
      filename: 'Customer_Order_PO4711.eml',
      documentType: 'RFC822 Email with PDF Attachment',
      sender: 'purchasing@mueller-engineering-ltd.com',
      subject: 'Urgent Order: Flanges & Gasket Sets as per Quote QU-2026-88',
      receivedAt: '2026-10-01T08:15:22+02:00',
      summary: 'Complete customer order with part numbers, pricing, requested date, and Gate 3 unloading instructions.',
      sapReferenceDoc: 'SAP Sales Order (TA / VBAK)',
      rawText: `From: Purchasing Department <purchasing@mueller-engineering-ltd.com>
To: orders@sap-enterprise-showcase.com
Date: Oct 01, 2026 08:15
Subject: Urgent Order: Flanges & Gasket Sets as per Quote QU-2026-88

Dear Sir or Madam,

We hereby place our binding purchase order based on your quotation QU-2026-88 for our plant in Augsburg:

Item 1:
- 12 pcs Precision Steel Flange DIN 2633 (Your Part: FL-9021 / Our Ref: MMB-9021)
- Price: 145.00 EUR / unit
- Requested Delivery Date: Oct 15, 2026

Item 2:
- 24 pcs High-Pressure EPDM Gasket Set (Your Part: DI-4410)
- Price: 22.50 EUR / unit
- Requested Delivery Date: Oct 15, 2026

Important Notice:
Delivery strictly to Gate 3 (Heavy Machinery Receiving).
Please dispatch invoice electronically in ZUGFeRD/UBL format to invoice@mueller-engineering-ltd.com.
Internal PO Reference: PO-4711-AUG

Kind regards,
Klaus Weber
Head of Procurement | Mueller Engineering Ltd.`,
      structuredData: {
        customerOrPlant: 'Mueller Engineering Ltd. (Customer 0000100420)',
        targetReference: 'PO-4711-AUG (Quote QU-2026-88)',
        itemsOrEquipment: [
          { id: 'FL-9021', name: 'Precision Steel Flange DIN 2633', detail: 'Pos 10 • Plant Stock: 85 pcs available', qty: 12, priceEur: 145.0 },
          { id: 'DI-4410', name: 'High-Pressure EPDM Gasket Set', detail: 'Pos 20 • Plant Stock: 320 pcs available', qty: 24, priceEur: 22.5 },
        ],
        totalAmountEur: 2280.0,
        urgency: 'Standard / Express (Oct 15, 2026)',
        specialNote: 'Gate 3 (Heavy Machinery Inbound Dock)',
      },
    },
    poor: {
      id: 'bd9-poor',
      templateId: 'scope-bd9',
      quality: 'poor',
      qualityLabel: 'Poor / Noisy (Incomplete & Vague)',
      filename: 'Urgent_Order_Vague_Freetext.eml',
      documentType: 'Unstructured Freetext Email without PO structure',
      sender: 'klaus.construction88@web.de',
      subject: 'Need more flanges ASAP for the construction site',
      receivedAt: '2026-10-01T08:42:10+02:00',
      summary: 'Chaotic freetext email without part numbers, personal sender email, ambiguous quantities.',
      sapReferenceDoc: 'SAP Sales Order (TA / VBAK)',
      rawText: `From: Klaus Construction <klaus.construction88@web.de>
To: orders@sap-enterprise-showcase.com
Date: Oct 01, 2026 08:42
Subject: Need more flanges ASAP for the construction site

Hey guys,

Please send over 10 of those round flanges like last time and throw in a few gaskets as well.
Must arrive tomorrow morning by 7 AM sharp, otherwise the site work stops!
Keep prices as agreed and bill the company as usual.

Cheers, Klaus`,
      structuredData: {
        customerOrPlant: 'Ambiguous (Sender web.de, likely Mueller Engineering)',
        targetReference: 'No PO Number provided',
        itemsOrEquipment: [
          { id: 'UNKNOWN-1', name: 'Round Flanges ("like last time")', detail: 'Missing SKU • Quantity: 10 units' },
          { id: 'UNKNOWN-2', name: 'Gaskets ("a few extra")', detail: 'SKU & Quantity indeterminate' },
        ],
        totalAmountEur: 0.0,
        urgency: 'Tomorrow morning 07:00 AM (Unfulfillable without ATP)',
        specialNote: 'Construction stoppage risk • Unloading dock unspecified',
      },
    },
  },

  // 2. Service Order Management (2F1)
  'scope-2f1': {
    good: {
      id: '2f1-good',
      templateId: 'scope-2f1',
      quality: 'good',
      qualityLabel: 'Best Practice (Prio 1 Emergency with Equipment ID)',
      filename: 'Incident_Report_KSB_Pump_P204.eml',
      documentType: 'Service Ticket & Breakdown Notice',
      sender: 'maintenance@chemiepark-bavaria.com',
      subject: 'EMERGENCY Prio 1: Bearing Failure High Pressure Pump P-204 (Equip: 10084721)',
      receivedAt: '2026-10-01T09:12:05+02:00',
      summary: 'Precise emergency report with Equipment ID, Fault Code E-4402, SLA Gold contract, and on-site contact.',
      sapReferenceDoc: 'SAP Service Order (SO01 / AUFK)',
      rawText: `From: Plant Maintenance <maintenance@chemiepark-bavaria.com>
To: service-hotline@sap-enterprise-showcase.com
Date: Oct 01, 2026 09:12
Subject: EMERGENCY Prio 1: Bearing Failure High Pressure Pump P-204 (Equip: 10084721)

Dear Service Team,

Our main polymerization line 2 high-pressure pump has just suffered a catastrophic failure:

- Equipment ID: 10084721 (KSB Multitec A50)
- Serial Number: SN-9941-K
- Location: Burghausen Chemical Park, Building 4B (Pump Station South)
- Symptom: Sudden pressure loss to 0 Bar, vibration sensor alarm triggered (Fault Code: E-4402 Bearing Seizure)
- Urgency: PRODUCTION DOWN (Line Down - Priority 1 Emergency)
- Service Contract: SLA Gold Contract No. SV-88102 (Guaranteed response < 2 hrs, 100% parts covered)
- Required Spares: Ceramic Bearing Kit LK-22 & Gasket Set KSB-50
- On-site Contact: Markus Huber, Shift Supervisor, Mobile: +49 8677 992-411

Please dispatch a certified field engineer immediately!

Kind regards,
Markus Huber | Chemiepark Bavaria Plant Maintenance`,
      structuredData: {
        customerOrPlant: 'Chemiepark Bavaria Plant Burghausen (Customer 0000200810)',
        targetReference: 'Equip 10084721 • Contract SV-88102 (SLA Gold)',
        itemsOrEquipment: [
          { id: '10084721', name: 'KSB Multitec A50 High Pressure Pump', detail: 'Serial: SN-9941-K • Fault Code: E-4402' },
          { id: 'LK-22', name: 'Spare: Ceramic Bearing Kit LK-22', detail: 'Reserved from Regional Central Warehouse' },
        ],
        totalAmountEur: 1450.0,
        urgency: 'Prio 1 EMERGENCY (< 2h response per SLA Gold)',
        specialNote: 'Building 4B • On-site contact Markus Huber',
      },
    },
    poor: {
      id: '2f1-poor',
      templateId: 'scope-2f1',
      quality: 'poor',
      qualityLabel: 'Poor / Noisy (Missing Machine ID & Vague)',
      filename: 'Machine_Broken_No_ID.eml',
      documentType: 'Unstructured Complaint Ticket',
      sender: 'shiftleader-north@chemiepark-bavaria.com',
      subject: 'Pump makes loud noise and died',
      receivedAt: '2026-10-01T09:35:18+02:00',
      summary: 'Vague breakdown report without Equipment ID, without fault code, and without serial number.',
      sapReferenceDoc: 'SAP Service Order (SO01 / AUFK)',
      rawText: `From: Shift Leader North <shiftleader-north@chemiepark-bavaria.com>
To: service-hotline@sap-enterprise-showcase.com
Date: Oct 01, 2026 09:35
Subject: Pump makes loud noise and died

Hi Service,

Nothing is working here anymore. The big blue pump in the far corner smells burnt and just stopped working.
Don't know the exact number, please check your old invoices.
We need someone here today to fix it, otherwise plant management will escalate.

Thanks, Shift North`,
      structuredData: {
        customerOrPlant: 'Chemiepark Bavaria (Location/Customer indeterminate)',
        targetReference: 'No Equipment ID • No Serial Number',
        itemsOrEquipment: [
          { id: 'UNKNOWN-EQUIP', name: 'Big blue pump ("in far corner")', detail: 'Identification failed (Ambiguous match)' },
        ],
        totalAmountEur: 0.0,
        urgency: 'Indeterminate ("today")',
        specialNote: 'Burnt odor reported • Clarification required',
      },
    },
  },

  // 3. Accounts Receivable & Clearing (J60)
  'scope-j60': {
    good: {
      id: 'j60-good',
      templateId: 'scope-j60',
      quality: 'good',
      qualityLabel: 'Best Practice (Clean Remittance Advice with Cash Discount)',
      filename: 'Payment_Advice_Siemens_Healthineers.pdf',
      documentType: 'Electronic Remittance Advice (PDF)',
      sender: 'accounting@siemens-healthineers.com',
      subject: 'Remittance Advice for Wire Transfer 14,280.00 EUR valuta 02.10.2026',
      receivedAt: '2026-10-01T10:05:40+02:00',
      summary: 'Mathematically exact remittance advice with invoice references, 2% early payment discount, and IBAN.',
      sapReferenceDoc: 'SAP FI-AR Payment Clearing (FB05 / BSEG)',
      rawText: `Sender: Siemens Healthineers AG | Corporate Accounting
To: receivables@sap-enterprise-showcase.com
Date: Oct 01, 2026 10:05
Subject: Remittance Advice for Wire Transfer 14,280.00 EUR valuta 02.10.2026

Dear Accounts Receivable Team,

We have initiated a collective wire payment of EUR 14,280.00 today:

Clearing Line Items:
1. Invoice Number: INV-2026-9011
   - Gross Amount: EUR 8,000.00
   - Cash Discount (2% within 14 days): -EUR 160.00
   - Paid Amount: EUR 7,840.00

2. Invoice Number: INV-2026-9012
   - Gross Amount: EUR 6,571.43
   - Cash Discount (2% within 14 days): -EUR 131.43
   - Paid Amount: EUR 6,440.00

Total Wire Amount: EUR 14,280.00
Valuta Date: Oct 02, 2026
Bank Account: DE89 7001 0080 0982 1120 00

Kind regards,
Corporate Treasury | Siemens Healthineers AG`,
      structuredData: {
        customerOrPlant: 'Siemens Healthineers AG (Customer 0000300192)',
        targetReference: 'Invoices INV-2026-9011 & INV-2026-9012',
        itemsOrEquipment: [
          { id: 'INV-2026-9011', name: 'Q3 Maintenance Contract', detail: '8,000.00 € • Discount 2%: -160.00 € = 7,840.00 €' },
          { id: 'INV-2026-9012', name: 'Sensor Hardware Delivery', detail: '6,571.43 € • Discount 2%: -131.43 € = 6,440.00 €' },
        ],
        totalAmountEur: 14280.0,
        urgency: 'Valuta Oct 02, 2026 (Compliant with 2% discount terms)',
        specialNote: 'Automatic FI clearing against open items (BSID)',
      },
    },
    poor: {
      id: 'j60-poor',
      templateId: 'scope-j60',
      quality: 'poor',
      qualityLabel: 'Poor / Noisy (Deductions without Invoice Reference)',
      filename: 'Wire_Transfer_Unreadable_Advice.pdf',
      documentType: 'Scanned Fax / Unstructured Payment Proof',
      sender: 'finance@schmidt-fabrication.com',
      subject: 'Payment of EUR 5,400 initiated',
      receivedAt: '2026-10-01T10:22:15+02:00',
      summary: 'Wire transfer with lump sum deduction without invoice numbers and without discount baseline.',
      sapReferenceDoc: 'SAP FI-AR Payment Clearing (FB05 / BSEG)',
      rawText: `From: Accounting Schmidt Fabrication <finance@schmidt-fabrication.com>
Date: Oct 01, 2026 10:22
Subject: Payment of EUR 5,400 initiated

Hi Accounting,

We wired EUR 5,400 today for old summer invoices.
We withheld EUR 600 as a lump-sum deduction due to damaged goods last week.
Please clear this on our account.

Schmidt Fabrication`,
      structuredData: {
        customerOrPlant: 'Schmidt Fabrication (Customer ID unknown)',
        targetReference: 'No invoice reference cited',
        itemsOrEquipment: [
          { id: 'DIFF-600', name: 'Lump-sum dispute deduction', detail: '600.00 € deduction without credit memo' },
        ],
        totalAmountEur: 5400.0,
        urgency: 'Payment posted • Disputed residual in clarification',
        specialNote: 'Account cannot be cleared (EUR 600 difference) • FI dispute case',
      },
    },
  },
  // 4. Supplier Invoice Verification & 3-Way Match (2B6)
  'scope-2b6': {
    good: {
      id: '2b6-good',
      templateId: 'scope-2b6',
      quality: 'good',
      qualityLabel: 'Best Practice (ZUGFeRD PDF & PO Reference)',
      filename: 'Invoice_INV-2026-8812.pdf',
      documentType: 'ZUGFeRD 2.2 / Inbound PDF Invoice',
      sender: 'invoicing@bosch-rexroth-partner.com',
      subject: 'Invoice INV-2026-8812 for Purchase Order PO-88201',
      receivedAt: '2026-10-01T09:12:00+02:00',
      summary: 'Vendor invoice with PO reference PO-88201, delivery note LS-7710, 19% VAT, and 3% cash discount.',
      sapReferenceDoc: 'SAP MM-IV Invoice Verification (MIRO)',
      rawText: `From: Bosch Rexroth Partner Sales <invoicing@bosch-rexroth-partner.com>
To: inbound-invoices@sap-enterprise-showcase.com
Date: Oct 01, 2026 09:12
Subject: Invoice INV-2026-8812 for Purchase Order PO-88201

Dear Sir or Madam,

Please find attached our invoice INV-2026-8812 regarding your purchase order PO-88201:

Vendor: Bosch Rexroth Partner GmbH (Vendor ID 0000400120)
Your PO Number: PO-88201
Our Delivery Note: LS-7710 (Goods Receipt Sep 29, 2026)

Invoice Line Items:
Item 10: 10 pcs Proportional Directional Valve 4WRAE (Part R900952011)
Unit Price: EUR 380.00 | Total: EUR 3,800.00 net

Net Total: EUR 3,800.00
VAT (19%): EUR 722.00
Gross Total: EUR 4,522.00

Payment Terms: 3% cash discount within 14 days (EUR 135.66), 30 days net.
Bank Account: DE44 6005 0101 0001 2345 67

Best regards,
Accounts Payable Bosch Rexroth Partner`,
      structuredData: {
        customerOrPlant: 'Bosch Rexroth Partner GmbH (Vendor 0000400120)',
        targetReference: 'PO-88201 / INV-2026-8812',
        itemsOrEquipment: [
          { id: 'R900952011', name: 'Proportional Valve 4WRAE', detail: 'Item 10 • 10 pcs @ EUR 380.00', qty: 10, priceEur: 380.0 },
        ],
        totalAmountEur: 4522.0,
        urgency: 'Discount period 14 days until Oct 15, 2026 (3% = EUR 135.66)',
        specialNote: '3-way match against PO-88201 and goods receipt WE-500129',
      },
    },
    poor: {
      id: '2b6-poor',
      templateId: 'scope-2b6',
      quality: 'poor',
      qualityLabel: 'Poor / Noisy (Price Variance & Ancillary Surcharges)',
      filename: 'Scanned_Invoice_Rexroth_Skewed.pdf',
      documentType: 'Scanned Paper Invoice (Fuzzy OCR)',
      sender: 'scan-service@external-logistics.com',
      subject: 'Inbound Document Vendor INV-8812 (Fuzzy Scan)',
      receivedAt: '2026-10-01T09:44:18+02:00',
      summary: 'Scanned invoice with minor price variance (+EUR 4.50 packaging fee) and partially masked IBAN.',
      sapReferenceDoc: 'SAP MM-IV Invoice Verification (MIRO)',
      rawText: `From: Scan Service <scan-service@external-logistics.com>
Date: Oct 01, 2026 09:44
Subject: Inbound Document Vendor INV-8812 (Fuzzy Scan)

[OCR Scan Output - Rotated 2 degrees, 150 DPI]
Vendor: Rexroth Partner Sales
Document ID: INV-8812
Purchase Order: PO-88201 (?)

10x Directional Valve 4WRAE: EUR 3,800.00
Packaging Surcharge: EUR 4.50 (Not included in purchase order)
Net Total: EUR 3,804.50
Gross Total incl. Tax: EUR 4,527.36
IBAN: DE44 6005 **** **** **** 67`,
      structuredData: {
        customerOrPlant: 'Rexroth Partner Sales (Vendor 0000400120)',
        targetReference: 'PO-88201 / INV-8812',
        itemsOrEquipment: [
          { id: 'R900952011', name: 'Directional Valve 4WRAE', detail: 'Item 10 • 10 pcs @ EUR 380.00', qty: 10, priceEur: 380.0 },
          { id: 'SURCHARGE-01', name: 'Packaging Surcharge', detail: 'EUR 4.50 minor deviation', qty: 1, priceEur: 4.5 },
        ],
        totalAmountEur: 4527.36,
        urgency: 'Tolerance evaluation needed (EUR 4.50 variance <= EUR 5.00 threshold)',
        specialNote: 'Price variance EUR 4.50 within tolerance • IBAN resolved from vendor master data',
      },
    },
  },
  // 5. Sourcing & Procurement (J45)
  'scope-j45': {
    good: {
      id: 'j45-good',
      templateId: 'scope-j45',
      quality: 'good',
      qualityLabel: 'Best Practice (Complete & Budget Approved)',
      filename: 'Purchase_Requisition_PR10004521.json',
      documentType: 'Internal Purchase Requisition (SAP MM-PUR)',
      sender: 'plant.operations@augsburg-facility.com',
      subject: 'Requisition: 500x Ball Bearings 6205-2RS & 10x Grease for Line 2',
      receivedAt: '2026-10-02T07:30:00+02:00',
      summary: 'Complete purchase requisition with cost center 4210, G/L accounting, and outline agreement with SKF.',
      sapReferenceDoc: 'SAP Purchase Requisition (EBAN 10004521)',
      rawText: `From: Dr. Stefan Huber <plant.operations@augsburg-facility.com>
To: central-procurement@sap-enterprise-showcase.com
Date: Oct 2, 2026 07:30
Subject: Requisition: 500x Ball Bearings 6205-2RS & 10x Grease for Line 2

Dear Procurement Team,

We require the following items for continuous assembly line 2:
- Item 1: 500 pcs Deep Groove Ball Bearing DIN 625 (SKF 6205-2RS / SAP Material: KL-6205-RS)
  Cost Center: 4210 (Assembly Line Transmission) | G/L Account: 400000 | Required Date: Oct 24, 2026
- Item 2: 10 cartridges High-Temp Grease LGHP 2/0.4 (SAP Material: FT-9920)
  Cost Center: 4210 | G/L Account: 400000 | Required Date: Oct 24, 2026

Active outline agreement RV-SKF-2024 is registered. Q4 budget has been signed off.

Best regards,
Stefan Huber | Head of Operations Augsburg Plant`,
      structuredData: {
        customerOrPlant: 'Augsburg Facility (Plant 1000) / Cost Center 4210',
        targetReference: 'PR-2026-4521 (Contract RV-SKF-2024)',
        itemsOrEquipment: [
          { id: 'KL-6205-RS', name: 'Ball Bearing DIN 625 6205-2RS', detail: '500 pcs • Contract price EUR 8.50', qty: 500, priceEur: 8.5 },
          { id: 'FT-9920', name: 'High-Temp Grease SKF LGHP 2', detail: '10 pcs • Contract price EUR 24.00', qty: 10, priceEur: 24.0 },
        ],
        totalAmountEur: 4490.0,
        urgency: 'Standard Procurement (Required by Oct 24, 2026)',
        specialNote: 'Contract RV-SKF-2024 active • Budget verification passed',
      },
    },
    poor: {
      id: 'j45-poor',
      templateId: 'scope-j45',
      quality: 'poor',
      qualityLabel: 'Poor / Incomplete (Missing Cost Center & Quantity)',
      filename: 'Stock_Note_Bearings.txt',
      documentType: 'Unstructured Request Note',
      sender: 'shift3.assembly@augsburg-facility.com',
      subject: 'Bearings running low please order more',
      receivedAt: '2026-10-02T08:05:12+02:00',
      summary: 'Urgent demand without precise quantities, missing cost center and vague specification.',
      sapReferenceDoc: 'SAP Purchase Requisition (EBAN 10004521)',
      rawText: `From: Shift 3 Assembly <shift3.assembly@augsburg-facility.com>
To: procurement@sap-enterprise-showcase.com
Subject: Bearings running low please order more

We are running out of bearings for the big gearbox. Please order a few boxes. Not sure who needs to approve this.`,
      structuredData: {
        customerOrPlant: 'Augsburg Facility (Plant 1000)',
        targetReference: 'UNKNOWN',
        itemsOrEquipment: [
          { id: 'KL-UNKNOWN', name: 'Bearings (Unspecified type)', detail: 'Vague quantity: a few boxes', qty: 1, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Critical / Incomplete',
        specialNote: 'Missing cost center • Missing G/L account • Unspecified part number',
      },
    },
  },
  // 6. Make-to-Stock Production (1GA)
  'scope-1ga': {
    good: {
      id: '1ga-good',
      templateId: 'scope-1ga',
      quality: 'good',
      qualityLabel: 'Best Practice (Production Plan & BOM Verified)',
      filename: 'Production_Order_10009823.json',
      documentType: 'SAP PP Production Order Dispatch',
      sender: 'production.planning@augsburg-facility.com',
      subject: 'Release Order: 50x Industrial Planetary Gearboxes PG-200',
      receivedAt: '2026-10-02T09:00:00+02:00',
      summary: 'Production order for 50 assemblies with complete bill of materials, work center WS-40, and green ATP status.',
      sapReferenceDoc: 'SAP Production Order (AFKO / AFPO 10009823)',
      rawText: `System Notification: SAP S/4HANA MRP Live
Planned Order 0010048821 converted to Production Order 10009823.
Material: PG-200-ST (Industrial Planetary Gearbox i=10)
Quantity: 50 units | Plant: 1000 | Production Controller: 002 (Gearbox Manufacturing)
Basic Start Date: Oct 12, 2026 | Basic Finish Date: Oct 23, 2026
BOM: Variant 01 exploded (7 components)
Routing: Group AP-GETR-01 (Operations 10, 20, 30, 40)
ATP Check: All 7 components fully available in stock (Green).`,
      structuredData: {
        customerOrPlant: 'Plant 1000 (Hall 3 - Gearbox Assembly)',
        targetReference: 'PO-10009823 (Planned Order 0010048821)',
        itemsOrEquipment: [
          { id: 'PG-200-ST', name: 'Planetary Gearbox PG-200', detail: '50 units • Planned time 120 hrs', qty: 50, priceEur: 680.0 },
        ],
        totalAmountEur: 34000.0,
        urgency: 'On Schedule (Finish by Oct 23, 2026)',
        specialNote: 'All components available • Work center WS-40 capacity reserved',
      },
    },
    poor: {
      id: '1ga-poor',
      templateId: 'scope-1ga',
      quality: 'poor',
      qualityLabel: 'Poor / Missing Parts Alert (Material Shortage)',
      filename: 'Production_Bottleneck_Alert.txt',
      documentType: 'SAP PP Shortage Alert',
      sender: 'mrp-daemon@sap-enterprise-showcase.com',
      subject: 'Missing components for Production Order 10009823 - Housing missing',
      receivedAt: '2026-10-02T09:15:00+02:00',
      summary: 'ATP check failed: 50x aluminum gearbox housings out of stock.',
      sapReferenceDoc: 'SAP Production Order (AFKO / AFPO 10009823)',
      rawText: `Warning: Dynamic ATP check for production order 10009823 failed.
Component GH-200-ALU (Aluminum Gearbox Housing) shortage: 50 units.
Replenishment lead time: 14 business days. Planned start Oct 12, 2026 cannot be maintained.`,
      structuredData: {
        customerOrPlant: 'Plant 1000',
        targetReference: 'PO-10009823',
        itemsOrEquipment: [
          { id: 'GH-200-ALU', name: 'Aluminum Gearbox Housing', detail: 'Shortage: 50 units', qty: 50, priceEur: 110.0 },
        ],
        totalAmountEur: 5500.0,
        urgency: 'Order Blocked (Material Shortage)',
        specialNote: 'ATP Red • Missing component GH-200-ALU • Schedule postponement required',
      },
    },
  },
  // 7. Quality Management (1MB)
  'scope-1mb': {
    good: {
      id: '1mb-good',
      templateId: 'scope-1mb',
      quality: 'good',
      qualityLabel: 'Best Practice (EN 10204 3.1 Test Certificate Compliant)',
      filename: 'Inspection_Certificate_EN10204_3.1_Lot_C8891.pdf',
      documentType: 'Inspection Certificate DIN EN 10204 3.1',
      sender: 'qm-certificates@steelworks-bavaria.com',
      subject: 'Test Certificate EN 10204 3.1 for Batch C8891 (12x Precision Flanges)',
      receivedAt: '2026-10-02T10:12:00+02:00',
      summary: 'Inspection certificate detailing yield strength, tensile strength, and Brinell hardness. All values within spec.',
      sapReferenceDoc: 'SAP Inspection Lot (QALS 01000038291)',
      rawText: `Inspection Certificate DIN EN 10204 3.1
Manufacturer: Steelworks Bavaria GmbH | Certificate No: WZ-2026-9912
Customer: SAP Enterprise Showcase | Purchase Order: 4500028911 | Delivery Note: DN-44109
Material: 1.4404 / 316L Precision Flange DIN 2633 | Heat/Batch: C8891

Chemical Analysis (%):
C: 0.022 (Max 0.030) | Cr: 17.20 (Range 16.5-18.5) | Ni: 12.10 (Range 10.0-13.0) | Mo: 2.15 (Range 2.0-2.5)

Mechanical Properties:
- Yield Strength Rp0.2: 285 MPa (Min 240 MPa) -> Within spec
- Tensile Strength Rm: 580 MPa (Range 500 - 700 MPa) -> Within spec
- Elongation A5: 46 % (Min 40 %) -> Within spec
- Brinell Hardness: 175 HB (Max 215 HB) -> Within spec

Disposition: Fully compliant with ISO 9001 and drawing specifications QM-FL-01.`,
      structuredData: {
        customerOrPlant: 'Inbound Gate 3 / QM Lab Plant 1000',
        targetReference: 'Inspection Lot 01000038291 (Batch C8891)',
        itemsOrEquipment: [
          { id: 'CHARG-C8891', name: 'Precision Flange 1.4404 (Batch C8891)', detail: 'Rp0.2: 285 MPa | Rm: 580 MPa | Hardness: 175 HB', qty: 12, priceEur: 145.0 },
        ],
        totalAmountEur: 1740.0,
        urgency: 'Ready for Release (100% compliant tolerances)',
        specialNote: 'All 6 parameters within target bounds • Acceptance recommended',
      },
    },
    poor: {
      id: '1mb-poor',
      templateId: 'scope-1mb',
      quality: 'poor',
      qualityLabel: 'Poor / Spec Violation (Hardness Exceeded)',
      filename: 'Defect_Report_Flange_Batch.pdf',
      documentType: 'Material Test Non-Conformance Report',
      sender: 'lab@sap-enterprise-showcase.com',
      subject: 'Inspection Lot 01000038291: Hardness exceeds maximum threshold',
      receivedAt: '2026-10-02T10:45:00+02:00',
      summary: 'Hardness test reveals 238 HB (Maximum allowable: 215 HB). Risk of brittleness during machining.',
      sapReferenceDoc: 'SAP Inspection Lot (QALS 01000038291)',
      rawText: `QM Test Report: Variance in Goods Receipt Inspection
Inspection Lot: 01000038291 | Material: 1.4404 Flange | Heat/Batch: C8891
Measured Hardness: 238 HB.
Upper Tolerance Limit: 215 HB.
Deviation: +23 HB (Tolerance violation).
Recommendation: Rejection of lot back to supplier or special release by lead design engineer.`,
      structuredData: {
        customerOrPlant: 'QM Lab Plant 1000',
        targetReference: 'Inspection Lot 01000038291',
        itemsOrEquipment: [
          { id: 'CHARG-C8891', name: 'Flange Batch C8891', detail: 'Hardness 238 HB exceeds 215 HB upper limit', qty: 12, priceEur: 145.0 },
        ],
        totalAmountEur: 1740.0,
        urgency: 'Quarantine / Investigation',
        specialNote: 'Tolerance breach on hardness • Supplier quality notification required',
      },
    },
  },
  // 8. Corrective Plant Maintenance (BJ2)
  'scope-bj2': {
    good: {
      id: 'bj2-good',
      templateId: 'scope-bj2',
      quality: 'good',
      qualityLabel: 'Best Practice (Precise Malfunction Report)',
      filename: 'Malfunction_Report_Hydraulic_Press4.json',
      documentType: 'SAP PM Maintenance Notification (IW21 / QMEL)',
      sender: 'shift.supervisor@augsburg-facility.com',
      subject: 'Critical Malfunction: Pressure Loss Main Cylinder Hydraulic Press 4 (Equip 10048201)',
      receivedAt: '2026-10-02T11:00:00+02:00',
      summary: 'Pressure drop to 80 bar on Press 4 in Hall 2. Seal kit leak, imminent downtime risk. Priority 1.',
      sapReferenceDoc: 'SAP Maintenance Notification (QMEL 10005423)',
      rawText: `Maintenance Breakdown Notification
Equipment: 10048201 (Hydraulic Press Schuler 500t - P4)
Functional Location: DE-AUG-H2-PRS4 (Hall 2 / Metal Forming)
Failure Symptoms: Pressure drop in main pilot circuit from 220 bar down to 80 bar. Fluid leak at cylinder flange.
Impact: Press cycle halted. Assembly Line 1 will run dry in 90 minutes.
Urgency: Priority 1 (Very High / Imminent Line Stoppage).
Required Repair: Replace seal kit HD-PRS4 and refill hydraulic fluid HLP-46.`,
      structuredData: {
        customerOrPlant: 'Hall 2 (Metal Forming) / Func. Loc DE-AUG-H2-PRS4',
        targetReference: 'Equipment 10048201 (Notification 10005423)',
        itemsOrEquipment: [
          { id: '10048201', name: 'Hydraulic Press Schuler 500t', detail: 'Cylinder flange leak • 80 bar pressure drop', qty: 1, priceEur: 850.0 },
        ],
        totalAmountEur: 1250.0,
        urgency: 'Priority 1 - Critical Downtime',
        specialNote: 'Reserve seal kit HD-PRS4 from stock • Dispatch emergency crew',
      },
    },
    poor: {
      id: 'bj2-poor',
      templateId: 'scope-bj2',
      quality: 'poor',
      qualityLabel: 'Poor / Vague (Unknown Equipment & Unclear Symptoms)',
      filename: 'Operator_Note_Oil_Leak.txt',
      documentType: 'Informal Note without Tag',
      sender: 'operator.unknown@augsburg-facility.com',
      subject: 'Something is leaking in Hall 2',
      receivedAt: '2026-10-02T11:22:00+02:00',
      summary: 'Vague report: Oil leaking near the presses in Hall 2. Unclear which machine is affected.',
      sapReferenceDoc: 'SAP Maintenance Notification (QMEL 10005423)',
      rawText: `There is oil leaking on the floor near the big presses in the back left. Makes loud grinding noise when pressing. Please have someone take a look.`,
      structuredData: {
        customerOrPlant: 'Hall 2',
        targetReference: 'UNKNOWN',
        itemsOrEquipment: [
          { id: 'EQUIP-UNKNOWN', name: 'Unknown Machine Hall 2', detail: 'Oil leak from undetermined source', qty: 1, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Unknown',
        specialNote: 'Equipment unverified • Physical floor inspection mandatory',
      },
    },
  },
  // 9. Warehouse Inbound & Putaway with EWM (1B6)
  'scope-1b6': {
    good: {
      id: '1b6-good',
      templateId: 'scope-1b6',
      quality: 'good',
      qualityLabel: 'Best Practice (ASN EDI 856 with SSCC Barcodes)',
      filename: 'Inbound_Delivery_DESADV_80001923.xml',
      documentType: 'Advance Shipping Notice (EDIFACT DESADV)',
      sender: 'dispatch@dachser-logistics.com',
      subject: 'ASN Delivery: 4 Euro Pallets Steel Flanges for PO 4500028911',
      receivedAt: '2026-10-02T12:00:00+02:00',
      summary: 'Shipping notice with ETA 14:00, truck license A-DL-8821, 4 Handling Units with SSCC tracking codes.',
      sapReferenceDoc: 'SAP EWM Inbound Delivery (/SCWM/PRDO 80001923)',
      rawText: `EDIFACT DESADV / SAP Inbound ASN
Carrier: Dachser SE | Truck Plate: A-DL-8821 | Driver: M. Horvath
Planned ETA: Oct 2, 2026 14:00 | Plant: 1000 | Warehouse: EWM-01
PO Reference: 4500028911 | Bill of Lading: BOL-992014

Handling Units (Packages):
- HU 1 (SSCC 340123456789012341): Euro Pallet 800 kg, 3x Flange FL-9021
- HU 2 (SSCC 340123456789012342): Euro Pallet 800 kg, 3x Flange FL-9021
- HU 3 (SSCC 340123456789012343): Euro Pallet 800 kg, 3x Flange FL-9021
- HU 4 (SSCC 340123456789012344): Euro Pallet 800 kg, 3x Flange FL-9021
Total Weight: 3,200 kg | Freight Bays: 4 pallet positions`,
      structuredData: {
        customerOrPlant: 'Logistics Hub South / EWM Warehouse 0001',
        targetReference: 'ASN-80001923 (Truck A-DL-8821)',
        itemsOrEquipment: [
          { id: 'HU-01', name: 'Pallet 1 (SSCC 340123456789012341)', detail: '3 pcs FL-9021 • Weight 800 kg', qty: 3, priceEur: 435.0 },
          { id: 'HU-02', name: 'Pallet 2 (SSCC 340123456789012342)', detail: '3 pcs FL-9021 • Weight 800 kg', qty: 3, priceEur: 435.0 },
          { id: 'HU-03', name: 'Pallet 3 (SSCC 340123456789012343)', detail: '3 pcs FL-9021 • Weight 800 kg', qty: 3, priceEur: 435.0 },
          { id: 'HU-04', name: 'Pallet 4 (SSCC 340123456789012344)', detail: '3 pcs FL-9021 • Weight 800 kg', qty: 3, priceEur: 435.0 },
        ],
        totalAmountEur: 1740.0,
        urgency: 'Arriving (Gate 4 reserved for 14:00)',
        specialNote: 'All 4 SSCC barcodes verified • High-bay putaway strategy pre-computed',
      },
    },
    poor: {
      id: '1b6-poor',
      templateId: 'scope-1b6',
      quality: 'poor',
      qualityLabel: 'Poor / Unannounced (Missing SSCC Barcodes & Wrong Gate)',
      filename: 'Paper_Delivery_Slip_Freight.jpg',
      documentType: 'Scanned Paper Delivery Slip without EDI',
      sender: 'dock.east@augsburg-facility.com',
      subject: 'Unannounced truck arrived at Gate 1',
      receivedAt: '2026-10-02T12:30:00+02:00',
      summary: 'Truck arrived without advance notice at Gate 1. No barcodes on crates, handwritten paper bill.',
      sapReferenceDoc: 'SAP EWM Inbound Delivery (/SCWM/PRDO 80001923)',
      rawText: `Paper note: Express freight delivery from Express Logistics. 4 crates metallic components.
No barcodes on boxes. No pre-announcement in system. Standing at Gate 1 and blocking exit ramp.`,
      structuredData: {
        customerOrPlant: 'Warehouse Gate 1',
        targetReference: 'NO-ASN',
        itemsOrEquipment: [
          { id: 'PAL-UNLABELED', name: '4 Unlabeled Pallets', detail: 'No barcode / No SSCC', qty: 4, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Dock Congestion / Manual Intake',
        specialNote: 'No ASN record • Pallets require manual data entry and barcode printing',
      },
    },
  },
  // 10. Customer Service & Warranty Returns (1E6)
  'scope-1e6': {
    good: {
      id: '1e6-good',
      templateId: 'scope-1e6',
      quality: 'good',
      qualityLabel: 'Best Practice (Warranty Claim with Serial & Purchase Record)',
      filename: 'Warranty_Claim_SN882910K.eml',
      documentType: 'Customer Warranty Claim with Proof of Purchase',
      sender: 'service@bavaria-machinery.com',
      subject: 'Warranty Claim: Controller Failure CU-400 (SN: SN-882910-K)',
      receivedAt: '2026-10-02T13:15:00+02:00',
      summary: 'Warranty request for drive controller CU-400, serial number SN-882910-K, purchased 9 months ago. Active warranty.',
      sapReferenceDoc: 'SAP Service Ticket (SR-2026-9901)',
      rawText: `From: Bavaria Machinery Ltd. <service@bavaria-machinery.com>
To: customer-service@sap-enterprise-showcase.com
Date: Oct 2, 2026 13:15
Subject: Warranty Claim: Controller Failure CU-400 (SN: SN-882910-K)

Dear Customer Service Team,

We hereby submit a formal warranty claim for the following equipment:
Device Type: Electronic Drive Controller CU-400
Serial Number: SN-882910-K
Original Invoice: INV-2026-1102 dated Jan 15, 2026 (Warranty coverage: 24 months from purchase)
Symptom: Display remains blank; internal DC-DC converter produces no voltage. External fuses intact. No fluid damage.

Please issue an RMA return label and provide an advance replacement unit if possible.

Best regards,
Markus Leitner | Head of Maintenance | Bavaria Machinery Ltd.`,
      structuredData: {
        customerOrPlant: 'Bavaria Machinery Ltd. (Customer 0000100880)',
        targetReference: 'SN-882910-K (Invoice INV-2026-1102)',
        itemsOrEquipment: [
          { id: 'CU-400', name: 'Drive Controller CU-400', detail: 'SN: SN-882910-K • Display blank', qty: 1, priceEur: 1250.0 },
        ],
        totalAmountEur: 1250.0,
        urgency: 'Active Warranty (Valid until Jan 15, 2028)',
        specialNote: 'Warranty claim validated • RMA label and advance replacement authorized',
      },
    },
    poor: {
      id: '1e6-poor',
      templateId: 'scope-1e6',
      quality: 'poor',
      qualityLabel: 'Poor / Incomplete (Missing Serial Number & Tampering)',
      filename: 'Complaint_Device_Destroyed.eml',
      documentType: 'Emotional Email without Purchase Record',
      sender: 'john.hobbyist@web.com',
      subject: 'This thing exploded want my money back now',
      receivedAt: '2026-10-02T13:45:00+02:00',
      summary: 'Customer demands refund. Case opened manually with burnt components. Missing invoice and serial number.',
      sapReferenceDoc: 'SAP Service Ticket (SR-2026-9901)',
      rawText: `Hello,
Connected this unit yesterday and heard a loud pop with smoke. Opened up the case with a screwdriver and saw burnt components. I want an immediate refund or I will contact my lawyer. I lost the receipt.`,
      structuredData: {
        customerOrPlant: 'Unknown Retail Customer',
        targetReference: 'NO-DOCUMENT',
        itemsOrEquipment: [
          { id: 'DEV-UNKNOWN', name: 'Unknown Device', detail: 'Burnt following unauthorized case opening', qty: 1, priceEur: 0.0 },
        ],
        totalAmountEur: 0.0,
        urgency: 'Suspected Warranty Exclusion',
        specialNote: 'Missing invoice • Unauthorized case opening • Escalation required',
      },
    },
  },
};

export const SAMPLE_MESSAGES = SAMPLE_MESSAGES_DE;

export function getSampleMessage(templateId: string, quality: MessageQuality = 'good', lang: Language = 'de'): ProcessSampleMessage {
  const dictionary = lang === 'en' ? SAMPLE_MESSAGES_EN : SAMPLE_MESSAGES_DE;
  if (dictionary[templateId]) {
    return dictionary[templateId][quality] || dictionary[templateId].good;
  }

  // Dynamischer Generator für beliebige Custom- und Ad-hoc-Workflows:
  const isEn = lang === 'en';
  return {
    id: `${templateId}-${quality}`,
    templateId,
    quality,
    qualityLabel: isEn
      ? (quality === 'good' ? 'Standard / Compliant Inbound Payload' : 'Noisy / Incomplete Inbound Payload')
      : (quality === 'good' ? 'Standard / Vollständiger Belegeingang' : 'Verrauschter / Unvollständiger Eingang'),
    filename: `${templateId.replace(/[^a-zA-Z0-9_-]/g, '_')}_Beleg.pdf`,
    documentType: isEn ? 'Digital Document / Electronic Payload' : 'Digitaler Beleg / Elektronische Nachricht',
    sender: quality === 'good' ? 'partner-service@sap-enterprise.com' : 'unbekannt@extern-mail.com',
    subject: isEn ? `Inbound Transaction for ${templateId}` : `Geschäftsvorfall Eingang zu ${templateId}`,
    receivedAt: '2026-10-01T08:30:00+02:00',
    summary: isEn
      ? 'Inbound process trigger payload with structured business data.'
      : 'Eingehende Prozessanforderung mit strukturierten Belegdaten.',
    sapReferenceDoc: 'SAP Business Document',
    rawText: isEn
      ? `From: partner-service@sap-enterprise.com\nTo: inbound@company.com\nSubject: Inbound Transaction for ${templateId}\n\nTransaction payload received for automated processing in SAP S/4HANA.`
      : `Von: partner-service@sap-enterprise.com\nAn: eingang@unternehmen.de\nBetreff: Geschäftsvorfall Eingang zu ${templateId}\n\nEingehende Nachricht zur automatisierten Verarbeitung im SAP S/4HANA System.`,
    structuredData: {
      customerOrPlant: 'Enterprise Partner (BP-00109923)',
      targetReference: `DOC-${templateId.toUpperCase()}-01`,
      itemsOrEquipment: [
        { id: 'POS-10', name: 'Standard Item / Operation', detail: 'Pos 10 • Primary transaction item', qty: 1, priceEur: 1250.0 },
      ],
      totalAmountEur: 1250.0,
      urgency: 'Normal Priority',
      specialNote: 'Automated workflow execution',
    },
  };
}

// Fallback Kompatibilität für ältere Imports
export const DRY_RUN_SAMPLE_ORDER = {
  ...SAMPLE_MESSAGES_DE['scope-bd9'].good,
  rawEmail: SAMPLE_MESSAGES_DE['scope-bd9'].good.rawText,
};

