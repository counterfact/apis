import type { MediaId } from "./MediaId.js";
/**
 * @example {"media_id":"prodmedia_01jgb2zd68f8f9tfvbb968wb8z"}
 */
export type RegisterMediaResponse = {
  /**
   * The ID of the uploaded media file.
   */
  media_id: MediaId;
};
