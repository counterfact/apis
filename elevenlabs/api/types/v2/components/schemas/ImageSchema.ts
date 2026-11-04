export type ImageSchema = {
  title?: string | null;
  description?: string | null;
  /**
   * @default "image"
   */
  type?: "image";
};
