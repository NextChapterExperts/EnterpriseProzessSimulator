import { ProcessStep, DryRunExecutionResult, DryRunStepTrace, AutomationArchetype } from '@/types/process';
import { getSampleMessage, MessageQuality, ProcessSampleMessage } from '@/data/dryRunSample';
import type { Language } from '@/i18n/translations';

interface TechniqueMeta {
  name: string;
  mechanism: string;
  baseLatency: number;
  baseTokens: number;
  subCalls: number;
}

const TECHNIQUE_INFO: Record<AutomationArchetype, TechniqueMeta> = {
  deterministic: {
    name: 'Deterministisch',
    mechanism: 'ABAP Regex, BRFplus Decision Tables & OData Engine',
    baseLatency: 12,
    baseTokens: 0,
    subCalls: 1,
  },
  classic_ml: {
    name: 'Assistant (Klassisches LLM)',
    mechanism: 'Prompt-basiertes LLM (Single-Turn: Text in ➔ Text out)',
    baseLatency: 380,
    baseTokens: 420,
    subCalls: 1,
  },
  copilot: {
    name: 'Copilot (Joule & Review)',
    mechanism: 'Joule LLM mit interaktiver Sachbearbeiter-Freigabe',
    baseLatency: 450,
    baseTokens: 480,
    subCalls: 2,
  },
  autopilot: {
    name: 'Autopilot (Tool-Agent)',
    mechanism: 'Autonomer Single-Agent mit Tool-Calling & Konfidenz-Gate',
    baseLatency: 620,
    baseTokens: 920,
    subCalls: 2,
  },
  agentic: {
    name: 'Agentic (Multi-Agent Swarm)',
    mechanism: 'Multi-Agent ReAct Swarm mit iterativer Selbstheilung',
    baseLatency: 1450,
    baseTokens: 2400,
    subCalls: 4,
  },
};

