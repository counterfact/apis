export type Body_Register_media_v1_productions_orders__order_id__media_post = {
  /**
   * The language code of the media content (e.g. 'en', 'es-ES'). Must be a supported source language for some order item kind.
   */
  declared_language: string;
  /**
   * The media file to upload. Mutually exclusive with media_url.
   */
  media?: (Uint8Array | string) | null;
  /**
   * A URL to fetch the media file from. Mutually exclusive with media.
   */
  media_url?: string | null;
  /**
   * The filename for URL-sourced media (e.g. 'example.mp4'). Required when using media_url.
   */
  media_url_filename?: string | null;
  /**
   * The MIME type for URL-sourced media (e.g. 'video/mp4'). Required when using media_url.
   */
  media_url_content_type?: string | null;
};
