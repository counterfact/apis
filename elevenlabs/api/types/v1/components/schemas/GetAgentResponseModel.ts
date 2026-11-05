import type { ConversationalConfigAPIModel_Output } from "./ConversationalConfigAPIModel-Output.js";
import type { AgentMetadataResponseModel } from "./AgentMetadataResponseModel.js";
import type { AgentPlatformSettingsResponseModel } from "./AgentPlatformSettingsResponseModel.js";
import type { GetPhoneNumberTwilioResponseModel } from "./GetPhoneNumberTwilioResponseModel.js";
import type { GetPhoneNumberExotelResponseModel } from "./GetPhoneNumberExotelResponseModel.js";
import type { GetPhoneNumberSIPTrunkResponseModel } from "./GetPhoneNumberSIPTrunkResponseModel.js";
import type { GetWhatsAppAccountResponse } from "./GetWhatsAppAccountResponse.js";
import type { AgentWorkflowResponseModel } from "./AgentWorkflowResponseModel.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { ProcedureRefResponseModel } from "./ProcedureRefResponseModel.js";
/**
 * @example {"agent_id":"agent_7101k5zvyjhmfg983brhmhkd98n6","name":"My Agent","workflow":{"edges":{"entry_to_tool_a":{"forward_condition":{"condition":"Tool A condition","type":"llm"},"reroutes":[],"source":"entry_node","target":"tool_node_a"},"start_to_entry":{"forward_condition":{"type":"unconditional"},"reroutes":[],"source":"start_node","target":"entry_node"},"tool_a_to_failure":{"forward_condition":{"successful":false,"type":"result"},"reroutes":[],"source":"tool_node_a","target":"failure_node"},"tool_a_to_tool_b":{"forward_condition":{"successful":true,"type":"result"},"reroutes":[],"source":"tool_node_a","target":"tool_node_b"},"tool_b_to_agent_transfer":{"forward_condition":{"type":"unconditional"},"reroutes":[],"source":"tool_node_b","target":"success_transfer"},"tool_b_to_conversation":{"forward_condition":{"condition":"Conversation condition","type":"llm"},"reroutes":[],"source":"tool_node_b","target":"success_conversation"},"tool_b_to_end":{"forward_condition":{"condition":"End condition","type":"llm"},"reroutes":[],"source":"tool_node_b","target":"success_end"},"tool_b_to_phone":{"forward_condition":{"expression":{"children":[{"name":"force_phone_transfer","type":"dynamic_variable"},{"prompt":"Phone condition","type":"llm","value_schema":{"description":"Phone condition","type":"boolean"}},{"left":{"name":"mode","type":"dynamic_variable"},"right":{"type":"string_literal","value":"dev"},"type":"eq_operator"}],"type":"or_operator"},"type":"expression"},"reroutes":[],"source":"tool_node_b","target":"success_phone"}},"nodes":{"entry_node":{"additional_knowledge_base":[],"additional_prompt":"","additional_tool_ids":[],"conversation_config":{},"edge_order":["entry_to_tool_a"],"entry_behavior":"auto","label":"Entry","position":{"x":0,"y":0},"type":"override_agent"},"failure_node":{"additional_knowledge_base":[],"additional_prompt":"","additional_tool_ids":[],"conversation_config":{},"edge_order":[],"entry_behavior":"auto","label":"Failure","position":{"x":0,"y":0},"type":"override_agent"},"start_node":{"edge_order":["start_to_entry"],"position":{"x":0,"y":0},"type":"start"},"success_conversation":{"additional_knowledge_base":[],"additional_prompt":"","additional_tool_ids":[],"conversation_config":{},"edge_order":[],"entry_behavior":"auto","label":"Success A","position":{"x":0,"y":0},"type":"override_agent"},"success_end":{"edge_order":[],"outcome":"success","position":{"x":0,"y":0},"type":"end"},"success_phone":{"custom_sip_headers":[],"edge_order":[],"position":{"x":0,"y":0},"require_acceptance":false,"sip_refer_play_dialtone":true,"transfer_destination":{"phone_number":"+1234567890","type":"phone"},"transfer_type":"conference","type":"phone_number"},"success_transfer":{"agent_id":"success_transfer_agent","delay_ms":0,"drop_history":false,"edge_order":[],"enable_transferred_agent_first_message":false,"isolate_history":false,"position":{"x":0,"y":0},"preserve_client_tts_overrides":false,"preserve_voice_settings":false,"type":"standalone_agent"},"tool_node_a":{"edge_order":["tool_a_to_failure","tool_a_to_tool_b"],"position":{"x":0,"y":0},"tools":[{"tool_id":"tool_a"},{"tool_id":"tool_b"}],"type":"tool"},"tool_node_b":{"edge_order":["tool_b_to_conversation","tool_b_to_end","tool_b_to_phone","tool_b_to_agent_transfer"],"position":{"x":0,"y":0},"tools":[{"tool_id":"tool_a"}],"type":"tool"}},"prevent_subagent_loops":false,"subgraphs":{}}}
 */
export type GetAgentResponseModel = {
  /**
   * The ID of the agent
   */
  agent_id: string;
  /**
   * The name of the agent
   */
  name: string;
  /**
   * The conversation configuration of the agent
   */
  conversation_config: ConversationalConfigAPIModel_Output;
  /**
   * The metadata of the agent
   */
  metadata: AgentMetadataResponseModel;
  /**
   * The platform settings of the agent
   */
  platform_settings?: AgentPlatformSettingsResponseModel;
  /**
   * The phone numbers of the agent
   */
  phone_numbers?: Array<
    | (GetPhoneNumberTwilioResponseModel & { provider: "twilio" })
    | (GetPhoneNumberExotelResponseModel & { provider: "exotel" })
    | (GetPhoneNumberSIPTrunkResponseModel & { provider: "sip_trunk" })
  >;
  /**
   * WhatsApp accounts assigned to the agent
   */
  whatsapp_accounts?: Array<GetWhatsAppAccountResponse>;
  /**
   * The workflow of the agent
   */
  workflow?: AgentWorkflowResponseModel;
  /**
   * The access information of the agent for the user
   */
  access_info?: ResourceAccessInfo | null;
  /**
   * Agent tags used to categorize the agent
   */
  tags?: Array<string>;
  /**
   * The ID of the version the agent is on
   */
  version_id?: string | null;
  /**
   * The ID of the branch the agent is on
   */
  branch_id?: string | null;
  /**
   * The ID of the main branch for this agent
   */
  main_branch_id?: string | null;
  /**
   * Procedures keyed by procedure_id.
   */
  procedures?: { [key: string]: ProcedureRefResponseModel };
  /**
   * URL of the default hold tone played to queued callers when no custom hold audio is uploaded, so the dashboard can preview it.
   * @default "https://eleven-public-cdn-common.elevenlabs.io/convai/ambient-audio-assets/elevator1.mp3"
   */
  default_hold_audio_url?: string;
};
