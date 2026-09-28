import type { UnixMillis } from "./UnixMillis.js";
import type { DeploymentCollectionRep } from "./DeploymentCollectionRep.js";
import type { FlagReferenceCollectionRep } from "./FlagReferenceCollectionRep.js";
import type { PullRequestLeadTimeRep } from "./PullRequestLeadTimeRep.js";

export type PullRequestRep = {
  /**
   * The pull request internal ID
   * @format uuid
   * @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
   */
  id: string;
  /**
   * The pull request number
   * @example "1234"
   */
  externalId: string;
  /**
   * The pull request title
   * @example "Enable new payment structure"
   */
  title: string;
  /**
   * The pull request status
   * @example "merged"
   */
  status: string;
  /**
   * The pull request author
   * @example "jane.doe"
   */
  author: string;
  /**
   * The pull request create time
   * @example "1706701522000"
   */
  createTime: UnixMillis;
  /**
   * The pull request merge time
   * @example "1706712518000"
   */
  mergeTime?: UnixMillis;
  /**
   * The pull request merge commit key
   * @example "a90a8a2"
   */
  mergeCommitKey?: string;
  /**
   * The pull request base commit key
   * @example "a90a8a2"
   */
  baseCommitKey: string;
  /**
   * The pull request head commit key
   * @example "a90a8a2"
   */
  headCommitKey: string;
  /**
   * The number of files changed
   * @example 2
   */
  filesChanged: number;
  /**
   * The number of lines added
   * @example 100
   */
  linesAdded: number;
  /**
   * The number of lines deleted
   * @example 50
   */
  linesDeleted: number;
  /**
   * The pull request URL
   * @example "https://github.com/launchdarkly/LaunchDarkly-Docs/pull/406"
   */
  url: string;
  /**
   * A list of deployments associated with the pull request
   */
  deployments?: DeploymentCollectionRep;
  /**
   * A list of flag references associated with the pull request
   */
  flagReferences?: FlagReferenceCollectionRep;
  /**
   * The lead time for the pull request in a given environment
   */
  leadTime?: PullRequestLeadTimeRep;
};
