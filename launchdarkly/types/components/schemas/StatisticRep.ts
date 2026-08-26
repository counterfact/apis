export type StatisticRep = {
  /**
   * The repository name
   * @example "LaunchDarkly-Docs"
   */
  name: string;
  /**
   * The type of repository
   * @example "github"
   */
  type: "bitbucket" | "custom" | "github" | "gitlab";
  /**
   * A URL to access the repository
   * @example "https://github.com/launchdarkly/LaunchDarkly-Docs"
   */
  sourceLink: string;
  /**
   * The repository's default branch
   * @example "main"
   */
  defaultBranch: string;
  /**
   * Whether or not a repository is enabled for code reference scanning
   * @example true
   */
  enabled: boolean;
  /**
   * The version of the repository's saved information
   * @example 3
   */
  version: number;
  /**
   * The number of code reference hunks in which the flag appears in this repository
   */
  hunkCount: number;
  /**
   * The number of files in which the flag appears in this repository
   */
  fileCount: number;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
