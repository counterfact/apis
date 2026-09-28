import type { ExpandableApprovalRequestResponse } from "./ExpandableApprovalRequestResponse.js";

export type ExpandableApprovalRequestsResponse = {
  /**
   * An array of approval requests
   */
  items: Array<ExpandableApprovalRequestResponse>;
  /**
   * Total number of approval requests
   * @example 1
   */
  totalCount: number;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
