import type { VariationEvalSummary } from "./VariationEvalSummary.js";

export type EvaluationsSummary = {
  /**
   * A list of variation evaluations
   */
  variations?: Array<VariationEvalSummary>;
};
