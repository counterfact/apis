import type { WorkflowToolEdgeStepModel } from "./WorkflowToolEdgeStepModel.js";
import type { WorkflowToolNestedToolsStepModel_Input } from "./WorkflowToolNestedToolsStepModel-Input.js";
import type { WorkflowToolMaxIterationsExceededStepModel } from "./WorkflowToolMaxIterationsExceededStepModel.js";
/**
 * A common model for workflow tool responses.
 */
export type WorkflowToolResponseModel_Input = {
  steps?: Array<
    | (WorkflowToolEdgeStepModel & { type: "edge" })
    | (WorkflowToolNestedToolsStepModel_Input & { type: "nested_tools" })
    | (WorkflowToolMaxIterationsExceededStepModel & {
        type: "max_iterations_exceeded";
      })
  >;
};
