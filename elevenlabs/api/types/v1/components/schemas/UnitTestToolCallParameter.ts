import type { LLMParameterEvaluationStrategy } from "./LLMParameterEvaluationStrategy.js";
import type { RegexParameterEvaluationStrategy } from "./RegexParameterEvaluationStrategy.js";
import type { ExactParameterEvaluationStrategy } from "./ExactParameterEvaluationStrategy.js";
import type { MatchAnythingParameterEvaluationStrategy } from "./MatchAnythingParameterEvaluationStrategy.js";
export type UnitTestToolCallParameter = {
  eval:
    | (LLMParameterEvaluationStrategy & { type: "llm" })
    | (RegexParameterEvaluationStrategy & { type: "regex" })
    | (ExactParameterEvaluationStrategy & { type: "exact" })
    | (MatchAnythingParameterEvaluationStrategy & { type: "anything" });
  path: string;
};
