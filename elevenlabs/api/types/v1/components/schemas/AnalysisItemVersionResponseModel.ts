import type { UserEvaluationAnalysisItem } from "./UserEvaluationAnalysisItem.js";
import type { UserDataCollectionAnalysisItem_Output } from "./UserDataCollectionAnalysisItem-Output.js";
export type AnalysisItemVersionResponseModel = {
  id: string;
  version_number: number;
  created_at_unix_secs: number;
  definition:
    | (UserEvaluationAnalysisItem & { kind: "evaluation" })
    | (UserDataCollectionAnalysisItem_Output & { kind: "data_collection" });
};
