import { Language } from '@/i18n/translations';
import { ProcessTemplate } from '@/types/process';

export interface ProcessDocumentFlowStep {
  stepNumber: number;
  documentName: string;
  sapObjectType: string;
  description: string;
  icon?: string;
}

export interface ProcessKnowledgeItem {
  id: string;
  scopeCode: string;
  name: string;
  businessArea: string;
  headlineSummary: string;
  
  // 1. Didaktische, allgemeinsprachliche Beschreibung (für Studenten)
  plainDescription: string;
  realWorldScenario: string;
  
  // 2. Bedeutung für SAP & S/4HANA
  sapSignificance: {
    coreModules: string[];
    roleInErpEcosystem: string;
    documentFlow: ProcessDocumentFlowStep[];
    keyTransactionsAndApps: {
      codeOrApp: string;
      title: string;
      purpose: string;
    }[];
    cleanCoreAndIntegration: {
      standardApi: string;
      extensionGuideline: string;
      aiCoreUseCase: string;
    };
  };

  // 3. Didaktische Einordnung & Lernziele für das Studium
  studentTakeaways: {
    keyConcept: string;
    examRelevance: string;
    processDistinction: string; // Abgrenzung zu ähnlichen Prozessen
  };
}

export const PROCESS_KNOWLEDGE_DE: Record<string, ProcessKnowledgeItem> = {
  'scope-2f1': {
    id: 'scope-2f1',
    scopeCode: '2F1',
    name: 'Service Order Management',
    businessArea: 'Customer Service (CS / S/4HANA Service)',
    headlineSummary: 'End-to-End Kundendienst- und Reparaturprozess von Störungseingang bis zur Abrechnung von Technikerzeit und Ersatzteilen.',
    plainDescription:
      'Im Service Order Management geht es darum, Kunden nach dem Kauf eines Produkts bei Störungen, Wartungen oder Reparaturen schnell und verlässlich zu helfen. Ein Kunde meldet ein Problem (z.B. eine ausgefallene Industrie-Maschine oder Kaffeemaschine). Das Unternehmen prüft Garantie und Serviceverträge, schickt einen Servicetechniker mit den passenden Ersatzteilen vor Ort oder führt eine Reparatur in der Werkstatt durch und stellt die erbrachte Arbeitszeit sowie das verbaute Material anschließend transparent in Rechnung.',
    realWorldScenario:
      'Beispiel: Eine Bäckereikette betreibt 50 Filialen mit High-End-Kaffeevollautomaten. In Filiale 7 streikt die Brühgruppe. Der Filialleiter meldet die Störung über das Kundenportal. Das System identifiziert sofort das exakte Equipment anhand der Seriennummer, prüft die vertragliche SLA (Reaktionszeit < 4 Stunden), reserviert das Ersatzteil im Zentrallager und disponiert einen Techniker in der Nähe.',
    sapSignificance: {
      coreModules: ['S/4HANA Service', 'Customer Service (CS)', 'Plant Maintenance (PM)', 'Controlling (CO)', 'Finance (FI)', 'Field Service Management (FSM)'],
      roleInErpEcosystem:
        'Service Order Management schlägt die Brücke zwischen Kundenbeziehung (CRM/Service) und harter ERP-Logistik/Finanzwirtschaft. Ein Serviceauftrag ist in SAP nicht nur ein Ticket, sondern ein kostenrechnendes Kontierungsobjekt: Hier fließen Materialentnahmen (Warenbewegungen), externe Dienstleister und interne Personalstunden (CATS) zusammen und werden auf Profitcenter und Ergebnisrechnung (CO-PA) verbucht.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Servicemeldung (Service Notification)',
          sapObjectType: 'BUS2038 / Service Notification',
          description: 'Erfassung des Störungsbildes, Schadenscodes, Priorität und Kundenkontakt.',
          icon: '📩',
        },
        {
          stepNumber: 2,
          documentName: 'Serviceauftrag (Service Order)',
          sapObjectType: 'BUS2007 / CRMS4_ORDER',
          description: 'Planung von Vorgängen (Technikerstunden), Materialkomponenten (Ersatzteile) und Kostenkalkulation.',
          icon: '🛠️',
        },
        {
          stepNumber: 3,
          documentName: 'Warenbegleitschein & Warenausgang',
          sapObjectType: 'Materialbeleg (MIGO / Bewegungsart 261)',
          description: 'Entnahme des Ersatzteils aus dem Lagerbestand mit automatischer Entlastung des Bestandskontos.',
          icon: '📦',
        },
        {
          stepNumber: 4,
          documentName: 'Leistungsrückmeldung (Confirmation)',
          sapObjectType: 'CATS / Service Confirmation',
          description: 'Erfassung der tatsächlich geleisteten Techniker-Arbeitsstunden und Reisekosten.',
          icon: '⏱️',
        },
        {
          stepNumber: 5,
          documentName: 'Fakturaanforderung & Kundenrechnung',
          sapObjectType: 'DMR (Debit Memo Request) & Faktura (VF01 / CI)',
          description: 'Erstellung der Rechnung basierend auf tatsächlichem Aufwand (Time & Material) oder Pauschale.',
          icon: '💶',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F4602 (Fiori)',
          title: 'Manage Service Orders',
          purpose: 'Moderne S/4HANA Fiori App zur Überwachung, Freigabe und Bearbeitung aller Serviceaufträge.',
        },
        {
          codeOrApp: 'IW31 / IW32 (GUI)',
          title: 'Service-/Instandhaltungsauftrag anlegen',
          purpose: 'Klassische SAP-GUI-Transaktion für die operative Auftragsplanung und Vorgangssteuerung.',
        },
        {
          codeOrApp: 'CRMS4_SERV_ORDER (GUI/Fiori)',
          title: 'S/4HANA Service Order',
          purpose: 'Zentraler Belegtyp im modernen S/4HANA Enterprise Service Management.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData v4: API_SERVICE_ORDER_SRV / Service Order (A2X)',
        extensionGuideline:
          'Keine Modifikationen an SAP-Kerntabellen (wie AFIH/AFKO)! Erweiterungen wie Skill-Matching oder Routenplanung gehören side-by-side auf die SAP Business Technology Platform (BTP). Statusänderungen werden über SAP Event Mesh entkoppelt publiziert.',
        aiCoreUseCase:
          'Automatisierte Schadensbild-Klassifikation und Triage aus unstrukturierten Kundennachrichten via LLM; Vorhersage benötigter Ersatzteile via SAP AI Core.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Der Serviceauftrag ist ein doppelgesichtiges Objekt: Organisatorischer Arbeitsauftrag für die Werkstatt/den Techniker und Kostensammler im Controlling (CO-Auftrag).',
      examRelevance:
        'Typische Prüfungsfrage: "Wie unterscheidet sich ein Serviceauftrag von einem Kundenauftrag (SD) und einem Instandhaltungsauftrag (PM)?"',
      processDistinction:
        'Kundenauftrag (SD/BD9) verkauft Standardware oder definierte Dienstleistungen an Kunden. Instandhaltung (PM/BJ2) repariert EIGENE Anlagen im Betrieb. Service Order Management (CS/2F1) repariert FREMDE oder verkaufte Kundenanlagen mit Kundenfaktura.',
    },
  },

  'scope-bd9': {
    id: 'scope-bd9',
    scopeCode: 'BD9',
    name: 'Sell from Stock (Order-to-Cash)',
    businessArea: 'Sales & Distribution (SD / S/4HANA Sales)',
    headlineSummary: 'Der archetypische Vertriebskernprozess: Vom Eingang der Kundenbestellung über Verfügbarkeitsprüfung, Kommissionierung und Lieferung bis zur Rechnung und Zahlungseingang.',
    plainDescription:
      'Sell from Stock ("Verkauf ab Lager") ist das Herzstück jedes Handels- und Fertigungsunternehmens. Ein Kunde bestellt fertige Produkte, die bereits im Lager liegen. Das System prüft in Echtzeit, ob genügend Ware vorhanden ist und ob der Kunde kreditwürdig ist. Anschließend wird die Lieferung im Lager angestoßen, verpackt, versendet und dem Kunden in Rechnung gestellt. Ziel ist eine maximale Liefertreue bei minimalen Durchlaufzeiten.',
    realWorldScenario:
      'Beispiel: Ein Baustoff-Großhändler erhält per E-Mail eine Großbestellung über 500 Sack Spezialzement von einem Bauunternehmen. Das System liest die PDF-Bestellung automatisch aus, matcht die Kundennummer und Artikelcodes, prüft sofort den verfügbaren Lagerbestand (ATP) im Zentrallager sowie das Kreditlimit des Kunden, legt den SAP-Kundenauftrag an und schickt die Auftragsbestätigung zurück.',
    sapSignificance: {
      coreModules: ['Sales & Distribution (SD)', 'Materials Management (MM)', 'Financial Accounting (FI)', 'Controlling (CO)'],
      roleInErpEcosystem:
        'BD9 ist das am häufigsten implementierte Scope Item weltweit. Es repräsentiert die klassische "Order-to-Cash"-Kette (O2C). Hier entsteht der Umsatz des Unternehmens. Der Belegfluss verbindet Vertriebslogik mit Lagerlogistik und den automatischen Hauptbuchbuchungen im Finanzwesen.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Kundenanfrage / Angebot (Inquiry / Quotation)',
          sapObjectType: 'BUS2031 (VA11 / VA21)',
          description: 'Unverbindliche Preisanfrage oder verbindliches Angebot mit Preisstaffeln.',
          icon: '📝',
        },
        {
          stepNumber: 2,
          documentName: 'Kundenauftrag (Sales Order)',
          sapObjectType: 'BUS2032 (VA01 / Manage Sales Orders)',
          description: 'Rechtsverbindlicher Kaufvertrag mit Preisfindung, Wunschlieferdatum und ATP-Prüfung.',
          icon: '📑',
        },
        {
          stepNumber: 3,
          documentName: 'Auslieferungsbeleg (Outbound Delivery)',
          sapObjectType: 'LIKP (VL01N)',
          description: 'Anstoß der Versandaktivitäten im Lager: Kommissionieren, Verpacken, Lademittelverwaltung.',
          icon: '📦',
        },
        {
          stepNumber: 4,
          documentName: 'Warenausgang (Goods Issue)',
          sapObjectType: 'Materialbeleg (MIGO / Bewegungsart 601)',
          description: 'Eigentumsübergang der Ware: Bestandsminderung in der Materialwirtschaft und Buchung auf Aufwandskonto.',
          icon: '🚚',
        },
        {
          stepNumber: 5,
          documentName: 'Kundenfaktura & Buchhaltungsbeleg',
          sapObjectType: 'VBRK / BKPF (VF01 / Manage Billing Documents)',
          description: 'Erstellung der Rechnung; automatische Buchung: Forderungen an Umsatzerlöse (Debitorenkonto).',
          icon: '💰',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F0842A (Fiori)',
          title: 'Manage Sales Orders',
          purpose: 'Zentrale S/4HANA Fiori App zur Erfassung, Statusprüfung und Bearbeitung von Kundenaufträgen.',
        },
        {
          codeOrApp: 'VA01 / VA02 / VA03 (GUI)',
          title: 'Kundenauftrag anlegen / ändern / anzeigen',
          purpose: 'Die legendäre Standard-Transaktion des SAP SD Moduls.',
        },
        {
          codeOrApp: 'VL01N / VF01 (GUI)',
          title: 'Auslieferung anlegen / Faktura erstellen',
          purpose: 'Folgebeleg-Erstellung für Versand und Abrechnung.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData v4: API_SALES_ORDER_SRV / CE_SALESORDER_0001',
        extensionGuideline:
          'Freitextfelder und eigene Felder über SAP S/4HANA Custom Fields and Logic App hinzufügen. Komplexe Prüfungen als BAdI (Clean Core freigegeben) oder Event-gesteuert via SAP BTP Integration Suite anbinden.',
        aiCoreUseCase:
          'Intelligente Belegextraktion (Document Grounding) aus unstrukturierten Bestell-PDFs und automatisiertes Matching von Kunden-Materialnummern via Fuzzy Search / Embeddings.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Der lückenlose Belegfluss (Document Flow) garantiert Auditierbarkeit (GoBD): Jeder Warenausgang und jede Rechnung verweist eindeutig auf den ursprünglichen Kundenauftrag.',
      examRelevance:
        'Standardfrage: "Erläutern Sie die Phasen des Order-to-Cash-Prozesses in SAP und nennen Sie die Auswirkungen des Warenausgangs auf Materialwirtschaft und Finanzwesen."',
      processDistinction:
        'Im Gegensatz zu Make-to-Order (1GA, Kundeneinzelfertigung) existiert die Ware bei Sell from Stock (BD9) bereits auf Lager (anonymer Lagerbestand).',
    },
  },

  'scope-j60': {
    id: 'scope-j60',
    scopeCode: 'J60',
    name: 'Invoice Processing (Accounts Payable)',
    businessArea: 'Financial Accounting (FI-AP / S/4HANA Finance)',
    headlineSummary: 'Kreditorenbuchhaltung und automatisierte Rechnungsprüfung: Vom Rechnungseingang über den 3-Wege-Abgleich (3-Way Match) bis zur Zahlungsausführung.',
    plainDescription:
      'Wenn ein Unternehmen Waren oder Dienstleistungen von Lieferanten kauft, schicken diese Rechnungen. In der Kreditorenbuchhaltung (Accounts Payable) muss jede eingehende Rechnung akribisch geprüft werden: Haben wir das überhaupt bestellt? Wurde die Ware tatsächlich geliefert? Stimmen die Preise und Steuern? Dieser Vorgang heißt 3-Wege-Abgleich (Bestellung vs. Wareneingang vs. Rechnung). Erst wenn alles passt, wird die Rechnung verbucht und im Zahlungslauf beglichen.',
    realWorldScenario:
      'Beispiel: Ein Automobilzulieferer erhält monatlich 40.000 Rechnungen von 1.200 Lieferanten. Eine Lieferantenrechnung über 12.500 € für Kugellager trifft als PDF ein. Die KI extrahiert IBAN, Rechnungsnummer, Nettobetrag und Steuersatz. Das System gleicht das Dokument mit der internen SAP-Bestellung und dem Wareneingangsbeleg ab. Bei Cent-Genauigkeit erfolgt die Dunkelbuchung ohne menschlichen Eingriff.',
    sapSignificance: {
      coreModules: ['Financial Accounting (FI-AP)', 'Materials Management (MM-IV / Logistik-Rechnungsprüfung)', 'Controlling (CO)'],
      roleInErpEcosystem:
        'J60 ist der finanzielle Schlusspunkt der Beschaffungskette (Procure-to-Pay / P2P). Eine fehlerhafte Buchung führt zu falschen Steuermeldungen, Liquiditätsverlust oder Betrugsrisiken. Die Logistik-Rechnungsprüfung (MM-IV) gleicht das WE/RE-Verrechnungskonto (Wareneingang/Rechnungseingang) aus.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Eingangsrechnung (Vendor Invoice Inbound)',
          sapObjectType: 'PDF / ZUGFeRD / XRechnung / EDI',
          description: 'Eintreffen des Belegs über E-Mail, Lieferantenportal oder Peppol-Netzwerk.',
          icon: '📥',
        },
        {
          stepNumber: 2,
          documentName: '3-Wege-Abgleich (3-Way Matching)',
          sapObjectType: 'SAP MM-IV Rechnungsprüfung',
          description: 'Automatischer Vergleich: Bestellung (EKKO) + Materialbeleg Wareneingang (EKBE) + Rechnung.',
          icon: '⚖️',
        },
        {
          stepNumber: 3,
          documentName: 'Logistik-Rechnungsbeleg (MM) & FI-Beleg',
          sapObjectType: 'RBKP (Logistik) & BKPF (FI)',
          description: 'Buchung: Aufwand/WE-RE-Konto an Kreditorenverbindlichkeit (Kreditorenkonto KNB1).',
          icon: '📑',
        },
        {
          stepNumber: 4,
          documentName: 'Rechnungsfreigabe (Payment Release)',
          sapObjectType: 'Workflow / Zahlsperre aufheben',
          description: 'Lösen eventueller Zahlsperren (z.B. bei Preisabweichung oder fehlender Qualitätsprüfung).',
          icon: '🔓',
        },
        {
          stepNumber: 5,
          documentName: 'Automatischer Zahllauf (Payment Run)',
          sapObjectType: 'F110 / Manage Automatic Payments',
          description: 'SEPA-Überweisungsträger / XML (pain.001) an die Bank und Ausgleich der offenen Posten.',
          icon: '💳',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F0859 (Fiori)',
          title: 'Manage Supplier Invoices',
          purpose: 'Moderne S/4HANA App für Prüfung, Vorab-Erfassung und Buchen von Lieferantenrechnungen.',
        },
        {
          codeOrApp: 'MIRO (GUI)',
          title: 'Eingangsrechnung hinzufügen (Logistik)',
          purpose: 'Der SAP-Standard für die Prüfung gegen Bestellungen und Wareneingänge.',
        },
        {
          codeOrApp: 'FB60 (GUI) / F110 (GUI)',
          title: 'Kreditorenrechnung buchen / Automatischer Zahllauf',
          purpose: 'Reine FI-Rechnungsbuchung ohne Bestellbezug bzw. Massenzahlungslauf.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_SUPPLIERINVOICE_PROCESS_SRV',
        extensionGuideline:
          'Nutzung des SAP Document Information Extraction (DOX) Cloud Service auf BTP für OCR/KI. Rechnungsfreigaben über SAP Build Process Automation.',
        aiCoreUseCase:
          'Autonome Erkennung von Skontofristen, Duplikatsprüfung, Fraud Detection und automatische Kontierungsvorschläge für Sachkonten.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Das WE/RE-Verrechnungskonto (GR/IR): Ein interimistisches Passivkonto, das bei Wareneingang bebucht und erst durch die Rechnungsprüfung saldiert wird.',
      examRelevance:
        'Klassiker der Rechnungslegung: "Was passiert buchungstechnisch, wenn die Rechnung vor dem Wareneingang gebucht wird, und warum ist der 3-Wege-Abgleich unverzichtbar?"',
      processDistinction:
        'Abgrenzung: Fakturierung (SD/VF01) schreibt Rechnungen an Kunden (Forderung). J60 bucht Rechnungen von Lieferanten (Verbindlichkeit).',
    },
  },

  'scope-j45': {
    id: 'scope-j45',
    scopeCode: 'J45',
    name: 'Procurement of Direct Materials',
    businessArea: 'Materials Management (MM-PUR / S/4HANA Sourcing & Procurement)',
    headlineSummary: 'Der klassische operative Beschaffungsprozess (Procure-to-Pay): Von der Bestellanforderung (Banf) über die Lieferantenbestellung bis zum Wareneingang.',
    plainDescription:
      'Unternehmen müssen Rohstoffe, Bauteile und Handelswaren einkaufen, um produzieren oder liefern zu können. Im Prozess "Procurement of Direct Materials" stellt die Produktion oder die Disposition fest, dass Material fehlt. Es wird eine Bestellanforderung (Banf) erstellt, die genehmigt wird. Der Einkauf wandelt diese in eine Bestellung an den Lieferanten um. Nach Lieferung wird die Ware im Lager vereinnahmt und geprüft.',
    realWorldScenario:
      'Beispiel: Ein Maschinenbauer stellt fest, dass für den nächsten Monat 200 Hydraulikzylinder fehlen. Die Materialbedarfsplanung (MRP) erzeugt automatisch eine Banf. Das System ermittelt die gültige Bezugsquelle (Rahmenvertrag mit Vorzugslieferant), erzeugt die Bestellung und übermittelt sie digital via EDI / SAP Business Network an den Lieferanten.',
    sapSignificance: {
      coreModules: ['Materials Management (MM)', 'Production Planning (PP)', 'Quality Management (QM)', 'Finance (FI)'],
      roleInErpEcosystem:
        'J45 ist das logistische Rückgrat der operativen Versorgung. Ohne diesen Prozess stehen Fertigungslinien still. Er ist eng mit der Materialbedarfsplanung (MRP Live) verzahnt.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Bestellanforderung (Purchase Requisition / Banf)',
          sapObjectType: 'EBAN (ME51N / Manage Purchase Requisitions)',
          description: 'Interner Bedarfsnachweis der Fachabteilung mit Mengenangabe und Wunschtermin.',
          icon: '📋',
        },
        {
          stepNumber: 2,
          documentName: 'Bezugsquellenfindung (Source of Supply Determination)',
          sapObjectType: 'Orderbuch / Infosatz (EINA/EINE)',
          description: 'Automatische Zuordnung von Lieferant, Konditionen und Rahmenverträgen.',
          icon: '🔍',
        },
        {
          stepNumber: 3,
          documentName: 'Lieferantenbestellung (Purchase Order)',
          sapObjectType: 'EKKO (ME21N / Manage Purchase Orders)',
          description: 'Verbindliche Bestellung beim Lieferanten mit Incoterms und Zahlungsbedingungen.',
          icon: '📤',
        },
        {
          stepNumber: 4,
          documentName: 'Wareneingang (Goods Receipt)',
          sapObjectType: 'MIGO (Bewegungsart 101) / Materialbeleg',
          description: 'Vereinnahmung der Lieferung, Erhöhung des Lagerbestands und Verbuchung auf WE/RE-Konto.',
          icon: '📥',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F0842 (Fiori)',
          title: 'Manage Purchase Orders',
          purpose: 'Moderne S/4HANA App für Einkauf, Genehmigung und Nachverfolgung.',
        },
        {
          codeOrApp: 'ME21N / ME51N (GUI)',
          title: 'Bestellung / Banf anlegen',
          purpose: 'Die operativen Standardtransaktionen im SAP Einkauf.',
        },
        {
          codeOrApp: 'MIGO (GUI)',
          title: 'Warenbewegung (Wareneingang)',
          purpose: 'Zentrale Transaktion für alle logistischen Bestandsbuchungen.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_PURCHASEORDER_PROCESS_SRV',
        extensionGuideline:
          'Genehmigungs-Workflows über flexibles Workflow-Framework in S/4HANA oder SAP Build Process Automation.',
        aiCoreUseCase:
          'Lieferanten-Risikobewertung, Vorhersage von Lieferverzögerungen und automatisierte Generierung von Bestellanforderungen bei Anomalien.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Unterschied Bestellanforderung (Banf, rein intern, unverbindlich) vs. Bestellung (PO, extern wirksam, rechtsverbindlicher Vertrag).',
      examRelevance:
        'Grundlagenfrage ERP: "Welche Buchungssätze entstehen beim Wareneingang einer bestellten Direktmaterial-Lieferung?" (Bestand an WE/RE-Verrechnungskonto).',
      processDistinction:
        'J45 deckt Direkte Materialien (fließen ins Endprodukt ein) ab, im Unterschied zu Indirektem Einkauf (Büromaterial, Dienstleistungen) oder J60 (reine Rechnungsabwicklung).',
    },
  },

  'scope-2b6': {
    id: 'scope-2b6',
    scopeCode: '2B6',
    name: 'Quality Inspection & Complaint Management',
    businessArea: 'Quality Management (QM / S/4HANA Quality)',
    headlineSummary: 'Qualitätssicherung im Wareneingang und Kundenreklamations-Management: Von Prüflos und Fehlererfassung bis zu Korrekturmaßnahmen und 8D-Report.',
    plainDescription:
      'Qualität entscheidet über Kundenzufriedenheit und Produkthaftung. In diesem Prozess werden eingehende Waren oder Zwischenprodukte nach festen Prüfplänen auf Maßhaltigkeit, Fehlerfreiheit oder chemische Eigenschaften getestet (Prüflos). Weist ein Teil Fehler auf oder beschwert sich ein Kunde nach dem Kauf (Reklamation), steuert das Qualitätsmanagement die Fehleranalyse, Sperrung fehlerhafter Bestände, Lieferantenrügen und Gutschriften.',
    realWorldScenario:
      'Beispiel: Ein Medizintechnik-Hersteller erhält eine Charge Titan-Schrauben. Der Wareneingang bucht die Teile automatisch in den "Qualitätsprüfbestand" (nicht frei verfügbar). Das System erzeugt ein Prüflos mit Stichprobenanweisung. Nach Messung wird ein Gewindefehler festgestellt: Das Prüflos wird zurückgewiesen, eine Qualitätsmeldung angelegt und ein 8D-Report an den Lieferanten generiert.',
    sapSignificance: {
      coreModules: ['Quality Management (QM)', 'Materials Management (MM)', 'Sales & Distribution (SD)', 'Production Planning (PP)'],
      roleInErpEcosystem:
        '2B6 sichert die Einhaltung regulatorischer Standards (ISO 9001, IATF 16949, FDA). Der QM-Verwendungsentscheid steuert direkt die Bestandsführung in der Materialwirtschaft.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Prüflos-Generierung (Inspection Lot)',
          sapObjectType: 'QALS (QA01 / Wareneingang)',
          description: 'Automatisches Erzeugen des Prüfloses bei Warenbewegung oder Fertigungsauftrag.',
          icon: '🧪',
        },
        {
          stepNumber: 2,
          documentName: 'Ergebniserfassung (Results Recording)',
          sapObjectType: 'QASR (QE51N / Record Inspection Results)',
          description: 'Erfassung von Messwerten und qualitativen Merkmalen gegen Sollvorgaben.',
          icon: '📊',
        },
        {
          stepNumber: 3,
          documentName: 'Verwendungsentscheid (Usage Decision)',
          sapObjectType: 'QAVE (QA11 / Record Usage Decision)',
          description: 'Freigabe in den freien Bestand oder Umbuchung in Sperrbestand/Ausschuss.',
          icon: '⚖️',
        },
        {
          stepNumber: 4,
          documentName: 'Qualitätsmeldung & 8D-Report (Quality Notification)',
          sapObjectType: 'QMEL (QM01 / Manage Quality Notifications)',
          description: 'Dokumentation von Mängeln, Ursachenanalyse, Korrekturmaßnahmen und Lieferantenbelastung.',
          icon: '⚠️',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F2343 (Fiori)',
          title: 'Record Inspection Results',
          purpose: 'Touch-optimierte Fiori App für Prüfer im Labor und an der Linie.',
        },
        {
          codeOrApp: 'QA11 / QA32 (GUI)',
          title: 'Verwendungsentscheid erfassen / Prüflosübersicht',
          purpose: 'Zentraler Abschluss der Qualitätsprüfung.',
        },
        {
          codeOrApp: 'QM01 / QM02 (GUI)',
          title: 'Qualitätsmeldung anlegen / bearbeiten',
          purpose: 'Erfassung interner, lieferanten- oder kundenbezogener Beanstandungen.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_INSPECTIONLOT_SRV',
        extensionGuideline:
          'Prüfgeräte (IoT) senden Messdaten via SAP IoT / BTP REST APIs ohne direkte DB-Schreibzugriffe.',
        aiCoreUseCase:
          'Computer Vision für automatische Oberflächeninspektion und LLM-gestützte Ursachenanalyse in Reklamationstexten.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Bestandsarten in SAP: Frei verwendbarer Bestand, Qualitätsprüfbestand und Sperrbestand. Der QM-Verwendungsentscheid bewegt die Ware buchungstechnisch.',
      examRelevance:
        'Wirtschaftsinformatik-Schwerpunkt: "Wie wirkt sich die Ablehnung eines Prüfloses auf den Materialbestand und die Lieferantenbeurteilung aus?"',
      processDistinction:
        'Reines Prüflos (operativer Test) vs. Qualitätsmeldung (Reklamation, Eskalation, Maßnahmenverfolgung).',
    },
  },

  'scope-1ga': {
    id: 'scope-1ga',
    scopeCode: '1GA',
    name: 'Make-to-Order Production',
    businessArea: 'Production Planning & Execution (PP / S/4HANA Manufacturing)',
    headlineSummary: 'Kundeneinzelfertigung: Von der kundenauftragsspezifischen Stücklistenauflösung über Fertigungsauftrag und Kapazitätsplanung bis zur Rückmeldung und Einlagerung.',
    plainDescription:
      'Bei der Kundeneinzelfertigung (Make-to-Order) wird ein Produkt erst dann hergestellt, wenn ein Kunde es bestellt hat – oft individuell konfiguriert nach Maß (z.B. Sondermaschinen, Yachten oder maßgeschneiderte Schaltschränke). Die Materialwirtschaft und Produktion sind direkt an den jeweiligen Kundenauftrag gekoppelt: Kosten und Bestände werden auftragsspezifisch getrennt von der Serienfertigung geführt.',
    realWorldScenario:
      'Beispiel: Ein Werkzeugmaschinenhersteller baut 5-Achs-Fräsmaschinen. Ein Kunde bestellt eine Maschine mit spezifischer Spindel und Kühlmittelanlage. Erst mit Auftragseingang erzeugt das System den Fertigungsauftrag, reserviert Spezialkomponenten und sperrt die benötigten Fertigungskapazitäten in den Werkstätten.',
    sapSignificance: {
      coreModules: ['Production Planning (PP)', 'Sales & Distribution (SD)', 'Controlling (CO-PC)', 'Materials Management (MM)'],
      roleInErpEcosystem:
        '1GA demonstriert die enge Kopplung von Vertrieb und Werkshalle. In der Kostenträgerrechnung (CO-PC) wird genau ermittelt, ob der individuelle Kundenauftrag profitabel produziert wurde (Auftragsbezogenes Controlling).',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Kundenauftrag mit Einzelfertigungs-Position',
          sapObjectType: 'VBAP (Bedarfsart KEK / KBN)',
          description: 'Anstoß des auftragsspezifischen Bedarfs ohne Rückgriff auf anonymen Lagerbestand.',
          icon: '📑',
        },
        {
          stepNumber: 2,
          documentName: 'Fertigungsauftrag (Production Order)',
          sapObjectType: 'AFKO (CO01 / Manage Production Orders)',
          description: 'Planung von Arbeitsplan (Routen), Vorgängen, Rüstzeiten und Materialstückliste (BOM).',
          icon: '🏭',
        },
        {
          stepNumber: 3,
          documentName: 'Materialbereitstellung & Warenausgang',
          sapObjectType: 'MIGO (Bewegungsart 261 / Kundenauftragsbestand)',
          description: 'Entnahme von Baugruppen und Rohstoffen bezogen auf den Fertigungsauftrag.',
          icon: '📦',
        },
        {
          stepNumber: 4,
          documentName: 'Vorgangsrückmeldung (Confirmation)',
          sapObjectType: 'CO11N / Confirm Production Operations',
          description: 'Rückmeldung von Gutmenge, Ausschuss und tatsächlich benötigter Maschinen- und Personalzeit.',
          icon: '⏱️',
        },
        {
          stepNumber: 5,
          documentName: 'Wareneingang aus Produktion & Abrechnung',
          sapObjectType: 'MIGO (Bewegungsart 101 an Kundenauftragsbestand)',
          description: 'Einbuchen der fertigen Maschine in den kundeneigenen Sonderbestand zur Auslieferung.',
          icon: '🏁',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F3973 (Fiori)',
          title: 'Manage Production Orders',
          purpose: 'Zentrale Produktionsleiter-App für Auftragsfreigabe, Engpassanalyse und Status.',
        },
        {
          codeOrApp: 'CO01 / CO02 (GUI)',
          title: 'Fertigungsauftrag anlegen / ändern',
          purpose: 'Die Kern-Transaktion der diskreten Fertigung in SAP PP.',
        },
        {
          codeOrApp: 'CO11N (GUI)',
          title: 'Lohnrückmeldeschein erfassen',
          purpose: 'Rückmeldung der Produktionsfortschritte direkt aus der Werkstatt.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_PRODUCTION_ORDER_2_SRV',
        extensionGuideline:
          'MES (Manufacturing Execution Systems) binden sich über SAP Digital Manufacturing Cloud (DMC) oder standardisierte OData/REST-Schnittstellen an.',
        aiCoreUseCase:
          'Prädiktive Wartung von Werkzeugmaschinen während des Laufs sowie dynamische Reihenfolgeplanung bei Maschinenausfall.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Sonderbestand "E" (Kundenauftragsbestand): Das gefertigte Material gehört buchhalterisch bereits fest zu diesem Kundenauftrag und kann nicht anderweitig verkauft werden.',
      examRelevance:
        'Klassische Prüfungsfrage: "Vergleichen Sie Make-to-Stock (MTS) und Make-to-Order (MTO) hinsichtlich Dispositionsstrategie, Lagerhaltungsrisiko und Kostenrechnung."',
      processDistinction:
        'MTS produziert anonym auf Lager. MTO startet die Wertschöpfung erst nach bindender Kundenbestellung.',
    },
  },

  'scope-1mb': {
    id: 'scope-1mb',
    scopeCode: '1MB',
    name: 'Warehouse Inbound & Putaway',
    businessArea: 'Extended Warehouse Management (EWM / S/4HANA Supply Chain)',
    headlineSummary: 'Erweiterte Lagerlogistik: Von der Lieferaviso über Tor-Zuweisung, Entladung und Qualitätsprüfung bis zur lagerplatzgenauen Einlagerung via Lageraufgabe.',
    plainDescription:
      'In modernen Hochregal- und Distributionslagern reicht einfaches Buchen nicht aus. Im Prozess "Warehouse Inbound & Putaway" kündigt ein LKW seine Ankunft an (Lieferavis). Am Wareneingangstor wird die Palette abgeladen, gescannt und geprüft. Das System berechnet über komplexe Einlagerungsstrategien den optimalen Lagerplatz (Gewicht, Dreher-Geschwindigkeit, Temperatur) und weist einem Staplerfahrer oder Shuttle-System die Fahraufgabe zu.',
    realWorldScenario:
      'Beispiel: Ein Distributionszentrum erhält täglich 80 LKW-Ladungen Konsumgüter. Das System steuert LKW an Tor 14, erzeugt für jede Euro-Palette eine Handling Unit (Barcodelabel) und weist dem Hochregallift vollautomatisch Platz G-14-08-3 zu, um die Wegstrecken der Stapler zu minimieren.',
    sapSignificance: {
      coreModules: ['Extended Warehouse Management (EWM)', 'Materials Management (MM)', 'Transportation Management (TM)'],
      roleInErpEcosystem:
        'EWM ist die Hochleistungs-Logistiklösung von SAP für komplexe Distributionszentren, getrennt von der kaufmännischen Bestandsführung (IM).',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Anlieferung (Inbound Delivery)',
          sapObjectType: 'VL31N / /SCWM/PRDI',
          description: 'Avisierte Lieferung mit Packstücken und Handling Units.',
          icon: '🚛',
        },
        {
          stepNumber: 2,
          documentName: 'Torverwaltung & Entladung',
          sapObjectType: '/SCWM/DOOR',
          description: 'Statuswechsel: LKW am Tor angedockt, Entladung abgeschlossen.',
          icon: '🚪',
        },
        {
          stepNumber: 3,
          documentName: 'Lageraufgabe (Warehouse Task - WT)',
          sapObjectType: '/SCWM/TASK',
          description: 'Transportbefehl für den Stapler: Von der Bereitstellfläche zur Einlagerposition.',
          icon: '🚜',
        },
        {
          stepNumber: 4,
          documentName: 'Lagerauftrag & Quittierung (WT Confirmation)',
          sapObjectType: '/SCWM/TO',
          description: 'Scannen des Ziel-Lagerplatzes und endgültige Bestandsfreigabe im EWM.',
          icon: '✅',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: '/SCWM/MON (GUI/Fiori)',
          title: 'Warehouse Management Monitor',
          purpose: 'Das Kontrollzentrum des Lagerleiters für Bestände, Aufgaben und Engpässe.',
        },
        {
          codeOrApp: '/SCWM/PRDI (GUI)',
          title: 'Inbound Delivery Processing',
          purpose: 'Bearbeitung von Anlieferungen im SAP EWM.',
        },
        {
          codeOrApp: '/SCWM/RFUI (Mobile)',
          title: 'Radio Frequency UI (Mobile Datenerfassung)',
          purpose: 'Handheld-Scanner-Oberfläche für Kommissionierer und Gabelstaplerfahrer.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_WAREHOUSE_TASK_2 / EWM Inbound Services',
        extensionGuideline:
          'Fördertechnik (SPS/MFS) kommuniziert über standardisierte TCP/IP Telegramme oder SAP EWM MFS.',
        aiCoreUseCase:
          'Dynamische Slotting-Optimierung (KI berechnet saisonale Umlagerungen basierend auf historischen Pick-Raten).',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Unterschied zwischen Bestandsführung (MM-IM: Wo gehört die Ware buchhalterisch hin? Werk/Lagerort) und Lagerverwaltung (EWM: Wo steht die Palette physisch? Gang/Säule/Ebene).',
      examRelevance:
        'Logistik-Klausur: "Was ist eine Handling Unit (HU) und welche Rolle spielt die Lageraufgabe (WT) bei der Quittierung?"',
      processDistinction:
        'MM-Wareneingang bucht nur Mengen. EWM steuert physische Wege, Tore, Paletten und Scanner.',
    },
  },

  'scope-bj2': {
    id: 'scope-bj2',
    scopeCode: 'BJ2',
    name: 'Plant Maintenance & Equipment Inspection',
    businessArea: 'Plant Maintenance (PM / S/4HANA Asset Management)',
    headlineSummary: 'Instandhaltung von Betriebsanlagen: Von der Schadensmeldung über Wartungsauftrag, Arbeitssicherheit und Ersatzteilbereitstellung bis zum technischen Abschluss.',
    plainDescription:
      'Maschinen, Roboter, Förderbänder und Produktionsanlagen müssen regelmäßig gewartet und bei Defekten unverzüglich repariert werden, um teure Produktionsstillstände zu verhindern. Im Plant Maintenance Prozess meldet ein Mitarbeiter eine Anomalie. Der Instandhaltungsplaner erstellt einen Auftrag, teilt qualifizierte Schlosser oder Elektriker ein, fordert Ersatzteile an und sperrt die Anlage aus Sicherheitsgründen (Lockout/Tagout). Nach erfolgreicher Reparatur wird die Anlage wieder freigegeben.',
    realWorldScenario:
      'Beispiel: In einer Chemiefabrik zeigt eine Förderpumpe ungewöhnliche Vibrationen. Ein Schwingungssensor schlägt Alarm. Der Instandhalter erzeugt einen PM-Auftrag mit höchster Priorität, bucht neue Dichtungen aus dem Lager und vollzieht nach dem Austausch die technische Rückmeldung.',
    sapSignificance: {
      coreModules: ['Plant Maintenance (PM / Asset Management)', 'Production Planning (PP)', 'Materials Management (MM)', 'Controlling (CO)'],
      roleInErpEcosystem:
        'BJ2 schützt das Anlagevermögen des Unternehmens. Die Kosten für Instandhaltung fließen direkt in die Kostenstellen der betroffenen Produktionsbereiche.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Instandhaltungsmeldung (Maintenance Notification)',
          sapObjectType: 'QMEL (IW21 / Manage Maintenance Notifications)',
          description: 'Erfassung des Schadensbildes am Technischen Platz oder Equipment.',
          icon: '⚠️',
        },
        {
          stepNumber: 2,
          documentName: 'Instandhaltungsauftrag (Maintenance Order)',
          sapObjectType: 'AFIH (IW31 / Manage Maintenance Orders)',
          description: 'Planung von Vorgängen, Werkzeugen, Sicherheitsvorschriften und Material.',
          icon: '🔧',
        },
        {
          stepNumber: 3,
          documentName: 'Arbeitsfreigabe & Permit (Safety WCM)',
          sapObjectType: 'Work Clearance Management',
          description: 'Sicherheitsabschaltung und Freigabe für Instandhaltungspersonal.',
          icon: '🦺',
        },
        {
          stepNumber: 4,
          documentName: 'Technischer Abschluss (TECO)',
          sapObjectType: 'Status TECO / Technical Completion',
          description: 'Anlage läuft wieder; keine weiteren operativen Buchungen erlaubt.',
          icon: '🏁',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F2071 (Fiori)',
          title: 'Manage Maintenance Orders',
          purpose: 'Moderne App für Instandhaltungsleiter zur Einsatz- und Budgetüberwachung.',
        },
        {
          codeOrApp: 'IW31 / IW32 (GUI)',
          title: 'Instandhaltungsauftrag anlegen / ändern',
          purpose: 'Klassische Plant Maintenance Transaktion.',
        },
        {
          codeOrApp: 'IW21 (GUI)',
          title: 'Instandhaltungsmeldung anlegen',
          purpose: 'Erfassung von Schadensursachen und Stillstandszeiten.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_MAINTENANCEORDER / Maintenance Notification API',
        extensionGuideline:
          'Predictive Maintenance IoT Daten werden über SAP Asset Performance Management (APM) auf der BTP aggregiert.',
        aiCoreUseCase:
          'Predictive Maintenance: Vorhersage von Lagerdefekten anhand von Vibrations- und Temperatur-Telemetriedaten.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Strukturierung des Anlagevermögens: Technischer Platz (ortsbezogen, z.B. Gebäude 4, Halle 2, Linie 1) vs. Equipment (physisches Objekt, z.B. Pumpe Seriennr. 44021).',
      examRelevance:
        'Prüfungsfrage: "Wie unterscheidet sich vorbeugende (präventive) Instandhaltung von korrektiver Instandhaltung in SAP PM?"',
      processDistinction:
        'PM (BJ2) repariert EIGENE Maschinen des Werks. CS (2F1) repariert KUNDEN-Maschinen gegen Entgelt.',
    },
  },

  'scope-1b6': {
    id: 'scope-1b6',
    scopeCode: '1B6',
    name: 'Lead-to-Opportunity & Sales Pipeline',
    businessArea: 'Sales Cloud / CX / CRM (S/4HANA Sales Pipeline)',
    headlineSummary: 'Vertriebsanbahnung und Neukundengewinnung: Von der Marketing-Kampagne und Lead-Qualifizierung über die Opportunity bis zum abschlussreifen Angebot.',
    plainDescription:
      'Bevor überhaupt ein Kundenauftrag entstehen kann, muss Vertrieb betrieben werden. Im Prozess Lead-to-Opportunity generiert das Marketing Kontakte (Leads, z.B. über Webseiten, Messen oder Whitepaper). Der Vertrieb qualifiziert diesen Lead: Hat das Unternehmen Budget, Bedarf und Entscheidungsbefugnis (BANT-Kriterien)? Wenn ja, wird eine Opportunity eröffnet, Verhandlungen geführt und schließlich ein verbindliches Angebot erstellt.',
    realWorldScenario:
      'Beispiel: Ein Software-Hersteller veranstaltet ein Webinar über Cloud-Sicherheit mit 500 Teilnehmern. Ein Teilnehmer lädt die Testversion herunter. Das System stuft ihn als "Hot Lead" ein, weist ihn einem Account Executive zu und eröffnet nach dem ersten Telefonat eine Opportunity über 150.000 € Lizenzvolumen.',
    sapSignificance: {
      coreModules: ['SAP Sales Cloud (C/4HANA)', 'S/4HANA Sales (SD)', 'SAP Marketing Cloud'],
      roleInErpEcosystem:
        '1B6 bildet die Front-End-Kundeninteraktion ab. Sobald die Verhandlung erfolgreich ist, wird die gewonnene Opportunity nahtlos in einen S/4HANA Kundenauftrag (BD9) überführt.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Lead (Interessentenkontakt)',
          sapObjectType: 'BUS2000108 / Lead',
          description: 'Rohkontakt aus Marketingaktivität mit Qualifizierungsstatus.',
          icon: '🎯',
        },
        {
          stepNumber: 2,
          documentName: 'Opportunity (Verkaufschance)',
          sapObjectType: 'BUS2000111 / Opportunity',
          description: 'Strukturierte Verkaufschance mit erwartetem Umsatz, Abschlusswahrscheinlichkeit und Phasenplan.',
          icon: '💼',
        },
        {
          stepNumber: 3,
          documentName: 'Kundenangebot (Sales Quotation)',
          sapObjectType: 'BUS2031 (VA21 / Quotation)',
          description: 'Verbindliches kaufmännisches Angebot mit Preisen, Rabatten und Gültigkeitsdauer.',
          icon: '📜',
        },
        {
          stepNumber: 4,
          documentName: 'Auftragsgewinn (Won) & Folgeauftrag',
          sapObjectType: 'Kundenauftrag VA01',
          description: 'Abschluss der Opportunity und Übergabe an die Logistikkette.',
          icon: '🎉',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'Sales Cloud Fiori',
          title: 'Opportunity Management',
          purpose: 'Pipeline-Dashboard für Vertriebsleiter und Account Manager.',
        },
        {
          codeOrApp: 'VA21 / VA22 (GUI)',
          title: 'Verkaufsangebot anlegen / pflegen',
          purpose: 'Erstellung von ERP-Angeboten im S/4HANA Kern.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: Opportunity API / Lead Management API (Sales Cloud)',
        extensionGuideline:
          'Integration zwischen SAP Sales Cloud und S/4HANA über SAP Master Data Integration (MDI) für harmonisierte Geschäftspartner (Business Partner).',
        aiCoreUseCase:
          'Predictive Lead Scoring und generative Zusammenfassung von Meeting-Transkripten direkt in den CRM-Aktivitäten.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Der Vertriebstrichter (Sales Funnel): Umrechnung von Leads in Opportunities (Conversion Rate) und Gewichtung der Pipeline nach Abschlusswahrscheinlichkeit.',
      examRelevance:
        'Wirtschaftsinformatik-Grundlage: "Wie fließen Opportunity-Daten in das Vertriebs- und Finanz-Forecasting eines Konzerns ein?"',
      processDistinction:
        'Lead/Opportunity sind vertriebliche Vorstufen ohne Auswirkung auf Hauptbuch und Bestand. Erst der Folgebeleg (Kundenauftrag) startet die logistische ERP-Kette.',
    },
  },

  'scope-1e6': {
    id: 'scope-1e6',
    scopeCode: '1E6',
    name: 'Supplier Onboarding & Qualification',
    businessArea: 'Supplier Management (SRM / SAP Ariba / S/4HANA Sourcing)',
    headlineSummary: 'Lieferantenqualifizierung und Stammdatenpflege: Von der Selbstregistrierung über ESG-/Nachhaltigkeitsprüfung bis zur Freigabe als SAP Business Partner.',
    plainDescription:
      'Große Unternehmen dürfen nicht einfach bei beliebigen Anbietern einkaufen – sie müssen gesetzliche Vorgaben (wie das Lieferkettensorgfaltspflichtengesetz LkSG, Antikorruption, ISO-Zertifikate) erfüllen. Im Prozess "Supplier Onboarding & Qualification" registriert sich ein neuer Lieferant selbst über ein Portal, lädt Zertifikate hoch und beantwortet Fragebögen. Nach Prüfung durch Einkauf und Compliance wird der Lieferant offiziell im SAP-System als verifizierter Geschäftspartner (Business Partner) aktiviert.',
    realWorldScenario:
      'Beispiel: Ein Automobilhersteller sucht einen neuen Zulieferer für Elektronikchips aus Asien. Der Kandidat muss im Supplier-Portal ISO 27001 Zertifikate, Arbeitsrechts-Audits und Bankbestätigungen hochladen. Erst nach Bestehen des automatisierten Prüf-Workflows wird der Lieferant im S/4HANA als kreditorischer Business Partner angelegt.',
    sapSignificance: {
      coreModules: ['SAP Ariba Supplier Management', 'S/4HANA Master Data (MDM)', 'Governance, Risk and Compliance (GRC)'],
      roleInErpEcosystem:
        '1E6 ist die Grundvoraussetzung für saubere Stammdaten im Einkauf. Nur qualifizierte Lieferanten dürfen an Ausschreibungen teilnehmen oder Bestellungen empfangen.',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Lieferanten-Registrierung (Supplier Registration)',
          sapObjectType: 'Self-Service Portal / Ariba SLP',
          description: 'Eingabe von Stammdaten, Bankverbindungen und Steuernummern durch den Lieferanten.',
          icon: '🌐',
        },
        {
          stepNumber: 2,
          documentName: 'Qualifizierungs-Fragebogen (Qualification Survey)',
          sapObjectType: 'SLP Questionnaire',
          description: 'Beantwortung von Nachhaltigkeits-, Compliance- und Qualitätsfragen.',
          icon: '📝',
        },
        {
          stepNumber: 3,
          documentName: 'Compliance- & Bonitätsprüfung (Sanction Screening)',
          sapObjectType: 'SAP Watch List Screening',
          description: 'Automatischer Abgleich gegen internationale Sanktionslisten und Bonitätsprüfungen.',
          icon: '🛡️',
        },
        {
          stepNumber: 4,
          documentName: 'Business Partner Aktivierung',
          sapObjectType: 'BUT000 / Transaktion BP',
          description: 'Erzeugung des SAP S/4HANA Geschäftspartners in der Rolle Lieferant (FLVN00/FLVN01).',
          icon: '🤝',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'BP (GUI)',
          title: 'Maintain Business Partner',
          purpose: 'Die zentrale S/4HANA Transaktion für alle Kunden, Lieferanten und Partner.',
        },
        {
          codeOrApp: 'Fiori Manage Supplier Master Data',
          title: 'Lieferantenstammdaten verwalten',
          purpose: 'Übersicht über Buchungskreise, Einkaufsorgs und Bankdaten.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_BUSINESS_PARTNER',
        extensionGuideline:
          'Harmonisierung von Stammdaten über SAP Master Data Governance (MDG). Keine direkten Inserts in KNA1/LFA1!',
        aiCoreUseCase:
          'Automatisierte Extraktion und Validierung von PDF-Zertifikaten (Gültigkeitsdauer, Akkreditierungsstellen) via Document AI.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'Das Business Partner (BP) Konzept in S/4HANA: Vorbei sind die Zeiten getrennter Kunden (Debitor) und Lieferanten (Kreditor) – in S/4HANA ist jedes Subjekt ein zentraler "Business Partner" mit verschiedenen Rollen.',
      examRelevance:
        'Standardfrage zur S/4HANA Migration: "Erklären Sie den Übergang vom klassischen ERP-Kreditor (LFA1) zum S/4HANA Business Partner Konzept."',
      processDistinction:
        'Stammdatenprozess (1E6) vs. Transaktionsprozess (J45): 1E6 bereitet das Fundament vor; J45 wickelt das eigentliche Geschäft ab.',
    },
  },
};

