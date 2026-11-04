import type { ConversationConfigClientOverride_Input } from "./ConversationConfigClientOverride-Input.js";
import type { ConversationInitiationSourceInfo } from "./ConversationInitiationSourceInfo.js";
export type ConversationInitiationClientDataRequest_Input = {
  conversation_config_override?: ConversationConfigClientOverride_Input;
  custom_llm_extra_body?: { [key: string]: unknown };
  /**
   * ID of the end user participating in this conversation (for agent owner's user identification)
   */
  user_id?: string | null;
  source_info?: ConversationInitiationSourceInfo;
  /**
   * ID of the agent branch to use for this conversation
   */
  branch_id?: string | null;
  /**
   * Environment to use for resolving environment variables
   */
  environment?: string | null;
  /**
   * If set, start the workflow at this node id instead of the default entry
   */
  starting_workflow_node_id?: string | null;
  /**
   * If set, only these procedures are available to the starting agent. Each ID must be attached to that agent; unknown IDs fail conversation start. An empty list disables all of that agent's procedures. Not applied after an agent transfer. Requires enable_procedure_ids_from_client.
   */
  procedure_ids?: Array<string> | null;
  /**
   * If set, these free-form procedures start when the conversation starts. Accepts at most five IDs. Each ID must be available after procedure_ids is applied. Unknown IDs and structured procedures fail conversation start. Requires enable_procedure_ids_from_client.
   */
  start_procedure_ids?: Array<string> | null;
  dynamic_variables?: { [key: string]: unknown };
};
