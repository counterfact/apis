import type { UserSegment } from "./UserSegment.js";

export type UserSegments = {
  /**
   * An array of segments
   */
  items: Array<UserSegment>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The total number of segments
   */
  totalCount: number;
};
