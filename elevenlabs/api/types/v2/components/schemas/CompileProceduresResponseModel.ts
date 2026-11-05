import type { AgentWorkflowResponseModel } from "./AgentWorkflowResponseModel.js";
/**
 * @example {"workflow":{"edges":[],"nodes":[]}}
 */
export type CompileProceduresResponseModel = {
  /**
   * Generated workflow from compilation
   */
  workflow: AgentWorkflowResponseModel;
};
