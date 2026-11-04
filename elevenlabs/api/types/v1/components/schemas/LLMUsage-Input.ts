import type { LLMInputOutputTokensUsage } from "./LLMInputOutputTokensUsage.js";
export type LLMUsage_Input = {
  model_usage?: { [key: string]: LLMInputOutputTokensUsage };
};