// =========================================================================
// ENGLISH LOCALIZATION LAYER
// The scenario simulation below is authored in German. When the simulator runs
// in English, every user-visible string (payload values, log messages, technique
// names) is mapped through this dictionary and a few format normalizers
// (units, dates, times, currency). Object KEYS are never translated, because
// they are used for label lookups (see fieldDescriptions.ts).
// =========================================================================
const EN_TEXT: Record<string, string> = {
  "Deterministisch": "Deterministic",
  "Assistant (Klassisches LLM)": "Assistant (Classic LLM)",
  "Prompt-basiertes LLM (Single-Turn: Text in ➔ Text out)": "Prompt-based LLM (single-turn: text in ➔ text out)",
  "Joule LLM mit interaktiver Sachbearbeiter-Freigabe": "Joule LLM with interactive clerk approval",
  "Autonomer Single-Agent mit Tool-Calling & Konfidenz-Gate": "Autonomous single agent with tool calling & confidence gate",
  "Multi-Agent ReAct Swarm mit iterativer Selbstheilung": "Multi-agent ReAct swarm with iterative self-healing",
  "E-Mail Eingang (sales@firma.de)": "Email inbound (sales@firma.de)",
  "Bestellung_4711.pdf": "PurchaseOrder_4711.pdf",
  "Verbindliche Kundenbestellung": "Binding customer purchase order",
  "Bestellung zu Angebot AN-2026-88": "Purchase order for quotation AN-2026-88",
  "Angebot AN-2026-88": "Quotation AN-2026-88",
  "Bestellung_4711.pdf (Digital lesbar, 124 KB)": "PurchaseOrder_4711.pdf (digitally readable, 124 KB)",
  "Hoch (Wunschtermin 15.10.2026)": "High (requested date 15.10.2026)",
  "Automatische Belegextraktion (SALES_PROCESSING)": "Automated document extraction (SALES_PROCESSING)",
  "Deterministische Regel: Betreff AN-2026-88 exakt erkannt. Sofortige Triage (100%).": "Deterministic rule: subject AN-2026-88 matched exactly. Immediate triage (100%).",
  "HANA ML Klassifikator: Text mit 98.4% Wahrscheinlichkeit als Bestellung klassifiziert.": "HANA ML classifier: text classified as purchase order with 98.4% probability.",
  "Joule Copilot: Bestellabsicht verstanden, Priorität hoch (Lieferung 15.10.).": "Joule Copilot: order intent understood, priority high (delivery Oct 15).",
  "Autopilot: Tool classify_order_intent ausgeführt. Konfidenz 98% > Gate 85%.": "Autopilot: tool classify_order_intent executed. Confidence 98% > gate 85%.",
  "Agentic Swarm: Triage-Agent & Intent-Agent haben Einstufung einstimmig bestätigt.": "Agentic Swarm: triage agent & intent agent unanimously confirmed the classification.",
  "Verbindliche Kundenbestellung (Rekonstruiert)": "Binding customer purchase order (reconstructed)",
  "(Kein Betreff angegeben)": "(No subject provided)",
  "Angebot AN-2026-88 (aus Historie via MCP ermittelt)": "Quotation AN-2026-88 (determined from history via MCP)",
  "Kunden-Freitext (Digitalisiert)": "Customer free text (digitized)",
  "Hoch": "High",
  "Automatische Belegextraktion": "Automated document extraction",
  "Agentisches Framework (Stufe 5): Historien-Agent ermittelt Firmenbezug von klaus.baustelle88@web.de autonom via MCP!": "Agentic framework (level 5): history agent autonomously determines company relation of klaus.baustelle88@web.de via MCP!",
  "Unklare Mitteilung (Klärfall erforderlich)": "Unclear message (clarification case required)",
  "(Kein Betreff)": "(No subject)",
  "Mittel": "Medium",
  "Manueller Klärungskorb für Sachbearbeiter": "Manual clarification basket for clerk",
  "Copilot fasst Unklarheiten zusammen und bereitet Klärung für Sachbearbeiter vor.": "Copilot summarizes ambiguities and prepares clarification for the clerk.",
  "ABBRUCH (Syntax-Fehler)": "ABORTED (syntax error)",
  "Betreffzeile & Text entsprechen keiner bekannten Bestellanfrage-Schablone.": "Subject line & text do not match any known purchase order template.",
  "ABBRUCH: Deterministischer Parser scheitert an unstrukturiertem Freitext ohne Betreff.": "ABORTED: deterministic parser fails on unstructured free text without subject.",
  "Unklare Einstufung (Konfidenz zu gering)": "Unclear classification (confidence too low)",
  "Klärungswarteschlange": "Clarification queue",
  "Konfidenz unter Schwellenwert. Vorgang an Klärungswarteschlange übergeben.": "Confidence below threshold. Case handed over to clarification queue.",
  "Werk Augsburg, Tor 3 (Wareneingang)": "Augsburg plant, gate 3 (goods receipt)",
  "30 Tage netto, 14 Tage 2% Skonto": "30 days net, 14 days 2% cash discount",
  "Präzisionsflansch Stahl DIN 2633 (FL-9021)": "Precision flange steel DIN 2633 (FL-9021)",
  "Hochdruck-Dichtungssatz EPDM (DI-4410)": "High-pressure gasket set EPDM (DI-4410)",
  "Tabellen-Parser: 2 Positionen, Tor 3 und Termine fehlerfrei extrahiert.": "Table parser: 2 line items, gate 3 and dates extracted without errors.",
  "NER Entitäts-Modell: Positionen und Termine mit 96.5% Konfidenz isoliert.": "NER entity model: line items and dates isolated with 96.5% confidence.",
  "Joule Copilot: Positionen & Sonderanweisung \"Tor 3\" strukturiert.": "Joule Copilot: line items & special instruction \"gate 3\" structured.",
  "Autopilot: Tool extract_sales_order_lines liefert valides Positionsschema.": "Autopilot: tool extract_sales_order_lines returns a valid line item schema.",
  "Agentic Swarm: Mengeneinheiten gegen ISO-Norm validiert und Positionen bestätigt.": "Agentic Swarm: units of measure validated against ISO standard and line items confirmed.",
  "PO-4711-AUG (Rekonstruiert via MCP)": "PO-4711-AUG (reconstructed via MCP)",
  "Präzisionsflansch Stahl (FL-9021)": "Precision flange steel (FL-9021)",
  "EPDM Dichtungssatz (DI-4410)": "EPDM gasket set (DI-4410)",
  "Agentisches Framework (Stufe 5): Vorbeleg-Agent gleicht \"runde Flansche\" mit Vorauftrag ab und rettet Artikel-IDs via MCP!": "Agentic framework (level 5): reference document agent matches \"round flanges\" against previous order and recovers article IDs via MCP!",
  "PO-UNBEKANNT": "PO-UNKNOWN",
  "Unvollständig": "Incomplete",
  "runde Flansche (FL-9021 vermutet)": "round flanges (FL-9021 assumed)",
  "Sachbearbeiter muss Materialnummer und Dichtungen bestätigen": "Clerk must confirm material number and gaskets",
  "Copilot schlägt dem Sachbearbeiter vor: \"Meint der Kunde FL-9021 aus Angebot AN-2026-88?\"": "Copilot suggests to the clerk: \"Does the customer mean FL-9021 from quotation AN-2026-88?\"",
  "Keine Artikelnummern oder strukturierte Tabelle im unstrukturierten Text auffindbar.": "No article numbers or structured table found in the unstructured text.",
  "ABBRUCH: Deterministischer Parser scheitert an Umgangssprache (\"runde Flansche wie neulich\").": "ABORTED: deterministic parser fails on colloquial language (\"round flanges like last time\").",
  "FEHLENDE_PFLICHTFELDER": "MISSING_MANDATORY_FIELDS",
  "Artikelnummern und Mengeneinheiten fehlen im Text.": "Article numbers and units of measure are missing in the text.",
  "Autopilot-Gate: Unvollständige Pflichtfelder blockieren autonome Extraktion.": "Autopilot gate: incomplete mandatory fields block autonomous extraction.",
  "AG (Auftraggeber) / WE (Warenempfänger Werk Augsburg)": "SP (sold-to party) / SH (ship-to party Augsburg plant)",
  "Klasse A (Kreditlinie: 150.000 €)": "Class A (credit line: €150,000)",
  "Flansch DN100 PN16 Stahl 1.4571": "Flange DN100 PN16 steel 1.4571",
  "Werk 1010": "Plant 1010",
  "Dichtung EPDM DN100 PN16": "Gasket EPDM DN100 PN16",
  "Vollständig zugeordnet & verifiziert gegen SAP S/4HANA": "Fully assigned & verified against SAP S/4HANA",
  "Exakter Key-Lookup: KUNNR 0000100420 & MARA-Stammdaten in 4ms bestätigt.": "Exact key lookup: KUNNR 0000100420 & MARA master data confirmed in 4 ms.",
  "SAP HANA Fuzzy Search: Trigram-Score 0.985 bestätigt KUNNR & MARA.": "SAP HANA fuzzy search: trigram score 0.985 confirms KUNNR & MARA.",
  "Copilot verknüpft Debitor & zeigt Kredit-Historie für Sachbearbeiter an.": "Copilot links customer & shows credit history to the clerk.",
  "Autopilot: Tool sap_odata_partner_lookup bestätigt Debitor autonom.": "Autopilot: tool sap_odata_partner_lookup confirms customer autonomously.",
  "Agentic Swarm: Debitor, Werk 1010 und Lagerbestand für Tor 3 verifiziert.": "Agentic Swarm: customer, plant 1010 and stock for gate 3 verified.",
  "AG (Auftraggeber)": "SP (sold-to party)",
  "Flansch DN100 PN16 (aus Vorbeleg ermittelt)": "Flange DN100 PN16 (determined from reference document)",
  "Dichtung EPDM (aus Vorbeleg ermittelt)": "Gasket EPDM (determined from reference document)",
  "Autonom über Multi-Hop Graph via MCP zugeordnet": "Assigned autonomously via multi-hop graph via MCP",
  "Agentisches Framework (Stufe 5): Graph-Agent verknüpft Bauleiter mit Angebot AN-2026-88 autonom!": "Agentic framework (level 5): graph agent autonomously links site manager with quotation AN-2026-88!",
  "0000100420 (Müller Maschinenbau GmbH vermutet)": "0000100420 (Müller Maschinenbau GmbH assumed)",
  "Soll Debitor anhand der Lieferadresse zugeordnet werden?": "Should the customer be assigned based on the delivery address?",
  "Manuelle Freigabe erforderlich": "Manual approval required",
  "Copilot präsentiert Kandidatenliste dem Sachbearbeiter zur Bestätigung.": "Copilot presents candidate list to the clerk for confirmation.",
  "STAMMDATEN_NICHT_GEFUNDEN": "MASTER_DATA_NOT_FOUND",
  "Absender nicht in KNA1. Keine Treffer für unstrukturierte Materialbezeichnung.": "Sender not in KNA1. No hits for unstructured material description.",
  "FEHLER: Debitor und Material in SAP S/4HANA nicht eindeutig identifizierbar.": "ERROR: customer and material cannot be uniquely identified in SAP S/4HANA.",
  "UNBEKANNT": "UNKNOWN",
  "Ähnlichkeit unter Schwellenwert (58%)": "Similarity below threshold (58%)",
  "Autopilot-Gate: Konfidenz 58% < 85%. Verbuchungsvorbereitung abgebrochen.": "Autopilot gate: confidence 58% < 85%. Posting preparation aborted.",
  "Freigegeben (Beanspruchung 32.400 € / 150.000 €)": "Approved (utilization €32,400 / €150,000)",
  "Bestätigt (Werk 1010: 84 ST sofort verfügbar)": "Confirmed (plant 1010: 84 PC available immediately)",
  "Wunschtermin 15.10.2026 zugesagt": "Requested date 15.10.2026 confirmed",
  "Automatische Freigabe erteilt (Keine Liefersperre)": "Automatic approval granted (no delivery block)",
  "BRFplus Regelwerk: Kreditlimit & ATP positiv für 15.10. Freigabe erteilt.": "BRFplus rule set: credit limit & ATP positive for Oct 15. Approval granted.",
  "Risikomodell: Ausfallwahrscheinlichkeit 0.2%. Automatische Freigabe empfohlen.": "Risk model: probability of default 0.2%. Automatic approval recommended.",
  "Copilot zeigt ATP-Status grün. Sachbearbeiter autorisiert Buchung per 1-Klick.": "Copilot shows ATP status green. Clerk authorizes posting with 1 click.",
  "Autopilot: Autonome Freigabeentscheidung nach BRFplus-Regelwerk ausgeführt.": "Autopilot: autonomous approval decision executed according to BRFplus rule set.",
  "Agentic Swarm: Policy-Agent & Risk-Agent genehmigen Express-Lieferung.": "Agentic Swarm: policy agent & risk agent approve express delivery.",
  "Vorab-Freigabe erteilt (Stammkunde)": "Pre-approval granted (regular customer)",
  "Bestätigt (Kontingent für Tor 3 reserviert)": "Confirmed (allocation reserved for gate 3)",
  "Wunschtermin gehalten": "Requested date kept",
  "Autonom freigegeben (Agentisches Regelwerk)": "Approved autonomously (agentic rule set)",
  "Agentisches Framework (Stufe 5): Vorab-Bestandsprüfung auf FL-9021 (85 ST) & Kontingent autonom freigegeben!": "Agentic framework (level 5): stock pre-check for FL-9021 (85 PC) & allocation approved autonomously!",
  "Kreditlimit ausreichend": "Credit limit sufficient",
  "Kurzfristige Sonderdisposition erforderlich": "Short-term special scheduling required",
  "Copilot warnt vor Liefertermin \"morgen früh\" und fordert Sonderfreigabe an.": "Copilot warns about delivery date \"tomorrow morning\" and requests special approval.",
  "ATP_BLOCKIERT": "ATP_BLOCKED",
  "ATP-Prüfung unmöglich: Fehlende Materialnummer blockiert Regelausführung.": "ATP check impossible: missing material number blocks rule execution.",
  "Regelwerk verweigert Freigabe: Stammdaten und Liefertermin unvalidiert.": "Rule set denies approval: master data and delivery date not validated.",
  "Entscheidung mangels Daten verweigert": "Decision denied due to lack of data",
  "Autopilot verweigert Entscheidung auf Basis unvollständiger Stammdaten.": "Autopilot refuses decision based on incomplete master data.",
  "Autonome ERP-Mutation bei Reversibilität 5 verweigert. Human-Gatekeeper zwingend erforderlich!": "Autonomous ERP mutation at reversibility 5 denied. Human gatekeeper mandatory!",
  "❌ SICHERHEITSSTOPP: Autonome ERP-Verbuchung ohne menschliche Signatur blockiert (Schutzplanke 5).": "❌ SAFETY STOP: autonomous ERP posting without human signature blocked (guardrail 5).",
  "0045008921 (Kundenauftrag Standard TA)": "0045008921 (standard sales order TA)",
  "Erfolgreich in SAP S/4HANA gebucht (VBAK / VBAP)": "Successfully posted in SAP S/4HANA (VBAK / VBAP)",
  "4.800,00 € (Brutto inkl. 19% MwSt: 5.712,00 €)": "€4,800.00 (gross incl. 19% VAT: €5,712.00)",
  "Deterministisch: Beleg 0045008921 in S/4HANA (VBAK/VBAP) via OData gebucht.": "Deterministic: document 0045008921 posted in S/4HANA (VBAK/VBAP) via OData.",
  "Assistent: Validierte Payload an BAPI übergeben. Beleg 0045008921 gebucht.": "Assistant: validated payload passed to BAPI. Document 0045008921 posted.",
  "Copilot: Sachbearbeiter autorisiert Buchung. Beleg 0045008921 in S/4HANA gebucht.": "Copilot: clerk authorizes posting. Document 0045008921 posted in S/4HANA.",
  "3.200,00 € (Rekonstruierter Belegwert)": "€3,200.00 (reconstructed document value)",
  "Agentisches Framework (Stufe 5): Rekonstruierte Stammdaten erfolgreich in S/4HANA (VBAK/VBAP) gebucht.": "Agentic framework (level 5): reconstructed master data successfully posted in S/4HANA (VBAK/VBAP).",
  "ABGEBROCHEN": "ABORTED",
  "Verbuchung wegen unvollständiger Belegdaten verweigert.": "Posting denied due to incomplete document data.",
  "Verbuchung gestoppt. Vorgang in Klärungsschlange übergeben.": "Posting stopped. Case handed over to clarification queue.",
  "Auftragsbestätigung AB_0045008921.pdf": "Order confirmation AB_0045008921.pdf",
  "E-Mail an k.meier@mueller-maschinenbau.de": "Email to k.meier@mueller-maschinenbau.de",
  "Erfolgreich versendet & im SAP Archiv abgelegt": "Successfully sent & stored in SAP archive",
  "Assistant (LLM): Vollständig personalisiertes Kundenanschreiben per Prompt generiert.": "Assistant (LLM): fully personalized customer letter generated via prompt.",
  "Copilot hat personalisiertes Anschreiben mit Tor-3-Hinweis formuliert & versandt.": "Copilot formulated & sent a personalized letter including the gate 3 note.",
  "Auftragsbestätigung mit PDF-Beleg an Kunden versendet.": "Order confirmation with PDF document sent to customer.",
  "Erfolgreich versendet (Selbstheilung abgeschlossen)": "Successfully sent (self-healing completed)",
  "Agentisches Framework (Stufe 5): Personalisierte Bestätigung mit rekonstruierten Positionen versandt.": "Agentic framework (level 5): personalized confirmation with reconstructed line items sent.",
  "Klärungs-E-Mail (Nachforderung Daten)": "Clarification email (request for data)",
  "Klärungsanfrage versendet": "Clarification request sent",
  "Klärungs-E-Mail an Kunden versandt mit Bitte um Konkretisierung.": "Clarification email sent to customer asking for specifics.",
  "Notfall-Störungsmeldung (Priorität 1)": "Emergency fault report (priority 1)",
  "Chemiepark Süd (Markus Huber, Schichtleiter)": "Chemiepark Süd (Markus Huber, shift supervisor)",
  "DRINGEND: Notfall Hochdruckpumpe P-204 ausgefallen": "URGENT: emergency – high-pressure pump P-204 failed",
  "Prio 1 (Produktionsstillstand droht)": "Prio 1 (production standstill imminent)",
  "Hochdruckpumpe KSB Multitec P-204 (Equipment 10084721)": "High-pressure pump KSB Multitec P-204 (equipment 10084721)",
  "Service-Einsatzsteuerung (SAP CS / PM)": "Service dispatch control (SAP CS / PM)",
  "Notfall-Triage: Prio 1 Stillstand an Polymerisationslinie 2 erkannt.": "Emergency triage: prio 1 standstill on polymerization line 2 detected.",
  "Notfall-Störungsmeldung (Rekonstruiert)": "Emergency fault report (reconstructed)",
  "Pumpe P-204 (aus Historie via MCP ermittelt)": "Pump P-204 (determined from history via MCP)",
  "Prio 1 (Stillstand)": "Prio 1 (standstill)",
  "Service-Einsatzsteuerung": "Service dispatch control",
  "Agentisches Framework (Stufe 5): Standort und Anlagenbereich aus Text via MCP rekonstruiert!": "Agentic framework (level 5): location and plant area reconstructed from text via MCP!",
  "Unklare Störungsmeldung (Klärfall)": "Unclear fault report (clarification case)",
  "Störungsmeldung ungenau. Rückfrage bei Schichtleiter erforderlich.": "Fault report imprecise. Callback to shift supervisor required.",
  "Copilot markiert Störung zur manuellen Vorabklärung durch den Schichtleiter.": "Copilot flags the fault for manual pre-clarification by the shift supervisor.",
  "KEIN_FEHLERMUSTER_ERKANNT": "NO_FAULT_PATTERN_DETECTED",
  "Keine standardisierte Störungsmeldung im Freitext erkannt.": "No standardized fault report detected in free text.",
  "ABBRUCH: Deterministischer Parser erkennt Fehlermuster nicht.": "ABORTED: deterministic parser does not recognize fault pattern.",
  "Störungsmeldung ungenau (Konfidenz 54%)": "Fault report imprecise (confidence 54%)",
  "Störungsmeldung ungenau (Konfidenz 54%). Human Review erforderlich.": "Fault report imprecise (confidence 54%). Human review required.",
  "NOTFALL-2026-P204": "EMERGENCY-2026-P204",
  "10084721 (Pumpe P-204)": "10084721 (pump P-204)",
  "Prio 1 (Bandstillstand droht)": "Prio 1 (line standstill imminent)",
  "Wälzlager-Satz KSB Typ 6308-2Z": "Rolling bearing set KSB type 6308-2Z",
  "Gleitringdichtung SiC/SiC/Viton": "Mechanical seal SiC/SiC/Viton",
  "Extraktion: Equipment 10084721, Fehler E-4402 & Ersatzteile identifiziert.": "Extraction: equipment 10084721, error E-4402 & spare parts identified.",
  "Lagerschaden & Druckabfall auf 0 Bar um 08:35 Uhr": "Bearing damage & pressure drop to 0 bar at 08:35",
  "Agentisches Framework (Stufe 5): IoT-Diagnose-Agent identifiziert Pumpe P-204 (10084721) anhand akuter Telemetrie!": "Agentic framework (level 5): IoT diagnostics agent identifies pump P-204 (10084721) based on acute telemetry!",
  "Pumpe P-204 (10084721)": "Pump P-204 (10084721)",
  "Disponent muss Equipment-Zuordnung bestätigen": "Dispatcher must confirm equipment assignment",
  "Copilot schlägt Zuordnung zu Pumpe P-204 vor und bittet Disponent um Freigabe.": "Copilot suggests assignment to pump P-204 and asks dispatcher for approval.",
  "Parser kann \"große blaue Pumpe\" keinem Stammdatenobjekt zuordnen.": "Parser cannot assign \"big blue pump\" to any master data object.",
  "Geruchsentwicklung / Ausfall": "Odor development / failure",
  "FEHLT": "MISSING",
  "Fehlerbild erfasst, aber Equipment- und Fehlercode fehlen vollständig.": "Fault pattern captured, but equipment and error code are completely missing.",
  "Hochdruckpumpe KSB Multitec P-204 (10084721)": "High-pressure pump KSB Multitec P-204 (10084721)",
  "SV-88102 (SLA Gold - 2h Vor-Ort-Garantie)": "SV-88102 (SLA Gold - 2h on-site guarantee)",
  "Kreiselpumpe Typ Multitec D DN50": "Centrifugal pump type Multitec D DN50",
  "Wartungsvertrag aktiv (24/7 Vollabdeckung)": "Maintenance contract active (24/7 full coverage)",
  "Chemiepark Süd Betriebsgemeinschaft": "Chemiepark Süd operating association",
  "Equipment & Servicevertrag in SAP CS/PM validiert": "Equipment & service contract validated in SAP CS/PM",
  "SAP IBASE / EQUI Match: Equipment 10084721 gefunden. SLA Gold aktiv!": "SAP IBASE / EQUI match: equipment 10084721 found. SLA Gold active!",
  "Hochdruckpumpe P-204 (10084721)": "High-pressure pump P-204 (10084721)",
  "Wartungsvertrag aktiv": "Maintenance contract active",
  "Autonom über IoT-Telemetrie via MCP zugeordnet": "Assigned autonomously via IoT telemetry via MCP",
  "Agentisches Framework (Stufe 5): Equipment 10084721 & SLA Gold Vertrag via MCP verknüpft!": "Agentic framework (level 5): equipment 10084721 & SLA Gold contract linked via MCP!",
  "Pumpe P-204 (10084721 vermutet)": "Pump P-204 (10084721 assumed)",
  "Soll Vertrag SV-88102 (SLA Gold) zugeordnet werden?": "Should contract SV-88102 (SLA Gold) be assigned?",
  "Manuelle Freigabe durch Disponenten erforderlich": "Manual approval by dispatcher required",
  "Copilot schlägt dem Disponenten Zuordnung zu Vertrag SV-88102 vor.": "Copilot suggests assignment to contract SV-88102 to the dispatcher.",
  "MEHRERE_PUMPEN_GEFUNDEN": "MULTIPLE_PUMPS_FOUND",
  "14 Pumpen am Standort registriert. Eindeutige Equipment-ID fehlt im Text.": "14 pumps registered at the site. Unique equipment ID missing in text.",
  "Matching fehlgeschlagen: 14 Pumpen am Standort gefunden, Zuordnung unmöglich.": "Matching failed: 14 pumps found at the site, assignment impossible.",
  "Maximal 2 Stunden (SLA Gold vertraglich garantiert)": "Maximum 2 hours (SLA Gold contractually guaranteed)",
  "Thomas Meyer (TECH-042, Service-Team Hochdruck)": "Thomas Meyer (TECH-042, high-pressure service team)",
  "Sofort einsatzbereit (Fahrzeit: ca. 35 Minuten)": "Ready for immediate deployment (travel time: approx. 35 minutes)",
  "Wälzlagersatz im Servicefahrzeug vorrätig": "Rolling bearing set in stock in service vehicle",
  "Notfalleinsatz autorisiert (Prio 1 Freigabe)": "Emergency deployment authorized (prio 1 approval)",
  "SLA Gold: Sofortiger Techniker-Einsatz innerhalb 2h genehmigt.": "SLA Gold: immediate technician deployment within 2h approved.",
  "2 Stunden (SLA Gold)": "2 hours (SLA Gold)",
  "Teile reserviert": "Parts reserved",
  "Autonom disponiert (Agentische SLA-Prüfung)": "Dispatched autonomously (agentic SLA check)",
  "Agentisches Framework (Stufe 5): Notfall-Techniker Thomas Meyer gemäß SLA-Vertrag autonom disponiert.": "Agentic framework (level 5): emergency technician Thomas Meyer dispatched autonomously according to SLA contract.",
  "Thomas Meyer (TECH-042 vorgeschlagen)": "Thomas Meyer (TECH-042 proposed)",
  "Disponent muss Notfalleinsatz und Sonderfahrt freigeben": "Dispatcher must approve emergency deployment and special trip",
  "Wartet auf Disponenten-Entscheidung": "Waiting for dispatcher decision",
  "Copilot legt Disponenten Notfall-Freigabe für Techniker Thomas Meyer vor.": "Copilot presents emergency approval for technician Thomas Meyer to the dispatcher.",
  "SLA_NICHT_ERMITTELBAR": "SLA_NOT_DETERMINABLE",
  "Vertragsklasse ohne Equipment-Zuordnung nicht bestimmbar.": "Contract class cannot be determined without equipment assignment.",
  "SLA-Berechnung blockiert: Vertragsklasse unbestimmt.": "SLA calculation blocked: contract class undetermined.",
  "Autonome ERP-Mutation bei Reversibilität 5 blockiert. Genehmigung zwingend erforderlich!": "Autonomous ERP mutation at reversibility 5 blocked. Approval mandatory!",
  "❌ SICHERHEITSSTOPP: Autonomer Serviceauftrag ohne Genehmigung verweigert.": "❌ SAFETY STOP: autonomous service order without approval denied.",
  "00400019284 (SAP CS/PM Notfalleinsatz)": "00400019284 (SAP CS/PM emergency deployment)",
  "Erfolgreich in SAP S/4HANA gebucht (AUFK / AFKO)": "Successfully posted in SAP S/4HANA (AUFK / AFKO)",
  "KST-4410 (Instandhaltung Polymerisation)": "KST-4410 (maintenance polymerization)",
  "SM01 (Notfall-Instandsetzung)": "SM01 (emergency repair)",
  "Serviceauftrag 400019284 in SAP S/4HANA (AUFK/AFKO) angelegt.": "Service order 400019284 created in SAP S/4HANA (AUFK/AFKO).",
  "Agentisches Framework (Stufe 5): Serviceauftrag 400019284 mit geheilten Equipment-Daten in SAP S/4HANA angelegt.": "Agentic framework (level 5): service order 400019284 created in SAP S/4HANA with healed equipment data.",
  "AUFTRAGSANLAGE_BLOCKIERT": "ORDER_CREATION_BLOCKED",
  "Fehlende Pflichtstammdaten verhindern Transaktionsbuchung.": "Missing mandatory master data prevents transaction posting.",
  "Serviceauftrag verweigert: Vorgang an Callcenter-Klärung übergeben.": "Service order denied: case handed over to call center clarification.",
  "Auftrag 00400019284 an Mobilgerät von Th. Meyer übertragen": "Order 00400019284 transferred to Th. Meyer's mobile device",
  "SMS an Schichtleiter Markus Huber versendet": "SMS sent to shift supervisor Markus Huber",
  "07:20 Uhr vor Ort (Tor 1 Chemiepark Süd)": "07:20 on site (gate 1 Chemiepark Süd)",
  "Erfolgreich disponiert & im System quittiert": "Successfully dispatched & acknowledged in the system",
  "Assistant (LLM): SMS-Benachrichtigung an den Kundenkontakt per Prompt generiert.": "Assistant (LLM): SMS notification to the customer contact generated via prompt.",
  "Techniker Thomas Meyer über SAP FSM disponiert & Kunde per SMS informiert.": "Technician Thomas Meyer dispatched via SAP FSM & customer informed via SMS.",
  "Auftrag erfolgreich übertragen": "Order transferred successfully",
  "SMS an Leitstand versendet": "SMS sent to control room",
  "Erfolgreich disponiert (Selbstheilung abgeschlossen)": "Successfully dispatched (self-healing completed)",
  "Agentisches Framework (Stufe 5): Notfall-Techniker disponiert & Leitstand per SMS informiert.": "Agentic framework (level 5): emergency technician dispatched & control room informed via SMS.",
  "Manueller Rückruf": "Manual callback",
  "Techniker-Dispatch pausiert. Klärungsanruf beim Kunden erforderlich.": "Technician dispatch paused. Clarification call with customer required.",
  "Wartet auf manuelle Klärung": "Waiting for manual clarification",
  "Techniker-Dispatch pausiert. Klärungsanruf bei Kunde initiiert.": "Technician dispatch paused. Clarification call with customer initiated.",
  "Elektronisches Zahlungsavis (PDF / EDI)": "Electronic payment advice (PDF / EDI)",
  "Avis_2026_SH.pdf (Digital lesbar, 88 KB)": "Advice_2026_SH.pdf (digitally readable, 88 KB)",
  "Valides Zahlungsavis": "Valid payment advice",
  "Automatische Avis-Extraktion (FI-AR)": "Automated advice extraction (FI-AR)",
  "Zahlungsavis vollständig & formal valide.": "Payment advice complete & formally valid.",
  "Valides Zahlungsavis (Rekonstruiert via MCP)": "Valid payment advice (reconstructed via MCP)",
  "ZA-2026-99120 (aus Buchungszeile ermittelt)": "ZA-2026-99120 (determined from posting line)",
  "Automatische Avis-Extraktion": "Automated advice extraction",
  "Agentisches Framework (Stufe 5): Avis-Struktur trotz fehlender Headerdaten via MCP rekonstruiert.": "Agentic framework (level 5): advice structure reconstructed via MCP despite missing header data.",
  "Zahlungsavis (Prüfung erforderlich)": "Payment advice (review required)",
  "Avis unvollständig. Manuelle Sichtung durch Buchhalter empfohlen.": "Advice incomplete. Manual review by accountant recommended.",
  "Klärungskorb Debitorenbuchhaltung": "Accounts receivable clarification basket",
  "Copilot legt Zahlungsavis dem Buchhalter zur Vorprüfung vor.": "Copilot presents payment advice to the accountant for pre-check.",
  "AVIS_UNVOLLSTAENDIG": "ADVICE_INCOMPLETE",
  "Pauschaler Abzug 600,00 € ohne Rechnungsbezug ausgewiesen.": "Lump-sum deduction of €600.00 shown without invoice reference.",
  "Avis erfasst, aber ungeklärte Abzüge von 600 € festgestellt.": "Advice captured, but unexplained deductions of €600 detected.",
  "291,43 € (2% vereinbarungsgemäß)": "€291.43 (2% as agreed)",
  "0,00 € (Vollständig ausgeglichen)": "€0.00 (fully cleared)",
  "2 Rechnungen mit 2% Skontoabzug fehlerfrei extrahiert.": "2 invoices with 2% cash discount extracted without errors.",
  "0,00 € (Gutschrift GS-9901 über 600 € via MCP zugeordnet)": "€0.00 (credit memo GS-9901 for €600 assigned via MCP)",
  "Agentisches Framework (Stufe 5): Dispute-Agent findet offene 600 € Gutschrift zu Reklamation!": "Agentic framework (level 5): dispute agent finds open €600 credit memo for complaint!",
  "600,00 € (ungeklärt)": "€600.00 (unexplained)",
  "Sachbearbeiter muss Zuordnung der Differenz von 600,00 € bestätigen": "Clerk must confirm assignment of the €600.00 difference",
  "Copilot bittet Sachbearbeiter um manuelle Differenzzuordnung.": "Copilot asks clerk for manual assignment of the difference.",
  "RECHNUNGSZUORDNUNG_FEHLGESCHLAGEN": "INVOICE_ASSIGNMENT_FAILED",
  "Keine gültigen Rechnungsnummern im Avis-Freitext identifizierbar.": "No valid invoice numbers identifiable in the advice free text.",
  "Warnung: Keine Rechnungsnummern im Avis genannt.": "Warning: no invoice numbers mentioned in the advice.",
  "2 offene Posten in SAP FI-AR (BSID)": "2 open items in SAP FI-AR (BSID)",
  "Fristgerecht eingegangen (Skonto 2% berechtigt)": "Received on time (2% cash discount eligible)",
  "1000 (Deutschland Inland)": "1000 (Germany domestic)",
  "Eindeutiger Match auf Debitor 0000300192": "Unique match on customer 0000300192",
  "Beide Rechnungen in SAP BSID gefunden & skontoberechtigt.": "Both invoices found in SAP BSID & eligible for cash discount.",
  "2 offene Posten + 1 Gutschrift zugeordnet": "2 open items + 1 credit memo assigned",
  "Autonom über Posten-Agent via MCP abgeglichen": "Matched autonomously via open item agent via MCP",
  "Agentisches Framework (Stufe 5): Posten-Agent ordnet Betrag automatisch den 2 offenen Rechnungen zu.": "Agentic framework (level 5): open item agent automatically assigns amount to the 2 open invoices.",
  "0000300192 (Siemens Healthineers vermutet)": "0000300192 (Siemens Healthineers assumed)",
  "5 offene Posten für Kunden vorhanden. Bitte Auswahl bestätigen.": "5 open items exist for customer. Please confirm selection.",
  "Wartet auf Prüfung durch Buchhaltung": "Waiting for review by accounting",
  "Copilot schlägt 2 passende offene Posten vor und wartet auf Freigabe.": "Copilot suggests 2 matching open items and waits for approval.",
  "KEIN_EINDEUTIGER_MATCH": "NO_UNIQUE_MATCH",
  "Offene Posten konnten keinem Einzelbeleg in BSID eindeutig zugeordnet werden.": "Open items could not be uniquely assigned to a single document in BSID.",
  "Offene Posten konnten keinem Einzelbeleg zugeordnet werden.": "Open items could not be assigned to a single document.",
  "Vollständig genehmigt (Fristgerechter Skontoabzug 2%)": "Fully approved (cash discount 2% taken on time)",
  "Automatischer OP-Ausgleich ohne Restposten": "Automatic open item clearing without residual items",
  "Freigegeben zur automatischen Buchung": "Approved for automatic posting",
  "Regelprüfung: Fristgerechter Skontoabzug, vollständiger Ausgleich genehmigt.": "Rule check: on-time cash discount, full clearing approved.",
  "Genehmigt": "Approved",
  "Ausgleich mit Verrechnungsgutschrift GS-9901": "Clearing with offsetting credit memo GS-9901",
  "Autonom freigegeben": "Approved autonomously",
  "Agentisches Framework (Stufe 5): Differenz von 600 € mit Gutschrift GS-9901 vollautomatisch ausgeglichen.": "Agentic framework (level 5): difference of €600 cleared fully automatically with credit memo GS-9901.",
  "Buchhalter muss Genehmigung für 600 € Sonderdifferenz erteilen": "Accountant must grant approval for €600 special difference",
  "Copilot bittet Buchhalter um Entscheidung über 600 € Abzug.": "Copilot asks accountant for decision on €600 deduction.",
  "SKONTO_VERWEIGERT": "CASH_DISCOUNT_DENIED",
  "Skontotoleranz überschritten (Unberechtigter Abzug 600,00 €).": "Cash discount tolerance exceeded (unjustified deduction €600.00).",
  "Automatische Buchung verweigert: Unberechtigter Abzug 600 €.": "Automatic posting denied: unjustified deduction €600.",
  "Autonome Hauptbuch-Buchung ohne 4-Augen-Freigabe blockiert.": "Autonomous general ledger posting without four-eyes approval blocked.",
  "❌ SICHERHEITSSTOPP: Autonome FB05-Buchung ohne 4-Augen-Prinzip blockiert.": "❌ SAFETY STOP: autonomous FB05 posting without four-eyes principle blocked.",
  "0100084920 (SAP FI Hauptbuchbeleg)": "0100084920 (SAP FI general ledger document)",
  "Offene Posten in BSID/BSEG erfolgreich ausgeglichen": "Open items in BSID/BSEG successfully cleared",
  "RE-2026-9011 & RE-2026-9012 geschlossen": "RE-2026-9011 & RE-2026-9012 closed",
  "0,00 € (Keine Restdifferenz gebucht)": "€0.00 (no residual difference posted)",
  "Ausgleichsbeleg 140002910 gebucht; offene Posten in BSID ausgeglichen.": "Clearing document 140002910 posted; open items in BSID cleared.",
  "Erfolgreich mit Gutschrift GS-9901 gebucht": "Successfully posted with credit memo GS-9901",
  "Agentisches Framework (Stufe 5): Ausgleichsbeleg 140002910 in SAP FI gebucht; Posten ausgeglichen.": "Agentic framework (level 5): clearing document 140002910 posted in SAP FI; items cleared.",
  "AUF_VERRECHNUNGSKONTO_GEBUCHT": "POSTED_TO_SUSPENSE_ACCOUNT",
  "Konto 990100 (Zwischenkonto für unklare Posten)": "Account 990100 (suspense account for unclear items)",
  "Klärfall in SAP FI eröffnet wegen ungeklärter Differenz.": "Clarification case opened in SAP FI due to unexplained difference.",
  "Auf Verrechnungskonto gebucht; Klärfall in SAP FI eröffnet.": "Posted to suspense account; clarification case opened in SAP FI.",
  "Zahlungsavis ZA-2026-99120 revisionssicher im SAP Archiv abgelegt": "Payment advice ZA-2026-99120 stored audit-proof in SAP archive",
  "Buchungsprotokoll an Debitorenbuchhaltung übermittelt": "Posting log sent to accounts receivable",
  "Bankkontoauszug mit Avis 0100084920 abgestimmt": "Bank statement reconciled with advice 0100084920",
  "Vorgang vollständig abgeschlossen": "Case fully completed",
  "Assistant (LLM): Zahlungsbestätigung an Debitor per Prompt generiert.": "Assistant (LLM): payment confirmation to customer generated via prompt.",
  "Ausgleichsprotokoll archiviert und Beleg verknüpft.": "Clearing log archived and document linked.",
  "Zahlungsavis revisionssicher archiviert": "Payment advice archived audit-proof",
  "Kontoauszug erfolgreich abgestimmt": "Bank statement reconciled successfully",
  "Erfolgreich abgeschlossen (Selbstheilung)": "Successfully completed (self-healing)",
  "Agentisches Framework (Stufe 5): Zahlungsavis archiviert & Posten ausgeglichen.": "Agentic framework (level 5): payment advice archived & items cleared.",
  "Beleg im Klärungsvorrat abgelegt": "Document placed in clarification backlog",
  "Klärungsanforderung an Debitorenbuchhalter versendet": "Clarification request sent to accounts receivable clerk",
  "Klärungsschleife eröffnet": "Clarification loop opened",
  "Klärungsanfrage an Debitorenbuchhaltung übermittelt.": "Clarification request sent to accounts receivable.",
  "Elektronische Eingangsrechnung (PDF / ZUGFeRD)": "Electronic incoming invoice (PDF / ZUGFeRD)",
  "Rechnung_RE-2026-8812.pdf (Digital lesbar, 142 KB)": "Invoice_RE-2026-8812.pdf (digitally readable, 142 KB)",
  "Valide Lieferantenrechnung (MM-IV)": "Valid supplier invoice (MM-IV)",
  "Bosch Rexroth Partner GmbH (Kreditor 0000400120)": "Bosch Rexroth Partner GmbH (supplier 0000400120)",
  "Kein Duplikat gefunden (Negativ)": "No duplicate found (negative)",
  "Automatische DOX-Extraktion (SAP AI Core)": "Automated DOX extraction (SAP AI Core)",
  "Eingangsrechnung formal valide & kein Duplikat im System vorhanden.": "Incoming invoice formally valid & no duplicate in the system.",
  "Lieferantenrechnung (Rekonstruiert via MCP)": "Supplier invoice (reconstructed via MCP)",
  "Duplikatsausschluss via Historie bestätigt": "Duplicate excluded via history",
  "DE44 6005 0101 0001 2345 67 (aus Stammdaten ergänzt)": "DE44 6005 0101 0001 2345 67 (completed from master data)",
  "Automatische DOX-Extraktion": "Automated DOX extraction",
  "Agentisches Framework (Stufe 5): Maskierte IBAN aus Lieferantenstamm rekonstruiert & Scan entzerrt.": "Agentic framework (level 5): masked IBAN reconstructed from supplier master & scan de-skewed.",
  "Lieferantenrechnung (Prüfung erforderlich)": "Supplier invoice (review required)",
  "Scan unvollständig / IBAN maskiert. Sichtung durch Buchhalter empfohlen.": "Scan incomplete / IBAN masked. Review by accountant recommended.",
  "Klärungskorb Kreditorenbuchhaltung": "Accounts payable clarification basket",
  "Copilot legt Eingangsrechnung dem Kreditorenbuchhalter zur Sichtung vor.": "Copilot presents incoming invoice to the accounts payable clerk for review.",
  "Eingangsbeleg fehlerhaft": "Incoming document faulty",
  "Kreditor-IBAN nicht lesbar und Scanqualität unzureichend.": "Supplier IBAN not readable and scan quality insufficient.",
  "Klärungsvorrat Kreditorenbuchhaltung": "Accounts payable clarification backlog",
  "Eingangsbeleg gestoppt: Fehlende Pflichtfelder in Rechnung.": "Incoming document stopped: missing mandatory fields in invoice.",
  "WE-500129 (Lieferschein LS-7710)": "WE-500129 (delivery note LS-7710)",
  "722,00 € (19% Vorsteuer)": "€722.00 (19% input tax)",
  "Proportional-Wegeventil 4WRAE": "Proportional directional valve 4WRAE",
  "14 Tage 3% Skonto, 30 Tage netto": "14 days 3% cash discount, 30 days net",
  "3-Wege-Match gegen Bestellung & WE (Orient)": "3-way match against purchase order & GR (Orient)",
  "SAP Document AI (DOX): Kopf- und Positionsdaten vollständig extrahiert.": "SAP Document AI (DOX): header and line item data fully extracted.",
  "Wegeventil 4WRAE": "Directional valve 4WRAE",
  "Verpackungszuschlag": "Packaging surcharge",
  "1 PAU": "1 PKG",
  "Preisabweichung (+4,50 €) durch Nebenkosten festgestellt.": "Price variance (+€4.50) due to ancillary costs detected.",
  "3-Wege-Match mit Toleranzprüfung": "3-way match with tolerance check",
  "Extraktion mit Unsicherheiten: 4,50 € Nebenkosten aus Freitext isoliert.": "Extraction with uncertainties: €4.50 ancillary costs isolated from free text.",
  "PO-88201 (Status: Freigegeben)": "PO-88201 (status: released)",
  "WE-500129 (Gebucht am 29.09.2026)": "WE-500129 (posted on 29.09.2026)",
  "0000400120 (Aktiv / Stammdaten konform)": "0000400120 (active / master data compliant)",
  "10 ST (100% geliefert)": "10 PC (100% delivered)",
  "0,00 € (Identisch mit Bestellung)": "€0.00 (identical to purchase order)",
  "0 ST (Vollständig geliefert)": "0 PC (fully delivered)",
  "BESTAETIGT (PO / WE / RE 100% deckungsgleich)": "CONFIRMED (PO / GR / IR 100% congruent)",
  "Kaufmännische Prüfung & Skontoberechnung (Decide)": "Commercial check & cash discount calculation (Decide)",
  "HANA In-Memory Match: 3-Wege-Abgleich (Bestellung, WE, Rechnung) ohne Abweichung bestätigt.": "HANA in-memory match: 3-way match (purchase order, GR, invoice) confirmed without variance.",
  "+4,50 € (Verpackungskosten)": "+€4.50 (packaging costs)",
  "ABWEICHUNG_TOLERANZ_PRUEFEN": "VARIANCE_CHECK_TOLERANCE",
  "Toleranzprüfung (Decide)": "Tolerance check (Decide)",
  "3-Wege-Match: Mengen identisch, Preisabweichung von +4,50 € festgestellt.": "3-way match: quantities identical, price variance of +€4.50 detected.",
  "FREIGEGEBEN (Keine Preisabweichung)": "APPROVED (no price variance)",
  "3% Skonto bei Zahlung bis 15.10.2026": "3% cash discount for payment by 15.10.2026",
  "135,66 € (Reingewinn bei Skontoausnutzung)": "€135.66 (net gain when taking cash discount)",
  "SEPA-Überweisung (Zahllauf F110)": "SEPA credit transfer (payment run F110)",
  "Rechnerisch & kaufmännisch einwandfrei": "Arithmetically & commercially flawless",
  "Freigabeentscheidung (Decide)": "Approval decision (Decide)",
  "BRFplus Regelprüfung: Keine Abweichung, maximaler Skontoabzug (135,66 €) freigegeben.": "BRFplus rule check: no variance, maximum cash discount (€135.66) approved.",
  "INNERHALB_TOLERANZ (Abweichung 4,50 € <= 5,00 € Grenze)": "WITHIN_TOLERANCE (variance €4.50 <= €5.00 limit)",
  "+4,50 € (Geringfügige Nebenkosten)": "+€4.50 (minor ancillary costs)",
  "5,00 € (Automatische Kleinbetragsfreigabe)": "€5.00 (automatic small-amount approval)",
  "3% Skonto bis 15.10.2026": "3% cash discount until 15.10.2026",
  "Toleranzfreigabe gem. Einkaufsrichtlinie §4.2": "Tolerance approval per purchasing policy §4.2",
  "BRFplus Regelprüfung: 4,50 € liegt unter der 5,00 € Toleranzgrenze. Automatische Toleranzfreigabe.": "BRFplus rule check: €4.50 is below the €5.00 tolerance limit. Automatic tolerance approval.",
  "Rechnungsfreigabe blockiert (Guardrail Break)": "Invoice approval blocked (guardrail break)",
  "Autopilot auf irreversibler Verbuchung ohne Signatur verboten": "Autopilot on irreversible posting without signature prohibited",
  "Sicherheits-Gate aktiv: Buchung erfordert Copilot (HITL) oder deterministisches 4-Augen-Prinzip.": "Safety gate active: posting requires Copilot (HITL) or deterministic four-eyes principle.",
  "🚨 Guardrail-Verletzung: Autopilot auf irreversibler Rechnungsfreigabe gestoppt!": "🚨 Guardrail violation: Autopilot stopped on irreversible invoice approval!",
  "Freigabevorlage für Kreditorenbuchhaltung bereitgestellt": "Approval template provided for accounts payable",
  "4.522,00 € (inkl. 135,66 € Skonto)": "€4,522.00 (incl. €135.66 cash discount)",
  "Joule Copilot für Rechnungsprüfung": "Joule Copilot for invoice verification",
  "Freigabe zur automatischen MIRO-Verbuchung empfohlen": "Approval for automatic MIRO posting recommended",
  "Wartet auf Bestätigung durch Sachbearbeiter": "Waiting for confirmation by clerk",
  "Joule Copilot: Prüfbericht zusammengestellt. Sachbearbeiter gibt Beleg per Klick frei.": "Joule Copilot: review report compiled. Clerk approves document with one click.",
  "AUTORISIERT (Autonome Rechnungsfreigabe)": "AUTHORIZED (autonomous invoice approval)",
  "Level 1 (Wert <= 10.000 €)": "Level 1 (value <= €10,000)",
  "Rechnungsverbindung MM-IV / MIRO (Act)": "Invoice posting MM-IV / MIRO (Act)",
  "Autonome Rechnungsfreigabe erteilt. Beleg für MIRO-Verbuchung vorbereitet.": "Autonomous invoice approval granted. Document prepared for MIRO posting.",
  "Keine Buchung erfolgt": "No posting made",
  "Pausiert wegen fehlender Freigabe in Schritt 5": "Paused due to missing approval in step 5",
  "MM-IV Verbuchung ausgesetzt: Vorhergehende Freigabe nicht erteilt.": "MM-IV posting suspended: preceding approval not granted.",
  "5105600241 (MM-IV Rechnungsbeleg)": "5105600241 (MM-IV invoice document)",
  "1900004521 (BKPF / Hauptbuch)": "1900004521 (BKPF / general ledger)",
  "4.522,00 € (Vorsteuer 722,00 €)": "€4,522.00 (input tax €722.00)",
  "135,66 € (Zahlung bis 15.10.2026)": "€135.66 (payment by 15.10.2026)",
  "F110 Zahllauf automatisch vorgemerkt": "F110 payment run automatically scheduled",
  "ZUGFeRD Beleg revisionssicher im SAP Archiv archiviert": "ZUGFeRD document archived audit-proof in SAP archive",
  "Erfolgreich abgeschlossen": "Successfully completed",
  "MM-IV Clean Core RAP: Lieferantenrechnung 5105600241 verbindlich gebucht & Zahllauf aktiviert.": "MM-IV Clean Core RAP: supplier invoice 5105600241 posted bindingly & payment run activated.",
  "Elektronischer Belegeingang": "Electronic document inbound",
  "Formal geprüft und freigegeben": "Formally checked and approved",
  "Folgebearbeitung": "Follow-up processing",
  "Autonom durch agentische Werkzeuge ermittelt": "Determined autonomously by agentic tools",
  "Fehlende Attribute via Kontext-Lookup ergänzt": "Missing attributes completed via context lookup",
  "Eingangsdaten unvollständig. Vorlage an Sachbearbeiter zur Prüfung.": "Input data incomplete. Forwarded to clerk for review.",
  "Klärungsvorrat": "Clarification backlog",
  "Datenqualität unzureichend. Automatisierte Verarbeitung gestoppt.": "Data quality insufficient. Automated processing stopped.",
  "Manuelle Klärung": "Manual clarification",
  "Verbuchung gestoppt (Guardrail Break)": "Posting stopped (guardrail break)",
  "Autopilot auf irreversibler ERP-Mutation verboten": "Autopilot on irreversible ERP mutation prohibited",
  "Sicherheits-Gate aktiv: Reversibilität >= 4 erfordert menschliche Freigabe (Copilot) oder deterministische Prüfung.": "Safety gate active: reversibility >= 4 requires human approval (Copilot) or deterministic check.",
  "Pausiert": "Paused",
  "Erfolgreich strukturiert": "Successfully structured",
  "VORGANG-2026": "CASE-2026",
  "Standardposition": "Standard item",
  "100% syntaktisch valide": "100% syntactically valid",
  "Folgeschritt": "Next step",
  "Stammdaten eindeutig zugeordnet": "Master data uniquely assigned",
  "SAP Stammdatenabgleich": "SAP master data matching",
  "Regelprüfung": "Rule check",
  "Prüfbericht zusammengestellt": "Review report compiled",
  "Freigabe zur Systemverbuchung empfohlen": "Approval for system posting recommended",
  "Wartet auf Freigabe durch Sachbearbeiter": "Waiting for approval by clerk",
  "Richtlinien & Schwellenwerte eingehalten": "Policies & thresholds complied with",
  "Freigabe autorisiert": "Approval authorized",
  "Systemverbuchung": "System posting",
  "Verbindlich im ERP gebucht": "Bindingly posted in ERP",
  "Irreversibel (Endgültig)": "Irreversible (final)",
  "Kompensierbar (Storno möglich)": "Compensable (reversal possible)",
  "Revisionssicher archiviert": "Archived audit-proof",
  "Verbuchung erfolgreich abgeschlossen": "Posting completed successfully",
  "Abschlussdokument & Bestätigung generiert": "Final document & confirmation generated",
  "Prozessdurchlauf erfolgreich abgeschlossen": "Process run completed successfully",
  "Erfolgreich verarbeitet": "Successfully processed",
  "Schritt erfolgreich abgeschlossen": "Step completed successfully",
  "Sachbearbeiter-Klärung erforderlich": "Clerk clarification required",
  "Qualitätsabweichung festgestellt. Prüfung durch Sachbearbeiter erforderlich.": "Quality deviation detected. Review by clerk required.",
  "Konfidenz unter Schwellenwert. Manuelle Überprüfung erforderlich.": "Confidence below threshold. Manual review required.",
};

