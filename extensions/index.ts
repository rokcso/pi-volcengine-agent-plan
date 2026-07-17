import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Volcengine Ark — Agent Plan endpoint.
 *
 * Agent Plan (released 2026-05) is a superset of the older Coding Plan: the
 * same coding models plus drawing (Seedream), video (Seedance), web search,
 * and embedding tools. Its endpoint and resource pool are independent from
 * Coding Plan, so a Coding Plan API key receives HTTP 401 here and vice
 * versa. Use the endpoint below with an Agent Plan subscription key.
 */
const AGENT_PLAN_BASE_URL = "https://ark.cn-beijing.volces.com/api/plan/v3";

/**
 * Thinking configuration verified against the Agent Plan endpoint.
 *
 * pi's built-in "deepseek" thinkingFormat sends:
 *   thinking: { type: "enabled" }   when a thinking level is selected
 *   thinking: { type: "disabled" }  when thinking is off
 *   reasoning_effort: <level>       when supportsReasoningEffort is true
 *
 * Measured on doubao-seed-2.0-pro (reasoning_tokens by level, all HTTP 200):
 *   off=0  minimal=0  low=244  medium=302  high=358
 *
 * Volcengine reasoning_effort tops out at "high" (no "xhigh"), so xhigh is
 * downgraded to "high" via thinkingLevelMap.
 */
const THINKING_COMPAT = {
  thinkingFormat: "deepseek" as const,
  supportsReasoningEffort: true,
  supportsDeveloperRole: false,
  maxTokensField: "max_tokens" as const,
};

const THINKING_LEVEL_MAP = { xhigh: "high" as const };

/** Base compatibility for non-reasoning models. */
const BASE_COMPAT = {
  supportsDeveloperRole: false,
  maxTokensField: "max_tokens" as const,
};

interface ModelSpec {
  id: string;
  name: string;
  reasoning: boolean;
  contextWindow: number;
  maxTokens: number;
  /** Input modalities: "text" only or ["text", "image"] */
  vision: boolean;
}

/**
 * Model catalogue aligned with the official Agent Plan documentation.
 * Reasoning models carry thinking-depth support; standard/fast models do not.
 * Costs are zero because Agent Plan is a flat-rate subscription (billed via
 * AFP points, not per-token).
 *
 * Context window and max tokens are sourced from the official Agent Plan
 * model table: https://www.volcengine.com/docs/82379/2522860
 *
 * 2026-07 update: added doubao-seed-evolving and kimi-k3 from the new
 * Agent Plan model catalogue (doubao-seed-evolving is the "终身成长型" model
 * with 1024k context, kimi-k3 is a 2.8T-parameter model, Medium+ only).
 */
const MODELS: ModelSpec[] = [
  // 极速 — Fastest text generation (all support image input)
  { id: "doubao-seed-2.0-mini",   name: "Doubao Seed 2.0 Mini",   reasoning: false, vision: true,  contextWindow: 256000, maxTokens: 128000 },
  // 标准 — Standard
  { id: "doubao-seed-2.0-lite",   name: "Doubao Seed 2.0 Lite",   reasoning: false, vision: true,  contextWindow: 256000, maxTokens: 128000 },
  { id: "deepseek-v4-flash",      name: "DeepSeek V4 Flash",      reasoning: false, vision: false, contextWindow: 1024000, maxTokens: 384000 },
  // 进阶 — Advanced
  { id: "doubao-seed-2.0-code",   name: "Doubao Seed 2.0 Code",   reasoning: true,  vision: true,  contextWindow: 256000, maxTokens: 128000 },
  { id: "doubao-seed-2.0-pro",    name: "Doubao Seed 2.0 Pro",    reasoning: true,  vision: true,  contextWindow: 256000, maxTokens: 128000 },
  { id: "minimax-m2.7",           name: "MiniMax M2.7",           reasoning: false, vision: false, contextWindow: 200000, maxTokens: 128000 },
  { id: "minimax-m3",             name: "MiniMax M3",             reasoning: false, vision: true,  contextWindow: 512000, maxTokens: 128000 },
  { id: "glm-5.2",                name: "GLM 5.2 (glm-latest)",   reasoning: true,  vision: false, contextWindow: 1024000, maxTokens: 128000 },
  { id: "kimi-k2.6",              name: "Kimi K2.6",              reasoning: false, vision: true,  contextWindow: 256000, maxTokens: 32000 },
  { id: "kimi-k2.7-code",         name: "Kimi K2.7 Code",         reasoning: true,  vision: true,  contextWindow: 256000, maxTokens: 32000 },
  // New models as of 2026-07 Agent Plan refresh
  { id: "doubao-seed-evolving",   name: "Doubao Seed Evolving",    reasoning: true,  vision: true,  contextWindow: 1024000, maxTokens: 256000 },
  { id: "kimi-k3",                name: "Kimi K3",                 reasoning: true,  vision: true,  contextWindow: 1024000, maxTokens: 128000 },
  { id: "deepseek-v4-pro",        name: "DeepSeek V4 Pro",        reasoning: true,  vision: false, contextWindow: 1024000, maxTokens: 384000 },
];

export default function (pi: ExtensionAPI) {
  pi.registerProvider("volcengine-agent-plan", {
    baseUrl: AGENT_PLAN_BASE_URL,
    apiKey: "$ARK_API_KEY",
    api: "openai-completions",
    name: "Volcengine Ark (Agent Plan)",
    models: MODELS.map((m) => ({
      id: m.id,
      name: m.name,
      reasoning: m.reasoning,
      input: (m.vision ? ["text", "image"] : ["text"]) as ("text" | "image")[],
      contextWindow: m.contextWindow,
      maxTokens: m.maxTokens,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      compat: m.reasoning ? THINKING_COMPAT : BASE_COMPAT,
      ...(m.reasoning ? { thinkingLevelMap: THINKING_LEVEL_MAP } : {}),
    })),
  });
}
