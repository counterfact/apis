import type { LLM } from "./LLM.js";
export type LLMUsageCalculatorLLMResponseModel = {
  llm: LLM;
  price_per_minute: number;
  price_per_message: number;
};
