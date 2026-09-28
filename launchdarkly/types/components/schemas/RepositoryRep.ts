import type { BranchRep } from "./BranchRep.js";
import type { Access } from "./Access.js";

export type RepositoryRep = {
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
   * The type of repository
   * @example "github"
   */
  type: "bitbucket" | "custom" | "github" | "gitlab";
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
   * An array of the repository's branches that have been scanned for code references
   */
  branches?: Array<BranchRep>;
  _links: { [key: string]: unknown };
  _access?: Access;
};
