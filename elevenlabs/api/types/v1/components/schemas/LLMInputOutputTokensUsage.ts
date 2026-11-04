import type { LLMTokensCategoryUsage } from "./LLMTokensCategoryUsage.js";
export type LLMInputOutputTokensUsage = {
  input?: LLMTokensCategoryUsage;
  input_cache_read?: LLMTokensCategoryUsage;
  input_cache_write?: LLMTokensCategoryUsage;
  output_total?: LLMTokensCategoryUsage;
};
