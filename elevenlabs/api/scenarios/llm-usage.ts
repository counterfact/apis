import type { Scenario } from "../types/index.js";

export const emptyLlmUsage: Scenario = ($) => {
  const c = $.loadContext("/convai/llm-usage");
  c.rates = new Map();
  c.assumptions = {
    charactersPerToken: 4,
    tokensPerPage: 1000,
    ragPages: 2,
    outputTokens: 128,
    messagesPerMinute: 3,
  };
  c.agents = () => $.loadContext("/convai/agents");
  c.catalog = () => $.loadContext("/convai/llm");
  c.pages = (id) =>
    $.loadContext("/convai/agent").agentKnowledgeSize(id).number_of_pages;
  $.loadContext("/convai/agent").usage = () =>
    $.loadContext("/convai/llm-usage");
};

export const resetLlmUsage: Scenario = ($) => {
  emptyLlmUsage($);
  $.loadContext("/convai/llm-usage").rates = new Map([
    [
      "gemini-3.5-flash",
      { inputPerMillion: 1, outputPerMillion: 2, fastMultiplier: 1 },
    ],
    [
      "gemini-2.5-flash",
      { inputPerMillion: 2, outputPerMillion: 4, fastMultiplier: 1 },
    ],
    ["gpt-4o", { inputPerMillion: 3, outputPerMillion: 6, fastMultiplier: 2 }],
    [
      "gpt-4o-mini",
      { inputPerMillion: 4, outputPerMillion: 8, fastMultiplier: 1 },
    ],
  ]);
};

export const llmUsageFastTier: Scenario = ($) => {
  const model = $.loadContext("/convai/llm").models.get("gpt-4o");
  if (!model) throw new Error("Run reset before llmUsageFastTier");
  model.available_service_tiers = ["standard", "fast"];
  const prompt =
    $.loadContext("/convai/agents").agents.get("sim-agent")?.configuration
      .conversation_config.agent?.prompt;
  if (!prompt) throw new Error("Run reset before llmUsageFastTier");
  prompt.service_tier = "fast";
  prompt.rag = { enabled: true };
};
