#!/usr/bin/env node
import * as readline from 'readline';
import { AI_CORE_MODELS, AI_CORE_TEMPLATES } from './catalogData';
import { recommendStepSetting, calculateStepCapacityUnits, CognitivePrimitive, AutomationArchetype } from './recommendationEngine';

const SERVER_NAME = 'sap-ai-core-calculator-mcp';
const SERVER_VERSION = '1.0.0';

const TOOLS = [
  {
    name: 'ai_core_list_models',
    description: 'Lists official SAP AI Core Foundation Models with pricing rates (per 1k tokens in Capacity Units), context window length, and provider.',
    inputSchema: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          description: 'Optional filter by provider: Google, Azure, Anthropic, Mistral, SAP, PriorLabs, etc.',
        },
        search: {
          type: 'string',
          description: 'Optional search keyword in model name or display name.',
        },
      },
    },
  },
  {
    name: 'ai_core_get_templates',
    description: 'Returns the 8 official SAP AI Core Architecture Templates (Document Q&A, Autonomous Agent, Multi-Agent Platform, Batch Scoring, Prediction API, etc.) with pre-configured model stacks and approx monthly Capacity Units.',
    inputSchema: {
      type: 'object',
      properties: {
        intent: {
          type: 'string',
          enum: ['ai', 'compute', 'both', 'all'],
          description: 'Filter by intent pillar: ai, compute, both, or all.',
        },
      },
    },
  },
  {
    name: 'ai_core_recommend_step_setting',
    description: 'Provides architectural and cost-optimal SAP AI Core configuration recommendations for an individual process step based on its Cognitive Primitive (Filter, Extractor, Matcher, Evaluator, Executor, Generator) and chosen Automation Archetype (Deterministic, Assistant, Copilot, Autopilot, Agentic).',
    inputSchema: {
      type: 'object',
      properties: {
        primitive: {
          type: 'string',
          enum: [
            'Filter / Gatekeeper',
            'Extractor / Transformer',
            'Matcher / Enricher',
            'Evaluator / Reasoner',
            'Executor / Actuator',
            'Generator / Synthesizer',
          ],
          description: 'The cognitive primitive of the SAP process step.',
        },
        archetype: {
          type: 'string',
          enum: ['deterministic', 'classic_ml', 'copilot', 'autopilot', 'agentic'],
          description: 'The execution archetype chosen for this step.',
        },
        language: {
          type: 'string',
          enum: ['de', 'en'],
          description: 'Language for recommendation output (de or en). Default: de.',
        },
      },
      required: ['primitive', 'archetype'],
    },
  },
  {
    name: 'ai_core_calculate_step_costs',
    description: 'Calculates the exact monthly SAP Capacity Units (CU) and cost breakdown for a specific model, token volumes, monthly requests, and orchestration options (Data Masking, Content Filter, Grounding).',
    inputSchema: {
      type: 'object',
      properties: {
        modelKey: {
          type: 'string',
          description: 'Model key or name (e.g. gemini-3.5-flash-lite, gpt-5.4, claude-3.5-sonnet).',
        },
        monthlyRequests: {
          type: 'number',
          description: 'Number of transactions / requests per month (e.g. 10000).',
        },
        inputTokens: {
          type: 'number',
          description: 'Average input tokens per request (e.g. 1200).',
        },
        outputTokens: {
          type: 'number',
          description: 'Average output tokens per request (e.g. 350).',
        },
        enableDataMasking: {
          type: 'boolean',
          description: 'Enable SAP BTP GDPR Data Masking (0.00118 CU/req).',
        },
        enableContentFilter: {
          type: 'boolean',
          description: 'Enable SAP Content Filtering (0.0003 CU/req).',
        },
        enableGrounding: {
          type: 'boolean',
          description: 'Enable SAP Vector Grounding RAG (0.0005365 CU/query).',
        },
      },
      required: ['modelKey', 'monthlyRequests', 'inputTokens', 'outputTokens'],
    },
  },
];

function handleToolCall(name: string, args: any) {
  switch (name) {
    case 'ai_core_list_models': {
      let filtered = AI_CORE_MODELS;
      if (args?.provider) {
        const p = String(args.provider).toLowerCase();
        filtered = filtered.filter(m => m.provider.toLowerCase().includes(p) || m.category.toLowerCase().includes(p));
      }
      if (args?.search) {
        const s = String(args.search).toLowerCase();
        filtered = filtered.filter(m => m.name.toLowerCase().includes(s) || m.displayName.toLowerCase().includes(s));
      }
      return filtered.map(m => ({
        key: m.key,
        name: m.name,
        displayName: m.displayName,
        provider: m.provider,
        contextLength: m.contextLength,
        capabilities: m.capabilities,
        latestVersion: m.version[0] ? {
          inputTokensCostPer1kCu: m.version[0].inputTokensCost,
          outputTokensCostPer1kCu: m.version[0].outputTokensCost,
        } : null,
      }));
    }

    case 'ai_core_get_templates': {
      let templates = AI_CORE_TEMPLATES;
      if (args?.intent && args.intent !== 'all') {
        templates = templates.filter(t => t.intent === args.intent);
      }
      return templates.map(t => ({
        preset: t.preset,
        intent: t.intent,
        badge: t.badge,
        title: t.title,
        description: t.desc,
        meta: t.meta,
        approxMonthlyCu: t.approxCU,
        modelsConfigured: t.config?.foundationModels || [],
        orchestration: t.config?.orchestration || null,
      }));
    }

    case 'ai_core_recommend_step_setting': {
      return recommendStepSetting(
        args.primitive as CognitivePrimitive,
        args.archetype as AutomationArchetype,
        args.language || 'de'
      );
    }

    case 'ai_core_calculate_step_costs': {
      return calculateStepCapacityUnits({
        modelKey: args.modelKey,
        monthlyRequests: args.monthlyRequests,
        inputTokens: args.inputTokens,
        outputTokens: args.outputTokens,
        enableDataMasking: !!args.enableDataMasking,
        enableContentFilter: !!args.enableContentFilter,
        enableGrounding: !!args.enableGrounding,
      });
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// JSON-RPC stdio transport
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(id: any, result: any, error?: any) {
  const response: any = { jsonrpc: '2.0', id };
  if (error) {
    response.error = { code: -32603, message: String(error.message || error) };
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + '\n');
}

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);

    if (msg.method === 'initialize') {
      sendResponse(msg.id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      });
      return;
    }

    if (msg.method === 'notifications/initialized') {
      // no response required for notification
      return;
    }

    if (msg.method === 'ping') {
      sendResponse(msg.id, {});
      return;
    }

    if (msg.method === 'tools/list') {
      sendResponse(msg.id, { tools: TOOLS });
      return;
    }

    if (msg.method === 'tools/call') {
      const toolName = msg.params?.name;
      const toolArgs = msg.params?.arguments || {};
      try {
        const result = handleToolCall(toolName, toolArgs);
        sendResponse(msg.id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        });
      } catch (err: any) {
        sendResponse(msg.id, {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true,
        });
      }
      return;
    }

    // Default method not found
    if (msg.id !== undefined) {
      sendResponse(msg.id, null, { message: `Method not found: ${msg.method}` });
    }
  } catch (err: any) {
    sendResponse(null, null, { message: `Parse error: ${err.message}` });
  }
});
