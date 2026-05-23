import type { Category } from "./Category.js";
import type { Tag } from "./Tag.js";

export type Pet = {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @example "doggie"
   */
  name: string;
  category?: Category;
  photoUrls: Array<string>;
  tags?: Array<Tag>;
  /**
   * pet status in the store
   */
  status?: "available" | "pending" | "sold";
};
