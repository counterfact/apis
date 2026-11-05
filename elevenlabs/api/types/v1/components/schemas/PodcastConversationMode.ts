import type { PodcastConversationModeData } from "./PodcastConversationModeData.js";
/**
 * @example {"conversation":{"guest_voice_id":"aw1NgEzBg83R7vgmiJt7","host_voice_id":"aw1NgEzBg83R7vgmiJt6"},"type":"conversation"}
 */
export type PodcastConversationMode = {
  /**
   * The type of podcast to create.
   */
  type: "conversation";
  /**
   * The voice settings for the conversation.
   */
  conversation: PodcastConversationModeData;
};
