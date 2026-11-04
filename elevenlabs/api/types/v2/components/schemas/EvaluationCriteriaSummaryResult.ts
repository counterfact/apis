import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
export type EvaluationCriteriaSummaryResult = {
  result: EvaluationSuccessResult;
  score?: number | null;
  max_score?: number | null;
};
