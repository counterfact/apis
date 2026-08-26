import type { FlagConfigApprovalRequestResponse } from "./FlagConfigApprovalRequestResponse.js";

export type FlagConfigApprovalRequestsResponse = {
  /**
   * An array of approval requests
   */
  items: Array<FlagConfigApprovalRequestResponse>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
