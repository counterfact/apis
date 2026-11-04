import type { LLM } from "./LLM.js";
import type { BinaryScoring } from "./BinaryScoring.js";
import type { NumericUniformScoring } from "./NumericUniformScoring.js";
export type UserEvaluationAnalysisItem = {
  name: string;
  /**
   * @default "user"
   */
  source?: "user";
  /**
   * LLM to use for this item. If unset, the attaching agent's analysis_llm default is used.
   */
  llm?: LLM | null;
  /**
   * @default "evaluation"
   */
  kind?: "evaluation";
  /**
   * The prompt used to evaluate the conversation.
   */
  conversation_goal_prompt: string;
  /**
   * Whether the attaching agent's knowledge base is used when evaluating this criterion.
   * @default false
   */
  use_knowledge_base?: boolean;
  /**
   * How this criterion is scored (binary or numeric_uniform).
   */
  scoring?:
    | (BinaryScoring & { mode: "binary" })
    | (NumericUniformScoring & { mode: "numeric_uniform" });
};
