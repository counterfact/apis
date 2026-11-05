export type StringSchema = {
  title?: string | null;
  description?: string | null;
  /**
   * @default "string"
   */
  type?: "string";
  enum?: Array<string> | null;
};
