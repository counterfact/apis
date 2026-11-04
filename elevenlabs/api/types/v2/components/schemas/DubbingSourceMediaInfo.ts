/**
 * Metadata about the project's source media.
 */
export type DubbingSourceMediaInfo = {
  /**
   * Original filename of the uploaded source media (null for URL sources).
   */
  filename?: string | null;
  /**
   * Duration of the source media, in seconds.
   */
  duration_s?: number | null;
  /**
   * Whether the source media contains a video stream.
   */
  has_video?: boolean | null;
  /**
   * MIME type of the uploaded source media (null for URL sources).
   */
  mime_type?: string | null;
};
