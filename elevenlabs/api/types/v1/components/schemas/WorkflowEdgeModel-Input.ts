import type { WorkflowUnconditionalModel_Input } from "./WorkflowUnconditionalModel-Input.js";
import type { WorkflowLLMConditionModel_Input } from "./WorkflowLLMConditionModel-Input.js";
import type { WorkflowResultConditionModel_Input } from "./WorkflowResultConditionModel-Input.js";
import type { WorkflowExpressionConditionModel_Input } from "./WorkflowExpressionConditionModel-Input.js";
import type { Position_Input } from "./Position-Input.js";
export type WorkflowEdgeModel_Input = {
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
  forward_condition?:
    | (
        | (WorkflowUnconditionalModel_Input & { type: "unconditional" })
        | (WorkflowLLMConditionModel_Input & { type: "llm" })
        | (WorkflowResultConditionModel_Input & { type: "result" })
        | (WorkflowExpressionConditionModel_Input & { type: "expression" })
      )
    | null;
  /**
   * Condition that must be met for the edge to be traversed in the backward direction (target to source).
   */
  backward_condition?:
    | (
        | (WorkflowUnconditionalModel_Input & { type: "unconditional" })
        | (WorkflowLLMConditionModel_Input & { type: "llm" })
        | (WorkflowResultConditionModel_Input & { type: "result" })
        | (WorkflowExpressionConditionModel_Input & { type: "expression" })
      )
    | null;
  /**
   * Points the edge is routed through between its source and target, in order. Layout only, no effect on execution.
   */
  reroutes?: Array<Position_Input>;
};
