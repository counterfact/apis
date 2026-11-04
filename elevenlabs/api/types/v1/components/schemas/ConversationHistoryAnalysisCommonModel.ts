import type { ConversationHistoryEvaluationCriteriaResultCommonModel } from "./ConversationHistoryEvaluationCriteriaResultCommonModel.js";
import type { DataCollectionResultCommonModel } from "./DataCollectionResultCommonModel.js";
import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
import type { ScopedAnalysisResult } from "./ScopedAnalysisResult.js";
export type ConversationHistoryAnalysisCommonModel = {
  evaluation_criteria_results?: {
    [key: string]: ConversationHistoryEvaluationCriteriaResultCommonModel;
  };
  data_collection_results?: { [key: string]: DataCollectionResultCommonModel };
  evaluation_criteria_results_list?: Array<ConversationHistoryEvaluationCriteriaResultCommonModel>;
  data_collection_results_list?: Array<DataCollectionResultCommonModel>;
  call_successful: EvaluationSuccessResult;
  call_success_score?: number | null;
  transcript_summary: string;
  call_summary_title?: string | null;
  scoped?: Array<ScopedAnalysisResult>;
};
