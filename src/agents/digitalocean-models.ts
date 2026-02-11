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
  {
    id: "llama3.3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },
  {
    id: "llama3.1-70b-instruct",
    name: "Llama 3.1 70B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },
  {
    id: "llama3.1-8b-instruct",
    name: "Llama 3.1 8B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },
  {
    id: "mistral-nemo-instruct-2407",
    name: "Mistral Nemo Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },
  {
    id: "qwen2.5-72b-instruct",
    name: "Qwen 2.5 72B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },
  {
    id: "qwen2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder 32B Instruct",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
  },
  {
    id: "openai-gpt-oss-120b",
    name: "OpenAI GPT OSS 120B",
    reasoning: false,
    input: ["text"],
    cost: DIGITALOCEAN_DEFAULT_COST,
    contextWindow: 131072,
    maxTokens: DIGITALOCEAN_DEFAULT_MAX_TOKENS,
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
        // Create definition for newly discovered models not in catalog
        const isReasoning =
          apiModel.id.toLowerCase().includes("thinking") ||
          apiModel.id.toLowerCase().includes("reason") ||
          apiModel.id.toLowerCase().includes("r1");

        models.push({
          id: apiModel.id,
          name: apiModel.id,
          reasoning: isReasoning,
          input: ["text"],
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
