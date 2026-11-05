import type { WorkflowToolEdgeStepModel } from "./WorkflowToolEdgeStepModel.js";
import type { WorkflowToolNestedToolsStepModel_Output } from "./WorkflowToolNestedToolsStepModel-Output.js";
import type { WorkflowToolMaxIterationsExceededStepModel } from "./WorkflowToolMaxIterationsExceededStepModel.js";
/**
 * A common model for workflow tool responses.
 */
export type WorkflowToolResponseModel_Output = {
  steps?: Array<
    | (WorkflowToolEdgeStepModel & { type: "edge" })
    | (WorkflowToolNestedToolsStepModel_Output & { type: "nested_tools" })
    | (WorkflowToolMaxIterationsExceededStepModel & {
        type: "max_iterations_exceeded";
      })
  >;
};
