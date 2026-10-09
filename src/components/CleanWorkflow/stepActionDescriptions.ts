import { CognitivePrimitive } from '@/types/process';

interface StepActionSummaryParams {
  stepIndex: number;
  templateId: string;
  stepName: string;
  primitive: CognitivePrimitive;
  status: 'success' | 'escalation' | 'error' | 'degraded';
  isSelfHealed?: boolean;
  archetype?: string;
  language: 'de' | 'en';
  businessIntent?: string;
  description?: string;
}

export const getPlainLanguageStepAction = ({
  stepIndex,
  templateId,
  stepName,
  primitive,
  status,
  isSelfHealed,
  archetype,
  language,
  businessIntent,
  description,
}: StepActionSummaryParams): string => {
  const isEn = language === 'en';

  if (isSelfHealed) {
    return isEn
      ? 'Autonomous exception self-healing: Missing or noisy information was autonomously reconstructed via background context lookup so the process could proceed.'
      : 'Autonome Ausnahmen-Korrektur: Fehlende oder verrauschte Angaben wurden anhand der Historie selbstständig ermittelt, sodass der Prozess ohne Sachbearbeiter-Eskalation weiterlaufen konnte.';
  }

  if (status === 'error') {
    return isEn
      ? 'Process halted: The inbound data did not meet required criteria. The workflow stopped to prevent faulty booking.'
      : 'Prozess angehalten: Die Eingangsdaten erfüllen die Kriterien nicht. Die Weiterverarbeitung wurde gestoppt, um eine Fehlbuchung zu verhindern.';
  }

  if (status === 'escalation') {
    return isEn
      ? 'Clarification required: The confidence score is below safe automation thresholds. The document is forwarded to a human clerk for review.'
      : 'Klärungsbedarf: Die Daten weisen Unstimmigkeiten auf oder die Zuverlässigkeit liegt unter dem Schwellenwert. Der Beleg wird dem Sachbearbeiter zur manuellen Prüfung vorgelegt.';
  }

  // Erfolgsfall - Umgangssprachliche Erklärung nach Schrittnummer & Szenario
  if (templateId === 'scope-2f1') {
    // Service Order Management
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Triage: Inbound message evaluated and classified as an urgent equipment malfunction report.'
          : 'Sichtung: Eingehende Nachricht geprüft und als dringende Maschinen-Störungsmeldung (Instandhaltungsfall) eingestuft.';
      case 1:
        return isEn
          ? 'Extraction: Extracted equipment reference, reported symptoms, location, and plant contact from message body.'
          : 'Datenextraktion: Maschinenkennung, Fehlerbild, Standort und Ansprechpartner wurden aus dem Freitext ausgelesen.';
      case 2:
        return isEn
          ? 'Equipment Match: Verified equipment ID in asset registry, loaded service contract and active SLA terms.'
          : 'Anlagenabgleich: Maschine im SAP-Anlagenstamm identifiziert und zugehörigen Servicevertrag mit Reaktionszeit geladen.';
      case 3:
        return isEn
          ? 'Priority & Resource Check: Confirmed priority 1 (critical downtime) and checked available technician skills.'
          : 'Prio- & Dispositionsprüfung: Hohe Dringlichkeit (Stillstand) bestätigt und passende Technikerverfügbarkeit ermittelt.';
      case 4:
        return isEn
          ? 'Dispatch Authorization: Verified safety protocols and authorized emergency on-site technician assignment.'
          : 'Freigabe: Notfalleinsatz autorisiert und zur Verbuchung im Instandhaltungssystem freigegeben.';
      case 5:
        return isEn
          ? 'Service Order Created: Maintenance service order committed to SAP S/4HANA with technician reservation.'
          : 'Auftrag angelegt: Serviceauftrag verbindlich im SAP-System gespeichert und Techniker disponiert.';
      default:
        break;
    }
  } else if (templateId === 'scope-j60') {
    // Accounts Receivable
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Triage: Inbound communication identified as a payment remittance advice from customer finance department.'
          : 'Sichtung: Eingehendes Dokument als Zahlungsavis der Kundenbuchhaltung erkannt und zugeordnet.';
      case 1:
        return isEn
          ? 'Extraction: Extracted payment amount, invoice reference numbers, deductions, and payment execution date.'
          : 'Datenextraktion: Überweisungsbetrag, Rechnungsnummern, Skontoabzüge und Zahlungsdatum erfasst.';
      case 2:
        return isEn
          ? 'Open Item Match: Located matching customer account and corresponding open invoices in the accounts ledger.'
          : 'Forderungsabgleich: Kundenkonto im Debitorenstamm gefunden und zugehörige offene Rechnungen ermittelt.';
      case 3:
        return isEn
          ? 'Calculation Check: Recalculated 2% early-payment cash discount. Verified exact arithmetic match without variance.'
          : 'Rechnerische Prüfung: Berechtigung des Skontoabzugs (2%) geprüft. Rechnerischer Ausgleich ohne Differenz bestätigt.';
      case 4:
        return isEn
          ? 'Clearing Authorization: Authorized automated line-item clearing against the open accounts receivable.'
          : 'Freigabe: Differenzfreier Ausgleich der offenen Posten zur Verbuchung freigegeben.';
      case 5:
        return isEn
          ? 'Clearing Posted: Open items cleared in financial ledger (FI-AR) and clearing document generated.'
          : 'Ausgleich gebucht: Offene Rechnungen im SAP-Finanzwesen ausgeglichen und Ausgleichsbeleg archiviert.';
      default:
        break;
    }
  } else if (templateId === 'scope-2b6') {
    // Supplier Invoice Verification & 3-Way Match (MM-IV)
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Triage & Pre-Validation: Inbound supplier invoice checked, digital signature verified, and duplicates ruled out.'
          : 'Sichtung & Vorvalidierung: Eingehende Lieferantenrechnung geprüft, Format validiert und Duplikate ausgeschlossen.';
      case 1:
        return isEn
          ? 'Data Extraction: Extracted invoice number, amounts, VAT, vendor IBAN, and line items from PDF.'
          : 'Datenextraktion: Rechnungsnummer, Nettobetrag, MwSt, Kreditor-Bankverbindung und Positionen aus PDF extrahiert.';
      case 2:
        return isEn
          ? '3-Way Match: Matched invoice line items against SAP purchase order (PO) and warehouse goods receipt (GR).'
          : '3-Wege-Match: Rechnungspositionen gegen SAP-Bestellung und gebuchten Wareneingang abgeglichen.';
      case 3:
        return isEn
          ? 'Tolerance & Discount: Arithmetic verification passed, price variance within tolerance, and 3% cash discount calculated.'
          : 'Toleranz & Skonto: Rechnerische Prüfung bestanden, Toleranzgrenzen eingehalten und Skontoabzug optimiert.';
      case 4:
        if (archetype === 'copilot') {
          return isEn
            ? 'Copilot Review: Variance review assembled. AP accountant verifies items and approves continuation.'
            : 'Copilot-Vorlage: Prüfbericht zusammengestellt. Kreditorenbuchhalter prüft Beleg und gibt die Buchung frei.';
        }
        return isEn
          ? 'Invoice Authorization: Verification criteria met. Invoice approved for ERP posting.'
          : 'Rechnungs-Freigabe: Alle Prüfkriterien erfüllt. Beleg ist zur Verbuchung im MM-IV System autorisiert.';
      case 5:
        return isEn
          ? 'Invoice Posted: Incoming invoice (MIRO) committed to SAP S/4HANA with payment release for payment run.'
          : 'Rechnung verbucht: Rechnungsbeleg (MIRO) verbindlich in SAP S/4HANA verbucht und Zahlungsfreigabe gesetzt.';
      default:
        break;
    }
  } else if (templateId === 'scope-bd9') {
    // Standard: Scope BD9 (Kundenauftrag Vertrieb)
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Triage: Inbound customer message classified as a binding purchase order for industrial parts.'
          : 'Sichtung: Eingehende Nachricht gesichtet und als verbindliche Bestellanfrage (Kaufabsicht) für den Vertrieb eingestuft.';
      case 1:
        return isEn
          ? 'Extraction: Extracted requested articles, quantities, delivery deadline, and unloading gate from plain text.'
          : 'Datenextraktion: Aus dem Text wurden Artikel, Mengen, der gewünschte Liefertermin und die Entladestelle ausgelesen.';
      case 2:
        return isEn
          ? 'Master Data Match: Matched customer identity against the business partner database and mapped parts to SAP material numbers.'
          : 'Stammdaten-Abgleich: Der Kunde wurde im Debitorenstamm zugeordnet und die bestellten Artikel mit den internen Materialnummern verknüpft.';
      case 3:
        return isEn
          ? 'Commercial & ATP Check: Credit limit verified and sufficient stock availability confirmed for the delivery date.'
          : 'Kaufmännische Prüfung: Das Kreditlimit des Kunden reicht aus und die Ware ist zum Wunschtermin im Lager verfügbar.';
      case 4:
        if (archetype === 'copilot') {
          return isEn
            ? 'Copilot Review: Commercial pre-checks assembled. Clerk performs review and confirms continuation.'
            : 'Copilot-Vorlage: Vorprüfungen zusammengestellt. Der Sachbearbeiter prüft den Beleg und gibt die Buchung per Klick frei.';
        }
        return isEn
          ? 'Order Authorization: All policy criteria satisfied. Order authorized for direct system entry.'
          : 'Beleg-Freigabe: Alle Prüfkriterien sind erfüllt. Der Beleg ist für die Verbuchung im System freigegeben.';
      case 5:
        return isEn
          ? 'Sales Order Committed: Sales order successfully generated and stored in SAP S/4HANA database.'
          : 'Auftrag verbucht: Der Kundenauftrag wurde mit allen Positionen und Konditionen verbindlich im SAP S/4HANA angelegt und gespeichert.';
      default:
        break;
    }
  } else if (templateId === 'scope-j45') {
    // Sourcing & Procurement (Procure-to-Pay)
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Requisition Ingestion: Inbound internal purchase requisition verified against budget and cost center.'
          : 'Bedarfsprüfung: Interne Bestellanforderung (Banf) auf Kostenstelle, Sachkonto und Budgetverfügbarkeit geprüft.';
      case 1:
        return isEn
          ? 'Source Determination: Matched required components against valid outline agreements and vendor catalogs.'
          : 'Bezugsquellenfindung: Material gegen gültigen Rahmenvertrag abgeglichen und optimalen Lieferanten ermittelt.';
      case 2:
        return isEn
          ? 'Threshold Evaluation: Purchase volume checked against approval matrix (> €10k dual authorization).'
          : 'Freigabeprüfung: Bestellwert gegen Genehmigungsmatrix geprüft und Workflow-Entscheidung getroffen.';
      case 3:
        return isEn
          ? 'Purchase Order Dispatch: Binding purchase order committed in ERP and transmitted via Business Network.'
          : 'Bestellübermittlung: Verbindliche Bestellung im S/4HANA angelegt und an Lieferanten übermittelt.';
      case 4:
        return isEn
          ? 'Goods Receipt: Physical arrival recorded, material document posted, and stock placed on inventory ledger.'
          : 'Wareneingang: Physische Lieferung erfasst, Materialbeleg gebucht und Wareneingangskonto bebucht.';
      case 5:
        return isEn
          ? '3-Way Match: Invoice reconciled against PO and goods receipt quantity. Payment clearance granted.'
          : '3-Wege-Abgleich: Rechnung gegen Bestellung und Wareneingang abgeglichen und zur Zahlung freigegeben.';
      default:
        break;
    }
  } else if (templateId === 'scope-1ga') {
    // Make-to-Stock Production (Plan-to-Produce)
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'MRP Run: Planned independent requirements evaluated and converted into net production demands.'
          : 'Bedarfsauflösung: MRP Live hat Nettobedarfe ermittelt und in einen Planauftrag umgesetzt.';
      case 1:
        return isEn
          ? 'Order Conversion: Production order generated, multi-level BOM exploded, and routing operations assigned.'
          : 'Auftragsumwandlung: Planauftrag in Fertigungsauftrag umgesetzt und Stückliste mit Arbeitsplan verknüpft.';
      case 2:
        return isEn
          ? 'ATP & Capacity Check: Verified all 7 BOM components are in stock and shop floor work centers have capacity.'
          : 'Verfügbarkeitsprüfung: Alle 7 Komponenten auf Lager bestätigt und Maschinenkapazitäten reserviert.';
      case 3:
        return isEn
          ? 'Order Release: Production order released, material staging reservations generated for warehouse pick.'
          : 'Auftragsfreigabe: Fertigungsauftrag freigegeben und Kommissionierliste für Werkstattlager erzeugt.';
      case 4:
        return isEn
          ? 'Confirmation & Backflush: Actual operation runtimes and good parts confirmed; component issue backflushed.'
          : 'Rückmeldung & Warenausgang: Gutmengen und Maschinenzeiten rückgemeldet; Komponenten retrograd abgebucht.';
      case 5:
        return isEn
          ? 'Finished Goods Receipt: Completed assemblies booked into unrestricted warehouse stock; order credited.'
          : 'Fertigwarenzugang: Fertigerzeugnisse auf freien Lagerbestand eingebucht und Auftragskosten entlastet.';
      default:
        break;
    }
  } else if (templateId === 'scope-1mb') {
    // Quality Management in Procurement
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Inspection Lot Created: Inbound delivery moved to quarantine inspection stock; QM lot opened.'
          : 'Prüflos eröffnet: Wareneingang automatisch in Qualitätsprüfbestand gebucht und Prüflos generiert.';
      case 1:
        return isEn
          ? 'Certificate Extraction: Extracted 6 mechanical and chemical parameters from supplier test certificate.'
          : 'Werkszeugnis-Extraktion: Messwerte für Zugfestigkeit, Härte und Chemie aus EN 10204 3.1 PDF ausgelesen.';
      case 2:
        return isEn
          ? 'Tolerance Verification: Actual measurements reconciled against upper/lower specification limits.'
          : 'Toleranzabgleich: Ist-Messwerte gegen Vorgaben des Prüfplans verglichen (alle Werte im Sollbereich).';
      case 3:
        return isEn
          ? 'Usage Decision (UD): Formal usage decision made; batch accepted for unrestricted plant release.'
          : 'Verwendungsentscheid: Formale Qualitätsbewertung abgeschlossen und Verwendungsentscheid Annahme getroffen.';
      case 4:
        return isEn
          ? 'Stock Posting: Batch quantity transferred from quality inspection into unrestricted inventory.'
          : 'Bestandsumbuchung: Charge aus Qualitätsprüfbestand in frei verwendbaren Bestand umgelagert (Bewegung 321).';
      case 5:
        return isEn
          ? 'Quality Score Update: Supplier performance record updated and inspection dossier archived.'
          : 'Lieferantenbewertung: Qualitätsnote im Einkauf aktualisiert und Abschlussbericht archiviert.';
      default:
        break;
    }
  } else if (templateId === 'scope-bj2') {
    // Corrective Plant Maintenance
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Malfunction Intake: Breakdown report evaluated, classified as critical pressure loss (Priority 1).'
          : 'Störungserfassung: Störungsanzeige eingegangen und als kritischer Druckverlust (Prio 1 Stillstand) bewertet.';
      case 1:
        return isEn
          ? 'Asset Located: Equipment 10048201 located in Hall 2; repair history and seal specs retrieved.'
          : 'Anlagenidentifikation: Hydraulikpresse 4 im Anlagenstamm identifiziert und Historie geladen.';
      case 2:
        return isEn
          ? 'Maintenance Order: Work order PM01 created and seal replacement kit reserved in parts warehouse.'
          : 'Auftragsplanung: Instandhaltungsauftrag angelegt und benötigter Dichtungssatz im Lager reserviert.';
      case 3:
        return isEn
          ? 'Safety & Crew Dispatch: Lockout/Tagout protocol confirmed and work order pushed to field technician.'
          : 'Freigabe & Disposition: Sicherheitsauflagen geprüft und Arbeitsauftrag an Mobilgerät des Schlosserteams gesendet.';
      case 4:
        return isEn
          ? 'Actuals Recorded: 2.5 hours labor recorded, replacement gasket consumed, and seal test confirmed.'
          : 'Rückmeldung: 2,5 Stunden Arbeitszeit rückgemeldet, Ersatzteile verbucht und Drucktest bestanden.';
      case 5:
        return isEn
          ? 'Technical Completion (TECO): Order technically closed; actual expenses charged to plant cost center.'
          : 'Technischer Abschluss: Auftrag auf Status TABG gesetzt und Reparaturkosten an Kostenstelle verrechnet.';
      default:
        break;
    }
  } else if (templateId === 'scope-1b6') {
    // Warehouse Inbound & Putaway with EWM
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'ASN Ingested: Advance shipping notice processed and EWM inbound delivery created with 4 Handling Units.'
          : 'Avis-Erfassung: Elektronisches Lieferavis (ASN) verarbeitet und EWM-Anlieferung mit 4 Packstücken erzeugt.';
      case 1:
        return isEn
          ? 'Gate Assigned: Arriving freight truck checked in and routed to unloading Dock 4.'
          : 'Rampenzuweisung: Lkw-Kennzeichen abgeglichen und Entladetor 4 für den Spediteur reserviert.';
      case 2:
        return isEn
          ? 'Goods Receipt Scanned: Pallet SSCC barcodes scanned at dock and goods receipt booked in EWM.'
          : 'Wareneingangsscan: NVE/SSCC-Barcodes an der Rampe gescannt und Wareneingang im EWM vereinnahmt.';
      case 3:
        return isEn
          ? 'Slotting Strategy: Optimal storage bin in high-bay rack determined by weight and turnover frequency.'
          : 'Lagerplatzfindung: Optimaler Hochregalplatz (G02-R14-E03) nach Gewichts- und Umschlagskriterien berechnet.';
      case 4:
        return isEn
          ? 'Putaway Confirmed: Forklift warehouse task completed and verified via destination bin barcode scan.'
          : 'Einlagerungsquittung: Staplerauftrag ausgeführt und Lagerplatz per Handscanner verbindlich quittiert.';
      case 5:
        return isEn
          ? 'Inventory Sync: Asynchronous qRFC update executed between EWM bins and S/4HANA stock ledger.'
          : 'Bestandsabgleich: Platzgenauer Bestand im EWM asynchron mit S/4HANA Bestandsführung synchronisiert.';
      default:
        break;
    }
  } else if (templateId === 'scope-1e6') {
    // Customer Service & Warranty Returns
    switch (stepIndex) {
      case 0:
        return isEn
          ? 'Claim Ingestion: Inbound complaint parsed and registered as a potential warranty return request.'
          : 'Reklamationseingang: Kundenbeschwerde erfasst und als potenzieller Gewährleistungsfall klassifiziert.';
      case 1:
        return isEn
          ? 'Warranty Validated: Serial number SN-882910-K matched to purchase date; active 24-month warranty confirmed.'
          : 'Garantieprüfung: Seriennummer geprüft; Kauf vor 9 Monaten bestätigt aktiven Garantieanspruch.';
      case 2:
        return isEn
          ? 'Goodwill Decision: Technical defect report assessed; free unit replacement authorized.'
          : 'Kulanzentscheidung: Schadensbild analysiert; kostenloser Vorabaustausch für Kunden genehmigt.';
      case 3:
        return isEn
          ? 'Return Order (RMA): SAP return sales order created and prepaid return freight label emailed to customer.'
          : 'Retourenauftrag: SAP-Retourenbeleg (Auftragsart RE) angelegt und RMA-Rücksendelabel an Kunden gesendet.';
      case 4:
        return isEn
          ? 'Replacement Dispatched: Advance replacement unit picked from warehouse and goods issue booked.'
          : 'Ersatzlieferung: Austauschgerät aus Lager kommissioniert und Warenausgang für Kunden gebucht.';
      case 5:
        return isEn
          ? 'Settlement & Close: Zero-value warranty billing document issued; claim successfully resolved.'
          : 'Abschluss & Faktura: Null-Wert-Faktura im SD gebucht und Vorgang mit Kundenanschreiben geschlossen.';
      default:
        break;
    }
  } else {
    // DYNAMISCHER FALLBACK FÜR BELIEBIGE PROZESSE (Custom-Workflows oder neue Presets)
    if (businessIntent && businessIntent.trim() !== '') {
      return `${stepName}: ${businessIntent.trim()}`;
    }
    if (description && description.trim() !== '') {
      return description.trim();
    }
    switch (primitive) {
      case 'Filter / Gatekeeper':
        return isEn
          ? `${stepName}: Inbound request inspected and checked against format and routing criteria.`
          : `${stepName}: Eingangsbeleg gesichtet und auf formale Kriterien sowie Zuständigkeit geprüft.`;
      case 'Extractor / Transformer':
        return isEn
          ? `${stepName}: Relevant business entities, quantities, and reference keys extracted.`
          : `${stepName}: Relevante Kopf- und Positionsdaten aus den Eingangsdaten extrahiert.`;
      case 'Matcher / Enricher':
        return isEn
          ? `${stepName}: Data mapped against SAP master data records and enriched with system references.`
          : `${stepName}: Stammdaten im SAP-System identifiziert und Vorgangsdaten angereichert.`;
      case 'Evaluator / Reasoner':
        return isEn
          ? `${stepName}: Business rules, thresholds, and governance policies evaluated.`
          : `${stepName}: Kaufmännische Richtlinien, Schwellenwerte und Freigaberegeln geprüft.`;
      case 'Executor / Actuator':
        return isEn
          ? `${stepName}: Transaction committed to SAP S/4HANA ledger.`
          : `${stepName}: Verbindliche Transaktionsverbuchung im SAP S/4HANA System ausgeführt.`;
      case 'Generator / Synthesizer':
        return isEn
          ? `${stepName}: Outbound document generated and dispatched.`
          : `${stepName}: Ausgangsdokument generiert und an den Kommunikationskanal übergeben.`;
      default:
        break;
    }
  }

  return isEn
    ? 'Step executed: Inbound data verified and transformed according to process policy.'
    : 'Schritt ausgeführt: Eingangsdaten geprüft und gemäß Prozessregeln verarbeitet.';
};
