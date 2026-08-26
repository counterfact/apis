import type { ExpiringUserTargetItem } from "./ExpiringUserTargetItem.js";

export type ExpiringUserTargetGetResponse = {
  /**
   * An array of expiring user targets
   */
  items: Array<ExpiringUserTargetItem>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
