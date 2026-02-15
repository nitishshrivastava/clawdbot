import type { ModelDefinitionConfig } from "../config/types.js";

export const DIGITALOCEAN_BASE_URL = "https://inference.do-ai.run/v1";

// DigitalOcean uses credit-based pricing, not per-token costs.
// Set to 0 as costs vary by model and account type.
export const DIGITALOCEAN_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

const DIGITALOCEAN_DEFAULT_CONTEXT_WINDOW = 128000;
const DIGITALOCEAN_DEFAULT_MAX_TOKENS = 8192;

/**
 * Static catalog of known DigitalOcean GenAI models.
 * Serves as a fallback when the API is unreachable.
 */
export const DIGITALOCEAN_MODEL_CATALOG: ModelDefinitionConfig[] = [
  // ============================================
  // Anthropic models (via DigitalOcean)
  // ============================================
  {
    id: "anthropic-claude-4.5-sonnet",
    name: "Claude 4.5 Sonnet",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 64000,
  },
  {
    id: "anthropic-claude-sonnet-4",
    name: "Claude Sonnet 4",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 64000,
  },
  {
    id: "anthropic-claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "anthropic-claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 8192,
  },
  {
    id: "anthropic-claude-4.5-haiku",
    name: "Claude 4.5 Haiku",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 64000,
  },
  {
    id: "anthropic-claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 8000,
  },
  {
    id: "anthropic-claude-opus-4.6",
    name: "Claude Opus 4.6",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "anthropic-claude-opus-4.5",
    name: "Claude Opus 4.5",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 64000,
  },
  {
    id: "anthropic-claude-4.1-opus",
    name: "Claude 4.1 Opus",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 32000,
  },
  {
    id: "anthropic-claude-opus-4",
    name: "Claude Opus 4",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 32000,
  },
  {
    id: "anthropic-claude-3-opus",
    name: "Claude 3 Opus",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 4096,
  },

  // ============================================
  // OpenAI models (via DigitalOcean)
  // ============================================
  {
    id: "openai-gpt-oss-120b",
    name: "OpenAI GPT OSS 120B",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: 131072,
  },
  {
    id: "openai-gpt-oss-20b",
    name: "OpenAI GPT OSS 20B",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 131072,
  },
  {
    id: "openai-gpt-5.2",
    name: "GPT-5.2",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "openai-gpt-5-2-pro",
    name: "GPT-5.2 Pro",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "openai-gpt-5.1-codex-max",
    name: "GPT-5.1 Codex Max",
    reasoning: true,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "openai-gpt-5",
    name: "GPT-5",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "openai-gpt-5-mini",
    name: "GPT-5 Mini",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "openai-gpt-5-nano",
    name: "GPT-5 Nano",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "openai-gpt-4.1",
    name: "GPT-4.1",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 1048576,
    maxTokens: 32768,
  },
  {
    id: "openai-gpt-4o",
    name: "GPT-4o",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 16384,
  },
  {
    id: "openai-gpt-4o-mini",
    name: "GPT-4o Mini",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 16384,
  },
  {
    id: "openai-o1",
    name: "OpenAI o1",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 100000,
  },
  {
    id: "openai-o3",
    name: "OpenAI o3",
    reasoning: true,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 100000,
  },
  {
    id: "openai-o3-mini",
    name: "OpenAI o3-mini",
    reasoning: true,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 100000,
  },
  {
    id: "openai-gpt-image-1",
    name: "GPT Image 1",
    reasoning: false,
    input: ["text", "image"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },

  // ============================================
  // Other models
  // ============================================
  {
    id: "alibaba-qwen3-32b",
    name: "Qwen3 32B",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: 40960,
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill Llama 70B",
    reasoning: true,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 32768,
  },
  {
    id: "llama3.3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 128000,
  },
  {
    id: "llama3-8b-instruct",
    name: "Llama 3.1 8B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 128000,
  },
  {
    id: "mistral-nemo-instruct-2407",
    name: "Mistral Nemo Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 128000,
  },
];

// OpenAI-compatible /v1/models response types
interface DigitalOceanModel {
  id: string;
  object?: string;
  created?: number;
  owned_by?: string;
}

interface DigitalOceanModelsResponse {
  data: DigitalOceanModel[];
}

/**
 * Discover models from DigitalOcean GenAI API with fallback to static catalog.
 * The /v1/models endpoint requires authentication (Bearer token).
 */
export async function discoverDigitalOceanModels(
  apiKey: string,
): Promise<ModelDefinitionConfig[]> {
  // Skip API discovery in test environments
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return DIGITALOCEAN_MODEL_CATALOG;
  }

  try {
    const response = await fetch(`${DIGITALOCEAN_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(
        `[digitalocean-models] Failed to discover models: HTTP ${response.status}, using static catalog`,
      );
      return DIGITALOCEAN_MODEL_CATALOG;
    }

    const data = (await response.json()) as DigitalOceanModelsResponse;
    if (!Array.isArray(data.data) || data.data.length === 0) {
      console.warn("[digitalocean-models] No models found from API, using static catalog");
      return DIGITALOCEAN_MODEL_CATALOG;
    }

    // Merge discovered models with catalog metadata
    const catalogById = new Map(DIGITALOCEAN_MODEL_CATALOG.map((m) => [m.id, m]));
    const models: ModelDefinitionConfig[] = [];

    for (const apiModel of data.data) {
      const catalogEntry = catalogById.get(apiModel.id);
      if (catalogEntry) {
        // Use catalog metadata for known models
        models.push(catalogEntry);
      } else {
        // Create definition for newly discovered models not in catalog.
        // Infer capabilities from model name since the API only returns id.
        const id = apiModel.id.toLowerCase();
        const isReasoning =
          id.includes("thinking") ||
          id.includes("reason") ||
          id.includes("-r1") ||
          id.includes("-o1") ||
          id.includes("-o3") ||
          id.includes("opus-4") ||
          id.includes("4.1-opus") ||
          id.includes("sonnet-4") ||
          id.includes("4.5-sonnet") ||
          id.includes("4.5-haiku") ||
          id.includes("3.7-sonnet") ||
          id.includes("codex") ||
          id.includes("5.2");

        const isVision =
          (id.includes("claude") ||
            id.includes("gpt-4o") ||
            id.includes("gpt-4.1") ||
            id.includes("gpt-5")) &&
          !id.includes("oss") &&
          !id.includes("codex");

        models.push({
          id: apiModel.id,
          name: apiModel.id,
          reasoning: isReasoning,
          input: isVision ? ["text", "image"] : ["text"],
          cost: DIGITALOCEAN_DEFAULT_COST,
          contextWindow: DIGITALOCEAN_DEFAULT_CONTEXT_WINDOW,
          maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
        });
      }
    }

    return models.length > 0 ? models : DIGITALOCEAN_MODEL_CATALOG;
  } catch (error) {
    console.warn(
      `[digitalocean-models] Discovery failed: ${String(error)}, using static catalog`,
    );
    return DIGITALOCEAN_MODEL_CATALOG;
  }
}
