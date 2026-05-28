import type { simple_user } from "./simple-user.js";
import type { repository_advisory_vulnerability } from "./repository-advisory-vulnerability.js";
import type { cvss_severities } from "./cvss-severities.js";
import type { security_advisory_credit_types } from "./security-advisory-credit-types.js";
import type { repository_advisory_credit } from "./repository-advisory-credit.js";
import type { team } from "./team.js";
import type { simple_repository } from "./simple-repository.js";

/**
 * A repository security advisory.
 */
export type repository_advisory = {
  /**
   * The GitHub Security Advisory ID.
   */
  ghsa_id: string;
  /**
   * The Common Vulnerabilities and Exposures (CVE) ID.
   */
  cve_id: string;
  /**
   * The API URL for the advisory.
   * @format uri
   */
  url: string;
  /**
   * The URL for the advisory.
   * @format uri
   */
  html_url: string;
  /**
   * A short summary of the advisory.
   */
  summary: string;
  /**
   * A detailed description of what the advisory entails.
   */
  description: string;
  /**
   * The severity of the advisory.
   */
  severity: "critical" | "high" | "medium" | "low";
  /**
   * The author of the advisory.
   */
  author: simple_user;
  /**
   * The publisher of the advisory.
   */
  publisher: simple_user;
  identifiers: Array<{
    /**
     * The type of identifier.
     */
    type: "CVE" | "GHSA";
    /**
     * The identifier value.
     */
    value: string;
  }>;
  /**
   * The state of the advisory.
   */
  state: "published" | "closed" | "withdrawn" | "draft" | "triage";
  /**
   * The date and time of when the advisory was created, in ISO 8601 format.
   * @format date-time
   */
  created_at: string;
  /**
   * The date and time of when the advisory was last updated, in ISO 8601 format.
   * @format date-time
   */
  updated_at: string;
  /**
   * The date and time of when the advisory was published, in ISO 8601 format.
   * @format date-time
   */
  published_at: string;
  /**
   * The date and time of when the advisory was closed, in ISO 8601 format.
   * @format date-time
   */
  closed_at: string;
  /**
   * The date and time of when the advisory was withdrawn, in ISO 8601 format.
   * @format date-time
   */
  withdrawn_at: string;
  submission: {
    /**
     * Whether a private vulnerability report was accepted by the repository's administrators.
     */
    accepted: boolean;
  };
  vulnerabilities: Array<repository_advisory_vulnerability>;
  cvss: {
    /**
     * The CVSS vector.
     */
    vector_string: string;
    /**
     * The CVSS score.
     */
    score: number;
  };
  cvss_severities?: cvss_severities;
  cwes: Array<{
    /**
     * The Common Weakness Enumeration (CWE) identifier.
     */
    cwe_id: string;
    /**
     * The name of the CWE.
     */
    name: string;
  }>;
  /**
   * A list of only the CWE IDs.
   */
  cwe_ids: Array<string>;
  credits: Array<{
    /**
     * The username of the user credited.
     */
    login?: string;
    type?: security_advisory_credit_types;
  }>;
  credits_detailed: Array<repository_advisory_credit>;
  /**
   * A list of users that collaborate on the advisory.
   */
  collaborating_users: Array<simple_user>;
  /**
   * A list of teams that collaborate on the advisory.
   */
  collaborating_teams: Array<team>;
  /**
   * A temporary private fork of the advisory's repository for collaborating on a fix.
   */
  private_fork: simple_repository;
};
