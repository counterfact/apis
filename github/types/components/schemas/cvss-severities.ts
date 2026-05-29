export type cvss_severities = {
  cvss_v3?: {
    /**
     * The CVSS 3 vector string.
     */
    vector_string: string;
    /**
     * The CVSS 3 score.
     */
    score: number;
  };
  cvss_v4?: {
    /**
     * The CVSS 4 vector string.
     */
    vector_string: string;
    /**
     * The CVSS 4 score.
     */
    score: number;
  };
};
