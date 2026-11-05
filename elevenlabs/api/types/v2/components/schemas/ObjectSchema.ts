import type { ContentSchema } from "./ContentSchema.js";
export type ObjectSchema = {
  title?: string | null;
  description?: string | null;
  /**
   * @default "object"
   */
  type?: "object";
  properties?: { [key: string]: ContentSchema };
  required?: Array<string>;
};
