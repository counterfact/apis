import type { SafetyRule } from "./SafetyRule.js";
/**
 * Safety evaluation of the agent. Prompt and first message is taken into account.
 * The unsafe reason is provided from the evaluation
 */
export type SafetyEvaluation = {
  /**
   * @default false
   */
  is_unsafe?: boolean;
  /**
   * @default ""
   */
  llm_reason?: string;
  /**
   * @default 0
   */
  safety_prompt_version?: number;
  matched_rule_id?: Array<SafetyRule>;
};
