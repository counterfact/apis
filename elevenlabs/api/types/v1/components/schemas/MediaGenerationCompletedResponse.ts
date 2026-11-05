/**
 * A completed media generation and its output.
 * @example {"content_mime_type":"video/mp4","content_url":"https://storage.googleapis.com/generations/JWr5N6X9ZTqf8jD2LmQb","id":"JWr5N6X9ZTqf8jD2LmQb","status":"completed"}
 */
export type MediaGenerationCompletedResponse = {
  /**
   * The unique identifier of the generation.
   */
  id: string;
  /**
   * The lifecycle status of the generation.
   */
  status: "completed";
  /**
   * A signed URL to download the generated media from. It expires about an hour after this response is returned; fetch the generation again for a fresh URL.
   */
  content_url: string;
  /**
   * The MIME type of the generated media.
   */
  content_mime_type: string;
};
