export type ConversationHistoryTranscriptToolCallWebhookDetails = {
  /**
   * @default "webhook"
   */
  type?: "webhook";
  method: string;
  url: string;
  headers?: { [key: string]: string };
  path_params?: { [key: string]: string };
  query_params?: { [key: string]: string };
  body?: string | null;
};
