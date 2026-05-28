import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Page Build
 */
export type page_build = {
  /**
   * @format uri
   */
  url: string;
  status: string;
  error: { message: string };
  pusher: nullable_simple_user;
  commit: string;
  duration: number;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
};
