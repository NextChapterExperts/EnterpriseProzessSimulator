// Auto-extracted official SAP AI Core Cost Calculator Catalog Data
// Source: https://ai-core-calculator.cfapps.eu10.hana.ondemand.com/

export interface ModelVersion {
  key: string;
  name: string;
  isLatest: boolean;
  deprecated: boolean;
  retirementDate?: string;
  inputTokensCost: number; // per 1k tokens in CU
  outputTokensCost: number; // per 1k tokens in CU
  readCachedInputTokensCost?: number;
  writeCachedInputTokensCost?: number;
}

export interface AiCoreModel {
  key: string;
  name: string;
  displayName: string;
  category: string;
  accessType: string;
  provider: string;
  contextLength?: number | null;
  inputTypes: string[];
  capabilities: string[];
  streamingSupported: boolean;
  version: ModelVersion[];
}

export interface AiCoreTemplate {
  preset: string;
  intent: string;
  badge: string;
  badgeClass: string;
  title: string;
  desc: string;
  meta: string;
  approxCU: number | null;
  illustration?: string;
  config: any;
}

export const ORCHESTRATION_RATES = {
  "contentFilter": {
    "external": 0.0003,
    "internal": 0.0003
  },
  "grounding": {
    "external": 0.0005365,
    "internal": 0.0005365
  },
  "groundingStorage": {
    "external": 0.205563,
    "internal": 0.205563
  },
  "translation": {
    "external": 0.00162,
    "internal": 0.00162
  },
  "translationBlocksPerCall": 24,
  "dataMasking": {
    "external": 0.00118,
    "internal": 0.00118
  },
  "inferenceObservability": {
    "external": 0.00089,
    "internal": 0.00089
  }
};

