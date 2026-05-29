import type { security_advisory_ecosystems } from "./security-advisory-ecosystems.js";
import type { security_advisory_credit_types } from "./security-advisory-credit-types.js";

export type repository_advisory_update = {
  /**
   * A short summary of the advisory.
   */
  summary?: string;
  /**
   * A detailed description of what the advisory impacts.
   */
  description?: string;
  /**
   * The Common Vulnerabilities and Exposures (CVE) ID.
   */
  cve_id?: string;
  /**
   * A product affected by the vulnerability detailed in a repository security advisory.
   */
  vulnerabilities?: Array<{
    /**
     * The name of the package affected by the vulnerability.
     */
    package: {
      ecosystem: security_advisory_ecosystems;
      /**
       * The unique package name within its ecosystem.
       */
      name?: string;
    };
    /**
     * The range of the package versions affected by the vulnerability.
     */
    vulnerable_version_range?: string;
    /**
     * The package version(s) that resolve the vulnerability.
     */
    patched_versions?: string;
    /**
     * The functions in the package that are affected.
     */
    vulnerable_functions?: Array<string>;
  }>;
  /**
   * A list of Common Weakness Enumeration (CWE) IDs.
   */
  cwe_ids?: Array<string>;
  /**
   * A list of users receiving credit for their participation in the security advisory.
   */
  credits?: Array<{
    /**
     * The username of the user credited.
     */
    login: string;
    type: security_advisory_credit_types;
  }>;
  /**
   * The severity of the advisory. You must choose between setting this field or `cvss_vector_string`.
   */
  severity?: "critical" | "high" | "medium" | "low";
  /**
   * The CVSS vector that calculates the severity of the advisory. You must choose between setting this field or `severity`.
   */
  cvss_vector_string?: string;
  /**
   * The state of the advisory.
   */
  state?: "published" | "closed" | "draft";
  /**
   * A list of usernames who have been granted write access to the advisory.
   */
  collaborating_users?: Array<string>;
  /**
   * A list of team slugs which have been granted write access to the advisory.
   */
  collaborating_teams?: Array<string>;
};
