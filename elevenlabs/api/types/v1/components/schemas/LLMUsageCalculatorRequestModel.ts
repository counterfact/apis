import type { LLMServiceTier } from "./LLMServiceTier.js";
export type LLMUsageCalculatorRequestModel = {
  /**
   * Length of the prompt in characters.
   */
  prompt_length?: number | null;
  /**
   * Pages of content in pdf documents OR urls in agent's Knowledge Base.
   */
  number_of_pages?: number | null;
  /**
   * Whether RAG is enabled.
   */
  rag_enabled?: boolean | null;
  /**
   * Service tier to price against. Only affects models that offer the tier; others fall back to their standard price.
   */
  service_tier?: LLMServiceTier | null;
};
