import type { UserEvaluationAnalysisItem } from "./UserEvaluationAnalysisItem.js";
import type { UserDataCollectionAnalysisItem_Output } from "./UserDataCollectionAnalysisItem-Output.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
export type AnalysisItemResponseModel = {
  id: string;
  definition:
    | (UserEvaluationAnalysisItem & { kind: "evaluation" })
    | (UserDataCollectionAnalysisItem_Output & { kind: "data_collection" });
  access_info: ResourceAccessInfo;
  created_at_unix_secs: number;
  updated_at_unix_secs: number;
  current_version_id: string;
  legacy_source_id?: string | null;
};
