export type ReplicateVoiceToIsolatedEnvironmentRequestModel = {
  /**
   * ID of the workspace to replicate the voice into. It must belong to the same consolidated billing group as the calling workspace; the target's data residency is derived from that link.
   */
  target_workspace_id: string;
  /**
   * When true (default) the replicated voice keeps the same voice ID in the target residency; set to false to assign a new voice ID.
   * @default true
   */
  preserve_voice_id?: boolean;
};
