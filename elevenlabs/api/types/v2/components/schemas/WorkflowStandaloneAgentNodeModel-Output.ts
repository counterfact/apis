import type { Position_Output } from "./Position-Output.js";
export type WorkflowStandaloneAgentNodeModel_Output = {
  /**
   * @default "standalone_agent"
   */
  type: "standalone_agent";
  /**
   * Position of the node in the workflow.
   */
  position: Position_Output;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order: Array<string>;
  /**
   * The ID of the agent to transfer the conversation to. None means transfer within the current agent.
   */
  agent_id: string | null;
  /**
   * Optional branch ID for the target agent. None follows the target agent's traffic deployment, or uses its main branch when node_id is set.
   */
  branch_id: string | null;
  /**
   * Optional target node ID in the destination agent's workflow. When set, the transfer starts at this node instead of the default entry node.
   */
  node_id: string | null;
  /**
   * Artificial delay in milliseconds applied before transferring the conversation.
   * @default 0
   */
  delay_ms: number;
  /**
   * Optional message sent to the user before the transfer is initiated.
   */
  transfer_message: string | null;
  /**
   * Whether to enable the transferred agent to send its configured first message after the transfer.
   * @default false
   */
  enable_transferred_agent_first_message: boolean;
  /**
   * Defines whether TTS client overrides should be carried over to the transferred agent.
   * @default false
   */
  preserve_client_tts_overrides: boolean;
  /**
   * Defines whether the base voice, TTS model and voice settings should be carried over to the transferred agent.
   * @default false
   */
  preserve_voice_settings: boolean;
};
