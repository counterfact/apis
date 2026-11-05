import type { LLMUsage_Output } from "./LLMUsage-Output.js";
export type LLMCategoryUsage = {
  irreversible_generation?: LLMUsage_Output;
  initiated_generation?: LLMUsage_Output;
};
