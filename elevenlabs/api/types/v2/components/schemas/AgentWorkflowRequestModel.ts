import type { WorkflowEdgeModel_Input } from "./WorkflowEdgeModel-Input.js";
import type { WorkflowStartNodeModel_Input } from "./WorkflowStartNodeModel-Input.js";
import type { WorkflowEndNodeModel_Input } from "./WorkflowEndNodeModel-Input.js";
import type { WorkflowPhoneNumberNodeModel_Input } from "./WorkflowPhoneNumberNodeModel-Input.js";
import type { WorkflowOverrideAgentNodeModel_Input } from "./WorkflowOverrideAgentNodeModel-Input.js";
import type { WorkflowStandaloneAgentNodeModel_Input } from "./WorkflowStandaloneAgentNodeModel-Input.js";
import type { WorkflowToolNodeModel_Input } from "./WorkflowToolNodeModel-Input.js";
/**
 * @example {"edges":{"entry_to_tool_a":{"forward_condition":{"condition":"Tool A condition"},"source":"entry_node","target":"tool_node_a"},"start_to_entry":{"forward_condition":{},"source":"start_node","target":"entry_node"},"tool_a_to_failure":{"forward_condition":{"successful":false},"source":"tool_node_a","target":"failure_node"},"tool_a_to_tool_b":{"forward_condition":{"successful":true},"source":"tool_node_a","target":"tool_node_b"},"tool_b_to_agent_transfer":{"forward_condition":{},"source":"tool_node_b","target":"success_transfer"},"tool_b_to_conversation":{"forward_condition":{"condition":"Conversation condition"},"source":"tool_node_b","target":"success_conversation"},"tool_b_to_end":{"forward_condition":{"condition":"End condition"},"source":"tool_node_b","target":"success_end"},"tool_b_to_phone":{"forward_condition":{"expression":{"children":[{"name":"force_phone_transfer"},{"prompt":"Phone condition","value_schema":{"description":"Phone condition","type":"boolean"}},{"left":{"name":"mode"},"right":{"value":"dev"}}]}},"source":"tool_node_b","target":"success_phone"}},"nodes":{"entry_node":{"conversation_config":{},"edge_order":["entry_to_tool_a"],"label":"Entry"},"failure_node":{"conversation_config":{},"label":"Failure"},"start_node":{"edge_order":["start_to_entry"]},"success_conversation":{"conversation_config":{},"label":"Success A"},"success_end":{},"success_phone":{"transfer_destination":{"phone_number":"+1234567890"}},"success_transfer":{"agent_id":"success_transfer_agent"},"tool_node_a":{"edge_order":["tool_a_to_failure","tool_a_to_tool_b"],"tools":[{"tool_id":"tool_a"},{"tool_id":"tool_b"}]},"tool_node_b":{"edge_order":["tool_b_to_conversation","tool_b_to_end","tool_b_to_phone","tool_b_to_agent_transfer"],"tools":[{"tool_id":"tool_a"}]}}}
 */
export type AgentWorkflowRequestModel = {
  edges?: { [key: string]: WorkflowEdgeModel_Input };
  nodes?: {
    [key: string]:
      | (WorkflowStartNodeModel_Input & { type: "start" })
      | (WorkflowEndNodeModel_Input & { type: "end" })
      | (WorkflowPhoneNumberNodeModel_Input & { type: "phone_number" })
      | (WorkflowOverrideAgentNodeModel_Input & { type: "override_agent" })
      | (WorkflowStandaloneAgentNodeModel_Input & { type: "standalone_agent" })
      | (WorkflowToolNodeModel_Input & { type: "tool" });
  };
  /**
   * Whether to prevent loops in the workflow execution.
   * @default false
   */
  prevent_subagent_loops?: boolean;
};
