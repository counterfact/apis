export type CompactionSettingsWorkflowOverride = {
  /**
   * Whether context compaction is enabled for this agent.
   */
  enabled?: boolean | null;
  /**
   * Context window fraction at which compaction is triggered.
   */
  soft_trigger_fraction?: number | null;
  /**
   * Number of recent messages kept verbatim after compaction.
   */
  tail_size?: number | null;
  /**
   * Minimum number of tokens that compaction must reclaim.
   */
  min_reclaimable_tokens?: number | null;
};
