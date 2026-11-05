import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
/**
 * Information about the source of conversation initiation
 */
export type ConversationInitiationSourceInfo = {
  /**
   * Source of the conversation initiation
   */
  source?: ConversationInitiationSource | null;
  /**
   * The SDK version number
   */
  version?: string | null;
};
