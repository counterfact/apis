export type AgentTransfer_Input = {
  agent_id?: string | null;
  branch_id?: string | null;
  node_id?: string | null;
  condition: string;
  /**
   * @default 0
   */
  delay_ms?: number;
  transfer_message?: string | null;
  /**
   * @default false
   */
  enable_transferred_agent_first_message?: boolean;
  /**
   * @default false
   */
  is_workflow_node_transfer?: boolean;
  /**
   * Defines whether TTS client overrides should be carried over to the transferred agent.
   * @default false
   */
  preserve_client_tts_overrides?: boolean;
  /**
   * Defines whether the base voice, TTS model and voice settings should be carried over to the transferred agent.
   * @default false
   */
  preserve_voice_settings?: boolean;
};
