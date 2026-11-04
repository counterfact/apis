export type VideoSchema = {
  title?: string | null;
  description?: string | null;
  /**
   * @default "video"
   */
  type?: "video";
};
