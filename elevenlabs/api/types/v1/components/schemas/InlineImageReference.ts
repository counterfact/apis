/**
 * An image passed inline as base64. The image is stored as an ephemeral
 * asset with no guaranteed retention: it may be deleted at any time after
 * the generation completes. To keep an input and reuse it across
 * generations, upload it via the assets API (`POST /v1/assets`) and pass
 * an `asset` reference instead.
 */
export type InlineImageReference = {
  type: "inline_base64";
  /**
   * The media file's bytes, base64-encoded (standard alphabet). Up to 25MB decoded.
   */
  content_base64: string;
  /**
   * The MIME type of the encoded image.
   */
  mime_type:
    "image/jpeg" | "image/png" | "image/webp" | "image/heic" | "image/heif";
};
