import type { LLMInputOutputTokensUsage } from "./LLMInputOutputTokensUsage.js";
export type LLMUsage_Output = {
  model_usage?: { [key: string]: LLMInputOutputTokensUsage };
};
