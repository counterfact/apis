import type { ContextInstanceSegmentMembership } from "./ContextInstanceSegmentMembership.js";

export type ContextInstanceSegmentMemberships = {
  items: Array<ContextInstanceSegmentMembership>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
