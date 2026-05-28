import type { simple_user } from "./simple-user.js";
import type { security_advisory_credit_types } from "./security-advisory-credit-types.js";

/**
 * A credit given to a user for a repository security advisory.
 */
export type repository_advisory_credit = {
  user: simple_user;
  type: security_advisory_credit_types;
  /**
   * The state of the user's acceptance of the credit.
   */
  state: "accepted" | "declined" | "pending";
};