export const AI_CORE_TEMPLATES: AiCoreTemplate[] = [
  {
    "preset": "ai-small",
    "intent": "ai",
    "badge": "Small",
    "badgeClass": "tpl-badge--blue",
    "title": "Document Q&A",
    "desc": "Single LLM answering questions over a document corpus. Low complexity, no orchestration.",
    "meta": "1 foundation model | ~5K queries/month | No orchestration",
    "approxCU": 8,
    "illustration": "assets/Screwdriver_medium.svg",
    "config": {
      "label": "Document Q&A",
      "activePillars": {
        "generativeAI": true,
        "compute": false,
        "storage": false
      },
      "foundationModels": [
        {
          "catalogId": "gemini3.1flashlite",
          "pricingMode": "Standard",
          "inputTokens": 1000,
          "outputTokens": 300,
          "requests": 5000
        }
      ],
      "orchestration": {
        "enabled": false,
        "autoFilled": false,
        "overrides": {}
      },
      "promptOptimizer": {
        "enabled": false,
        "value": 5
      },
      "evaluation": {
        "enabled": false,
        "nodeHours": 10
      }
    }
  },
  {
    "preset": "ai-medium",
    "intent": "ai",
    "badge": "Medium",
    "badgeClass": "tpl-badge--yellow",
    "title": "Autonomous Agent",
    "desc": "Multi-model agentic loop with grounding and content filtering. Medium complexity.",
    "meta": "2 foundation models | Grounding + Content Filter | ~2K tasks/month",
    "approxCU": 90,
    "illustration": "assets/Toolbox_medium.svg",
    "config": {
      "label": "Autonomous Agent",
      "activePillars": {
        "generativeAI": true,
        "compute": false,
        "storage": false
      },
      "foundationModels": [
        {
          "catalogId": "gpt5.4",
          "pricingMode": "Standard",
          "inputTokens": 5000,
          "outputTokens": 1000,
          "requests": 2000
        },
        {
          "catalogId": "gpt5.4nano",
          "pricingMode": "Standard",
          "inputTokens": 1000,
          "outputTokens": 200,
          "requests": 2000
        }
      ],
      "orchestration": {
        "enabled": true,
        "autoFilled": false,
        "overrides": {
          "contentFilter": {
            "enabled": true,
            "value": 2000,
            "trafficRatio": 1
          },
          "grounding": {
            "enabled": true,
            "storageGBPerDay": 5,
            "queriesPerMonth": 2000
          }
        }
      },
      "promptOptimizer": {
        "enabled": false,
        "value": 10
      },
      "evaluation": {
        "enabled": false,
        "nodeHours": 10
      }
    }
  },
  {
    "preset": "ai-large",
    "intent": "ai",
    "badge": "Large",
    "badgeClass": "tpl-badge--purple",
    "title": "Multi-Agent Platform",
    "desc": "Full orchestration stack: grounding, content filter, translation, data masking, inference observability.",
    "meta": "Multi-model | Full orchestration | Prompt Optimizer | Evaluations | ~5K queries/month",
    "approxCU": 2104,
    "illustration": "assets/Drill_medium.svg",
    "config": {
      "label": "Multi-Agent Platform",
      "activePillars": {
        "generativeAI": true,
        "compute": false,
        "storage": false
      },
      "foundationModels": [
        {
          "catalogId": "anthropicclaude4.6sonnet",
          "pricingMode": "Standard",
          "inputTokens": 8000,
          "outputTokens": 1500,
          "requests": 5000
        },
        {
          "catalogId": "gpt5.4nano",
          "pricingMode": "Standard",
          "inputTokens": 2000,
          "outputTokens": 500,
          "requests": 5000
        }
      ],
      "orchestration": {
        "enabled": true,
        "autoFilled": true,
        "overrides": {
          "contentFilter": {
            "enabled": true,
            "value": 5000,
            "trafficRatio": 1
          },
          "grounding": {
            "enabled": true,
            "storageGBPerDay": 50,
            "queriesPerMonth": 5000
          },
          "translation": {
            "enabled": true,
            "value": 3000
          },
          "dataMasking": {
            "enabled": true,
            "value": 2500,
            "trafficRatio": 0.5
          },
          "inferenceObservability": {
            "enabled": true,
            "value": 5000,
            "trafficRatio": 1
          }
        }
      },
      "promptOptimizer": {
        "enabled": true,
        "value": 25
      },
      "evaluation": {
        "enabled": true,
        "nodeHours": 10
      }
    }
  },
  {
    "preset": "compute-small",
    "intent": "compute",
    "badge": "Small",
    "badgeClass": "tpl-badge--blue",
    "title": "Batch Scoring Job",
    "desc": "Periodic ML batch inference on a single CPU instance. No LLM traffic.",
    "meta": "1 CPU instance | 100 hrs/mo | No LLM",
    "approxCU": 205,
    "illustration": "assets/Screwdriver_medium.svg",
    "config": {
      "label": "Batch Scoring Job",
      "activePillars": {
        "generativeAI": false,
        "compute": true,
        "storage": false
      },
      "foundationModels": [],
      "orchestration": {
        "enabled": false,
        "autoFilled": false,
        "overrides": {}
      },
      "compute": {
        "instances": [
          {
            "instanceKey": "AWS:m7i.2xlarge",
            "hoursPerMonth": 100,
            "replicas": 1
          }
        ],
        "storage": {
          "enabled": false,
          "gbPerMonth": 0
        }
      }
    }
  },
  {
    "preset": "compute-medium",
    "intent": "compute",
    "badge": "Medium",
    "badgeClass": "tpl-badge--yellow",
    "title": "Prediction API",
    "desc": "Always-on prediction serving with 2 replicas for redundancy. Full-month uptime.",
    "meta": "1 instance × 2 replicas | 730 hrs/mo | No LLM",
    "approxCU": 2035,
    "illustration": "assets/Toolbox_medium.svg",
    "config": {
      "label": "Prediction API",
      "activePillars": {
        "generativeAI": false,
        "compute": true,
        "storage": false
      },
      "foundationModels": [],
      "orchestration": {
        "enabled": false,
        "autoFilled": false,
        "overrides": {}
      },
      "compute": {
        "instances": [
          {
            "instanceKey": "GCP:n4-standard-8",
            "hoursPerMonth": 730,
            "replicas": 2
          }
        ],
        "storage": {
          "enabled": false,
          "gbPerMonth": 0
        }
      }
    }
  },
  {
    "preset": "compute-large",
    "intent": "compute",
    "badge": "Large",
    "badgeClass": "tpl-badge--purple",
    "title": "ML Training Pipeline",
    "desc": "GPU-accelerated training + CPU serving + object storage.",
    "meta": "GPU + CPU instances | Object Storage | No LLM",
    "approxCU": 3180,
    "illustration": "assets/Drill_medium.svg",
    "config": {
      "label": "ML Training Pipeline",
      "activePillars": {
        "generativeAI": false,
        "compute": true,
        "storage": true
      },
      "foundationModels": [],
      "orchestration": {
        "enabled": false,
        "autoFilled": false,
        "overrides": {}
      },
      "compute": {
        "instances": [
          {
            "instanceKey": "AWS:g6e.4xlarge",
            "hoursPerMonth": 200,
            "replicas": 1
          },
          {
            "instanceKey": "AWS:m7i.2xlarge",
            "hoursPerMonth": 730,
            "replicas": 2
          }
        ],
        "storage": {
          "enabled": true,
          "gbPerMonth": 100
        }
      }
    }
  },
  {
    "preset": "both-small",
    "intent": "both",
    "badge": "Small",
    "badgeClass": "tpl-badge--blue",
    "title": "AI-Enhanced App",
    "desc": "Managed LLM for text generation paired with a custom ML model on AI Core compute.",
    "meta": "1 foundation model | 1 compute instance | ~2K requests/month",
    "approxCU": 234,
    "illustration": "assets/Screwdriver_medium.svg",
    "config": {
      "label": "AI-Enhanced App",
      "activePillars": {
        "generativeAI": true,
        "compute": true,
        "storage": false
      },
      "foundationModels": [
        {
          "catalogId": "gpt5.4",
          "pricingMode": "Standard",
          "inputTokens": 2000,
          "outputTokens": 500,
          "requests": 2000
        }
      ],
      "orchestration": {
        "enabled": false,
        "autoFilled": false,
        "overrides": {}
      },
      "promptOptimizer": {
        "enabled": false,
        "value": 5
      },
      "evaluation": {
        "enabled": false,
        "nodeHours": 10
      },
      "compute": {
        "instances": [
          {
            "instanceKey": "AWS:m7i.2xlarge",
            "hoursPerMonth": 100,
            "replicas": 1
          }
        ],
        "storage": {
          "enabled": false,
          "gbPerMonth": 0
        }
      }
    }
  },
  {
    "preset": "both-medium",
    "intent": "both",
    "badge": "Medium",
    "badgeClass": "tpl-badge--yellow",
    "title": "AI-Augmented ML Pipeline",
    "desc": "LLM + classical ML combo: grounding and content filter on AI traffic; always-on compute serving.",
    "meta": "2 foundation models | Orchestration | 1 compute instance",
    "approxCU": 1654,
    "illustration": "assets/Toolbox_medium.svg",
    "config": {
      "label": "AI-Augmented ML Pipeline",
      "activePillars": {
        "generativeAI": true,
        "compute": true,
        "storage": false
      },
      "foundationModels": [
        {
          "catalogId": "gpt5.4",
          "pricingMode": "Standard",
          "inputTokens": 3000,
          "outputTokens": 800,
          "requests": 3000
        },
        {
          "catalogId": "gpt5.4nano",
          "pricingMode": "Standard",
          "inputTokens": 1000,
          "outputTokens": 300,
          "requests": 3000
        }
      ],
      "orchestration": {
        "enabled": true,
        "autoFilled": false,
        "overrides": {
          "contentFilter": {
            "enabled": true,
            "value": 3000,
            "trafficRatio": 1
          },
          "grounding": {
            "enabled": true,
            "storageGBPerDay": 5,
            "queriesPerMonth": 3000
          }
        }
      },
      "promptOptimizer": {
        "enabled": false,
        "value": 10
      },
      "evaluation": {
        "enabled": false,
        "nodeHours": 10
      },
      "compute": {
        "instances": [
          {
            "instanceKey": "Azure:Standard_D8ds_v6",
            "hoursPerMonth": 730,
            "replicas": 1
          }
        ],
        "storage": {
          "enabled": false,
          "gbPerMonth": 0
        }
      }
    }
  },
  {
    "preset": "both-large",
    "intent": "both",
    "badge": "Large",
    "badgeClass": "tpl-badge--purple",
    "title": "Enterprise AI Fabric",
    "desc": "Full enterprise AI platform: multi-model LLMs, tabular AI, full orchestration, GPU training, object storage.",
    "meta": "Multi-model | Full orchestration | GPU + CPU instances | Object Storage",
    "approxCU": 6329,
    "illustration": "assets/Drill_medium.svg",
    "config": {
      "label": "Enterprise AI Fabric",
      "activePillars": {
        "generativeAI": true,
        "compute": true,
        "storage": true
      },
      "foundationModels": [
        {
          "catalogId": "anthropicclaude4.6sonnet",
          "pricingMode": "Standard",
          "inputTokens": 8000,
          "outputTokens": 1500,
          "requests": 5000
        },
        {
          "catalogId": "gpt5.4nano",
          "pricingMode": "Standard",
          "inputTokens": 2000,
          "outputTokens": 500,
          "requests": 5000
        },
        {
          "catalogId": "sap-rpt-1-large",
          "pricingMode": "Standard",
          "contextCallsPerPrediction": 10000,
          "predictedTokensPerPrediction": 100,
          "predictionsPerMonth": 10000
        }
      ],
      "orchestration": {
        "enabled": true,
        "autoFilled": true,
        "overrides": {
          "contentFilter": {
            "enabled": true,
            "value": 5000,
            "trafficRatio": 1
          },
          "grounding": {
            "enabled": true,
            "storageGBPerDay": 50,
            "queriesPerMonth": 5000
          },
          "translation": {
            "enabled": true,
            "value": 5000
          },
          "dataMasking": {
            "enabled": true,
            "value": 5000,
            "trafficRatio": 0.5
          },
          "inferenceObservability": {
            "enabled": true,
            "value": 10000,
            "trafficRatio": 1
          }
        }
      },
      "promptOptimizer": {
        "enabled": true,
        "value": 25
      },
      "evaluation": {
        "enabled": true,
        "nodeHours": 20
      },
      "compute": {
        "instances": [
          {
            "instanceKey": "AWS:g6e.4xlarge",
            "hoursPerMonth": 200,
            "replicas": 1
          },
          {
            "instanceKey": "AWS:m7i.2xlarge",
            "hoursPerMonth": 730,
            "replicas": 2
          }
        ],
        "storage": {
          "enabled": true,
          "gbPerMonth": 20
        }
      }
    }
  }
];

