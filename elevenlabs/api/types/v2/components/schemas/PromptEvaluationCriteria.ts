import type { AnalysisScope } from "./AnalysisScope.js";
import type { LLM } from "./LLM.js";
import type { CriteriaScoringMode } from "./CriteriaScoringMode.js";
/**
 * An evaluation using the transcript and a prompt for a yes/no achieved answer
 */
export type PromptEvaluationCriteria = {
  /**
   * The unique identifier for the evaluation criteria
   */
  id: string;
  name: string;
  /**
   * The type of evaluation criteria
   * @default "prompt"
   */
  type?: "prompt";
  /**
   * The prompt that the agent should use to evaluate the conversation
   */
  conversation_goal_prompt: string;
  /**
   * When evaluating the prompt, should the agent's knowledge base be used.
   * @default false
   */
  use_knowledge_base?: boolean;
  /**
   * The scope of transcript context used when evaluating this criterion. 'conversation' uses the full transcript; 'agent' uses only the portion where the defining agent was active.
   * @default "conversation"
   */
  scope?: AnalysisScope;
  /**
   * LLM model to use for this evaluation criteria. If not set, uses agent's analysis_llm default.
   */
  llm?: LLM | null;
  /**
   * How this criterion is scored. 'binary' resolves to success/failure/unknown. 'numeric_uniform' returns a number on the [0, max_score] scale which is normalized into the aggregate conversation success percentage.
   * @default "binary"
   */
  scoring_mode?: CriteriaScoringMode;
  /**
   * Maximum value of the numeric score scale (minimum is always 0). Only used when scoring_mode is 'numeric_uniform'.
   * @default 100
   */
  max_score?: number;
  /**
   * Optional free-text instructions describing how to assign values on the numeric scale. Only used when scoring_mode is 'numeric_uniform'.
   */
  score_instructions?: string | null;
};
