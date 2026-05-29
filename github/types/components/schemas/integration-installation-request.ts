import type { simple_user } from "./simple-user.js";
import type { enterprise } from "./enterprise.js";

/**
 * Request to install an integration on a target
 */
export type integration_installation_request = {
  /**
   * Unique identifier of the request installation.
   * @example 42
   */
  id: number;
  /**
   * @example "MDExOkludGVncmF0aW9uMQ=="
   */
  node_id?: string;
  account: simple_user | enterprise;
  requester: simple_user;
  /**
   * @format date-time
   * @example "2022-07-08T16:18:44-04:00"
   */
  created_at: string;
};