export const AI_CORE_MODELS: AiCoreModel[] = [
  {
    "key": "tabpfn-3.5-plus100k",
    "name": "TabPFN 3.5 Plus (<= 100k context rows)",
    "displayName": "Prior Labs TabPFN-3.5-Plus",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "PriorLabs",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "2609",
        "name": "2609",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "tabpfn-3.5-plus1M50K",
    "name": "TabPFN 3.5 Plus (> 100k context rows)",
    "displayName": "Prior Labs TabPFN-3.5-Plus",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "PriorLabs",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "2609",
        "name": "2609",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "qwen3.827bdevpreview",
    "name": "qwen3.8-27b-dev-preview",
    "displayName": "Qwen3.8 27B Dev Preview",
    "category": "Opensource",
    "accessType": "SAP-Hosted",
    "provider": "Alibaba",
    "contextLength": 262144,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2609-dev-preview",
        "name": "2609-dev-preview",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00019,
        "outputTokensCost": 0.00146,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini3.5flashlite",
    "name": "gemini-3.5-flash-lite",
    "displayName": "Gemini 3.5 Flash Lite",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1048576,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00039,
        "outputTokensCost": 0.00278,
        "readCachedInputTokensCost": 0.00004,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1.6",
    "name": "SAP RPT 1.6",
    "displayName": "SAP RPT 1.6",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1.6-large-tier-1",
    "name": "SAP RPT 1.6 Large (Default Context)",
    "displayName": "SAP RPT 1.6 Large (Default Context)",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1.6-large-tier-2",
    "name": "SAP RPT 1.6 Large (Deep Context)",
    "displayName": "SAP RPT 1.6 Large (Deep Context)",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "nvidiallamanemotronembed1b",
    "name": "nvidia--llama-nemotron-embed-1b",
    "displayName": "Llama Nemotron Embed 1b V2",
    "category": "NVIDIA",
    "accessType": "SAP-Managed",
    "provider": "NVIDIA",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "2",
        "name": "2",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00007,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gpt5.6sol272k",
    "name": "gpt-5.6-sol (<=272k tokens)",
    "displayName": "GPT 5.6 Sol",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2026-07-09",
        "name": "2026-07-09",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00342,
        "outputTokensCost": 0.02015,
        "readCachedInputTokensCost": 0.00034,
        "writeCachedInputTokensCost": 0.00427
      }
    ]
  },
  {
    "key": "gpt5.6sol1M50K",
    "name": "gpt-5.6-sol (>272k tokens)",
    "displayName": "GPT 5.6 Sol",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2026-07-09",
        "name": "2026-07-09",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00677,
        "outputTokensCost": 0.03019,
        "readCachedInputTokensCost": 0.00068,
        "writeCachedInputTokensCost": 0.00846
      }
    ]
  },
  {
    "key": "gpt5.6Terra272k",
    "name": "gpt-5.6-terra (<=272k tokens)",
    "displayName": "GPT 5.6 Terra",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2026-07-09",
        "name": "2026-07-09",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00141,
        "outputTokensCost": 0.0081,
        "readCachedInputTokensCost": 0.00014,
        "writeCachedInputTokensCost": 0.00176
      }
    ]
  },
  {
    "key": "gpt5.6terra1M50K",
    "name": "gpt-5.6-terra (>272k tokens)",
    "displayName": "GPT 5.6 Terra",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2026-07-09",
        "name": "2026-07-09",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00275,
        "outputTokensCost": 0.01212,
        "readCachedInputTokensCost": 0.00028,
        "writeCachedInputTokensCost": 0.00344
      }
    ]
  },
  {
    "key": "gpt5.6Luna272k",
    "name": "gpt-5.6-luna (<=272k tokens)",
    "displayName": "GPT 5.6 Luna",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2026-07-09",
        "name": "2026-07-09",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00015,
        "outputTokensCost": 0.00082,
        "readCachedInputTokensCost": 0.00002,
        "writeCachedInputTokensCost": 0.00026
      }
    ]
  },
  {
    "key": "gpt5.6luna1M50K",
    "name": "gpt-5.6-luna (>272k tokens)",
    "displayName": "GPT 5.6 Luna",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2026-07-09",
        "name": "2026-07-09",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00029,
        "outputTokensCost": 0.00122,
        "readCachedInputTokensCost": 0.00003,
        "writeCachedInputTokensCost": 0.00043
      }
    ]
  },
  {
    "key": "gpt5.5",
    "name": "gpt-5.5",
    "displayName": "GPT-5.5",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20260424",
        "name": "2026-04-24",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00342,
        "outputTokensCost": 0.02015,
        "readCachedInputTokensCost": 0.00034,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gpt5",
    "name": "gpt-5",
    "displayName": "GPT-5",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 272000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250807",
        "name": "2025-08-07",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00091,
        "outputTokensCost": 0.00677,
        "readCachedInputTokensCost": 0.00009,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.8opus",
    "name": "anthropic--claude-4.8-opus",
    "displayName": "Claude 4.8 Opus",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00367,
        "outputTokensCost": 0.01806,
        "readCachedInputTokensCost": 0.00037,
        "writeCachedInputTokensCost": 0.00459
      }
    ]
  },
  {
    "key": "gpt5.4",
    "name": "gpt-5.4",
    "displayName": "GPT-5.4",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1050000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20260305",
        "name": "2026-03-05",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00159,
        "outputTokensCost": 0.0092,
        "readCachedInputTokensCost": 0.00016,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.7opus",
    "name": "anthropic--claude-4.7-opus",
    "displayName": "Claude 4.7 Opus",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00367,
        "outputTokensCost": 0.01806,
        "readCachedInputTokensCost": 0.00037,
        "writeCachedInputTokensCost": 0.00459
      }
    ]
  },
  {
    "key": "gpt5.2",
    "name": "gpt-5.2",
    "displayName": "GPT-5.2",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 400000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20251211",
        "name": "2025-12-11",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2027-05-12",
        "inputTokensCost": 0.00125,
        "outputTokensCost": 0.00944,
        "readCachedInputTokensCost": 0.00012,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.6opus",
    "name": "anthropic--claude-4.6-opus",
    "displayName": "Claude 4.6 Opus",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00367,
        "outputTokensCost": 0.01806,
        "readCachedInputTokensCost": 0.00037,
        "writeCachedInputTokensCost": 0.00459
      }
    ]
  },
  {
    "key": "gpt5.1",
    "name": "gpt-5.1",
    "displayName": "GPT-5.1",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 400000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.0009,
        "outputTokensCost": 0.00675,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.6sonnet",
    "name": "anthropic--claude-4.6-sonnet",
    "displayName": "Claude 4.6 Sonnet",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00223,
        "outputTokensCost": 0.01087,
        "readCachedInputTokensCost": 0.0002,
        "writeCachedInputTokensCost": 0.00254
      }
    ]
  },
  {
    "key": "gpt5.3codex",
    "name": "gpt-5.3-codex",
    "displayName": "GPT-5.3 Codex",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 400000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20260224",
        "name": "2026-02-24",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00125,
        "outputTokensCost": 0.00944,
        "readCachedInputTokensCost": 0.00012,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.5opus",
    "name": "anthropic--claude-4.5-opus",
    "displayName": "Claude 4.5 Opus",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00367,
        "outputTokensCost": 0.01806,
        "readCachedInputTokensCost": 0.00037,
        "writeCachedInputTokensCost": 0.00459
      }
    ]
  },
  {
    "key": "gpt5mini",
    "name": "gpt-5-mini",
    "displayName": "GPT-5-Mini",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 272000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250807",
        "name": "2025-08-07",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2027-02-06",
        "inputTokensCost": 0.00019,
        "outputTokensCost": 0.00136,
        "readCachedInputTokensCost": 0.00002,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.5sonnet",
    "name": "anthropic--claude-4.5-sonnet",
    "displayName": "Claude 4.5 Sonnet",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00223,
        "outputTokensCost": 0.01087,
        "readCachedInputTokensCost": 0.0002,
        "writeCachedInputTokensCost": 0.00254
      }
    ]
  },
  {
    "key": "gemini3.5flash",
    "name": "gemini-3.5-flash",
    "displayName": "Gemini 3.5 Flash",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00169,
        "outputTokensCost": 0.00981,
        "readCachedInputTokensCost": 0.00017,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4.5haiku",
    "name": "anthropic--claude-4.5-haiku",
    "displayName": "Claude 4.5 Haiku",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00079,
        "outputTokensCost": 0.00367,
        "readCachedInputTokensCost": 0.00008,
        "writeCachedInputTokensCost": 0.00099
      }
    ]
  },
  {
    "key": "gpt5.4nano",
    "name": "gpt-5.4-nano",
    "displayName": "GPT-5.4 Nano",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 400000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20260317",
        "name": "2026-03-17",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00014,
        "outputTokensCost": 0.00078,
        "readCachedInputTokensCost": 0.00001,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gpt5nano",
    "name": "gpt-5-nano",
    "displayName": "GPT-5-Nano",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 272000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250807",
        "name": "2025-08-07",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2027-02-06",
        "inputTokensCost": 0.00004,
        "outputTokensCost": 0.00028,
        "readCachedInputTokensCost": 0.00001,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4opus",
    "name": "anthropic--claude-4-opus",
    "displayName": "Claude 4 Opus",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00988,
        "outputTokensCost": 0.04913,
        "readCachedInputTokensCost": 0.00099,
        "writeCachedInputTokensCost": 0.01236
      }
    ]
  },
  {
    "key": "gpt4.1",
    "name": "gpt-4.1",
    "displayName": "GPT-4.1",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1047576,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250414",
        "name": "2025-04-14",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-14",
        "inputTokensCost": 0.00129,
        "outputTokensCost": 0.00494,
        "readCachedInputTokensCost": 0.00032,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "anthropicclaude4sonnet",
    "name": "anthropic--claude-4-sonnet",
    "displayName": "Claude 4 Sonnet",
    "category": "Anthropic",
    "accessType": "Remote",
    "provider": "Anthropic",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-10-14",
        "inputTokensCost": 0.00204,
        "outputTokensCost": 0.00988,
        "readCachedInputTokensCost": 0.0002,
        "writeCachedInputTokensCost": 0.00254
      }
    ]
  },
  {
    "key": "gpt4.1mini",
    "name": "gpt-4.1-mini",
    "displayName": "GPT-4.1 mini",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1047576,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250414",
        "name": "2025-04-14",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-14",
        "inputTokensCost": 0.00026,
        "outputTokensCost": 0.00099,
        "readCachedInputTokensCost": 0.00007,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini3.1flashlite",
    "name": "gemini-3.1-flash-lite",
    "displayName": "Gemini 3.1 Flash Lite",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00029,
        "outputTokensCost": 0.00164,
        "readCachedInputTokensCost": 0.00003,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gpt4o",
    "name": "gpt-4o",
    "displayName": "GPT-4o",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20240513",
        "name": "2024-05-13",
        "isLatest": false,
        "deprecated": true,
        "retirementDate": "2026-10-01",
        "inputTokensCost": 0.00312,
        "outputTokensCost": 0.0092,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "20240806",
        "name": "2024-08-06",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-01",
        "inputTokensCost": 0.00159,
        "outputTokensCost": 0.00616,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "20241120",
        "name": "2024-11-20",
        "isLatest": false,
        "deprecated": false,
        "retirementDate": "2026-10-01",
        "inputTokensCost": 0.00175,
        "outputTokensCost": 0.00677,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini2.5pro200k",
    "name": "gemini-2.5-pro (<=200k tokens)",
    "displayName": "Gemini 2.5 Pro",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-16",
        "inputTokensCost": 0.00087,
        "outputTokensCost": 0.00647,
        "readCachedInputTokensCost": 0.00009,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini2.5pro1M",
    "name": "gemini-2.5-pro (>200k tokens)",
    "displayName": "Gemini 2.5 Pro",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-16",
        "inputTokensCost": 0.00167,
        "outputTokensCost": 0.00966,
        "readCachedInputTokensCost": 0.00017,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gpt4omini",
    "name": "gpt-4o-mini",
    "displayName": "GPT-4o Mini",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20240718",
        "name": "2024-07-18",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-10-01",
        "inputTokensCost": 0.00009,
        "outputTokensCost": 0.00039,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini3.1flashimage",
    "name": "gemini-3.1-flash-image",
    "displayName": "Gemini 3.1 Flash Image",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00056,
        "outputTokensCost": 0.00302,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gpt4.1nano",
    "name": "gpt-4.1-nano",
    "displayName": "GPT-4.1 nano",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 1047576,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250414",
        "name": "2025-04-14",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-14",
        "inputTokensCost": 0.00008,
        "outputTokensCost": 0.00026,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini3proimage",
    "name": "gemini-3-pro-image",
    "displayName": "Gemini 3 Pro Image",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 65536,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00204,
        "outputTokensCost": 0.01187,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini2.5flash",
    "name": "gemini-2.5-flash",
    "displayName": "Gemini 2.5 Flash",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-16",
        "inputTokensCost": 0.00027,
        "outputTokensCost": 0.00167,
        "readCachedInputTokensCost": 0.00003,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "amazonnovapremier",
    "name": "amazon--nova-premier",
    "displayName": "Nova Premier",
    "category": "Amazon",
    "accessType": "Remote",
    "provider": "Amazon",
    "contextLength": 1000000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-09-14",
        "inputTokensCost": 0.00171,
        "outputTokensCost": 0.00825,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "o4mini",
    "name": "o4-mini",
    "displayName": "o4 Mini",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 200000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250416",
        "name": "2025-04-16",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-16",
        "inputTokensCost": 0.00069,
        "outputTokensCost": 0.0027,
        "readCachedInputTokensCost": 0.00017,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "o3",
    "name": "o3",
    "displayName": "O3",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250416",
        "name": "2025-04-16",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-16",
        "inputTokensCost": 0.0061,
        "outputTokensCost": 0.02436,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini2.5flashimage",
    "name": "gemini-2.5-flash-image",
    "displayName": "Gemini 2.5 Flash Image",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 65536,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "image-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-02",
        "inputTokensCost": 0.00021,
        "outputTokensCost": 0.00162,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "amazonnovapro",
    "name": "amazon--nova-pro",
    "displayName": "Nova Pro",
    "category": "Amazon",
    "accessType": "Remote",
    "provider": "Amazon",
    "contextLength": 300000,
    "inputTypes": [
      "text",
      "image",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00056,
        "outputTokensCost": 0.00213,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "o3mini",
    "name": "o3-mini",
    "displayName": "O3 Mini",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 200000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20250131",
        "name": "2025-01-31",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-08-02",
        "inputTokensCost": 0.00069,
        "outputTokensCost": 0.0027,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gemini2.5flashlite",
    "name": "gemini-2.5-flash-lite",
    "displayName": "Gemini 2.5 Flash Lite",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": 1000000,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition",
      "speech-to-text"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-16",
        "inputTokensCost": 0.00008,
        "outputTokensCost": 0.00028,
        "readCachedInputTokensCost": 0.00001,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "amazonnovalite",
    "name": "amazon--nova-lite",
    "displayName": "Nova Lite",
    "category": "Amazon",
    "accessType": "Remote",
    "provider": "Amazon",
    "inputTypes": [
      "text",
      "image",
      "video"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": false,
        "deprecated": false,
        "inputTokensCost": 0.00004,
        "outputTokensCost": 0.00016,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "2",
        "name": "2",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.0003,
        "outputTokensCost": 0.00237,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "o1",
    "name": "o1",
    "displayName": "O1",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20241217",
        "name": "2024-12-17",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-07-15",
        "inputTokensCost": 0.0092,
        "outputTokensCost": 0.03658,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "amazonnovamicro",
    "name": "amazon--nova-micro",
    "displayName": "Nova Micro",
    "category": "Amazon",
    "accessType": "Remote",
    "provider": "Amazon",
    "contextLength": 128000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00003,
        "outputTokensCost": 0.0001,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "o1mini",
    "name": "o1-mini",
    "displayName": "O1 Mini",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 128000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "20240912",
        "name": "2024-09-12",
        "isLatest": true,
        "deprecated": true,
        "inputTokensCost": 0.0019,
        "outputTokensCost": 0.00737,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "coherecommandareasoning",
    "name": "cohere--command-a-reasoning",
    "displayName": "Command A Reasoning",
    "category": "Cohere",
    "accessType": "SAP-Hosted",
    "provider": "Cohere",
    "contextLength": 256000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation",
      "reasoning"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2508",
        "name": "2508",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-08-30",
        "inputTokensCost": 0.00063,
        "outputTokensCost": 0.00505,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "gptrealtime",
    "name": "gpt-realtime",
    "displayName": "GPT Realtime",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": 128000,
    "inputTypes": [
      "audio"
    ],
    "capabilities": [
      "speech-to-speech"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "20250828",
        "name": "2025-08-28",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2027-02-28",
        "inputTokensCost": 0.00251,
        "outputTokensCost": 0.00981,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "mistralaimistrallargeinstruct",
    "name": "mistralai--mistral-large-instruct",
    "displayName": "Mistral Large Instruct",
    "category": "Mistral",
    "accessType": "SAP-Hosted",
    "provider": "Mistral AI",
    "contextLength": 64000,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2407",
        "name": "2407",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-09-30",
        "inputTokensCost": 0.00112,
        "outputTokensCost": 0.0032,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sonarpro",
    "name": "sonar-pro",
    "displayName": "Sonar Pro",
    "category": "Perplexity",
    "accessType": "Remote",
    "provider": "Perplexity",
    "contextLength": 200000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "perplexityus",
        "name": "perplexity-us",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00243,
        "outputTokensCost": 0.01185,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "mistralaimistralmedium",
    "name": "mistralai--mistral-medium",
    "displayName": "Mistral Medium 3.5",
    "category": "Mistral",
    "accessType": "SAP-Hosted",
    "provider": "Mistral AI",
    "contextLength": 256000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "3.5",
        "name": "3.5",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00067,
        "outputTokensCost": 0.00347,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "textembedding3large",
    "name": "text-embedding-3-large",
    "displayName": "Text Embedding 3 Large",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00009,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sonar",
    "name": "sonar",
    "displayName": "Sonar",
    "category": "Perplexity",
    "accessType": "Remote",
    "provider": "Perplexity",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "perplexityus",
        "name": "perplexity-us",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00086,
        "outputTokensCost": 0.00086,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "textembedding3small",
    "name": "text-embedding-3-small",
    "displayName": "Text Embedding 3 Small",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00002,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sonardeepresearch",
    "name": "sonar-deep-research",
    "displayName": "Sonar Deep Research",
    "category": "Perplexity",
    "accessType": "Remote",
    "provider": "Perplexity",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "perplexityus",
        "name": "perplexity-us",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00164,
        "outputTokensCost": 0.00636,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "mistralaimistralmediuminstruct",
    "name": "mistralai--mistral-medium-instruct",
    "displayName": "Mistral Medium Instruct",
    "category": "Mistral",
    "accessType": "SAP-Hosted",
    "provider": "Mistral AI",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2505",
        "name": "2505",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-30",
        "inputTokensCost": 0.00036,
        "outputTokensCost": 0.00122,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "geminiembedding",
    "name": "gemini-embedding",
    "displayName": "Gemini Embedding",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00011,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "geminiembedding2",
    "name": "gemini-embedding-2",
    "displayName": "Gemini Embedding 2",
    "category": "Google",
    "accessType": "Remote",
    "provider": "Google",
    "contextLength": null,
    "inputTypes": [
      "text",
      "image",
      "audio",
      "video"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "001",
        "name": "001",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00027,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "mistralaimistralsmallinstruct",
    "name": "mistralai--mistral-small-instruct",
    "displayName": "Mistral Small Instruct",
    "category": "Mistral",
    "accessType": "SAP-Hosted",
    "provider": "Mistral AI",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2503",
        "name": "2503",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-09-30",
        "inputTokensCost": 0.00005,
        "outputTokensCost": 0.00015,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "mistralaimistralsmall",
    "name": "mistralai--mistral-small",
    "displayName": "Mistral Small 4",
    "category": "Mistral",
    "accessType": "SAP-Hosted",
    "provider": "Mistral AI",
    "contextLength": 128000,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "text-generation",
      "image-recognition"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "2603",
        "name": "2603",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-30",
        "inputTokensCost": 0.00007,
        "outputTokensCost": 0.00028,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "textembeddingada002",
    "name": "text-embedding-ada-002",
    "displayName": "Text Embedding Ada 002",
    "category": "Azure",
    "accessType": "Remote",
    "provider": "OpenAI",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "2",
        "name": "2",
        "isLatest": true,
        "deprecated": true,
        "inputTokensCost": 0.00007,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sapabap1",
    "name": "sap-abap-1",
    "displayName": "SAP ABAP 1",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": 32768,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-30",
        "inputTokensCost": 0.00048,
        "outputTokensCost": 0.0017,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "amazontitanembedtext",
    "name": "amazon--titan-embed-text",
    "displayName": "Titan Embed Text",
    "category": "Amazon",
    "accessType": "Remote",
    "provider": "Amazon",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "1.2",
        "name": "1.2",
        "isLatest": false,
        "deprecated": true,
        "inputTokensCost": 0.00014,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "2.0",
        "name": "2.0",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00014,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1-large",
    "name": "sap-rpt-1-large",
    "displayName": "SAP RPT 1 Large",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "default",
        "name": "default",
        "isLatest": false,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1.5",
    "name": "SAP RPT 1.5",
    "displayName": "SAP RPT 1.5",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "default",
        "name": "default",
        "isLatest": false,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "amazontitanembedimage",
    "name": "amazon--titan-embed-image",
    "displayName": "Titan Multimodal Embeddings",
    "category": "Amazon",
    "accessType": "Remote",
    "provider": "Amazon",
    "contextLength": null,
    "inputTypes": [
      "text",
      "image"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "default",
        "name": "default",
        "isLatest": true,
        "deprecated": false,
        "inputTokensCost": 0.00066,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1-small",
    "name": "sap-rpt-1-small",
    "displayName": "SAP RPT 1 Small",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "default",
        "name": "default",
        "isLatest": false,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "sap-rpt-1.5-large",
    "name": "SAP RPT 1.5 Large",
    "displayName": "SAP RPT 1.5 Large",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "tabular"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "default",
        "name": "default",
        "isLatest": false,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      },
      {
        "key": "1",
        "name": "1",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-12-31",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "cohereranker",
    "name": "cohere-reranker",
    "displayName": "Cohere Reranker",
    "category": "Cohere",
    "accessType": "SAP-Managed",
    "provider": "Cohere",
    "contextLength": 4096,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "reranking"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "v3.5",
        "name": "v3.5",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-09-30",
        "inputTokensCost": 0,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "nvidiallama3.2nvembedqa1b",
    "name": "nvidia--llama-3.2-nv-embedqa-1b",
    "displayName": "Llama 3.2 NV EmbedQA 1B",
    "category": "NVIDIA",
    "accessType": "SAP-Managed",
    "provider": "NVIDIA",
    "contextLength": null,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "embedding"
    ],
    "streamingSupported": false,
    "version": [
      {
        "key": "2",
        "name": "2",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-30",
        "inputTokensCost": 0.00007,
        "outputTokensCost": 0,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "abapstarcoder27b",
    "name": "abap-starcoder2-7b",
    "displayName": "ABAP StarCoder2 7B",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": 16384,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "v6",
        "name": "v6",
        "isLatest": true,
        "deprecated": false,
        "retirementDate": "2026-10-30",
        "inputTokensCost": 0.00041,
        "outputTokensCost": 0.00073,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  },
  {
    "key": "abapcodestral",
    "name": "abap-codestral-7b",
    "displayName": "ABAP Codestral 7B",
    "category": "SAP",
    "accessType": "SAP-Hosted",
    "provider": "SAP",
    "contextLength": 32768,
    "inputTypes": [
      "text"
    ],
    "capabilities": [
      "text-generation"
    ],
    "streamingSupported": true,
    "version": [
      {
        "key": "v1",
        "name": "v1",
        "isLatest": true,
        "deprecated": true,
        "retirementDate": "2026-08-30",
        "inputTokensCost": 0.00342,
        "outputTokensCost": 0.00789,
        "readCachedInputTokensCost": 0,
        "writeCachedInputTokensCost": 0
      }
    ]
  }
];
