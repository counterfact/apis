import type { WorkflowUnconditionalModel_Output } from "./WorkflowUnconditionalModel-Output.js";
import type { WorkflowLLMConditionModel_Output } from "./WorkflowLLMConditionModel-Output.js";
import type { WorkflowResultConditionModel_Output } from "./WorkflowResultConditionModel-Output.js";
import type { WorkflowExpressionConditionModel_Output } from "./WorkflowExpressionConditionModel-Output.js";
import type { Position_Output } from "./Position-Output.js";
export type WorkflowEdgeModel_Output = {
  /**
   * ID of the source node.
   */
  source: string;
  /**
   * ID of the target node.
   */
  target: string;
  /**
   * Condition that must be met for the edge to be traversed in the forward direction (source to target).
   */
  forward_condition:
    | (
        | (WorkflowUnconditionalModel_Output & { type: "unconditional" })
        | (WorkflowLLMConditionModel_Output & { type: "llm" })
        | (WorkflowResultConditionModel_Output & { type: "result" })
        | (WorkflowExpressionConditionModel_Output & { type: "expression" })
      )
    | null;
  /**
   * Condition that must be met for the edge to be traversed in the backward direction (target to source).
   */
  backward_condition:
    | (
        | (WorkflowUnconditionalModel_Output & { type: "unconditional" })
        | (WorkflowLLMConditionModel_Output & { type: "llm" })
        | (WorkflowResultConditionModel_Output & { type: "result" })
        | (WorkflowExpressionConditionModel_Output & { type: "expression" })
      )
    | null;
  /**
   * Points the edge is routed through between its source and target, in order. Layout only, no effect on execution.
   */
  reroutes: Array<Position_Output>;
};
