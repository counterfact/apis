import type { LLMServiceTier } from "./LLMServiceTier.js";
export type LLMUsageCalculatorPublicRequestModel = {
  /**
   * Length of the prompt in characters.
   */
  prompt_length: number;
  /**
   * Pages of content in PDF documents or URLs in the agent's knowledge base.
   */
  number_of_pages: number;
  /**
   * Whether RAG is enabled.
   */
  rag_enabled: boolean;
  /**
   * Service tier to price against. Only affects models that offer the tier; others fall back to their standard price.
   */
  service_tier?: LLMServiceTier | null;
};