const normalizeEnglishFormats = (s: string): string =>
  s
    // Currency: 2.880,00 € -> €2,880.00
    .replace(/(\d{1,3}(?:\.\d{3})*),(\d{2})\s?€/g, (_m, int: string, cents: string) => `€${int.replace(/\./g, ',')}.${cents}`)
    // Currency without cents: 150.000 € -> €150,000 / 600 € -> €600
    .replace(/(\d{1,3}(?:\.\d{3})*|\d+)\s€/g, (_m, int: string) => `€${int.replace(/\./g, ',')}`)
    // Dates: 15.10.2026 -> 2026-10-15
    .replace(/\b(\d{2})\.(\d{2})\.(\d{4})\b/g, '$3-$2-$1')
    // Times: 17:42 Uhr -> 17:42
    .replace(/(\d{1,2}:\d{2}) Uhr\b/g, '$1')
    // Units: 12 ST -> 12 PC
    .replace(/\b(\d+) ST\b/g, '$1 PC')
    // Plants: Werk 1010 -> Plant 1010
    .replace(/\bWerk (\d{4})\b/g, 'Plant $1');

const TECHNIQUE_TRANSLATIONS: Record<string, string> = {
  'Regelbasierter Fast-Path (ABAP / BRFplus)': 'Rule-based fast-path (ABAP / BRFplus)',
  'Deterministische Parsing-Regeln (ABAP / Regex)': 'Deterministic parsing rules (ABAP / Regex)',
  'ABAP Regex, BRFplus Decision Tables & OData Engine': 'ABAP Regex, BRFplus Decision Tables & OData Engine',
  'Prompt-basiertes LLM (Single-Turn: Text in ➔ Text out)': 'Prompt-based LLM (Single-Turn: Text in ➔ Text out)',
  'Joule LLM mit interaktiver Sachbearbeiter-Freigabe': 'Joule LLM with interactive clerk review & approval',
  'Autonomer Single-Agent mit Tool-Calling & Konfidenz-Gate': 'Autonomous single-agent with tool calling & confidence gate',
  'Multi-Agent ReAct Swarm mit iterativer Selbstheilung': 'Multi-agent ReAct swarm with iterative self-healing',
  'Deterministisch': 'Deterministic',
  'Assistant (Klassisches LLM)': 'Assistant (Classic LLM)',
  'Copilot (Joule & Review)': 'Copilot (Joule & Review)',
  'Autopilot (Tool-Agent)': 'Autopilot (Tool-Agent)',
  'Agentic (Multi-Agent Swarm)': 'Agentic (Multi-Agent Swarm)',
};

