/**
 * @example {"message":"Request accepted. Transcription result will be sent to the webhook endpoint.","request_id":"1234567890"}
 */
export type SpeechToTextWebhookResponseModel = {
  /**
   * The message of the webhook response.
   */
  message: string;
  /**
   * The request ID of the webhook response.
   */
  request_id: string;
  /**
   * The transcription ID of the webhook response.
   */
  transcription_id?: string | null;
};
