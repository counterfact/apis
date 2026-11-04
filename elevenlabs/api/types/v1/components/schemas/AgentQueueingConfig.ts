import type { AgentHoldAudioConfig } from "./AgentHoldAudioConfig.js";
export type AgentQueueingConfig = {
  /**
   * Hold callers in a wait queue when the agent is at its concurrency limit, instead of rejecting them immediately. New agents are created with queueing enabled unless this field is set explicitly.
   * @default false
   */
  enabled?: boolean;
  /**
   * Maximum time a caller can wait in the queue before being rejected
   * @default 180
   */
  wait_timeout_seconds?: number;
  /**
   * Custom hold audio played to queued callers; when unset, callers hear the default hold tone. Read-only: set it by uploading a file through the agent hold-audio endpoint.
   */
  hold_audio?: AgentHoldAudioConfig | null;
};
