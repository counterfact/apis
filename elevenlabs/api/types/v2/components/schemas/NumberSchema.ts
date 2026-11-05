export type NumberSchema = {
  title?: string | null;
  description?: string | null;
  /**
   * @default "number"
   */
  type?: "number";
  enum?: Array<number> | null;
};