export const PROCESS_KNOWLEDGE_EN: Record<string, ProcessKnowledgeItem> = {
  'scope-2f1': {
    id: 'scope-2f1',
    scopeCode: '2F1',
    name: 'Service Order Management',
    businessArea: 'Customer Service (CS / S/4HANA Service)',
    headlineSummary: 'End-to-End customer service and repair lifecycle from incident ingestion to field technician dispatch and time/material billing.',
    plainDescription:
      'Service Order Management is all about helping customers quickly and reliably when their products or industrial machines break down or need scheduled maintenance. When a customer reports a malfunction, the business verifies warranties and service contracts, plans technicians and spare parts, carries out on-site repair or depot maintenance, and invoices labor hours and consumed parts transparently.',
    realWorldScenario:
      'Example: A bakery chain operates 50 stores with high-end commercial coffee machines. In store #7, the brewing unit fails. The store manager reports the failure. The system immediately identifies the exact equipment by serial number, verifies SLA terms (<4h response), reserves spare parts in the warehouse, and dispatches the closest technician.',
    sapSignificance: {
      coreModules: ['S/4HANA Service', 'Customer Service (CS)', 'Plant Maintenance (PM)', 'Controlling (CO)', 'Finance (FI)', 'Field Service Management (FSM)'],
      roleInErpEcosystem:
        'Service Order Management bridges customer relationships (CRM) with core ERP logistics and financials. In SAP, a service order is not just a support ticket, but a cost-collecting controlling object that integrates goods movements, internal work times (CATS), and revenue postings (CO-PA).',
      documentFlow: [
        {
          stepNumber: 1,
          documentName: 'Service Notification',
          sapObjectType: 'BUS2038 / Service Notification',
          description: 'Capturing incident details, damage codes, priority, and customer contacts.',
          icon: '📩',
        },
        {
          stepNumber: 2,
          documentName: 'Service Order',
          sapObjectType: 'BUS2007 / CRMS4_ORDER',
          description: 'Planning operations (technician hours), material components, and cost estimates.',
          icon: '🛠️',
        },
        {
          stepNumber: 3,
          documentName: 'Goods Issue for Spare Parts',
          sapObjectType: 'Material Document (MIGO / Movement Type 261)',
          description: 'Consuming spare parts from stock and debiting order expense.',
          icon: '📦',
        },
        {
          stepNumber: 4,
          documentName: 'Service Confirmation',
          sapObjectType: 'CATS / Service Confirmation',
          description: 'Recording actual technician labor hours and travel expenses.',
          icon: '⏱️',
        },
        {
          stepNumber: 5,
          documentName: 'Billing & Invoice',
          sapObjectType: 'DMR (Debit Memo Request) & Billing Doc (VF01)',
          description: 'Invoicing the customer on time-and-material basis or flat rate.',
          icon: '💶',
        },
      ],
      keyTransactionsAndApps: [
        {
          codeOrApp: 'F4602 (Fiori)',
          title: 'Manage Service Orders',
          purpose: 'Modern S/4HANA Fiori app for tracking, dispatching, and releasing service orders.',
        },
        {
          codeOrApp: 'IW31 / IW32 (GUI)',
          title: 'Create / Change Service Order',
          purpose: 'Classic SAP GUI transaction for detailed operational work breakdown.',
        },
        {
          codeOrApp: 'CRMS4_SERV_ORDER (GUI/Fiori)',
          title: 'S/4HANA Service Order',
          purpose: 'Standard document type in modernized S/4HANA Enterprise Service Management.',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData v4: API_SERVICE_ORDER_SRV / Service Order (A2X)',
        extensionGuideline:
          'Keep core clean: Implement custom scheduling and technician mobile apps side-by-side on SAP BTP. Emit business events via SAP Event Mesh.',
        aiCoreUseCase:
          'Automated damage classification from customer free text via LLMs; predictive spare part forecasting.',
      },
    },
    studentTakeaways: {
      keyConcept:
        'A service order has a dual nature: An operational job card for technicians and an internal cost collector in Controlling (CO).',
      examRelevance:
        'Key exam question: "Differentiate between a Sales Order (SD), a Service Order (CS), and a Plant Maintenance Order (PM)."',
      processDistinction:
        'Sales Order (SD/BD9) sells standard goods. Plant Maintenance (PM/BJ2) repairs company-OWNED assets. Service Order (CS/2F1) repairs CUSTOMER equipment for billing.',
    },
  },

  'scope-bd9': {
    id: 'scope-bd9',
    scopeCode: 'BD9',
    name: 'Sell from Stock (Order-to-Cash)',
    businessArea: 'Sales & Distribution (SD / S/4HANA Sales)',
    headlineSummary: 'The archetypal sales process: From customer purchase order and credit/ATP check to picking, delivery, goods issue, and customer invoicing.',
    plainDescription:
      'Sell from Stock is the foundation of wholesale and manufacturing. A customer orders standard products that are already in inventory. The ERP checks availability in real-time and verifies customer credit. Then the warehouse picks, packs, and ships the goods, followed by automated invoicing.',
    realWorldScenario:
      'Example: A building material supplier receives an email purchase order for 500 bags of cement. The system parses the PDF, resolves customer and material numbers, executes an ATP check, verifies credit limits, and immediately generates the sales order.',
    sapSignificance: {
      coreModules: ['Sales & Distribution (SD)', 'Materials Management (MM)', 'Financial Accounting (FI)', 'Controlling (CO)'],
      roleInErpEcosystem:
        'BD9 is the benchmark scope item for Order-to-Cash (O2C). It records company revenues and links logistics directly to the general ledger.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Sales Inquiry / Quotation', sapObjectType: 'BUS2031 (VA11 / VA21)', description: 'Customer price inquiries or firm quotations.', icon: '📝' },
        { stepNumber: 2, documentName: 'Sales Order', sapObjectType: 'BUS2032 (VA01 / Manage Sales Orders)', description: 'Legally binding contract with pricing and ATP.', icon: '📑' },
        { stepNumber: 3, documentName: 'Outbound Delivery', sapObjectType: 'LIKP (VL01N)', description: 'Triggers warehouse picking and packing.', icon: '📦' },
        { stepNumber: 4, documentName: 'Goods Issue', sapObjectType: 'Material Doc (MIGO / Mov. Type 601)', description: 'Ownership transfer: Decreases inventory and posts COGS.', icon: '🚚' },
        { stepNumber: 5, documentName: 'Customer Invoice', sapObjectType: 'VBRK / BKPF (VF01)', description: 'Accounts Receivable posting: Customer debit vs. sales revenue.', icon: '💰' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'F0842A (Fiori)', title: 'Manage Sales Orders', purpose: 'Modern S/4HANA Fiori App.' },
        { codeOrApp: 'VA01 / VA02 / VA03 (GUI)', title: 'Create / Change Sales Order', purpose: 'Standard SAP SD transaction.' },
        { codeOrApp: 'VL01N / VF01 (GUI)', title: 'Outbound Delivery & Invoicing', purpose: 'Shipping and billing execution.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData v4: API_SALES_ORDER_SRV',
        extensionGuideline: 'Use SAP BTP for custom portal extensions and SAP Event Mesh for real-time order status.',
        aiCoreUseCase: 'Document Grounding for PDF extraction and fuzzy trigram matching for customer catalog numbers.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Document flow provides strict auditability (GoBD/SOX) from order to bank statement.',
      examRelevance: 'Classic question: "Explain the balance sheet impacts of Goods Issue vs. Billing Document."',
      processDistinction: 'Sell from Stock (BD9) sells existing inventory. Make-to-Order (1GA) triggers production only after order intake.',
    },
  },

  'scope-j60': {
    id: 'scope-j60',
    scopeCode: 'J60',
    name: 'Invoice Processing (Accounts Payable)',
    businessArea: 'Financial Accounting (FI-AP / S/4HANA Finance)',
    headlineSummary: 'Accounts Payable processing with automated 3-Way Match (Purchase Order vs. Goods Receipt vs. Supplier Invoice) and payment clearing.',
    plainDescription:
      'When buying goods or services from vendors, supplier invoices must be strictly verified before money is paid out. The system checks whether goods were ordered, delivered, and accurately priced (3-Way Matching). Once reconciled, the invoice is posted and scheduled for automated payment.',
    realWorldScenario:
      'Example: An automotive supplier receives 40,000 monthly invoices. An invoice for 12,500 € arrives via PDF. Document AI extracts line items. The system matches it against the purchase order and goods receipt without manual intervention.',
    sapSignificance: {
      coreModules: ['Financial Accounting (FI-AP)', 'Materials Management (MM-IV)', 'Controlling (CO)'],
      roleInErpEcosystem: 'J60 concludes Procure-to-Pay (P2P), clearing the GR/IR (Goods Receipt/Invoice Receipt) clearing account.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Inbound Supplier Invoice', sapObjectType: 'PDF / XML / Peppol', description: 'Arrives via email or e-invoicing network.', icon: '📥' },
        { stepNumber: 2, documentName: '3-Way Matching', sapObjectType: 'MM-IV Logic', description: 'Reconciles PO + Goods Receipt + Invoice.', icon: '⚖️' },
        { stepNumber: 3, documentName: 'Logistics & Accounting Document', sapObjectType: 'RBKP & BKPF', description: 'Debit GR/IR account, Credit Vendor liability.', icon: '📑' },
        { stepNumber: 4, documentName: 'Payment Run', sapObjectType: 'F110 / Manage Automatic Payments', description: 'Executes bank transfer and clears open items.', icon: '💳' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'F0859 (Fiori)', title: 'Manage Supplier Invoices', purpose: 'S/4HANA invoice verification.' },
        { codeOrApp: 'MIRO (GUI)', title: 'Enter Incoming Invoice', purpose: 'Standard logistics invoice verification.' },
        { codeOrApp: 'F110 (GUI)', title: 'Automatic Payment Run', purpose: 'Mass batch payment clearing.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_SUPPLIERINVOICE_PROCESS_SRV',
        extensionGuideline: 'Use SAP Document Information Extraction (DOX) on BTP. Never bypass core FI posting rules.',
        aiCoreUseCase: 'Cash discount optimization, fraud prevention, and GL account coding prediction.',
      },
    },
    studentTakeaways: {
      keyConcept: 'The GR/IR clearing account: A temporary liability account reconciled upon invoice posting.',
      examRelevance: 'Accounting classic: "How does the GR/IR account balance out after goods receipt and invoice receipt?"',
      processDistinction: 'Accounts Payable (J60) verifies vendor bills (liabilities). Invoicing (SD) sends customer bills (receivables).',
    },
  },

  'scope-j45': {
    id: 'scope-j45',
    scopeCode: 'J45',
    name: 'Procurement of Direct Materials',
    businessArea: 'Materials Management (MM-PUR / Sourcing & Procurement)',
    headlineSummary: 'Direct material purchasing: From Purchase Requisition and PO dispatch to Goods Receipt and stock increase.',
    plainDescription:
      'To manufacture products, raw materials must be procured. Production or MRP detects a shortage, generates an internal Purchase Requisition, and procurement places a Purchase Order with a vendor. Upon delivery, materials are checked and booked into plant storage.',
    realWorldScenario:
      'Example: MRP identifies a need for 200 hydraulic valves. The system automatically creates a PO against an existing outline agreement and transmits it via EDI.',
    sapSignificance: {
      coreModules: ['Materials Management (MM)', 'Production Planning (PP)', 'Quality Management (QM)', 'Finance (FI)'],
      roleInErpEcosystem: 'Logistical backbone of supply chain continuity, tightly integrated with MRP Live.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Purchase Requisition (Banf)', sapObjectType: 'EBAN', description: 'Internal material demand.', icon: '📋' },
        { stepNumber: 2, documentName: 'Purchase Order (PO)', sapObjectType: 'EKKO', description: 'Legally binding order to vendor.', icon: '📤' },
        { stepNumber: 3, documentName: 'Goods Receipt', sapObjectType: 'MIGO (Mov. Type 101)', description: 'Stock increase and GR/IR posting.', icon: '📥' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'F0842 (Fiori)', title: 'Manage Purchase Orders', purpose: 'Fiori purchasing hub.' },
        { codeOrApp: 'ME21N (GUI)', title: 'Create Purchase Order', purpose: 'Standard procurement transaction.' },
        { codeOrApp: 'MIGO (GUI)', title: 'Goods Movement', purpose: 'Receiving and inventory postings.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_PURCHASEORDER_PROCESS_SRV',
        extensionGuideline: 'Flexible Workflow for approval policies; side-by-side supplier collaboration via BTP.',
        aiCoreUseCase: 'Predictive delivery delay warnings and automated supplier risk scoring.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Internal requisition (Banf) vs. external legally binding contract (Purchase Order).',
      examRelevance: '"Which general ledger accounts are affected upon Goods Receipt of raw materials?"',
      processDistinction: 'Direct Materials (part of bill of materials) vs. Indirect / MRO purchasing.',
    },
  },

  'scope-2b6': {
    id: 'scope-2b6',
    scopeCode: '2B6',
    name: 'Quality Inspection & Complaint Management',
    businessArea: 'Quality Management (QM / S/4HANA Quality)',
    headlineSummary: 'Quality assurance at goods receipt and customer complaints: From inspection lot and results recording to usage decision and 8D reports.',
    plainDescription:
      'Quality inspection ensures delivered parts and produced items meet strict specifications. Incoming goods are placed in inspection stock. Inspectors test tolerances. If accepted, goods are released to unrestricted stock; if rejected, a quality notification and complaint are triggered.',
    realWorldScenario:
      'Example: Medical screws arrive. The system creates an inspection lot. Thread dimensions are out of tolerance. The usage decision blocks the lot and sends an 8D report to the supplier.',
    sapSignificance: {
      coreModules: ['Quality Management (QM)', 'Materials Management (MM)', 'Sales & Distribution (SD)'],
      roleInErpEcosystem: 'Enforces ISO 9001 and regulatory compliance, directly controlling inventory availability.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Inspection Lot Creation', sapObjectType: 'QALS', description: 'Auto-generated on goods receipt.', icon: '🧪' },
        { stepNumber: 2, documentName: 'Results Recording', sapObjectType: 'QASR', description: 'Recording measurements.', icon: '📊' },
        { stepNumber: 3, documentName: 'Usage Decision', sapObjectType: 'QAVE', description: 'Stock release or rejection.', icon: '⚖️' },
        { stepNumber: 4, documentName: 'Quality Notification', sapObjectType: 'QMEL', description: 'Complaint and corrective action.', icon: '⚠️' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'F2343 (Fiori)', title: 'Record Inspection Results', purpose: 'Fiori quality testing app.' },
        { codeOrApp: 'QA11 (GUI)', title: 'Record Usage Decision', purpose: 'Final stock disposition.' },
        { codeOrApp: 'QM01 (GUI)', title: 'Create Quality Notification', purpose: 'Customer/vendor complaint logging.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_INSPECTIONLOT_SRV',
        extensionGuideline: 'Connect IoT test benches via BTP REST endpoints.',
        aiCoreUseCase: 'Visual inspection via Computer Vision and automated root cause extraction from complaint text.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Inventory stock types: Unrestricted stock vs. Quality inspection stock vs. Blocked stock.',
      examRelevance: '"Explain the logistical consequences of a negative Usage Decision in SAP QM."',
      processDistinction: 'Inspection Lot (testing) vs. Quality Notification (problem logging and escalation).',
    },
  },

  'scope-1ga': {
    id: 'scope-1ga',
    scopeCode: '1GA',
    name: 'Make-to-Order Production',
    businessArea: 'Production Planning & Execution (PP / Manufacturing)',
    headlineSummary: 'Custom manufacturing tied directly to sales orders: BOM explosion, capacity scheduling, order confirmation, and finished goods stock.',
    plainDescription:
      'In Make-to-Order (MTO), products are only manufactured once an individual customer order is placed. The production order is directly linked to the sales order, keeping costs and stock strictly isolated from anonymous mass production.',
    realWorldScenario:
      'Example: A customized 5-axis CNC milling machine is ordered. Production order scheduling begins only upon sales contract confirmation, reserving specialized spindle components.',
    sapSignificance: {
      coreModules: ['Production Planning (PP)', 'Sales & Distribution (SD)', 'Controlling (CO-PC)', 'MM'],
      roleInErpEcosystem: 'Demonstrates tightly coupled sales and shop-floor execution with dedicated order-related controlling.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Sales Order (MTO Item)', sapObjectType: 'VBAP', description: 'Sales demand triggers MTO planning.', icon: '📑' },
        { stepNumber: 2, documentName: 'Production Order', sapObjectType: 'AFKO (CO01)', description: 'Routing, operations, and BOM components.', icon: '🏭' },
        { stepNumber: 3, documentName: 'Component Goods Issue', sapObjectType: 'MIGO (Mov. 261)', description: 'Consuming raw materials against the order.', icon: '📦' },
        { stepNumber: 4, documentName: 'Operation Confirmation', sapObjectType: 'CO11N', description: 'Confirming labor and machine hours.', icon: '⏱️' },
        { stepNumber: 5, documentName: 'Goods Receipt from Production', sapObjectType: 'MIGO (Mov. 101 E)', description: 'Receiving finished machine into sales order stock.', icon: '🏁' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'F3973 (Fiori)', title: 'Manage Production Orders', purpose: 'Supervisor production dispatching.' },
        { codeOrApp: 'CO01 (GUI)', title: 'Create Production Order', purpose: 'Standard discrete manufacturing order.' },
        { codeOrApp: 'CO11N (GUI)', title: 'Order Confirmation', purpose: 'Shop floor progress tracking.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_PRODUCTION_ORDER_2_SRV',
        extensionGuideline: 'MES integration through SAP Digital Manufacturing Cloud (DMC) or standard APIs.',
        aiCoreUseCase: 'Predictive tool wear forecasting and dynamic machine rescheduling upon breakdown.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Special Stock "E" (Sales Order Stock): Goods are legally and financially dedicated to this specific customer order.',
      examRelevance: '"Contrast Make-to-Stock (MTS) and Make-to-Order (MTO) regarding inventory risk and cost accounting."',
      processDistinction: 'MTS builds to forecast; MTO starts production only upon customer commitment.',
    },
  },

  'scope-1mb': {
    id: 'scope-1mb',
    scopeCode: '1MB',
    name: 'Warehouse Inbound & Putaway',
    businessArea: 'Extended Warehouse Management (EWM / Supply Chain)',
    headlineSummary: 'High-performance warehousing: Advanced shipping notification, dock door scheduling, warehouse tasks, and bin putaway.',
    plainDescription:
      'In large distribution centers, goods receipt requires bin-level coordination. The truck arrives at an assigned dock door, goods are scanned into Handling Units, and intelligent putaway strategies compute the ideal storage bin before warehouse tasks guide forklift operators.',
    realWorldScenario:
      'Example: 80 daily truckloads arrive at a logistics hub. Barcode pallets are scanned at Door 14, and high-bay shuttles store pallets in slot G-14-08-3 automatically.',
    sapSignificance: {
      coreModules: ['Extended Warehouse Management (EWM)', 'Materials Management (MM)', 'Transportation Management (TM)'],
      roleInErpEcosystem: 'Handles physical warehouse bin topology separately from financial inventory management.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Inbound Delivery', sapObjectType: 'VL31N / /SCWM/PRDI', description: 'Advanced shipping notification.', icon: '🚛' },
        { stepNumber: 2, documentName: 'Dock Door & Unloading', sapObjectType: '/SCWM/DOOR', description: 'Dock appointment and pallet staging.', icon: '🚪' },
        { stepNumber: 3, documentName: 'Warehouse Task (WT)', sapObjectType: '/SCWM/TASK', description: 'Putaway routing instruction.', icon: '🚜' },
        { stepNumber: 4, documentName: 'Task Confirmation', sapObjectType: '/SCWM/TO', description: 'Forklift driver scans destination bin.', icon: '✅' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: '/SCWM/MON (GUI/Fiori)', title: 'Warehouse Management Monitor', purpose: 'Control center for warehouse operations.' },
        { codeOrApp: '/SCWM/RFUI (Mobile)', title: 'Radio Frequency Mobile UI', purpose: 'Barcode scanner handheld interface.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_WAREHOUSE_TASK_2',
        extensionGuideline: 'Integrate automated guided vehicles (AGV) via BTP IoT or SAP Warehouse Robotics.',
        aiCoreUseCase: 'Dynamic slotting optimization based on seasonal picking frequencies.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Inventory Management (MM-IM: Valuation & balance sheet) vs. Warehouse Management (EWM: Exact physical coordinates & routes).',
      examRelevance: '"Define a Handling Unit (HU) and explain how Warehouse Tasks ensure bin-level integrity."',
      processDistinction: 'MM-IM manages quantities on storage locations; EWM manages bins, racks, and forklifts.',
    },
  },

  'scope-bj2': {
    id: 'scope-bj2',
    scopeCode: 'BJ2',
    name: 'Plant Maintenance & Equipment Inspection',
    businessArea: 'Plant Maintenance (PM / S/4HANA Asset Management)',
    headlineSummary: 'Industrial asset upkeep: From anomaly notification and work order scheduling to safety clearance, repair, and technical completion (TECO).',
    plainDescription:
      'Factory machinery and infrastructure must be kept running smoothly. When an operator notices vibrations or an alarm goes off, an alert is logged. The maintenance planner schedules technicians, orders replacement parts, verifies safety lockouts, and records work history for compliance.',
    realWorldScenario:
      'Example: A pump in a chemical plant exhibits anomalous bearing vibrations. Telemetry triggers a maintenance order. Electricians isolate the circuit, swap the seal, and perform technical completion.',
    sapSignificance: {
      coreModules: ['Plant Maintenance (PM / Asset Management)', 'Production Planning (PP)', 'MM', 'CO'],
      roleInErpEcosystem: 'Protects capital assets and directly debits production cost centers for maintenance expenses.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Maintenance Notification', sapObjectType: 'QMEL (IW21)', description: 'Damage description on equipment.', icon: '⚠️' },
        { stepNumber: 2, documentName: 'Maintenance Order', sapObjectType: 'AFIH (IW31)', description: 'Operations, components, and permits.', icon: '🔧' },
        { stepNumber: 3, documentName: 'Safety Work Clearance', sapObjectType: 'WCM', description: 'Lockout/Tagout verification.', icon: '🦺' },
        { stepNumber: 4, documentName: 'Technical Completion (TECO)', sapObjectType: 'Status TECO', description: 'Asset returned to service.', icon: '🏁' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'F2071 (Fiori)', title: 'Manage Maintenance Orders', purpose: 'Maintenance manager cockpit.' },
        { codeOrApp: 'IW31 (GUI)', title: 'Create Maintenance Order', purpose: 'Standard plant maintenance transaction.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_MAINTENANCEORDER',
        extensionGuideline: 'Aggregate telemetry data on SAP Asset Performance Management (APM).',
        aiCoreUseCase: 'Predictive maintenance failure forecasting from vibration and temperature sensor data.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Functional Location (spatial hierarchy) vs. Equipment (specific serialized physical machine).',
      examRelevance: '"Contrast preventive maintenance against corrective maintenance in SAP PM."',
      processDistinction: 'PM (BJ2) repairs INTERNAL factory machinery. CS (2F1) repairs EXTERNAL customer machines for money.',
    },
  },

  'scope-1b6': {
    id: 'scope-1b6',
    scopeCode: '1B6',
    name: 'Lead-to-Opportunity & Sales Pipeline',
    businessArea: 'Sales Cloud / CX / CRM (S/4HANA Sales Pipeline)',
    headlineSummary: 'Sales pipeline generation: From marketing campaign lead qualification and opportunity management to binding customer quotation.',
    plainDescription:
      'Before a sales contract can be signed, commercial opportunities must be nurtured. Marketing generates leads. Sales reps qualify the prospect (budget, authority, timeline). If viable, an Opportunity is opened, negotiation milestones are tracked, and a formal quotation is issued.',
    realWorldScenario:
      'Example: A software webinar attracts 500 attendees. An enterprise buyer downloads a trial. The system flags a "Hot Lead", assigns an account executive, and opens a 150k € sales opportunity.',
    sapSignificance: {
      coreModules: ['SAP Sales Cloud (CX)', 'S/4HANA Sales (SD)', 'SAP Marketing Cloud'],
      roleInErpEcosystem: 'Front-end engagement layer that seamlessly converts won deals into standard S/4HANA sales orders (BD9).',
      documentFlow: [
        { stepNumber: 1, documentName: 'Lead', sapObjectType: 'BUS2000108', description: 'Unqualified prospect interest.', icon: '🎯' },
        { stepNumber: 2, documentName: 'Opportunity', sapObjectType: 'BUS2000111', description: 'Qualified deal with expected volume.', icon: '💼' },
        { stepNumber: 3, documentName: 'Sales Quotation', sapObjectType: 'BUS2031 (VA21)', description: 'Binding commercial proposal.', icon: '📜' },
        { stepNumber: 4, documentName: 'Won Deal & Sales Order', sapObjectType: 'VA01', description: 'Handoff into standard ERP execution.', icon: '🎉' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'Sales Cloud Fiori', title: 'Opportunity Pipeline', purpose: 'Pipeline and forecast dashboard.' },
        { codeOrApp: 'VA21 (GUI)', title: 'Create Sales Quotation', purpose: 'S/4HANA core pricing and quotation.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: Opportunity API / Lead Management API',
        extensionGuideline: 'Harmonize business partners across CX and S/4HANA via SAP Master Data Integration (MDI).',
        aiCoreUseCase: 'Predictive lead scoring and automated meeting transcript summarization.',
      },
    },
    studentTakeaways: {
      keyConcept: 'Sales funnel stages and conversion probabilities: Weighting pipeline values for reliable forecasting.',
      examRelevance: '"How does an Opportunity transform into an ERP document flow upon being won?"',
      processDistinction: 'Leads and Opportunities are pre-sales records with no financial ledger entries until an order is placed.',
    },
  },

  'scope-1e6': {
    id: 'scope-1e6',
    scopeCode: '1E6',
    name: 'Supplier Onboarding & Qualification',
    businessArea: 'Supplier Management (SRM / SAP Ariba / S/4HANA Sourcing)',
    headlineSummary: 'Supplier governance: From self-registration and ESG/compliance vetting to activation as an official SAP Business Partner.',
    plainDescription:
      'Enterprises cannot buy from unverified vendors due to strict supply chain laws, anti-corruption rules, and quality standards. In this process, a potential vendor registers via a supplier portal, submits ISO certificates, and completes ESG audits. Once vetted, they are approved as an SAP Business Partner.',
    realWorldScenario:
      'Example: An automotive OEM vets an overseas semiconductor vendor. The vendor uploads ISO 27001 certificates. The automated compliance engine checks sanctions lists and creates an active S/4HANA supplier record.',
    sapSignificance: {
      coreModules: ['SAP Ariba Supplier Lifecycle (SLP)', 'S/4HANA Master Data (MDM)', 'GRC'],
      roleInErpEcosystem: 'Ensures master data hygiene and legal compliance before any procurement transactions take place.',
      documentFlow: [
        { stepNumber: 1, documentName: 'Supplier Self-Registration', sapObjectType: 'Ariba SLP', description: 'Vendor submits basic tax and banking info.', icon: '🌐' },
        { stepNumber: 2, documentName: 'Qualification Questionnaire', sapObjectType: 'SLP Survey', description: 'ESG, security, and quality audits.', icon: '📝' },
        { stepNumber: 3, documentName: 'Sanction Screening', sapObjectType: 'SAP Watch List Screening', description: 'Screening against global denied-party lists.', icon: '🛡️' },
        { stepNumber: 4, documentName: 'Business Partner Activation', sapObjectType: 'BUT000 / Tx BP', description: 'Creation of S/4HANA Supplier role.', icon: '🤝' },
      ],
      keyTransactionsAndApps: [
        { codeOrApp: 'BP (GUI)', title: 'Maintain Business Partner', purpose: 'Central S/4HANA master data entity.' },
        { codeOrApp: 'Manage Supplier Master Data', title: 'Supplier 360 View', purpose: 'Fiori view for purchasing data and bank accounts.' },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'OData: API_BUSINESS_PARTNER',
        extensionGuideline: 'Master data governance via SAP MDG. No legacy direct table writes to LFA1/KNA1.',
        aiCoreUseCase: 'Automated verification of scanned ISO certificates and validity period checks.',
      },
    },
    studentTakeaways: {
      keyConcept: 'The S/4HANA Business Partner (BP) paradigm: Single master entity playing multiple roles (vendor, customer, contact).',
      examRelevance: '"Explain the migration from classical ERP vendor master (LFA1) to the unified Business Partner in S/4HANA."',
      processDistinction: 'Master Data Governance (1E6) establishes trust; transactional purchasing (J45) conducts business.',
    },
  },
};

/**
 * Holt die didaktischen Prozessinformationen für ein Template ab.
 * Bietet ein sauberes Fallback für benutzerdefinierte / AI-generierte Templates.
 */
export function getProcessKnowledge(template: ProcessTemplate, lang: Language): ProcessKnowledgeItem {
  const dict = lang === 'en' ? PROCESS_KNOWLEDGE_EN : PROCESS_KNOWLEDGE_DE;
  const isEn = lang === 'en';

  if (dict[template.id]) {
    return dict[template.id];
  }

  // Fallback für neu generierte / Custom Workflows
  return {
    id: template.id,
    scopeCode: template.scopeCode || 'CUSTOM',
    name: template.name,
    businessArea: template.businessArea || (isEn ? 'Custom Business Process' : 'Benutzerdefinierter Geschäftsprozess'),
    headlineSummary: template.description || (isEn ? 'User-defined business workflow' : 'Benutzerdefinierter Geschäftsprozess'),
    plainDescription: isEn
      ? `This workflow '${template.name}' models a business process divided into the 4 cognitive OODA phases (Observe, Orient, Decide, Act). It showcases how unstructured inputs are received, enriched with ERP master data, evaluated against policies, and posted as transactions.`
      : `Dieser Workflow '${template.name}' modelliert einen betriebswirtschaftlichen Prozess entlang der 4 kognitiven OODA-Phasen (Observe, Orient, Decide, Act). Er demonstriert, wie unstrukturierte Eingänge empfangen, mit ERP-Stammdaten angereichert, gegen Richtlinien geprüft und als ERP-Belege verbucht werden.`,
    realWorldScenario: isEn
      ? `A real-world operational scenario where business documents or events trigger automated and human-assisted processing steps across ERP systems.`
      : `Ein betriebliches Praxisszenario, bei dem Belege oder Ereignisse eintreffen und schrittweise automatisiert sowie mit menschlicher Unterstützung im ERP verarbeitet werden.`,
    sapSignificance: {
      coreModules: ['SAP S/4HANA Core', 'SAP Integration Suite', 'SAP AI Core'],
      roleInErpEcosystem: isEn
        ? 'In the SAP ecosystem, workflows orchestrate transactional consistency across functional modules, adhering to Clean Core principles.'
        : 'Im SAP-Ökosystem gewährleistet dieser Workflow transaktionale Konsistenz über Funktionsmodule hinweg unter Einhaltung von Clean-Core-Prinzipien.',
      documentFlow: template.steps.map((st, idx) => ({
        stepNumber: idx + 1,
        documentName: st.name,
        sapObjectType: st.sapReference || 'SAP Standard Object',
        description: st.description,
        icon: idx === 0 ? '📥' : idx === template.steps.length - 1 ? '🏁' : '⚙️',
      })),
      keyTransactionsAndApps: [
        {
          codeOrApp: 'SAP Fiori Launchpad',
          title: template.name,
          purpose: isEn ? 'Standard role-based workspace' : 'Rollenbasierte Fiori-Arbeitsumgebung',
        },
      ],
      cleanCoreAndIntegration: {
        standardApi: 'Standard OData / REST APIs & Business Events',
        extensionGuideline: isEn
          ? 'Side-by-side extension on SAP BTP; decoupling via event-driven architecture.'
          : 'Side-by-side Erweiterung auf SAP BTP; Entkopplung über ereignisgesteuerte Architektur.',
        aiCoreUseCase: isEn
          ? 'Extraction of unstructured inputs and automated validation gates.'
          : 'Extraktion unstrukturierter Daten und automatisierte Konfidenz-Gates.',
      },
    },
    studentTakeaways: {
      keyConcept: isEn
        ? 'Decomposition of complex business flows into OODA loops and 6 cognitive primitives.'
        : 'Zerlegung komplexer Geschäftsprozesse in OODA-Schleifen und 6 kognitive Primitives.',
      examRelevance: isEn
        ? 'Analysis of automation trade-offs: dark processing vs. human-in-the-loop escalation.'
        : 'Abwägung von Automatisierungsgraden: Dunkelverarbeitung vs. Human-in-the-Loop-Eskalation.',
      processDistinction: isEn
        ? 'Custom workflow adapted to specific organization requirements.'
        : 'Individuell modellierter Workflow für spezifische Unternehmensanforderungen.',
    },
  };
}
