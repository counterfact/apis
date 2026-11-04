/**
 * Buckets that make up the non-LLM ``platform_charge`` of a conversation.
 */
export type PlatformCategory =
  | "voice"
  | "silence"
  | "burst"
  | "asr"
  | "text_message"
  | "reception"
  | "v3_addon"
  | "v4_addon"
  | "rag_addon"
  | "other";
