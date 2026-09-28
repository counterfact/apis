export type repositoryPost = {
  /**
   * The repository name
   * @example "LaunchDarkly-Docs"
   */
  name: string;
  /**
   * A URL to access the repository
   * @example "https://github.com/launchdarkly/LaunchDarkly-Docs"
   */
  sourceLink?: string;
  /**
   * A template for constructing a valid URL to view the commit
   * @example "https://github.com/launchdarkly/LaunchDarkly-Docs/commit/${sha}"
   */
  commitUrlTemplate?: string;
  /**
   * A template for constructing a valid URL to view the hunk
   * @example "https://github.com/launchdarkly/LaunchDarkly-Docs/blob/${sha}/${filePath}#L${lineNumber}"
   */
  hunkUrlTemplate?: string;
  /**
   * The type of repository. If not specified, the default value is <code>custom</code>.
   * @example "github"
   */
  type?: "bitbucket" | "custom" | "github" | "gitlab";
  /**
   * The repository's default branch. If not specified, the default value is <code>main</code>.
   * @example "main"
   */
  defaultBranch?: string;
};
