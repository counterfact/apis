import type { UnitTestToolCallParameter } from "./UnitTestToolCallParameter.js";
import type { ReferencedToolCommonModel } from "./ReferencedToolCommonModel.js";
import type { UnitTestWorkflowNodeTransitionEvaluationNodeId } from "./UnitTestWorkflowNodeTransitionEvaluationNodeId.js";
import type { UnitTestGuardrailTriggerEvaluationModel } from "./UnitTestGuardrailTriggerEvaluationModel.js";
export type UnitTestToolCallEvaluationModel_Input = {
  /**
   * Parameters to evaluate for the agent's tool call. If empty, the tool call parameters are not evaluated.
   */
  parameters?: Array<UnitTestToolCallParameter>;
  /**
   * The tool to evaluate a call against.
   */
  referenced_tool?: ReferencedToolCommonModel | null;
  /**
   * Whether to verify that the tool was NOT called.
   * @default false
   */
  verify_absence?: boolean;
  /**
   * Configuration for testing workflow node transitions. When set, the test will verify the agent transitions to the specified workflow node.
   */
  workflow_node_transition?: UnitTestWorkflowNodeTransitionEvaluationNodeId | null;
  /**
   * Evaluate guardrails triggered by the generated agent turn.
   */
  guardrail_trigger?: UnitTestGuardrailTriggerEvaluationModel | null;
};
