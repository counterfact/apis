import type { ConversationHistoryRedactionConfig } from "./ConversationHistoryRedactionConfig.js";
/**
 * @example {"apply_to_existing_conversations":false,"delete_audio":false,"delete_transcript_and_pii":false,"record_voice":true,"retention_days":-1,"zero_retention_mode":false}
 */
export type PrivacyConfig_Output = {
  /**
   * Whether to record the conversation
   * @default true
   */
  record_voice?: boolean;
  /**
   * The number of days to retain the conversation. -1 indicates there is no retention limit
   * @default -1
   */
  retention_days?: number;
  /**
   * Whether to delete the transcript and PII
   * @default false
   */
  delete_transcript_and_pii?: boolean;
  /**
   * Whether to delete the audio
   * @default false
   */
  delete_audio?: boolean;
  /**
   * Whether to apply the privacy settings to existing conversations
   * @default false
   */
  apply_to_existing_conversations?: boolean;
  /**
   * Whether to enable zero retention mode - no PII data is stored
   * @default false
   */
  zero_retention_mode?: boolean;
  /**
   * Config for PII redaction in the conversation history
   */
  conversation_history_redaction?: ConversationHistoryRedactionConfig;
};
