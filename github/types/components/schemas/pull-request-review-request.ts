import type { simple_user } from "./simple-user.js";
import type { team } from "./team.js";

/**
 * Pull Request Review Request
 */
export type pull_request_review_request = {
  users: Array<simple_user>;
  teams: Array<team>;
};
