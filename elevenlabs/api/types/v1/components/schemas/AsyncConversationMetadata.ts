/**
 * Metadata for async conversation delivery (Zendesk, Slack, etc.).
 */
export type AsyncConversationMetadata = {
  delivery_status: "pending" | "success" | "failed";
  delivery_timestamp: number;
  delivery_error?: string | null;
  external_system: string;
  external_id: string;
  external_link?: string | null;
  /**
   * @default 0
   */
  retry_count?: number;
  last_retry_timestamp?: number | null;
  last_processed_external_message_id?: string | null;
};
