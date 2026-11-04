import type { WorkflowEdgeModel_Output } from "./WorkflowEdgeModel-Output.js";
import type { WorkflowStartNodeModel_Output } from "./WorkflowStartNodeModel-Output.js";
import type { WorkflowEndNodeModel_Output } from "./WorkflowEndNodeModel-Output.js";
import type { WorkflowPhoneNumberNodeModel_Output } from "./WorkflowPhoneNumberNodeModel-Output.js";
import type { WorkflowOverrideAgentNodeModel_Output } from "./WorkflowOverrideAgentNodeModel-Output.js";
import type { WorkflowStandaloneAgentNodeModel_Output } from "./WorkflowStandaloneAgentNodeModel-Output.js";
import type { WorkflowToolNodeModel_Output } from "./WorkflowToolNodeModel-Output.js";
/**
 * @example {"edges":{"entry_to_tool_a":{"forward_condition":{"condition":"Tool A condition","type":"llm"},"reroutes":[],"source":"entry_node","target":"tool_node_a"},"start_to_entry":{"forward_condition":{"type":"unconditional"},"reroutes":[],"source":"start_node","target":"entry_node"},"tool_a_to_failure":{"forward_condition":{"successful":false,"type":"result"},"reroutes":[],"source":"tool_node_a","target":"failure_node"},"tool_a_to_tool_b":{"forward_condition":{"successful":true,"type":"result"},"reroutes":[],"source":"tool_node_a","target":"tool_node_b"},"tool_b_to_agent_transfer":{"forward_condition":{"type":"unconditional"},"reroutes":[],"source":"tool_node_b","target":"success_transfer"},"tool_b_to_conversation":{"forward_condition":{"condition":"Conversation condition","type":"llm"},"reroutes":[],"source":"tool_node_b","target":"success_conversation"},"tool_b_to_end":{"forward_condition":{"condition":"End condition","type":"llm"},"reroutes":[],"source":"tool_node_b","target":"success_end"},"tool_b_to_phone":{"forward_condition":{"expression":{"children":[{"name":"force_phone_transfer","type":"dynamic_variable"},{"prompt":"Phone condition","type":"llm","value_schema":{"description":"Phone condition","type":"boolean"}},{"left":{"name":"mode","type":"dynamic_variable"},"right":{"type":"string_literal","value":"dev"},"type":"eq_operator"}],"type":"or_operator"},"type":"expression"},"reroutes":[],"source":"tool_node_b","target":"success_phone"}},"nodes":{"entry_node":{"additional_knowledge_base":[],"additional_prompt":"","additional_tool_ids":[],"conversation_config":{},"edge_order":["entry_to_tool_a"],"entry_behavior":"auto","label":"Entry","position":{"x":0,"y":0},"type":"override_agent"},"failure_node":{"additional_knowledge_base":[],"additional_prompt":"","additional_tool_ids":[],"conversation_config":{},"edge_order":[],"entry_behavior":"auto","label":"Failure","position":{"x":0,"y":0},"type":"override_agent"},"start_node":{"edge_order":["start_to_entry"],"position":{"x":0,"y":0},"type":"start"},"success_conversation":{"additional_knowledge_base":[],"additional_prompt":"","additional_tool_ids":[],"conversation_config":{},"edge_order":[],"entry_behavior":"auto","label":"Success A","position":{"x":0,"y":0},"type":"override_agent"},"success_end":{"edge_order":[],"outcome":"success","position":{"x":0,"y":0},"type":"end"},"success_phone":{"custom_sip_headers":[],"edge_order":[],"position":{"x":0,"y":0},"require_acceptance":false,"sip_refer_play_dialtone":true,"transfer_destination":{"phone_number":"+1234567890","type":"phone"},"transfer_type":"conference","type":"phone_number"},"success_transfer":{"agent_id":"success_transfer_agent","delay_ms":0,"drop_history":false,"edge_order":[],"enable_transferred_agent_first_message":false,"isolate_history":false,"position":{"x":0,"y":0},"preserve_client_tts_overrides":false,"preserve_voice_settings":false,"type":"standalone_agent"},"tool_node_a":{"edge_order":["tool_a_to_failure","tool_a_to_tool_b"],"position":{"x":0,"y":0},"tools":[{"tool_id":"tool_a"},{"tool_id":"tool_b"}],"type":"tool"},"tool_node_b":{"edge_order":["tool_b_to_conversation","tool_b_to_end","tool_b_to_phone","tool_b_to_agent_transfer"],"position":{"x":0,"y":0},"tools":[{"tool_id":"tool_a"}],"type":"tool"}},"prevent_subagent_loops":false,"subgraphs":{}}
 */
export type AgentWorkflowResponseModel = {
  edges: { [key: string]: WorkflowEdgeModel_Output };
  nodes: {
    [key: string]:
      | (WorkflowStartNodeModel_Output & { type: "start" })
      | (WorkflowEndNodeModel_Output & { type: "end" })
      | (WorkflowPhoneNumberNodeModel_Output & { type: "phone_number" })
      | (WorkflowOverrideAgentNodeModel_Output & { type: "override_agent" })
      | (WorkflowStandaloneAgentNodeModel_Output & { type: "standalone_agent" })
      | (WorkflowToolNodeModel_Output & { type: "tool" });
  };
  /**
   * Whether to prevent loops in the workflow execution.
   * @default false
   */
  prevent_subagent_loops: boolean;
};
