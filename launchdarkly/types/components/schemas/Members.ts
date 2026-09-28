import type { Member } from "./Member.js";

export type Members = {
  /**
   * An array of members
   */
  items: Array<Member>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The number of members returned
   */
  totalCount?: number;
};
