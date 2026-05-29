import type { dependabot_alert_security_vulnerability } from "./dependabot-alert-security-vulnerability.js";
import type { cvss_severities } from "./cvss-severities.js";
import type { security_advisory_epss } from "./security-advisory-epss.js";

/**
 * Details for the GitHub Security Advisory.
 */
export type dependabot_alert_security_advisory = {
  /**
   * The unique GitHub Security Advisory ID assigned to the advisory.
   */
  ghsa_id: string;
  /**
   * The unique CVE ID assigned to the advisory.
   */
  cve_id: string;
  /**
   * A short, plain text summary of the advisory.
   */
  summary: string;
  /**
   * A long-form Markdown-supported description of the advisory.
   */
  description: string;
  /**
   * Vulnerable version range information for the advisory.
   */
  vulnerabilities: Array<dependabot_alert_security_vulnerability>;
  /**
   * The severity of the advisory.
   */
  severity: "low" | "medium" | "high" | "critical";
  /**
   * The classification of the advisory.
   */
  classification?: "general" | "malware";
  /**
   * Details for the advisory pertaining to the Common Vulnerability Scoring System.
   */
  cvss: {
    /**
     * The overall CVSS score of the advisory.
     */
    score: number;
    /**
     * The full CVSS vector string for the advisory.
     */
    vector_string: string;
  };
  cvss_severities?: cvss_severities;
  epss?: security_advisory_epss;
  /**
   * Details for the advisory pertaining to Common Weakness Enumeration.
   */
  cwes: Array<{
    /**
     * The unique CWE ID.
     */
    cwe_id: string;
    /**
     * The short, plain text name of the CWE.
     */
    name: string;
  }>;
  /**
   * Values that identify this advisory among security information sources.
   */
  identifiers: Array<{
    /**
     * The type of advisory identifier.
     */
    type: "CVE" | "GHSA";
    /**
     * The value of the advisory identifer.
     */
    value: string;
  }>;
  /**
   * Links to additional advisory information.
   */
  references: Array<{
    /**
     * The URL of the reference.
     * @format uri
     */
    url: string;
  }>;
  /**
   * The time that the advisory was published in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.
   * @format date-time
   */
  published_at: string;
  /**
   * The time that the advisory was last modified in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.
   * @format date-time
   */
  updated_at: string;
  /**
   * The time that the advisory was withdrawn in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.
   * @format date-time
   */
  withdrawn_at: string;
};
