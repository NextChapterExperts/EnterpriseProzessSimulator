# SAP Process Simulator – User Manual & Methodological Guide

This manual is written from a user's perspective (business process owners, solution architects, consultants, educators, and students). It explains how to operate the **SAP Process Simulator**, its underlying methods, tools, and analytical models, so anyone can get started immediately without prior coaching.

---

## Table of Contents

1. [Overview and Mission](#1-overview-and-mission)
2. [Quickstart & Getting Started](#2-quickstart--getting-started)
3. [User Interface & Workspaces](#3-user-interface--workspaces)
   - 3.1 [Global Header & Navigation](#31-global-header--navigation)
   - 3.2 [Tab 1: Interactive Simulator (`/simulator`)](#32-tab-1-interactive-simulator-simulator)
   - 3.3 [Tab 2: Executive Cockpit (`/cockpit`)](#33-tab-2-executive-cockpit-cockpit)
   - 3.4 [Tab 3: Methodology & Training Matrix (`/matrix`)](#34-tab-3-methodology--training-matrix-matrix)
4. [Methodological Foundation & Architecture](#4-methodological-foundation--architecture)
   - 4.1 [The OODA Loop (John Boyd)](#41-the-ooda-loop-john-boyd)
   - 4.2 [The 6 Cognitive Primitives](#42-the-6-cognitive-primitives)
   - 4.3 [The 5 Zwingmann Automation Tiers (Archetypes)](#43-the-5-zwingmann-automation-tiers-archetypes)
   - 4.4 [Pareto Frontier Optimization (STP vs. Cost vs. Risk)](#44-pareto-frontier-optimization-stp-vs-cost-vs-risk)
5. [The 4 Analytical Perspectives (Workflow Layers)](#5-the-4-analytical-perspectives-workflow-layers)
   - 5.1 [Layer 1: Document Flow (Flow)](#51-layer-1-document-flow-flow)
   - 5.2 [Layer 2: Cost & TCA (Cost)](#52-layer-2-cost--tca-cost)
   - 5.3 [Layer 3: Risk & Guardrails (Risk)](#53-layer-3-risk--guardrails-risk)
   - 5.4 [Layer 4: SAP Architecture & Clean Core (Architecture)](#54-layer-4-sap-architecture--clean-core-architecture)
6. [The 13 Enterprise AI Challenges & Student Bands](#6-the-13-enterprise-ai-challenges--student-bands)
7. [Built-in SAP Best Practice Workflows](#7-built-in-sap-best-practice-workflows)
8. [Creating Custom Workflows (`+ New Workflow`)](#8-creating-custom-workflows--new-workflow)
9. [Human-in-the-Loop (HITL) Console & Payload Editor](#9-human-in-the-loop-hitl-console--payload-editor)
10. [Teaching & Evaluation Guide](#10-teaching--evaluation-guide)
11. [Technical Architecture & Directory Layout](#11-technical-architecture--directory-layout)

---

## 1. Overview and Mission

Traditional business process diagrams (BPMN) depict workflows as static, deterministic chains. In real enterprise environments where Generative AI, machine learning, and autonomous agents interact, this view falls short. Process steps are rarely binary ("manual" vs. "automated"); instead, they exist along a cognitive spectrum — from rigid rule engines to multi-agent loops.

The **SAP Process Simulator** serves three primary use cases:

1. **Decision Sandbox for Architects:** Determine the exact automation tier (Deterministic, Classic ML, Autopilot, or Copilot) for each step to balance speed, cost, and reliability.
2. **Risk & Governance Transparency:** Identify which of the 13 enterprise AI vulnerabilities (hallucinations, schema divergence, latency spikes, prompt injections, audit gaps) appear when selecting a tier.
3. **Interactive Enablement for Teams & Students:** Hands-on experience of document execution across 7 SAP Best Practice scenarios with live payload inspection, latency simulation, and before-and-after optimization.

---

## 2. Quickstart & Getting Started

### Prerequisites
- Node.js (18.x or 20.x LTS)
- npm or pnpm
- A modern web browser

### Starting the Application
```bash
# 1. Navigate to the project root
cd /home/peter/Projekte/active/ProzessSimulator

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev -- -p 5000
```
Open your browser at:
👉 **`http://localhost:5000`**

### Running the Test Suite
```bash
npm run test:run
# Executes all 593 automated unit, TCA calculation, and Golden Path tests.
```

---

## 3. User Interface & Workspaces

### 3.1 Global Header & Navigation

The sticky top header provides universal access to key controls:
- **Title & Status:** Displays the active mode and application identity.
- **Main Tabs:** Quick navigation between **Simulator**, **Cockpit**, and **Methodology & Training Matrix**.
- **Process Selector (Dropdown):** Instant access to 7 pre-configured SAP Best Practice workflows plus any custom workflows.
- **`+ New Workflow`:** Opens the creation wizard (presets or unstructured text decomposition).
- **Language Switcher `[ 🇩🇪 DE | 🇬🇧 EN ]`:** Full runtime translation across all screens, labels, and JSON payloads.
- **Theme Switcher `[ ☀️ / 🌙 ]`:** Toggles between Dark Mode and Light Mode.

---

### 3.2 Tab 1: Interactive Simulator (`/simulator`)

The primary simulation canvas is divided into three sections:

#### A. Top Action Toolbar
- **Workflow Name & Scope Code** (e.g., `BD9`, `J45`, `1GA`).
- **`Info` Button:** Opens the business glossary (business goals, SAP module, documents, transaction codes).
- **`Parameters` Button:** Configures monthly document volume (e.g., 10,000 to 500,000), noise rate (0–100 % unstructured inputs), and internal hourly labor rates (€/h).
- **`★ Pareto Optimum`:** Instantly aligns all steps along the Pareto efficiency frontier.
- **`Start Test Run (Play)` / `Pause`:** Simulates live document processing through steps 1 to 6 with realistic latency.
- **`Reset`:** Restores default settings, traces, and decisions.

#### B. 4-Layer Perspective Switcher
Filters the visual representation across four core enterprise dimensions:
1. **Flow:** Business actions, OODA phases, and execution latencies.
2. **Cost:** SAP Capacity Units (CUs), token consumption, manual review expenses.
3. **Risk:** Triggered AI challenges, severity levels, and mitigation strategies.
4. **Architecture:** Clean Core compliance index, SAP BTP extension tools, and target APIs.

#### C. Split-Screen Main Canvas
- **Left Column (Step Cards):** Vertical sequence of 6 process steps. Each card includes:
  - OODA phase indicator with color coding.
  - Step name and SAP integration reference.
  - **Zwingmann Tier Bar:** 4 buttons (`Deterministic`, `Classic ML`, `Autopilot`, `Copilot`) to toggle the step's technology.
  - Step-specific explanation of what the chosen tier means for this task.
  - Collapsible **"Step Specification & I/O"** panel displaying preconditions, input schema, output schema, and SAP API details.
  - Challenge badges showing solved (green) and induced (red/yellow) risks.
- **Right Column (Live Payload Monitor):**
  - High-fidelity inspection of structured input and output data.
  - Sample case switcher (Happy Path, Edge Case, Error Case).
  - Edit button to alter the incoming text at runtime.
  - Human-in-the-Loop decision panel when a step requires manual confirmation.

---

### 3.3 Tab 2: Executive Cockpit (`/cockpit`)

Provides high-level executive metrics calculated across the entire process chain:
- **Total Cost of Automation (TCA):** Combined compute, labor escalation, and residual damage costs.
- **Straight-Through Processing (STP) Rate:** Percentage of documents processed without human intervention.
- **End-to-End Latency:** Total cycle time from arrival to ERP database commit.
- **Clean Core Index:** Percentage of steps using upgrade-safe ABAP Cloud or BTP extension interfaces.
- **13-Challenges Radar:** Visual risk distribution across all 4 clusters.

---

### 3.4 Tab 3: Methodology & Training Matrix (`/matrix`)

A comprehensive curriculum table mapping:
- Every combination of **4 OODA Phases**, **6 Cognitive Primitives**, and **5 Automation Tiers**.
- Step-by-step technical mechanisms, target SAP products, default validation checks, and architectural recommendations.
- Interactive modal popups providing deep pedagogical background on each concept.

---

## 4. Methodological Foundation & Architecture

### 4.1 The OODA Loop (John Boyd)

Every workflow follows Boyd's cybernetic cycle:

```
[ Inbound Document / Signal ]
             │
             ▼
 1. OBSERVE  ──> Filter noise, validate schema, extract unstructured data
             │
             ▼
 2. ORIENT   ──> Ground entities against SAP ERP master data (KNA1, MARA)
             │
             ▼
 3. DECIDE   ──> Evaluate business rules, limits, credit, and ATP policies
             │
             ▼
 4. ACT      ──> Commit transactional posting (RAP/OData) & dispatch confirmation
```

---

### 4.2 The 6 Cognitive Primitives

Every process step is classified into exactly one primitive:
1. **Filter / Gatekeeper (Observe):** Inbound triage, MIME/header checks, and spam rejection.
2. **Extractor / Transformer (Observe):** Parsing unstructured documents into structured JSON records.
3. **Matcher / Enricher (Orient):** Primary key resolution via fuzzy and vector search.
4. **Evaluator / Reasoner (Decide):** Deterministic policy evaluation and boundary verification.
5. **Executor / Actuator (Act):** Writing transactional records into S/4HANA via clean interfaces.
6. **Generator / Synthesizer (Act):** Dynamic document and outbound communication rendering.

---

### 4.3 The 5 Zwingmann Automation Tiers

1. **Deterministic:** Strict rule sets (BRFplus, SQL). < 50 ms latency, zero token cost, 100% reproducible.
2. **Assistant / Classic ML:** Specialized non-hallucinatory models (SAP DOX, HANA Fuzzy Search).
3. **Copilot (Human-in-the-Loop):** Mandatory user confirmation before execution. Eliminates STP.
4. **Autopilot:** Constrained single-agent with tool execution and confidence threshold gating.
5. **Agentic:** Autonomous multi-agent loops for complex edge cases with self-healing capabilities.

---

## 5. Built-in SAP Best Practice Workflows

The simulator comes pre-loaded with 7 standard end-to-end scenarios:
1. **`BD9` – Sell from Stock (Order-to-Cash / SD)**
2. **`J45` – Sourcing & Procurement (Procure-to-Pay / MM)**
3. **`1GA` – Make-to-Stock Production (Plan-to-Produce / PP)**
4. **`1MB` – Quality Management in Procurement (Inspection-to-Disposition / QM)**
5. **`BJ2` – Corrective Plant Maintenance (Plan-to-Maintain / PM)**
6. **`1B6` – Warehouse Inbound & Putaway with EWM (Logistics Execution / EWM)**
7. **`1E6` – Customer Service & Warranty Management (Claim-to-Resolution / CS)**

---

*Status: October 2026 – NextChapterExperts / ProzessSimulator*
