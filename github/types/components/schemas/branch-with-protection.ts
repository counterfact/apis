import type { commit } from "./commit.js";
import type { branch_protection } from "./branch-protection.js";

/**
 * Branch With Protection
 */
export type branch_with_protection = {
  name: string;
  commit: commit;
  _links: {
    html: string;
    /**
     * @format uri
     */
    self: string;
  };
  protected: boolean;
  protection: branch_protection;
  /**
   * @format uri
   */
  protection_url: string;
  /**
   * @example "\"mas*\""
   */
  pattern?: string;
  /**
   * @example 1
   */
  required_approving_review_count?: number;
};
