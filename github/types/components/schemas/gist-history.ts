import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Gist History
 */
export type gist_history = {
  user?: nullable_simple_user;
  version?: string;
  /**
   * @format date-time
   */
  committed_at?: string;
  change_status?: { total?: number; additions?: number; deletions?: number };
  /**
   * @format uri
   */
  url?: string;
};