const translateDynamicGermanToEnglish = (s: string): string => {
  if (EN_TEXT[s]) return EN_TEXT[s];
  if (TECHNIQUE_TRANSLATIONS[s]) return TECHNIQUE_TRANSLATIONS[s];

  let res = s;
  // Prefixes & Archetypes
  res = res.replace(/^Deterministisch:\s*/, 'Deterministic: ');
  res = res.replace(/^(Assistent|Assistant):\s*/, 'Assistant: ');
  res = res.replace(/^Copilot:\s*/, 'Copilot: ');
  res = res.replace(/^Autopilot:\s*/, 'Autopilot: ');
  res = res.replace(/^Agentic Swarm:\s*/, 'Agentic Swarm: ');
  res = res.replace(/^Agentisches Framework \(Stufe 5\):\s*/, 'Agentic framework (Tier 5): ');

  // Messaging & actions
  res = res.replace(/SMS an ([^,]+) versendet/g, 'SMS sent to $1');
  res = res.replace(/SMS an Leitstand versendet/g, 'SMS sent to control room');
  res = res.replace(/Buchungsprotokoll an ([^,]+) übermittelt/g, 'Posting log transmitted to $1');
  res = res.replace(/revisionssicher im SAP Archiv abgelegt/g, 'stored audit-proof in SAP archive');
  res = res.replace(/revisionssicher archiviert/g, 'audit-proof archived');
  res = res.replace(/Erfolgreich in SAP S\/4HANA gebucht/g, 'Successfully posted in SAP S/4HANA');
  res = res.replace(/Erfolgreich in SAP S\/4HANA angelegt/g, 'Successfully created in SAP S/4HANA');
  res = res.replace(/Erfolgreich versendet/g, 'Successfully sent');
  res = res.replace(/Erfolgreich disponiert/g, 'Successfully dispatched');
  res = res.replace(/Erfolgreich abgeschlossen/g, 'Successfully completed');
  res = res.replace(/Selbstheilung abgeschlossen/g, 'self-healing completed');
  res = res.replace(/Konfidenz unzureichend, an Klärungsvorrat übermittelt\./g, 'Confidence insufficient, transferred to clarification backlog.');
  res = res.replace(/an Klärungsvorrat übermittelt/g, 'transferred to clarification backlog');
  res = res.replace(/an Klärungsschlange übergeben/g, 'transferred to clarification queue');
  res = res.replace(/Wartet auf Disponenten-Entscheidung/g, 'Waiting for dispatcher decision');
  res = res.replace(/Wartet auf manuelle Klärung/g, 'Waiting for manual clarification');
  res = res.replace(/Wartet auf Prüfung durch Buchhaltung/g, 'Waiting for accounting review');
  res = res.replace(/Manuelle Freigabe erforderlich/g, 'Manual approval required');
  res = res.replace(/Manuelle Freigabe durch Disponenten erforderlich/g, 'Manual approval by dispatcher required');
  res = res.replace(/Disponent muss ([^,]+) freigeben/g, 'Dispatcher must approve $1');
  res = res.replace(/Sachbearbeiter muss ([^,]+) bestätigen/g, 'Clerk must confirm $1');
  res = res.replace(/Buchhalter muss ([^,]+) erteilen/g, 'Accountant must grant $1');
  res = res.replace(/Verbuchung gestoppt\./g, 'Posting stopped.');
  res = res.replace(/Verbuchung wegen unvollständiger Belegdaten verweigert\./g, 'Posting denied due to incomplete document data.');
  res = res.replace(/Vorgang in Klärungsschlange übergeben\./g, 'Case handed over to clarification queue.');
  res = res.replace(/Auftrag (\d+) an Mobilgerät von ([^,]+) übertragen/g, 'Order $1 transferred to mobile device of $2');
  res = res.replace(/vor Ort \(Tor (\d+) ([^)]+)\)/g, 'on site (gate $1 $2)');
  res = res.replace(/Verbindliche Kundenbestellung/g, 'Binding customer sales order');
  res = res.replace(/Kunden-Freitext/g, 'Customer free text');
  res = res.replace(/Digitalisiert/g, 'Digitized');
  res = res.replace(/Rekonstruiert/g, 'Reconstructed');
  res = res.replace(/Unvollständig/g, 'Incomplete');
  res = res.replace(/Fehlende Pflichtfelder/g, 'Missing mandatory fields');
  res = res.replace(/Stammdaten nicht gefunden/g, 'Master data not found');
  res = res.replace(/Syntax-Fehler im Freitext/g, 'Syntax parse error in free text');
  res = res.replace(/Notfall-Störungsmeldung/g, 'Emergency fault report');
  res = res.replace(/Produktionsstillstand droht/g, 'Production standstill imminent');
  res = res.replace(/Valides Zahlungsavis/g, 'Valid payment advice');
  res = res.replace(/Valide Lieferantenrechnung/g, 'Valid supplier invoice');
  res = res.replace(/Automatischer OP-Ausgleich ohne Restposten/g, 'Automatic open item clearing without residual items');
  res = res.replace(/Freigegeben zur automatischen Buchung/g, 'Approved for automatic posting');
  res = res.replace(/Ausgleichsbeleg (\d+) gebucht/g, 'Clearing document $1 posted');
  res = res.replace(/offene Posten in BSID ausgeglichen/g, 'open items in BSID cleared');
  res = res.replace(/3-Wege-Match/g, '3-Way Match');
  res = res.replace(/Bestellung/g, 'Purchase Order');
  res = res.replace(/Wareneingang/g, 'Goods Receipt');
  res = res.replace(/Rechnung/g, 'Invoice');
  res = res.replace(/Stimmig/g, 'Consistent / Matched');
  res = res.replace(/Toleranzprüfung/g, 'Tolerance check');
  res = res.replace(/Eingehalten/g, 'Within tolerance');
  res = res.replace(/Automatische Freigabe/g, 'Automatic release');
  res = res.replace(/Erteilt/g, 'Granted');
  res = res.replace(/Rechnungsprüfung/g, 'Invoice verification');
  res = res.replace(/Erfolgreich/g, 'Successful');
  res = res.replace(/Zahllauf-Vormerkung/g, 'Payment run scheduling');
  res = res.replace(/Vorgemerkt/g, 'Scheduled');

  return res;
};

const toEnglish = (s?: string): string => {
  if (!s) return '';
  return normalizeEnglishFormats(translateDynamicGermanToEnglish(s));
};

const localizeValue = (value: any, language: Language): any => {
  if (language !== 'en') return value;
  if (typeof value === 'string') return toEnglish(value);
  if (Array.isArray(value)) return value.map((v) => localizeValue(v, language));
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = localizeValue(v, language);
    return out;
  }
  return value;
};

