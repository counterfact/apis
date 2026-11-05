import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
import type { CriteriaScoringMode } from "./CriteriaScoringMode.js";
export type ConversationHistoryEvaluationCriteriaResultCommonModel = {
  criteria_id: string;
  result: EvaluationSuccessResult;
  rationale: string;
  scoring_mode?: CriteriaScoringMode | null;
  score?: number | null;
  max_score?: number | null;
};
