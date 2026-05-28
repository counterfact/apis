import type { simple_user } from "./simple-user.js";
import type { issue } from "./issue.js";

/**
 * Timeline Cross Referenced Event
 */
export type timeline_cross_referenced_event = {
  event: string;
  actor?: simple_user;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  source: { type?: string; issue?: issue };
};