export class DryRunEngine {
  public static execute(
    steps: ProcessStep[],
    templateId: string = 'scope-bd9',
    quality: MessageQuality = 'good',
    customText?: string | null,
    customSender?: string | null,
    customSubject?: string | null,
    language: Language = 'de'
  ): DryRunExecutionResult {
    const sample: ProcessSampleMessage = getSampleMessage(templateId, quality, language);
    const activeText = customText !== undefined && customText !== null ? customText : sample.rawText;
    const activeSender = customSender || sample.sender;
    const activeSubject = customSubject || sample.subject;

    // Dynamische Erkennung bei Schulungs-Manipulation:
    let isGood = quality === 'good';
    if (customText !== undefined && customText !== null) {
      if (templateId === 'scope-2f1') {
        isGood = activeText.includes('10084721') || activeText.toLowerCase().includes('ksb multitec');
      } else if (templateId === 'scope-bd9') {
        isGood = activeText.includes('FL-9021') || activeText.includes('MMB-9021');
      } else if (templateId === 'scope-j60') {
        isGood = activeText.includes('RE-2026-');
      } else if (templateId === 'scope-2b6') {
        isGood = activeText.includes('RE-2026-8812') || activeText.includes('PO-88201');
      } else if (templateId === 'scope-j45') {
        isGood = activeText.includes('6205') || activeText.includes('4210');
      } else if (templateId === 'scope-1ga') {
        isGood = activeText.includes('PG-200') || activeText.includes('10009823');
      } else if (templateId === 'scope-1mb') {
        isGood = activeText.includes('C8891') || activeText.includes('580');
      } else if (templateId === 'scope-bj2') {
        isGood = activeText.includes('10048201') || activeText.toLowerCase().includes('hydraulik');
      } else if (templateId === 'scope-1b6') {
        isGood = activeText.includes('34012345') || activeText.includes('DESADV');
      } else if (templateId === 'scope-1e6') {
        isGood = activeText.includes('SN-882910-K') || activeText.includes('CU-400');
      } else {
        isGood = activeText.trim().length > 30;
      }
    }

    const traces: DryRunStepTrace[] = [];
    let hasGuardrailBreak = false;
    let hasEscalation = false;
    let totalLatencyMs = 0;
    let totalTokens = 0;
    let totalCapacityUnits = 0;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const arch = step.currentArchetype;
      const tech = TECHNIQUE_INFO[arch] || TECHNIQUE_INFO.deterministic;

      let status: DryRunStepTrace['status'] = 'success';
      let latencyMs = tech.baseLatency;
      let tokensUsed = tech.baseTokens;
      let subCalls = tech.subCalls;
      let confidence = isGood ? 0.98 : 0.55;
      let isSelfHealed = false;
      let logMessage = '';
      const triggeredChallenges: string[] = [];
      let stepInput: any = {};
      let stepOutput: any = {};

      const canSwarmSelfHeal = !isGood && arch === 'agentic';

      // =========================================================================
      // SCENARIO 1: Sell from Stock (BD9)
      // =========================================================================
      if (templateId === 'scope-bd9') {
        if (i === 0) {
          // 1. Triage
          stepInput = {
            vorgang: 'E-Mail Eingang (sales@firma.de)',
            absender: activeSender,
            betreff: activeSubject,
            belegdatei: 'Bestellung_4711.pdf',
            eingangszeit: sample.receivedAt,
          };

          if (isGood) {
            confidence = arch === 'deterministic' ? 1.0 : 0.98;
            stepOutput = {
              vorgang: 'Verbindliche Kundenbestellung',
              absender: 'Müller Maschinenbau GmbH (k.meier@mueller-maschinenbau.de)',
              betreff: 'Bestellung zu Angebot AN-2026-88',
              referenz: 'Angebot AN-2026-88',
              belegdatei: 'Bestellung_4711.pdf (Digital lesbar, 124 KB)',
              prioritaet: 'Hoch (Wunschtermin 15.10.2026)',
              weiterleitung: 'Automatische Belegextraktion (SALES_PROCESSING)',
            };
            if (arch === 'deterministic') {
              logMessage = 'Deterministische Regel: Betreff AN-2026-88 exakt erkannt. Sofortige Triage (100%).';
            } else if (arch === 'classic_ml') {
              logMessage = 'HANA ML Klassifikator: Text mit 98.4% Wahrscheinlichkeit als Bestellung klassifiziert.';
            } else if (arch === 'copilot') {
              logMessage = 'Joule Copilot: Bestellabsicht verstanden, Priorität hoch (Lieferung 15.10.).';
            } else if (arch === 'autopilot') {
              logMessage = 'Autopilot: Tool classify_order_intent ausgeführt. Konfidenz 98% > Gate 85%.';
            } else {
              logMessage = 'Agentic Swarm: Triage-Agent & Intent-Agent haben Einstufung einstimmig bestätigt.';
            }
          } else {
            // POOR MESSAGE (web.de, kein Betreff)
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.91;
              isSelfHealed = true;
              subCalls = 3;
              tokensUsed = 1850;
              latencyMs = 1200;
              stepOutput = {
                vorgang: 'Verbindliche Kundenbestellung (Rekonstruiert)',
                absender: 'Müller Maschinenbau GmbH (via Klaus Meier)',
                betreff: '(Kein Betreff angegeben)',
                referenz: 'Angebot AN-2026-88 (aus Historie via MCP ermittelt)',
                belegdatei: 'Kunden-Freitext (Digitalisiert)',
                prioritaet: 'Hoch',
                weiterleitung: 'Automatische Belegextraktion',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Historien-Agent ermittelt Firmenbezug von klaus.baustelle88@web.de autonom via MCP!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.68;
              stepOutput = {
                vorgang: 'Unklare Mitteilung (Klärfall erforderlich)',
                absender: 'klaus.baustelle88@web.de',
                betreff: '(Kein Betreff)',
                prioritaet: 'Mittel',
                weiterleitung: 'Manueller Klärungskorb für Sachbearbeiter',
              };
              logMessage = 'Copilot fasst Unklarheiten zusammen und bereitet Klärung für Sachbearbeiter vor.';
            } else if (arch === 'deterministic') {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                vorgang: 'ABBRUCH (Syntax-Fehler)',
                absender: 'klaus.baustelle88@web.de',
                fehler: 'Betreffzeile & Text entsprechen keiner bekannten Bestellanfrage-Schablone.',
              };
              logMessage = 'ABBRUCH: Deterministischer Parser scheitert an unstrukturiertem Freitext ohne Betreff.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.52;
              stepOutput = {
                vorgang: 'Unklare Einstufung (Konfidenz zu gering)',
                absender: 'klaus.baustelle88@web.de',
                weiterleitung: 'Klärungswarteschlange',
              };
              logMessage = 'Konfidenz unter Schwellenwert. Vorgang an Klärungswarteschlange übergeben.';
            }
          }
        } else if (i === 1) {
          // 2. Extraktion
          stepInput = traces[0]?.outputData || {};

          if (isGood) {
            confidence = arch === 'deterministic' ? 1.0 : 0.97;
            stepOutput = {
              bestellnummer: 'PO-4711-AUG',
              belegdatum: '04.10.2026',
              liefertermin: '15.10.2026',
              lieferort: 'Werk Augsburg, Tor 3 (Wareneingang)',
              zahlungskonditionen: '30 Tage netto, 14 Tage 2% Skonto',
              positionen: [
                { pos: '10', artikel: 'Präzisionsflansch Stahl DIN 2633 (FL-9021)', menge: '12 ST', einzelpreis: '240,00 €', gesamt: '2.880,00 €' },
                { pos: '20', artikel: 'Hochdruck-Dichtungssatz EPDM (DI-4410)', menge: '24 ST', einzelpreis: '80,00 €', gesamt: '1.920,00 €' },
              ],
              gesamtbetragNetto: '4.800,00 €',
            };
            if (arch === 'deterministic') {
              logMessage = 'Tabellen-Parser: 2 Positionen, Tor 3 und Termine fehlerfrei extrahiert.';
            } else if (arch === 'classic_ml') {
              logMessage = 'NER Entitäts-Modell: Positionen und Termine mit 96.5% Konfidenz isoliert.';
            } else if (arch === 'copilot') {
              logMessage = 'Joule Copilot: Positionen & Sonderanweisung "Tor 3" strukturiert.';
            } else if (arch === 'autopilot') {
              logMessage = 'Autopilot: Tool extract_sales_order_lines liefert valides Positionsschema.';
            } else {
              logMessage = 'Agentic Swarm: Mengeneinheiten gegen ISO-Norm validiert und Positionen bestätigt.';
            }
          } else {
            // POOR
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.92;
              isSelfHealed = true;
              subCalls = 3;
              tokensUsed = 1950;
              latencyMs = 1350;
              stepOutput = {
                bestellnummer: 'PO-4711-AUG (Rekonstruiert via MCP)',
                belegdatum: '04.10.2026',
                liefertermin: '15.10.2026',
                lieferort: 'Werk Augsburg, Tor 3 (Wareneingang)',
                positionen: [
                  { pos: '10', artikel: 'Präzisionsflansch Stahl (FL-9021)', menge: '10 ST', einzelpreis: '240,00 €', gesamt: '2.400,00 €' },
                  { pos: '20', artikel: 'EPDM Dichtungssatz (DI-4410)', menge: '10 ST', einzelpreis: '80,00 €', gesamt: '800,00 €' },
                ],
                gesamtbetragNetto: '3.200,00 €',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Vorbeleg-Agent gleicht "runde Flansche" mit Vorauftrag ab und rettet Artikel-IDs via MCP!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.69;
              stepOutput = {
                bestellnummer: 'PO-UNBEKANNT',
                lieferort: 'Unvollständig',
                positionen: [
                  { pos: '10', artikel: 'runde Flansche (FL-9021 vermutet)', menge: '10 ST', einzelpreis: '240,00 €', gesamt: '2.400,00 €' },
                ],
                hinweis: 'Sachbearbeiter muss Materialnummer und Dichtungen bestätigen',
              };
              logMessage = 'Copilot schlägt dem Sachbearbeiter vor: "Meint der Kunde FL-9021 aus Angebot AN-2026-88?"';
            } else if (arch === 'deterministic') {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                fehler: 'SYNTAX_PARSE_ERROR',
                grund: 'Keine Artikelnummern oder strukturierte Tabelle im unstrukturierten Text auffindbar.',
              };
              logMessage = 'ABBRUCH: Deterministischer Parser scheitert an Umgangssprache ("runde Flansche wie neulich").';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.55;
              stepOutput = {
                fehler: 'FEHLENDE_PFLICHTFELDER',
                grund: 'Artikelnummern und Mengeneinheiten fehlen im Text.',
              };
              logMessage = 'Autopilot-Gate: Unvollständige Pflichtfelder blockieren autonome Extraktion.';
            }
          }
        } else if (i === 2) {
          // 3. Matching
          stepInput = traces[1]?.outputData || {};

          if (isGood) {
            confidence = arch === 'deterministic' ? 1.0 : 0.985;
            stepOutput = {
              kunnr: '0000100420 (Müller Maschinenbau GmbH, Augsburg)',
              partnerRolle: 'AG (Auftraggeber) / WE (Warenempfänger Werk Augsburg)',
              bonitaet: 'Klasse A (Kreditlinie: 150.000 €)',
              sapArtikel: [
                { pos: '10', matnr: '10084721', maraText: 'Flansch DN100 PN16 Stahl 1.4571', werk: 'Werk 1010' },
                { pos: '20', matnr: '10091204', maraText: 'Dichtung EPDM DN100 PN16', werk: 'Werk 1010' },
              ],
              stammDatenStatus: 'Vollständig zugeordnet & verifiziert gegen SAP S/4HANA',
            };
            if (arch === 'deterministic') {
              logMessage = 'Exakter Key-Lookup: KUNNR 0000100420 & MARA-Stammdaten in 4ms bestätigt.';
            } else if (arch === 'classic_ml') {
              logMessage = 'SAP HANA Fuzzy Search: Trigram-Score 0.985 bestätigt KUNNR & MARA.';
            } else if (arch === 'copilot') {
              logMessage = 'Copilot verknüpft Debitor & zeigt Kredit-Historie für Sachbearbeiter an.';
            } else if (arch === 'autopilot') {
              logMessage = 'Autopilot: Tool sap_odata_partner_lookup bestätigt Debitor autonom.';
            } else {
              logMessage = 'Agentic Swarm: Debitor, Werk 1010 und Lagerbestand für Tor 3 verifiziert.';
            }
          } else {
            // POOR
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.94;
              isSelfHealed = true;
              subCalls = 3;
              tokensUsed = 1600;
              latencyMs = 1100;
              stepOutput = {
                kunnr: '0000100420 (Müller Maschinenbau GmbH)',
                partnerRolle: 'AG (Auftraggeber)',
                sapArtikel: [
                  { pos: '10', matnr: '10084721', maraText: 'Flansch DN100 PN16 (aus Vorbeleg ermittelt)', werk: 'Werk 1010' },
                  { pos: '20', matnr: '10091204', maraText: 'Dichtung EPDM (aus Vorbeleg ermittelt)', werk: 'Werk 1010' },
                ],
                stammDatenStatus: 'Autonom über Multi-Hop Graph via MCP zugeordnet',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Graph-Agent verknüpft Bauleiter mit Angebot AN-2026-88 autonom!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.72;
              stepOutput = {
                kunnr: '0000100420 (Müller Maschinenbau GmbH vermutet)',
                hinweis: 'Soll Debitor anhand der Lieferadresse zugeordnet werden?',
                stammDatenStatus: 'Manuelle Freigabe erforderlich',
              };
              logMessage = 'Copilot präsentiert Kandidatenliste dem Sachbearbeiter zur Bestätigung.';
            } else if (arch === 'deterministic') {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                fehler: 'STAMMDATEN_NICHT_GEFUNDEN',
                grund: 'Absender nicht in KNA1. Keine Treffer für unstrukturierte Materialbezeichnung.',
              };
              logMessage = 'FEHLER: Debitor und Material in SAP S/4HANA nicht eindeutig identifizierbar.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.58;
              stepOutput = {
                kunnr: 'UNBEKANNT',
                stammDatenStatus: 'Ähnlichkeit unter Schwellenwert (58%)',
              };
              logMessage = 'Autopilot-Gate: Konfidenz 58% < 85%. Verbuchungsvorbereitung abgebrochen.';
            }
          }
        } else if (i === 3) {
          // 4. Decision (ATP & Kredit)
          stepInput = traces[2]?.outputData || {};

          if (isGood) {
            confidence = 1.0;
            stepOutput = {
              kreditlimitPruefung: 'Freigegeben (Beanspruchung 32.400 € / 150.000 €)',
              verfuegbarkeitAtp: 'Bestätigt (Werk 1010: 84 ST sofort verfügbar)',
              terminPruefung: 'Wunschtermin 15.10.2026 zugesagt',
              freigabestatus: 'Automatische Freigabe erteilt (Keine Liefersperre)',
            };
            if (arch === 'deterministic') {
              logMessage = 'BRFplus Regelwerk: Kreditlimit & ATP positiv für 15.10. Freigabe erteilt.';
            } else if (arch === 'classic_ml') {
              logMessage = 'Risikomodell: Ausfallwahrscheinlichkeit 0.2%. Automatische Freigabe empfohlen.';
            } else if (arch === 'copilot') {
              logMessage = 'Copilot zeigt ATP-Status grün. Sachbearbeiter autorisiert Buchung per 1-Klick.';
            } else if (arch === 'autopilot') {
              logMessage = 'Autopilot: Autonome Freigabeentscheidung nach BRFplus-Regelwerk ausgeführt.';
            } else {
              logMessage = 'Agentic Swarm: Policy-Agent & Risk-Agent genehmigen Express-Lieferung.';
            }
          } else {
            // POOR
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.93;
              isSelfHealed = true;
              subCalls = 3;
              tokensUsed = 1750;
              latencyMs = 1150;
              stepOutput = {
                kreditlimitPruefung: 'Vorab-Freigabe erteilt (Stammkunde)',
                verfuegbarkeitAtp: 'Bestätigt (Kontingent für Tor 3 reserviert)',
                terminPruefung: 'Wunschtermin gehalten',
                freigabestatus: 'Autonom freigegeben (Agentisches Regelwerk)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Vorab-Bestandsprüfung auf FL-9021 (85 ST) & Kontingent autonom freigegeben!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                kreditlimitPruefung: 'Kreditlimit ausreichend',
                verfuegbarkeitAtp: 'Kurzfristige Sonderdisposition erforderlich',
                freigabestatus: 'Manuelle Freigabe erforderlich',
              };
              logMessage = 'Copilot warnt vor Liefertermin "morgen früh" und fordert Sonderfreigabe an.';
            } else if (arch === 'deterministic') {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                fehler: 'ATP_BLOCKIERT',
                grund: 'ATP-Prüfung unmöglich: Fehlende Materialnummer blockiert Regelausführung.',
              };
              logMessage = 'Regelwerk verweigert Freigabe: Stammdaten und Liefertermin unvalidiert.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.50;
              stepOutput = {
                freigabestatus: 'Entscheidung mangels Daten verweigert',
              };
              logMessage = 'Autopilot verweigert Entscheidung auf Basis unvollständiger Stammdaten.';
            }
          }
        } else if (i === 4) {
          // 5. Act (Verbuchung) - REVERSIBILITÄT 5 (SCHUTZPLANKE!)
          stepInput = traces[3]?.outputData || {};

          if (isGood) {
            // SCHUTZPLANKEN-PRÜFUNG!
            if (step.reversibility >= 4 && (arch === 'autopilot' || arch === 'agentic')) {
              status = 'error';
              hasGuardrailBreak = true;
              confidence = 0.0;
              stepOutput = {
                guardrailBreak: true,
                policy: 'SOX_GOBD_CLEAN_CORE_POLICY',
                grund: 'Autonome ERP-Mutation bei Reversibilität 5 verweigert. Human-Gatekeeper zwingend erforderlich!',
              };
              logMessage = '❌ SICHERHEITSSTOPP: Autonome ERP-Verbuchung ohne menschliche Signatur blockiert (Schutzplanke 5).';
            } else {
              stepOutput = {
                sapBelegnummer: '0045008921 (Kundenauftrag Standard TA)',
                verbuchungsStatus: 'Erfolgreich in SAP S/4HANA gebucht (VBAK / VBAP)',
                buchungsZeitpunkt: '04.10.2026, 17:42 Uhr',
                belegwertNetto: '4.800,00 € (Brutto inkl. 19% MwSt: 5.712,00 €)',
                auftraggeber: '0000100420 (Müller Maschinenbau GmbH)',
              };
              if (arch === 'deterministic') {
                logMessage = 'Deterministisch: Beleg 0045008921 in S/4HANA (VBAK/VBAP) via OData gebucht.';
              } else if (arch === 'classic_ml') {
                logMessage = 'Assistent: Validierte Payload an BAPI übergeben. Beleg 0045008921 gebucht.';
              } else {
                logMessage = 'Copilot: Sachbearbeiter autorisiert Buchung. Beleg 0045008921 in S/4HANA gebucht.';
              }
            }
          } else {
            // POOR
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.95;
              isSelfHealed = true;
              subCalls = 2;
              tokensUsed = 850;
              latencyMs = 600;
              stepOutput = {
                sapBelegnummer: '0045008921 (Kundenauftrag Standard TA)',
                verbuchungsStatus: 'Erfolgreich in SAP S/4HANA gebucht (VBAK / VBAP)',
                buchungsZeitpunkt: '04.10.2026, 17:42 Uhr',
                belegwertNetto: '3.200,00 € (Rekonstruierter Belegwert)',
                auftraggeber: '0000100420 (Müller Maschinenbau GmbH)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Rekonstruierte Stammdaten erfolgreich in S/4HANA (VBAK/VBAP) gebucht.';
            } else {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                verbuchungsStatus: 'ABGEBROCHEN',
                clearingTicket: 'CLR-2026-8819',
                grund: 'Verbuchung wegen unvollständiger Belegdaten verweigert.',
              };
              logMessage = 'Verbuchung gestoppt. Vorgang in Klärungsschlange übergeben.';
            }
          }
        } else {
          // 6. Bestätigung
          stepInput = traces[4]?.outputData || {};

          if (isGood) {
            confidence = 1.0;
            stepOutput = {
              erstellterBeleg: 'Auftragsbestätigung AB_0045008921.pdf',
              versandKanal: 'E-Mail an k.meier@mueller-maschinenbau.de',
              trackingNummer: 'TRK-AUG-2026-9912',
              versandstatus: 'Erfolgreich versendet & im SAP Archiv abgelegt',
            };
            if (arch === 'classic_ml') {
              logMessage = 'Assistant (LLM): Vollständig personalisiertes Kundenanschreiben per Prompt generiert.';
            } else if (arch === 'copilot') {
              logMessage = 'Copilot hat personalisiertes Anschreiben mit Tor-3-Hinweis formuliert & versandt.';
            } else {
              logMessage = 'Auftragsbestätigung mit PDF-Beleg an Kunden versendet.';
            }
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.99;
              isSelfHealed = true;
              stepOutput = {
                erstellterBeleg: 'Auftragsbestätigung AB_0045008921.pdf',
                versandKanal: 'E-Mail an k.meier@mueller-maschinenbau.de',
                trackingNummer: 'TRK-AUG-2026-9912',
                versandstatus: 'Erfolgreich versendet (Selbstheilung abgeschlossen)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Personalisierte Bestätigung mit rekonstruierten Positionen versandt.';
            } else {
              status = 'escalation';
              confidence = 0.85;
              stepOutput = {
                erstellterBeleg: 'Klärungs-E-Mail (Nachforderung Daten)',
                versandKanal: `E-Mail an ${activeSender}`,
                versandstatus: 'Klärungsanfrage versendet',
              };
              logMessage = 'Klärungs-E-Mail an Kunden versandt mit Bitte um Konkretisierung.';
            }
          }
        }
      }

      // =========================================================================
      // SCENARIO 2: Service Order Management (2F1)
      // =========================================================================
      else if (templateId === 'scope-2f1') {
        if (i === 0) {
          stepInput = {
            vorgang: 'Service Cloud Inbound (service@firma.de)',
            absender: activeSender,
            betreff: activeSubject,
            eingangszeit: sample.receivedAt,
          };
          if (isGood) {
            confidence = 0.99;
            stepOutput = {
              vorgang: 'Notfall-Störungsmeldung (Priorität 1)',
              absender: 'Chemiepark Süd (Markus Huber, Schichtleiter)',
              betreff: 'DRINGEND: Notfall Hochdruckpumpe P-204 ausgefallen',
              prioritaet: 'Prio 1 (Produktionsstillstand droht)',
              equipment: 'Hochdruckpumpe KSB Multitec P-204 (Equipment 10084721)',
              weiterleitung: 'Service-Einsatzsteuerung (SAP CS / PM)',
            };
            logMessage = 'Notfall-Triage: Prio 1 Stillstand an Polymerisationslinie 2 erkannt.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.92;
              isSelfHealed = true;
              subCalls = 3;
              tokensUsed = 1600;
              latencyMs = 1100;
              stepOutput = {
                vorgang: 'Notfall-Störungsmeldung (Rekonstruiert)',
                absender: 'Chemiepark Süd (via Markus Huber)',
                equipment: 'Pumpe P-204 (aus Historie via MCP ermittelt)',
                prioritaet: 'Prio 1 (Stillstand)',
                weiterleitung: 'Service-Einsatzsteuerung',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Standort und Anlagenbereich aus Text via MCP rekonstruiert!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                vorgang: 'Unklare Störungsmeldung (Klärfall)',
                absender: activeSender,
                hinweis: 'Störungsmeldung ungenau. Rückfrage bei Schichtleiter erforderlich.',
              };
              logMessage = 'Copilot markiert Störung zur manuellen Vorabklärung durch den Schichtleiter.';
            } else if (arch === 'deterministic') {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = { fehler: 'KEIN_FEHLERMUSTER_ERKANNT', grund: 'Keine standardisierte Störungsmeldung im Freitext erkannt.' };
              logMessage = 'ABBRUCH: Deterministischer Parser erkennt Fehlermuster nicht.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.54;
              stepOutput = { vorgang: 'Störungsmeldung ungenau (Konfidenz 54%)' };
              logMessage = 'Störungsmeldung ungenau (Konfidenz 54%). Human Review erforderlich.';
            }
          }
        } else if (i === 1) {
          // Störungsanalyse
          stepInput = traces[0]?.outputData || {};
          if (isGood) {
            confidence = 0.97;
            stepOutput = {
              stoermeldeNummer: 'NOTFALL-2026-P204',
              stillstandsBeginn: '04.10.2026, 06:30 Uhr',
              equipmentId: '10084721 (Pumpe P-204)',
              dringlichkeit: 'Prio 1 (Bandstillstand droht)',
              benoetigteErsatzteile: [
                { pos: '1', teil: 'Wälzlager-Satz KSB Typ 6308-2Z', menge: '2 ST' },
                { pos: '2', teil: 'Gleitringdichtung SiC/SiC/Viton', menge: '1 ST' },
              ],
            };
            logMessage = 'Extraktion: Equipment 10084721, Fehler E-4402 & Ersatzteile identifiziert.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.94;
              isSelfHealed = true;
              subCalls = 3;
              tokensUsed = 1700;
              latencyMs = 1200;
              stepOutput = {
                equipmentId: '10084721',
                resolvedVia: 'IOT_PRESSURE_DROP_TELEMETRY',
                symptom: 'Lagerschaden & Druckabfall auf 0 Bar um 08:35 Uhr',
                confidence: 0.94,
              };
              logMessage = 'Agentisches Framework (Stufe 5): IoT-Diagnose-Agent identifiziert Pumpe P-204 (10084721) anhand akuter Telemetrie!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.68;
              stepOutput = {
                suggestedEquipment: 'Pumpe P-204 (10084721)',
                actionRequired: 'Disponent muss Equipment-Zuordnung bestätigen',
                confidence: 0.68,
              };
              logMessage = 'Copilot schlägt Zuordnung zu Pumpe P-204 vor und bittet Disponent um Freigabe.';
            } else if (arch === 'deterministic') {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = { error: 'NO_EQUIPMENT_FOUND' };
              logMessage = 'Parser kann "große blaue Pumpe" keinem Stammdatenobjekt zuordnen.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.58;
              stepOutput = { symptom: 'Geruchsentwicklung / Ausfall', equipmentId: 'FEHLT', confidence: 0.58 };
              logMessage = 'Fehlerbild erfasst, aber Equipment- und Fehlercode fehlen vollständig.';
            }
          }
        } else if (i === 2) {
          // 3. Matching
          stepInput = traces[1]?.outputData || {};
          if (isGood) {
            confidence = 1.0;
            stepOutput = {
              equipment: 'Hochdruckpumpe KSB Multitec P-204 (10084721)',
              wartungsVertrag: 'SV-88102 (SLA Gold - 2h Vor-Ort-Garantie)',
              serviceObjekt: 'Kreiselpumpe Typ Multitec D DN50',
              garantieStatus: 'Wartungsvertrag aktiv (24/7 Vollabdeckung)',
              vertragsKunde: 'Chemiepark Süd Betriebsgemeinschaft',
              stammDatenStatus: 'Equipment & Servicevertrag in SAP CS/PM validiert',
            };
            logMessage = 'SAP IBASE / EQUI Match: Equipment 10084721 gefunden. SLA Gold aktiv!';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.93;
              isSelfHealed = true;
              stepOutput = {
                equipment: 'Hochdruckpumpe P-204 (10084721)',
                wartungsVertrag: 'SV-88102 (SLA Gold)',
                garantieStatus: 'Wartungsvertrag aktiv',
                stammDatenStatus: 'Autonom über IoT-Telemetrie via MCP zugeordnet',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Equipment 10084721 & SLA Gold Vertrag via MCP verknüpft!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                equipment: 'Pumpe P-204 (10084721 vermutet)',
                hinweis: 'Soll Vertrag SV-88102 (SLA Gold) zugeordnet werden?',
                stammDatenStatus: 'Manuelle Freigabe durch Disponenten erforderlich',
              };
              logMessage = 'Copilot schlägt dem Disponenten Zuordnung zu Vertrag SV-88102 vor.';
            } else {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                fehler: 'MEHRERE_PUMPEN_GEFUNDEN',
                grund: '14 Pumpen am Standort registriert. Eindeutige Equipment-ID fehlt im Text.',
              };
              logMessage = 'Matching fehlgeschlagen: 14 Pumpen am Standort gefunden, Zuordnung unmöglich.';
            }
          }
        } else if (i === 3) {
          // 4. SLA & Dispatch
          stepInput = traces[2]?.outputData || {};
          if (isGood) {
            confidence = 0.98;
            stepOutput = {
              reaktionsfrist: 'Maximal 2 Stunden (SLA Gold vertraglich garantiert)',
              disponierterTechniker: 'Thomas Meyer (TECH-042, Service-Team Hochdruck)',
              verfuegbarkeitTechniker: 'Sofort einsatzbereit (Fahrzeit: ca. 35 Minuten)',
              ersatzteilStatus: 'Wälzlagersatz im Servicefahrzeug vorrätig',
              freigabestatus: 'Notfalleinsatz autorisiert (Prio 1 Freigabe)',
            };
            logMessage = 'SLA Gold: Sofortiger Techniker-Einsatz innerhalb 2h genehmigt.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.95;
              isSelfHealed = true;
              stepOutput = {
                reaktionsfrist: '2 Stunden (SLA Gold)',
                disponierterTechniker: 'Thomas Meyer (TECH-042)',
                ersatzteilStatus: 'Teile reserviert',
                freigabestatus: 'Autonom disponiert (Agentische SLA-Prüfung)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Notfall-Techniker Thomas Meyer gemäß SLA-Vertrag autonom disponiert.';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                disponierterTechniker: 'Thomas Meyer (TECH-042 vorgeschlagen)',
                hinweis: 'Disponent muss Notfalleinsatz und Sonderfahrt freigeben',
                freigabestatus: 'Wartet auf Disponenten-Entscheidung',
              };
              logMessage = 'Copilot legt Disponenten Notfall-Freigabe für Techniker Thomas Meyer vor.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.40;
              stepOutput = {
                fehler: 'SLA_NICHT_ERMITTELBAR',
                grund: 'Vertragsklasse ohne Equipment-Zuordnung nicht bestimmbar.',
              };
              logMessage = 'SLA-Berechnung blockiert: Vertragsklasse unbestimmt.';
            }
          }
        } else if (i === 4) {
          // 5. Serviceauftrag anlegen (Mutation - Reversibilität 5)
          stepInput = traces[3]?.outputData || {};
          if (isGood) {
            if (step.reversibility >= 4 && (arch === 'autopilot' || arch === 'agentic')) {
              status = 'error';
              hasGuardrailBreak = true;
              confidence = 0.0;
              stepOutput = {
                guardrailBreak: true,
                policy: 'SAFETY_GOVERNANCE_POLICY',
                grund: 'Autonome ERP-Mutation bei Reversibilität 5 blockiert. Genehmigung zwingend erforderlich!',
              };
              logMessage = '❌ SICHERHEITSSTOPP: Autonomer Serviceauftrag ohne Genehmigung verweigert.';
            } else {
              stepOutput = {
                sapServiceauftrag: '00400019284 (SAP CS/PM Notfalleinsatz)',
                verbuchungsStatus: 'Erfolgreich in SAP S/4HANA gebucht (AUFK / AFKO)',
                buchungsZeitpunkt: '04.10.2026, 06:45 Uhr',
                kostenstelle: 'KST-4410 (Instandhaltung Polymerisation)',
                auftragsArt: 'SM01 (Notfall-Instandsetzung)',
              };
              logMessage = 'Serviceauftrag 400019284 in SAP S/4HANA (AUFK/AFKO) angelegt.';
            }
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.98;
              isSelfHealed = true;
              stepOutput = {
                sapServiceauftrag: '00400019284 (SAP CS/PM Notfalleinsatz)',
                verbuchungsStatus: 'Erfolgreich in SAP S/4HANA gebucht (AUFK / AFKO)',
                buchungsZeitpunkt: '04.10.2026, 06:45 Uhr',
                kostenstelle: 'KST-4410 (Instandhaltung Polymerisation)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Serviceauftrag 400019284 mit geheilten Equipment-Daten in SAP S/4HANA angelegt.';
            } else {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                verbuchungsStatus: 'ABGEBROCHEN',
                fehler: 'AUFTRAGSANLAGE_BLOCKIERT',
                grund: 'Fehlende Pflichtstammdaten verhindern Transaktionsbuchung.',
              };
              logMessage = 'Serviceauftrag verweigert: Vorgang an Callcenter-Klärung übergeben.';
            }
          }
        } else {
          // 6. Dispatch
          stepInput = traces[4]?.outputData || {};
          if (isGood) {
            confidence = 1.0;
            if (arch === 'classic_ml') {
              stepOutput = {
                dispatchKanal: 'SAP Field Service Management (FSM Mobile)',
                technikerStatus: 'Auftrag 00400019284 an Mobilgerät von Th. Meyer übertragen',
                smsKundenbenachrichtigung: 'SMS an Schichtleiter Markus Huber versendet',
                voraussichtlicheAnkunft: '07:20 Uhr vor Ort (Tor 1 Chemiepark Süd)',
                versandstatus: 'Erfolgreich disponiert & im System quittiert',
              };
              logMessage = 'Assistant (LLM): SMS-Benachrichtigung an den Kundenkontakt per Prompt generiert.';
            } else {
              stepOutput = {
                dispatchKanal: 'SAP Field Service Management (FSM Mobile)',
                technikerStatus: 'Auftrag 00400019284 an Mobilgerät von Th. Meyer übertragen',
                smsKundenbenachrichtigung: 'SMS an Schichtleiter Markus Huber versendet',
                voraussichtlicheAnkunft: '07:20 Uhr vor Ort (Tor 1 Chemiepark Süd)',
                versandstatus: 'Erfolgreich disponiert & im System quittiert',
              };
              logMessage = 'Techniker Thomas Meyer über SAP FSM disponiert & Kunde per SMS informiert.';
            }
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.99;
              isSelfHealed = true;
              stepOutput = {
                dispatchKanal: 'SAP Field Service Management (FSM Mobile)',
                technikerStatus: 'Auftrag erfolgreich übertragen',
                smsKundenbenachrichtigung: 'SMS an Leitstand versendet',
                versandstatus: 'Erfolgreich disponiert (Selbstheilung abgeschlossen)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Notfall-Techniker disponiert & Leitstand per SMS informiert.';
            } else {
              status = 'escalation';
              confidence = 0.60;
              stepOutput = {
                dispatchKanal: 'Manueller Rückruf',
                hinweis: 'Techniker-Dispatch pausiert. Klärungsanruf beim Kunden erforderlich.',
                versandstatus: 'Wartet auf manuelle Klärung',
              };
              logMessage = 'Techniker-Dispatch pausiert. Klärungsanruf bei Kunde initiiert.';
            }
          }
        }
      }

      // =========================================================================
      // SCENARIO 3: Accounts Receivable & Clearing (J60)
      // =========================================================================
      else if (templateId === 'scope-j60') {
        if (i === 0) {
          stepInput = {
            vorgang: 'Elektronisches Zahlungsavis (PDF / EDI)',
            absender: activeSender,
            betreff: activeSubject,
            belegdatei: 'Avis_2026_SH.pdf (Digital lesbar, 88 KB)',
            eingangszeit: sample.receivedAt,
          };
          if (isGood) {
            confidence = 0.99;
            stepOutput = {
              vorgang: 'Valides Zahlungsavis',
              absender: 'Siemens Healthineers AG (finance@healthineers.com)',
              avisNummer: 'ZA-2026-99120',
              avisBetrag: '14.280,00 €',
              bankKonto: 'DE89 7001 0080 0012 3456 78',
              weiterleitung: 'Automatische Avis-Extraktion (FI-AR)',
            };
            logMessage = 'Zahlungsavis vollständig & formal valide.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.91;
              isSelfHealed = true;
              stepOutput = {
                vorgang: 'Valides Zahlungsavis (Rekonstruiert via MCP)',
                absender: 'Siemens Healthineers AG',
                avisNummer: 'ZA-2026-99120 (aus Buchungszeile ermittelt)',
                avisBetrag: '14.280,00 €',
                weiterleitung: 'Automatische Avis-Extraktion',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Avis-Struktur trotz fehlender Headerdaten via MCP rekonstruiert.';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                vorgang: 'Zahlungsavis (Prüfung erforderlich)',
                absender: activeSender,
                hinweis: 'Avis unvollständig. Manuelle Sichtung durch Buchhalter empfohlen.',
                weiterleitung: 'Klärungskorb Debitorenbuchhaltung',
              };
              logMessage = 'Copilot legt Zahlungsavis dem Buchhalter zur Vorprüfung vor.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.58;
              stepOutput = {
                fehler: 'AVIS_UNVOLLSTAENDIG',
                grund: 'Pauschaler Abzug 600,00 € ohne Rechnungsbezug ausgewiesen.',
              };
              logMessage = 'Avis erfasst, aber ungeklärte Abzüge von 600 € festgestellt.';
            }
          }
        } else if (i === 1) {
          stepInput = traces[0]?.outputData || {};
          if (isGood) {
            confidence = 0.98;
            stepOutput = {
              avisNummer: 'ZA-2026-99120',
              zugeordneteRechnungen: [
                { pos: '1', rechnungsnr: 'RE-2026-9011', ursprungsbetrag: '8.000,00 €', skonto: '160,00 € (2%)', zahlbetrag: '7.840,00 €' },
                { pos: '2', rechnungsnr: 'RE-2026-9012', ursprungsbetrag: '6.571,43 €', skonto: '131,43 € (2%)', zahlbetrag: '6.440,00 €' },
              ],
              skontoAbzug: '291,43 € (2% vereinbarungsgemäß)',
              rechnungsSumme: '14.280,00 €',
              differenzBetrag: '0,00 € (Vollständig ausgeglichen)',
            };
            logMessage = '2 Rechnungen mit 2% Skontoabzug fehlerfrei extrahiert.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.93;
              isSelfHealed = true;
              stepOutput = {
                avisNummer: 'ZA-2026-99120',
                zugeordneteRechnungen: [
                  { pos: '1', rechnungsnr: 'RE-2026-9011', ursprungsbetrag: '8.000,00 €', skonto: '160,00 € (2%)', zahlbetrag: '7.840,00 €' },
                  { pos: '2', rechnungsnr: 'RE-2026-9012', ursprungsbetrag: '6.571,43 €', skonto: '131,43 € (2%)', zahlbetrag: '6.440,00 €' },
                ],
                skontoAbzug: '291,43 €',
                differenzBetrag: '0,00 € (Gutschrift GS-9901 über 600 € via MCP zugeordnet)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Dispute-Agent findet offene 600 € Gutschrift zu Reklamation!';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.62;
              stepOutput = {
                avisNummer: 'ZA-2026-99120',
                differenzBetrag: '600,00 € (ungeklärt)',
                hinweis: 'Sachbearbeiter muss Zuordnung der Differenz von 600,00 € bestätigen',
              };
              logMessage = 'Copilot bittet Sachbearbeiter um manuelle Differenzzuordnung.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.50;
              stepOutput = {
                fehler: 'RECHNUNGSZUORDNUNG_FEHLGESCHLAGEN',
                grund: 'Keine gültigen Rechnungsnummern im Avis-Freitext identifizierbar.',
              };
              logMessage = 'Warnung: Keine Rechnungsnummern im Avis genannt.';
            }
          }
        } else if (i === 2) {
          stepInput = traces[1]?.outputData || {};
          if (isGood) {
            confidence = 1.0;
            stepOutput = {
              kunnr: '0000300192 (Siemens Healthineers AG)',
              gefundeneOffenePosten: '2 offene Posten in SAP FI-AR (BSID)',
              skontoFrist: 'Fristgerecht eingegangen (Skonto 2% berechtigt)',
              buchungskreis: '1000 (Deutschland Inland)',
              stammDatenStatus: 'Eindeutiger Match auf Debitor 0000300192',
            };
            logMessage = 'Beide Rechnungen in SAP BSID gefunden & skontoberechtigt.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.95;
              isSelfHealed = true;
              stepOutput = {
                kunnr: '0000300192 (Siemens Healthineers AG)',
                gefundeneOffenePosten: '2 offene Posten + 1 Gutschrift zugeordnet',
                stammDatenStatus: 'Autonom über Posten-Agent via MCP abgeglichen',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Posten-Agent ordnet Betrag automatisch den 2 offenen Rechnungen zu.';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.60;
              stepOutput = {
                kunnr: '0000300192 (Siemens Healthineers vermutet)',
                hinweis: '5 offene Posten für Kunden vorhanden. Bitte Auswahl bestätigen.',
                stammDatenStatus: 'Wartet auf Prüfung durch Buchhaltung',
              };
              logMessage = 'Copilot schlägt 2 passende offene Posten vor und wartet auf Freigabe.';
            } else {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                fehler: 'KEIN_EINDEUTIGER_MATCH',
                grund: 'Offene Posten konnten keinem Einzelbeleg in BSID eindeutig zugeordnet werden.',
              };
              logMessage = 'Offene Posten konnten keinem Einzelbeleg zugeordnet werden.';
            }
          }
        } else if (i === 3) {
          stepInput = traces[2]?.outputData || {};
          if (isGood) {
            confidence = 1.0;
            stepOutput = {
              skontoGenehmigung: 'Vollständig genehmigt (Fristgerechter Skontoabzug 2%)',
              ausgleichsStrategie: 'Automatischer OP-Ausgleich ohne Restposten',
              genehmigungsStatus: 'Freigegeben zur automatischen Buchung',
            };
            logMessage = 'Regelprüfung: Fristgerechter Skontoabzug, vollständiger Ausgleich genehmigt.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.95;
              isSelfHealed = true;
              stepOutput = {
                skontoGenehmigung: 'Genehmigt',
                ausgleichsStrategie: 'Ausgleich mit Verrechnungsgutschrift GS-9901',
                genehmigungsStatus: 'Autonom freigegeben',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Differenz von 600 € mit Gutschrift GS-9901 vollautomatisch ausgeglichen.';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.60;
              stepOutput = {
                hinweis: 'Buchhalter muss Genehmigung für 600 € Sonderdifferenz erteilen',
                genehmigungsStatus: 'Manuelle Freigabe erforderlich',
              };
              logMessage = 'Copilot bittet Buchhalter um Entscheidung über 600 € Abzug.';
            } else {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                fehler: 'SKONTO_VERWEIGERT',
                grund: 'Skontotoleranz überschritten (Unberechtigter Abzug 600,00 €).',
              };
              logMessage = 'Automatische Buchung verweigert: Unberechtigter Abzug 600 €.';
            }
          }
        } else if (i === 4) {
          // FI-Buchung (Reversibilität 5)
          stepInput = traces[3]?.outputData || {};
          if (isGood) {
            if (step.reversibility >= 4 && (arch === 'autopilot' || arch === 'agentic')) {
              status = 'error';
              hasGuardrailBreak = true;
              confidence = 0.0;
              stepOutput = {
                guardrailBreak: true,
                policy: 'FINANCIAL_GOVERNANCE_GOBD',
                grund: 'Autonome Hauptbuch-Buchung ohne 4-Augen-Freigabe blockiert.',
              };
              logMessage = '❌ SICHERHEITSSTOPP: Autonome FB05-Buchung ohne 4-Augen-Prinzip blockiert.';
            } else {
              stepOutput = {
                sapAusgleichsbeleg: '0100084920 (SAP FI Hauptbuchbeleg)',
                verbuchungsStatus: 'Offene Posten in BSID/BSEG erfolgreich ausgeglichen',
                buchungsZeitpunkt: '04.10.2026, 11:15 Uhr',
                ausgeglichenePosten: 'RE-2026-9011 & RE-2026-9012 geschlossen',
                differenzKonto: '0,00 € (Keine Restdifferenz gebucht)',
              };
              logMessage = 'Ausgleichsbeleg 140002910 gebucht; offene Posten in BSID ausgeglichen.';
            }
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 1.0;
              isSelfHealed = true;
              stepOutput = {
                sapAusgleichsbeleg: '0100084920 (SAP FI Hauptbuchbeleg)',
                verbuchungsStatus: 'Erfolgreich mit Gutschrift GS-9901 gebucht',
                buchungsZeitpunkt: '04.10.2026, 11:15 Uhr',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Ausgleichsbeleg 140002910 in SAP FI gebucht; Posten ausgeglichen.';
            } else {
              status = 'error';
              hasEscalation = true;
              confidence = 0.0;
              stepOutput = {
                verbuchungsStatus: 'AUF_VERRECHNUNGSKONTO_GEBUCHT',
                differenzKonto: 'Konto 990100 (Zwischenkonto für unklare Posten)',
                grund: 'Klärfall in SAP FI eröffnet wegen ungeklärter Differenz.',
              };
              logMessage = 'Auf Verrechnungskonto gebucht; Klärfall in SAP FI eröffnet.';
            }
          }
        } else {
          stepInput = traces[4]?.outputData || {};
          if (isGood) {
            confidence = 1.0;
            if (arch === 'classic_ml') {
              stepOutput = {
                archivStatus: 'Zahlungsavis ZA-2026-99120 revisionssicher im SAP Archiv abgelegt',
                benachrichtigung: 'Buchungsprotokoll an Debitorenbuchhaltung übermittelt',
                kontoauszugsZeile: 'Bankkontoauszug mit Avis 0100084920 abgestimmt',
                versandstatus: 'Vorgang vollständig abgeschlossen',
              };
              logMessage = 'Assistant (LLM): Zahlungsbestätigung an Debitor per Prompt generiert.';
            } else {
              stepOutput = {
                archivStatus: 'Zahlungsavis ZA-2026-99120 revisionssicher im SAP Archiv abgelegt',
                benachrichtigung: 'Buchungsprotokoll an Debitorenbuchhaltung übermittelt',
                kontoauszugsZeile: 'Bankkontoauszug mit Avis 0100084920 abgestimmt',
                versandstatus: 'Vorgang vollständig abgeschlossen',
              };
              logMessage = 'Ausgleichsprotokoll archiviert und Beleg verknüpft.';
            }
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.99;
              isSelfHealed = true;
              stepOutput = {
                archivStatus: 'Zahlungsavis revisionssicher archiviert',
                kontoauszugsZeile: 'Kontoauszug erfolgreich abgestimmt',
                versandstatus: 'Erfolgreich abgeschlossen (Selbstheilung)',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Zahlungsavis archiviert & Posten ausgeglichen.';
            } else {
              status = 'escalation';
              confidence = 0.60;
              stepOutput = {
                archivStatus: 'Beleg im Klärungsvorrat abgelegt',
                hinweis: 'Klärungsanforderung an Debitorenbuchhalter versendet',
                versandstatus: 'Klärungsschleife eröffnet',
              };
              logMessage = 'Klärungsanfrage an Debitorenbuchhaltung übermittelt.';
            }
          }
        }
      }

      // =========================================================================
      // SCENARIO 4: Supplier Invoice Verification & 3-Way Match (2B6)
      // =========================================================================
      else if (templateId === 'scope-2b6') {
        if (i === 0) {
          stepInput = {
            vorgang: 'Elektronische Eingangsrechnung (PDF / ZUGFeRD)',
            absender: activeSender,
            betreff: activeSubject,
            belegdatei: 'Rechnung_RE-2026-8812.pdf (Digital lesbar, 142 KB)',
            eingangszeit: sample.receivedAt,
          };
          if (isGood) {
            confidence = 0.99;
            stepOutput = {
              vorgang: 'Valide Lieferantenrechnung (MM-IV)',
              absender: 'Bosch Rexroth Partner GmbH (Kreditor 0000400120)',
              rechnungsnummer: 'RE-2026-8812',
              belegdatum: '01.10.2026',
              duplikatsPruefung: 'Kein Duplikat gefunden (Negativ)',
              kreditorIban: 'DE44 6005 0101 0001 2345 67',
              weiterleitung: 'Automatische DOX-Extraktion (SAP AI Core)',
            };
            logMessage = 'Eingangsrechnung formal valide & kein Duplikat im System vorhanden.';
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.92;
              isSelfHealed = true;
              stepOutput = {
                vorgang: 'Lieferantenrechnung (Rekonstruiert via MCP)',
                absender: 'Bosch Rexroth Partner GmbH',
                rechnungsnummer: 'RE-2026-8812',
                duplikatsPruefung: 'Duplikatsausschluss via Historie bestätigt',
                kreditorIban: 'DE44 6005 0101 0001 2345 67 (aus Stammdaten ergänzt)',
                weiterleitung: 'Automatische DOX-Extraktion',
              };
              logMessage = 'Agentisches Framework (Stufe 5): Maskierte IBAN aus Lieferantenstamm rekonstruiert & Scan entzerrt.';
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                vorgang: 'Lieferantenrechnung (Prüfung erforderlich)',
                absender: activeSender,
                hinweis: 'Scan unvollständig / IBAN maskiert. Sichtung durch Buchhalter empfohlen.',
                weiterleitung: 'Klärungskorb Kreditorenbuchhaltung',
              };
              logMessage = 'Copilot legt Eingangsrechnung dem Kreditorenbuchhalter zur Sichtung vor.';
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.50;
              stepOutput = {
                vorgang: 'Eingangsbeleg fehlerhaft',
                absender: activeSender,
                hinweis: 'Kreditor-IBAN nicht lesbar und Scanqualität unzureichend.',
                weiterleitung: 'Klärungsvorrat Kreditorenbuchhaltung',
              };
              logMessage = 'Eingangsbeleg gestoppt: Fehlende Pflichtfelder in Rechnung.';
            }
          }
        } else if (i === 1) {
          // Extraktion
          stepInput = traces[0]?.outputData || {};
          if (isGood || isSelfHealed) {
            confidence = arch === 'classic_ml' ? 0.94 : 0.98;
            stepOutput = {
              rechnungsnummer: 'RE-2026-8812',
              rechnungsdatum: '01.10.2026',
              kreditorName: 'Bosch Rexroth Partner GmbH',
              kreditorNummer: '0000400120',
              bestellbezug: 'PO-88201',
              wareneingangBeleg: 'WE-500129 (Lieferschein LS-7710)',
              nettoBetrag: '3.800,00 €',
              steuerBetrag: '722,00 € (19% Vorsteuer)',
              bruttoBetrag: '4.522,00 €',
              rechnungsPositionen: [
                { pos: '10', artikel: 'Proportional-Wegeventil 4WRAE', matnr: 'R900952011', menge: '10 ST', einzelpreis: '380,00 €', gesamt: '3.800,00 €' },
              ],
              zahlungskonditionen: '14 Tage 3% Skonto, 30 Tage netto',
              weiterleitung: '3-Wege-Match gegen Bestellung & WE (Orient)',
            };
            logMessage = 'SAP Document AI (DOX): Kopf- und Positionsdaten vollständig extrahiert.';
          } else {
            confidence = 0.65;
            stepOutput = {
              rechnungsnummer: 'RE-8812 (Fuzzy)',
              bestellbezug: 'PO-88201 (?)',
              nettoBetrag: '3.804,50 €',
              steuerBetrag: '722,86 €',
              bruttoBetrag: '4.527,36 €',
              rechnungsPositionen: [
                { pos: '10', artikel: 'Wegeventil 4WRAE', menge: '10 ST', einzelpreis: '380,00 €', gesamt: '3.800,00 €' },
                { pos: '20', artikel: 'Verpackungszuschlag', menge: '1 PAU', einzelpreis: '4,50 €', gesamt: '4,50 €' },
              ],
              hinweis: 'Preisabweichung (+4,50 €) durch Nebenkosten festgestellt.',
              weiterleitung: '3-Wege-Match mit Toleranzprüfung',
            };
            logMessage = 'Extraktion mit Unsicherheiten: 4,50 € Nebenkosten aus Freitext isoliert.';
          }
        } else if (i === 2) {
          // 3-Wege-Match
          stepInput = traces[1]?.outputData || {};
          if (isGood || isSelfHealed) {
            confidence = 0.99;
            stepOutput = {
              bestellbezug: 'PO-88201 (Status: Freigegeben)',
              wareneingangBeleg: 'WE-500129 (Gebucht am 29.09.2026)',
              kreditorNummer: '0000400120 (Aktiv / Stammdaten konform)',
              bestellteMenge: '10 ST (100% geliefert)',
              gelieferteMenge: '10 ST',
              abgerechneteMenge: '10 ST',
              preisAbweichung: '0,00 € (Identisch mit Bestellung)',
              mengenAbweichung: '0 ST (Vollständig geliefert)',
              dreiWegeMatch: 'BESTAETIGT (PO / WE / RE 100% deckungsgleich)',
              weiterleitung: 'Kaufmännische Prüfung & Skontoberechnung (Decide)',
            };
            logMessage = 'HANA In-Memory Match: 3-Wege-Abgleich (Bestellung, WE, Rechnung) ohne Abweichung bestätigt.';
          } else {
            confidence = 0.88;
            stepOutput = {
              bestellbezug: 'PO-88201',
              wareneingangBeleg: 'WE-500129',
              bestellteMenge: '10 ST',
              gelieferteMenge: '10 ST',
              abgerechneteMenge: '10 ST',
              preisAbweichung: '+4,50 € (Verpackungskosten)',
              mengenAbweichung: '0 ST',
              dreiWegeMatch: 'ABWEICHUNG_TOLERANZ_PRUEFEN',
              weiterleitung: 'Toleranzprüfung (Decide)',
            };
            logMessage = '3-Wege-Match: Mengen identisch, Preisabweichung von +4,50 € festgestellt.';
          }
        } else if (i === 3) {
          // Toleranzprüfung & Skonto
          stepInput = traces[2]?.outputData || {};
          if (isGood || isSelfHealed) {
            confidence = 0.98;
            stepOutput = {
              toleranzStatus: 'FREIGEGEBEN (Keine Preisabweichung)',
              preisAbweichung: '0,00 €',
              skontoKondition: '3% Skonto bei Zahlung bis 15.10.2026',
              skontoBetrag: '135,66 € (Reingewinn bei Skontoausnutzung)',
              zahlbetragNettoSkonto: '4.386,34 €',
              zahlweg: 'SEPA-Überweisung (Zahllauf F110)',
              pruefErgebnis: 'Rechnerisch & kaufmännisch einwandfrei',
              weiterleitung: 'Freigabeentscheidung (Decide)',
            };
            logMessage = 'BRFplus Regelprüfung: Keine Abweichung, maximaler Skontoabzug (135,66 €) freigegeben.';
          } else {
            confidence = 0.92;
            stepOutput = {
              toleranzStatus: 'INNERHALB_TOLERANZ (Abweichung 4,50 € <= 5,00 € Grenze)',
              preisAbweichung: '+4,50 € (Geringfügige Nebenkosten)',
              toleranzSchwelle: '5,00 € (Automatische Kleinbetragsfreigabe)',
              skontoKondition: '3% Skonto bis 15.10.2026',
              skontoBetrag: '135,66 €',
              zahlbetragNettoSkonto: '4.391,70 €',
              pruefErgebnis: 'Toleranzfreigabe gem. Einkaufsrichtlinie §4.2',
              weiterleitung: 'Freigabeentscheidung (Decide)',
            };
            logMessage = 'BRFplus Regelprüfung: 4,50 € liegt unter der 5,00 € Toleranzgrenze. Automatische Toleranzfreigabe.';
          }
        } else if (i === 4) {
          // Freigabeentscheidung
          stepInput = traces[3]?.outputData || {};
          if (step.reversibility >= 4 && arch === 'autopilot') {
            status = 'error';
            confidence = 0.0;
            hasGuardrailBreak = true;
            triggeredChallenges.push('AUTOPILOT_ON_IRREVERSIBLE_POSTING');
            stepOutput = {
              freigabeStatus: 'Rechnungsfreigabe blockiert (Guardrail Break)',
              grund: 'Autopilot auf irreversibler Verbuchung ohne Signatur verboten',
              hinweis: 'Sicherheits-Gate aktiv: Buchung erfordert Copilot (HITL) oder deterministisches 4-Augen-Prinzip.',
            };
            logMessage = '🚨 Guardrail-Verletzung: Autopilot auf irreversibler Rechnungsfreigabe gestoppt!';
          } else if (arch === 'copilot') {
            confidence = 0.95;
            stepOutput = {
              freigabeStatus: 'Freigabevorlage für Kreditorenbuchhaltung bereitgestellt',
              pruefSumme: '4.522,00 € (inkl. 135,66 € Skonto)',
              pruefInstanz: 'Joule Copilot für Rechnungsprüfung',
              empfehlung: 'Freigabe zur automatischen MIRO-Verbuchung empfohlen',
              statusHinweis: 'Wartet auf Bestätigung durch Sachbearbeiter',
            };
            logMessage = 'Joule Copilot: Prüfbericht zusammengestellt. Sachbearbeiter gibt Beleg per Klick frei.';
          } else {
            confidence = 0.98;
            stepOutput = {
              freigabeStatus: 'AUTORISIERT (Autonome Rechnungsfreigabe)',
              autorisierungsLevel: 'Level 1 (Wert <= 10.000 €)',
              pruefDatum: '01.10.2026',
              weiterleitung: 'Rechnungsverbindung MM-IV / MIRO (Act)',
            };
            logMessage = 'Autonome Rechnungsfreigabe erteilt. Beleg für MIRO-Verbuchung vorbereitet.';
          }
        } else if (i === 5) {
          // Verbuchung MIRO
          stepInput = traces[4]?.outputData || {};
          if (traces[4]?.status === 'error' || traces[4]?.status === 'escalation') {
            status = 'error';
            confidence = 0.0;
            stepOutput = {
              sapMiroBeleg: 'Keine Buchung erfolgt',
              verbuchungsStatus: 'Pausiert wegen fehlender Freigabe in Schritt 5',
            };
            logMessage = 'MM-IV Verbuchung ausgesetzt: Vorhergehende Freigabe nicht erteilt.';
          } else {
            confidence = 1.0;
            stepOutput = {
              sapMiroBeleg: '5105600241 (MM-IV Rechnungsbeleg)',
              sapFiBeleg: '1900004521 (BKPF / Hauptbuch)',
              kreditorNummer: '0000400120 (Bosch Rexroth Partner GmbH)',
              belegdatum: '01.10.2026',
              verbuchterBetrag: '4.522,00 € (Vorsteuer 722,00 €)',
              skontoVormerkung: '135,66 € (Zahlung bis 15.10.2026)',
              zahllaufStatus: 'F110 Zahllauf automatisch vorgemerkt',
              archivStatus: 'ZUGFeRD Beleg revisionssicher im SAP Archiv archiviert',
              versandstatus: 'Erfolgreich abgeschlossen',
            };
            logMessage = 'MM-IV Clean Core RAP: Lieferantenrechnung 5105600241 verbindlich gebucht & Zahllauf aktiviert.';
          }
        }
      }

      // =========================================================================
      // SCENARIO 5: GENERIC ARBITRARY PROCESS SIMULATION (Any custom template)
      // =========================================================================
      else {
        if (i === 0) {
          stepInput = {
            vorgang: sample.documentType || 'Elektronischer Belegeingang',
            absender: activeSender,
            betreff: activeSubject,
            belegdatei: sample.filename,
            eingangszeit: sample.receivedAt,
            anforderung: step.inputDescription || sample.summary,
          };

          if (isGood) {
            confidence = arch === 'deterministic' ? 1.0 : 0.98;
            stepOutput = {
              vorgang: step.name,
              absender: activeSender,
              referenz: sample.structuredData.targetReference || `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              status: 'Formal geprüft und freigegeben',
              prioritaet: sample.structuredData.urgency || 'Standard (Normal)',
              weiterleitung: step.outputDescription || 'Folgebearbeitung',
            };
            logMessage = `${step.name}: Eingangsdaten erfolgreich validiert und für Folgeverarbeitung klassifiziert.`;
          } else {
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.92;
              isSelfHealed = true;
              stepOutput = {
                vorgang: `${step.name} (Autonom rekonstruiert)`,
                absender: activeSender,
                referenz: sample.structuredData.targetReference || 'REF-RECONSTRUCTED',
                status: 'Autonom durch agentische Werkzeuge ermittelt',
                selbstheilung: 'Fehlende Attribute via Kontext-Lookup ergänzt',
                weiterleitung: step.outputDescription || 'Folgebearbeitung',
              };
              logMessage = `Agentisches Framework (Stufe 5): Datenlücken in ${step.name} autonom behoben.`;
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                vorgang: `${step.name} (Prüfung ausstehend)`,
                absender: activeSender,
                hinweis: 'Eingangsdaten unvollständig. Vorlage an Sachbearbeiter zur Prüfung.',
                weiterleitung: 'Klärungsvorrat',
              };
              logMessage = `Copilot: ${step.name} zur manuellen Prüfung vorgelegt.`;
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.55;
              stepOutput = {
                status: 'Klärungsvorrat',
                hinweis: 'Datenqualität unzureichend. Automatisierte Verarbeitung gestoppt.',
                weiterleitung: 'Manuelle Klärung',
              };
              logMessage = `${step.name}: Automatische Verarbeitung wegen Datenunklarheiten gestoppt.`;
            }
          }
        } else {
          // Jeder Folgeschritt übernimmt 1:1 den Ausgang des vorhergehenden Schritts!
          const prevTrace = traces[i - 1];
          stepInput = prevTrace?.outputData || {};

          // Prüfe Guardrail-Verletzung bei irreversiblen Schritten
          if (step.reversibility >= 4 && arch === 'autopilot') {
            status = 'error';
            confidence = 0.0;
            hasGuardrailBreak = true;
            triggeredChallenges.push('AUTOPILOT_ON_IRREVERSIBLE_POSTING');
            stepOutput = {
              buchungsStatus: 'Verbuchung gestoppt (Guardrail Break)',
              grund: 'Autopilot auf irreversibler ERP-Mutation verboten',
              hinweis: 'Sicherheits-Gate aktiv: Reversibilität >= 4 erfordert menschliche Freigabe (Copilot) oder deterministische Prüfung.',
            };
            logMessage = `🚨 Guardrail-Verletzung: Autopilot auf ${step.name} blockiert (Reversibilität ${step.reversibility})!`;
          } else if (prevTrace?.status === 'error') {
            status = 'error';
            confidence = 0.0;
            stepOutput = {
              status: 'Pausiert',
              hinweis: `Folgeschritt pausiert wegen Fehler in vorhergehendem Schritt (${prevTrace.stepName}).`,
            };
            logMessage = `${step.name}: Verarbeitung ausgesetzt wegen Fehler im vorhergehenden Schritt.`;
          } else if (isGood || isSelfHealed) {
            confidence = arch === 'deterministic' ? 1.0 : arch === 'classic_ml' ? 0.94 : 0.98;

            if (step.primitive === 'Extractor / Transformer') {
              stepOutput = {
                extraktionsStatus: 'Erfolgreich strukturiert',
                belegReferenz: stepInput.referenz || stepInput.rechnungsnummer || stepInput.vorgang || 'VORGANG-2026',
                positionen: sample.structuredData.itemsOrEquipment.length > 0
                  ? sample.structuredData.itemsOrEquipment.map((item) => ({ pos: item.id, artikel: item.name, detail: item.detail, menge: `${item.qty || 1} ST` }))
                  : [{ pos: '10', artikel: 'Standardposition', menge: '1 ST' }],
                datenqualitaet: '100% syntaktisch valide',
                weiterleitung: step.outputDescription || 'Folgeschritt',
              };
              logMessage = `${step.name}: Kopf- und Positionsdaten erfolgreich extrahiert.`;
            } else if (step.primitive === 'Matcher / Enricher') {
              stepOutput = {
                matchingStatus: 'Stammdaten eindeutig zugeordnet',
                sapObjektId: 'SAP-ID 00109923',
                abgleichReferenz: step.sapReference || 'SAP Stammdatenabgleich',
                partner: sample.structuredData.customerOrPlant || activeSender,
                konfidenzScore: '98.5% (High Match)',
                weiterleitung: step.outputDescription || 'Regelprüfung',
              };
              logMessage = `${step.name}: Stammdaten im SAP-System abgeglichen und zugeordnet.`;
            } else if (step.primitive === 'Evaluator / Reasoner') {
              if (arch === 'copilot') {
                stepOutput = {
                  entscheidungsStatus: 'Prüfbericht zusammengestellt',
                  regelwerk: step.sapReference || 'SAP BRFplus / Decision Policy',
                  empfehlung: 'Freigabe zur Systemverbuchung empfohlen',
                  statusHinweis: 'Wartet auf Freigabe durch Sachbearbeiter',
                };
                logMessage = `Joule Copilot: Prüfbericht für ${step.name} zusammengestellt.`;
              } else {
                stepOutput = {
                  pruefErgebnis: 'Richtlinien & Schwellenwerte eingehalten',
                  entscheidungsStatus: 'Freigabe autorisiert',
                  regelwerk: step.sapReference || 'SAP BRFplus / Decision Policy',
                  risikoLevel: step.euAiActRisk || 'MINIMAL',
                  weiterleitung: step.outputDescription || 'Systemverbuchung',
                };
                logMessage = `${step.name}: Kaufmännische Regeln und Richtlinien ohne Beanstandung geprüft.`;
              }
            } else if (step.primitive === 'Executor / Actuator') {
              stepOutput = {
                buchungsStatus: 'Verbindlich im ERP gebucht',
                sapBelegnummer: `DOC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                schnittstelle: step.sapReference || 'SAP S/4HANA Clean Core RAP API',
                reversibilitaet: step.reversibility >= 4 ? 'Irreversibel (Endgültig)' : 'Kompensierbar (Storno möglich)',
                archivStatus: 'Revisionssicher archiviert',
                versandstatus: 'Verbuchung erfolgreich abgeschlossen',
              };
              logMessage = `${step.name}: Verbindliche Mutation im SAP-System erfolgreich ausgeführt.`;
            } else if (step.primitive === 'Generator / Synthesizer') {
              stepOutput = {
                ausgangsDokument: 'Abschlussdokument & Bestätigung generiert',
                empfaenger: activeSender,
                versandKanal: 'Digital (SAP Output Management)',
                abschlussStatus: 'Prozessdurchlauf erfolgreich abgeschlossen',
              };
              logMessage = `${step.name}: Abschlussdokument generiert und an Kommunikationskanal übergeben.`;
            } else {
              stepOutput = {
                status: 'Erfolgreich verarbeitet',
                bearbeitungsSchritt: step.name,
                ergebnis: step.outputDescription || 'Schritt erfolgreich abgeschlossen',
              };
              logMessage = `${step.name}: Schritt erfolgreich abgeschlossen.`;
            }
          } else {
            // !isGood && !isSelfHealed
            if (canSwarmSelfHeal) {
              status = 'success';
              confidence = 0.91;
              isSelfHealed = true;
              stepOutput = {
                status: 'Autonom durch agentische Werkzeuge ermittelt',
                bearbeitungsSchritt: step.name,
                selbstheilung: 'Fehlende Attribute via Kontext-Lookup ergänzt',
                weiterleitung: step.outputDescription || 'Folgeschritt',
              };
              logMessage = `Agentisches Framework (Stufe 5): Ausnahmesituation in ${step.name} autonom geheilt.`;
            } else if (arch === 'copilot') {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.65;
              stepOutput = {
                status: 'Sachbearbeiter-Klärung erforderlich',
                bearbeitungsSchritt: step.name,
                hinweis: 'Qualitätsabweichung festgestellt. Prüfung durch Sachbearbeiter erforderlich.',
              };
              logMessage = `Copilot: ${step.name} zur Prüfung durch Sachbearbeiter vorgelegt.`;
            } else {
              status = 'escalation';
              hasEscalation = true;
              confidence = 0.55;
              stepOutput = {
                status: 'Klärungsvorrat',
                bearbeitungsSchritt: step.name,
                hinweis: 'Konfidenz unter Schwellenwert. Manuelle Überprüfung erforderlich.',
              };
              logMessage = `${step.name}: Konfidenz unzureichend, an Klärungsvorrat übermittelt.`;
            }
          }
        }
      }

      totalLatencyMs += latencyMs;
      totalTokens += tokensUsed;
      totalCapacityUnits += tokensUsed > 0 ? Number(((tokensUsed / 1000) * 0.15).toFixed(3)) : 0;

      traces.push({
        stepId: step.id,
        stepName: step.name,
        oodaPhase: step.oodaPhase,
        primitive: step.primitive,
        archetype: arch,
        status,
        latencyMs,
        tokensUsed,
        subCalls,
        inputData: stepInput,
        outputData: stepOutput,
        logMessage,
        triggeredChallenges,
        cleanCoreStatus: step.cleanCoreIndex,
        confidence,
        techniqueName: tech.name,
        techniqueMechanism: tech.mechanism,
        isSelfHealed,
      });
    }

    const hasAnyError = traces.some((t) => t.status === 'error');
    const hasAnyEscalation = traces.some((t) => t.status === 'escalation');

    const finalTraces = language === 'en'
      ? traces.map((t) => ({
          ...t,
          techniqueName: t.techniqueName ? (TECHNIQUE_TRANSLATIONS[t.techniqueName] || toEnglish(t.techniqueName)) : undefined,
          techniqueMechanism: t.techniqueMechanism ? (TECHNIQUE_TRANSLATIONS[t.techniqueMechanism] || toEnglish(t.techniqueMechanism)) : undefined,
          logMessage: toEnglish(t.logMessage),
          inputData: localizeValue(t.inputData, 'en'),
          outputData: localizeValue(t.outputData, 'en'),
        }))
      : traces;

    return {
      sampleId: sample.id,
      sampleTitle: sample.filename,
      timestamp: new Date().toISOString(),
      overallStatus: hasGuardrailBreak
        ? 'failed_guardrail'
        : hasAnyError
        ? 'failed_guardrail'
        : hasAnyEscalation
        ? 'escalated_to_human'
        : 'success',
      totalLatencyMs,
      totalTokens,
      totalCapacityUnits,
      traces: finalTraces,
    };
  }
}
