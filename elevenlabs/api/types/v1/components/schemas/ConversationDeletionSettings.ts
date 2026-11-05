export type ConversationDeletionSettings = {
  deletion_time_unix_secs?: number | null;
  deleted_logs_at_time_unix_secs?: number | null;
  deleted_audio_at_time_unix_secs?: number | null;
  deleted_transcript_at_time_unix_secs?: number | null;
  /**
   * @default false
   */
  delete_transcript_and_pii?: boolean;
  /**
   * @default false
   */
  delete_audio?: boolean;
};
