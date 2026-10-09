import { NextRequest, NextResponse } from 'next/server';
import { matchAllStepsToSapAgents } from '@/lib/sapAiCatalogMatcher';
import { ProcessStep } from '@/types/process';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY nicht in den Umgebungsvariablen hinterlegt (.env.local).' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, conversationHistory = [], language = 'de' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Nachricht fehlt.' }, { status: 400 });
    }

    const isEn = language === 'en';

    const systemInstruction = `
Du bist der Senior SAP Enterprise Solution Architect und Process Advisor von Next Chapter Experts (Peter Alexander).
Deine Aufgabe: Du führst mit dem Kunden ein scharfes, fokussiertes Gespräch (per Sprache/Text), um seinen konkreten SAP-Geschäftsprozess aufzunehmen und direkt in eine Pareto-optimale SAP BTP & Clean Core Zielarchitektur zu transformieren.

Methodische Leitplanken:
- Wir modellieren Prozesse strikt nach dem OODA-Loop:
  1. Observe: Wahrnehmung & Ingestion (z. B. Filter / Gatekeeper, Extractor / Transformer)
  2. Orient: Grounding & Stammdaten (z. B. Matcher / Enricher)
  3. Decide: Geschäftsregeln & Freigaben (z. B. Evaluator / Reasoner)
  4. Act: ERP-Verbuchung & Ausgabe (z. B. Executor / Actuator, Generator / Synthesizer)
- Wir wenden strikt das Pareto-Optimum an:
  * Filter/Header-Prüfungen: IMMER 'deterministic' (Fast-Path, 0 Tokens, 100% STP)
  * Extraktion aus unstrukturierten Belegen: 'classic_ml' oder 'autopilot' (SAP DOX / Document Extraction)
  * Stammdatenabgleich & Fuzzy-Suche: 'deterministic' oder 'classic_ml' (SAP HANA Trigram Search)
  * Freigaben & Geschäftsregeln: 'deterministic' (SAP BRFplus) oder 'copilot' (HITL bei hohem Risiko/Zweifeln)
  * ERP-Mutation / Verbuchung: 'deterministic' (S/4HANA OData / ABAP RAP Clean Core)

Interview-Verhalten:
1. Wenn wesentliche Eckdaten noch völlig unklar sind (z. B. grober Prozessablauf, welches monatliche Volumen, ob PDFs/Mails oder Schnittstellen vorliegen, welches S/4HANA System), stelle 1 bis maximal 2 präzise, fachliche Fragen. Setze "status": "clarifying".
2. Wenn der Nutzer dir bereits einen klaren Prozess beschreibt oder dir genügend Kontext gegeben hat (oder sagt "modellier das jetzt", "nimm Standardwerte", etc.), dann ERZEUGE SOFORT das vollständige Prozessmodell mit 4 bis 7 Schritten. Setze "status": "ready".

GIB AUSSCHLIESSLICH EIN GÜLTIGES JSON-OBJEKT ZURÜCK:
{
  "status": "clarifying" | "ready",
  "aiResponseText": "Deine direkte, gesprochene Antwort an den Nutzer. Freundlich, prägnant, wie ein Partner auf Augenhöhe. Wenn 'clarifying': Die 1-2 scharfen Klärungsfragen. Wenn 'ready': Eine überzeugende, kurze Zusammenfassung der erstellten Pareto-Zielarchitektur.",
  "processTitle": "Titel des Prozesses (nur bei ready)",
  "processScopeCode": "z.B. O2C-AI, P2P-AI, CUST-01 (nur bei ready)",
  "executiveSummary": "2-3 Sätze C-Level Management Summary (nur bei ready)",
  "monthlyVolume": 25000,
  "steps": [
    {
      "id": "step_1",
      "name": "E-Mail Triage & Header-Filter",
      "oodaPhase": "Observe",
      "primitive": "Filter / Gatekeeper",
      "currentArchetype": "deterministic",
      "confidenceGate": 99,
      "cleanCoreIndex": "A_EXT_EVENT",
      "isUnstructuredInput": true,
      "reversibility": "HIGH",
      "blastRadiusCostEur": 50,
      "reason": "Deterministischer Fast-Path spart 100% Tokens bei Standard-Absendern."
    }
  ]
}
`;

    // History zusammenstellen
    const contents: any[] = [];
    for (const h of conversationHistory) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return NextResponse.json(
        { error: `Gemini API Fehler (${apiRes.status}): ${errText}` },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ error: 'Keine Antwort von Gemini erhalten.' }, { status: 500 });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (e) {
      return NextResponse.json(
        { error: 'Ungültiges JSON von Gemini erhalten', raw: rawText },
        { status: 500 }
      );
    }

    // Wenn status === 'ready', führen wir das SAP Discovery Center Matching aus
    if (parsedResult.status === 'ready' && Array.isArray(parsedResult.steps)) {
      const monthlyVol = parsedResult.monthlyVolume || 10000;
      const formattedSteps: ProcessStep[] = parsedResult.steps.map((s: any, idx: number) => ({
        id: s.id || `step_${idx + 1}`,
        name: s.name,
        oodaPhase: s.oodaPhase || 'Observe',
        primitive: s.primitive || 'Filter / Gatekeeper',
        currentArchetype: s.currentArchetype || 'deterministic',
        confidenceGate: s.confidenceGate || 95,
        cleanCoreIndex: s.cleanCoreIndex || 'B_KEY_USER_BAPI',
        isUnstructuredInput: s.isUnstructuredInput ?? false,
        reversibility: s.reversibility || 'HIGH',
        blastRadiusCostEur: s.blastRadiusCostEur || 100,
        explanation: s.reason || '',
      }));

      // Match against 718 items in catalog
      const agentMatching = matchAllStepsToSapAgents(formattedSteps, monthlyVol, language);

      const enrichedSteps = formattedSteps.map((step) => {
        const match = agentMatching.matches.find((m) => m.stepId === step.id);
        return {
          ...step,
          sapAgentMatch: match,
        };
      });

      return NextResponse.json({
        status: 'ready',
        aiResponseText: parsedResult.aiResponseText,
        processTitle: parsedResult.processTitle || 'Generierter SAP-Zielprozess',
        processScopeCode: parsedResult.processScopeCode || 'BTP-AI',
        executiveSummary: parsedResult.executiveSummary,
        monthlyVolume: monthlyVol,
        steps: enrichedSteps,
        sapAgentMatches: agentMatching.matches,
        totalMonthlyAiu: agentMatching.totalMonthlyAiu,
        totalMonthlyAiuCostEur: agentMatching.totalMonthlyAiuCostEur,
        gapCount: agentMatching.gapCount,
        standardAgentCount: agentMatching.standardAgentCount,
      });
    }

    // status === 'clarifying'
    return NextResponse.json({
      status: 'clarifying',
      aiResponseText: parsedResult.aiResponseText,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Interner Serverfehler im Advisor' },
      { status: 500 }
    );
  }
}
