/**
 * A diff of the dependencies between two commits.
 */
export type dependency_graph_diff = Array<{
  change_type: "added" | "removed";
  /**
   * @example "path/to/package-lock.json"
   */
  manifest: string;
  /**
   * @example "npm"
   */
  ecosystem: string;
  /**
   * @example "@actions/core"
   */
  name: string;
  /**
   * @example "1.0.0"
   */
  version: string;
  /**
   * @example "pkg:/npm/%40actions/core@1.1.0"
   */
  package_url: string;
  /**
   * @example "MIT"
   */
  license: string;
  /**
   * @example "https://github.com/github/actions"
   */
  source_repository_url: string;
  vulnerabilities: Array<{
    /**
     * @example "critical"
     */
    severity: string;
    /**
     * @example "GHSA-rf4j-j272-fj86"
     */
    advisory_ghsa_id: string;
    /**
     * @example "A summary of the advisory."
     */
    advisory_summary: string;
    /**
     * @example "https://github.com/advisories/GHSA-rf4j-j272-fj86"
     */
    advisory_url: string;
  }>;
  /**
   * Where the dependency is utilized. `development` means that the dependency is only utilized in the development environment. `runtime` means that the dependency is utilized at runtime and in the development environment.
   */
  scope: "unknown" | "runtime" | "development";
}>;
