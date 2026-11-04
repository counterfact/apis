import type { MediaId } from "./MediaId.js";
/**
 * @example {"content_type":"video/mp4","language":"en","media_id":"prodmedia_01jgb2zd68f8f9tfvbb968wb8z","name":"example.mp4","signed_url":"https://storage.googleapis.com/example-bucket/media/example.mp4?X-Goog-Signature=..."}
 */
export type OrderMediaResponse = {
  /**
   * The ID of the media file.
   */
  media_id: MediaId;
  /**
   * The original filename of the uploaded media.
   */
  name: string;
  /**
   * The MIME type of the media file (e.g. 'video/mp4').
   */
  content_type: string;
  /**
   * The detected or declared language of the media, if available.
   */
  language?: string | null;
  /**
   * A time-limited URL to download the media file.
   */
  signed_url: string;
};
