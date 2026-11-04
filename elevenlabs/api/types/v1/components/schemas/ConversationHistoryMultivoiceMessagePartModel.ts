/**
 * Represents a single voice part of a multi-voice message.
 */
export type ConversationHistoryMultivoiceMessagePartModel = {
  text: string;
  voice_label: string | null;
  time_in_call_secs: number | null;
};
