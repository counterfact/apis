import type { PodcastBulletinModeData } from "./PodcastBulletinModeData.js";
/**
 * @example {"bulletin":{"host_voice_id":"aw1NgEzBg83R7vgmiJt6"},"type":"bulletin"}
 */
export type PodcastBulletinMode = {
  /**
   * The type of podcast to create.
   */
  type: "bulletin";
  /**
   * The voice settings for the bulletin.
   */
  bulletin: PodcastBulletinModeData;
};
