import type { LLM } from "./LLM.js";
export type BackupLLMOverride = {
  /**
   * @default "override"
   */
  preference?: "override";
  order: Array<LLM>;
};
