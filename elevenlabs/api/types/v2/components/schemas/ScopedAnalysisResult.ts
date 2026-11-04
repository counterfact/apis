import type { AnalysisScope } from "./AnalysisScope.js";
import type { ConversationHistoryEvaluationCriteriaResultCommonModel } from "./ConversationHistoryEvaluationCriteriaResultCommonModel.js";
import type { DataCollectionResultCommonModel } from "./DataCollectionResultCommonModel.js";
import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
export type ScopedAnalysisResult = {
  /**
   * The scope of the analysis. 'conversation' uses the full transcript; 'agent' uses only the portion where the defining agent was active.
   */
  scope: AnalysisScope;
  source_agent_id: string;
  /**
   * Branch of the agent for this scoped block; disambiguates repeated agent_id.
   */
  source_branch_id?: string | null;
  evaluation_criteria_results?: {
    [key: string]: ConversationHistoryEvaluationCriteriaResultCommonModel;
  };
  data_collection_results?: { [key: string]: DataCollectionResultCommonModel };
  successful: EvaluationSuccessResult;
  success_score?: number | null;
};
