import type { LLM } from "./LLM.js";
export type OpenerConfig = {
  /**
   * Model used to speak a fast opener while the main model generates its full reply. Must be a hosted model (not a bring-your-own LLM type).
   */
  llm: LLM;
};
