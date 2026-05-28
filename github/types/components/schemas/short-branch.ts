import type { branch_protection } from "./branch-protection.js";

/**
 * Short Branch
 */
export type short_branch = {
  name: string;
  commit: {
    sha: string;
    /**
     * @format uri
     */
    url: string;
  };
  protected: boolean;
  protection?: branch_protection;
  /**
   * @format uri
   */
  protection_url?: string;
};
