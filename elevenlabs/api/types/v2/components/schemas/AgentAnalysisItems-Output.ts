import type { AttachedUserEvaluationRef } from "./AttachedUserEvaluationRef.js";
import type { AttachedSystemEvaluationRef } from "./AttachedSystemEvaluationRef.js";
import type { AttachedUserDataCollectionRef } from "./AttachedUserDataCollectionRef.js";
import type { AttachedSystemDataCollectionRef } from "./AttachedSystemDataCollectionRef.js";
export type AgentAnalysisItems_Output = {
  evaluation_criteria?: Array<
    | (AttachedUserEvaluationRef & { source: "user" })
    | (AttachedSystemEvaluationRef & { source: "system" })
  >;
  data_collection?: Array<
    | (AttachedUserDataCollectionRef & { source: "user" })
    | (AttachedSystemDataCollectionRef & { source: "system" })
  >;
};
