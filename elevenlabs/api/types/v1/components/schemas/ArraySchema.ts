import type { ContentSchema } from "./ContentSchema.js";
export type ArraySchema = {
  title?: string | null;
  description?: string | null;
  /**
   * @default "array"
   */
  type?: "array";
  items: ContentSchema;
};
