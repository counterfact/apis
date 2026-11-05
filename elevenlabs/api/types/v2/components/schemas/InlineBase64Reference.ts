/**
 * Media passed inline as base64. Stored as an ephemeral asset with no
 * guaranteed retention. To keep an input and reuse it, upload via
 * ``POST /v1/assets`` and pass an ``asset`` reference instead.
 */
export type InlineBase64Reference = {
  type: "inline_base64";
  /**
   * The media file's bytes, base64-encoded (standard alphabet). Up to 25MB decoded.
   */
  content_base64: string;
  /**
   * The MIME type of the encoded media.
   */
  mime_type:
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/heic"
    | "image/heif"
    | "audio/mpeg"
    | "audio/wav"
    | "video/mp4"
    | "video/quicktime"
    | "video/webm";
};
