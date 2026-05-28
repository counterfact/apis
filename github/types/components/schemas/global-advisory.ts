import type { vulnerability } from "./vulnerability.js";
import type { cvss_severities } from "./cvss-severities.js";
import type { security_advisory_epss } from "./security-advisory-epss.js";
import type { simple_user } from "./simple-user.js";
import type { security_advisory_credit_types } from "./security-advisory-credit-types.js";

/**
 * A GitHub Security Advisory.
 */
export type global_advisory = {
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
   */
  url: string;
  /**
   * The URL for the advisory.
   * @format uri
   */
  html_url: string;
  /**
   * The API URL for the repository advisory.
   * @format uri
   */
  repository_advisory_url: string;
  /**
   * A short summary of the advisory.
   */
  summary: string;
  /**
   * A detailed description of what the advisory entails.
   */
  description: string;
  /**
   * The type of advisory.
   */
  type: "reviewed" | "unreviewed" | "malware";
  /**
   * The severity of the advisory.
   */
  severity: "critical" | "high" | "medium" | "low" | "unknown";
  /**
   * The URL of the advisory's source code.
   * @format uri
   */
  source_code_location: string;
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
  references: Array<string>;
  /**
   * The date and time of when the advisory was published, in ISO 8601 format.
   * @format date-time
   */
  published_at: string;
  /**
   * The date and time of when the advisory was last updated, in ISO 8601 format.
   * @format date-time
   */
  updated_at: string;
  /**
   * The date and time of when the advisory was reviewed by GitHub, in ISO 8601 format.
   * @format date-time
   */
  github_reviewed_at: string;
  /**
   * The date and time when the advisory was published in the National Vulnerability Database, in ISO 8601 format.
   * This field is only populated when the advisory is imported from the National Vulnerability Database.
   * @format date-time
   */
  nvd_published_at: string;
  /**
   * The date and time of when the advisory was withdrawn, in ISO 8601 format.
   * @format date-time
   */
  withdrawn_at: string;
  /**
   * The products and respective version ranges affected by the advisory.
   */
  vulnerabilities: Array<vulnerability>;
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
  epss?: security_advisory_epss;
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
   * The users who contributed to the advisory.
   */
  credits: Array<{ user: simple_user; type: security_advisory_credit_types }>;
};
