import type { ConversationConfigClientOverrideConfig_Output } from "./ConversationConfigClientOverrideConfig-Output.js";
/**
 * @example {"custom_llm_extra_body":true,"enable_conversation_initiation_client_data_from_webhook":true,"enable_procedure_ids_from_client":true,"enable_starting_workflow_node_id_from_client":true}
 */
export type ConversationInitiationClientDataConfig_Output = {
  /**
   * Overrides for the conversation configuration
   */
  conversation_config_override?: ConversationConfigClientOverrideConfig_Output;
  /**
   * Whether to include custom LLM extra body
   * @default false
   */
  custom_llm_extra_body?: boolean;
  /**
   * Whether to enable conversation initiation client data from webhooks
   * @default false
   */
  enable_conversation_initiation_client_data_from_webhook?: boolean;
  /**
   * Whether clients may pass starting_workflow_node_id in initiation client data; if false, sending it fails conversation start.
   * @default false
   */
  enable_starting_workflow_node_id_from_client?: boolean;
  /**
   * Whether clients may pass procedure_ids and start_procedure_ids in initiation client data. procedure_ids selects which of the agent's procedures are available. start_procedure_ids starts free-form procedures when the conversation starts. If false, sending either field fails conversation start.
   * @default false
   */
  enable_procedure_ids_from_client?: boolean;
};
