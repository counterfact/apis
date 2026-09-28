import type { UnixMillis } from "./UnixMillis.js";
import type { DeploymentStatus } from "./DeploymentStatus.js";
import type { DeploymentKind } from "./DeploymentKind.js";
import type { PullRequestCollectionRep } from "./PullRequestCollectionRep.js";
import type { FlagReferenceCollectionRep } from "./FlagReferenceCollectionRep.js";
import type { LeadTimeStagesRep } from "./LeadTimeStagesRep.js";

export type DeploymentRep = {
  /**
   * The deployment ID
   * @format uuid
   * @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
   */
  id: string;
  /**
   * The application key
   * @example "billing-service"
   */
  applicationKey: string;
  /**
   * The application version
   * @example "a90a8a2"
   */
  applicationVersion: string;
  /**
   * The time the deployment started
   * @example "1706701522000"
   */
  startedAt: UnixMillis;
  /**
   * The time the deployment ended
   * @example "1706712518000"
   */
  endedAt?: UnixMillis;
  /**
   * The duration of the deployment in milliseconds
   * @format int64
   * @example 10996000
   */
  durationMs?: number;
  /**
   * The status of the deployment
   * @example "finished"
   */
  status: DeploymentStatus;
  /**
   * The kind of deployment
   * @example "redeployment"
   */
  kind: DeploymentKind;
  /**
   * Whether the deployment is active
   * @example true
   */
  active: boolean;
  /**
   * The metadata associated with the deployment
   * @example {"buildNumber":"1234"}
   */
  metadata?: { [key: string]: unknown };
  /**
   * Whether the deployment is archived
   * @example false
   */
  archived: boolean;
  /**
   * The environment key
   * @example "production"
   */
  environmentKey: string;
  /**
   * The number of contributors
   * @example 1
   */
  numberOfContributors: number;
  /**
   * The number of pull requests
   * @example 2
   */
  numberOfPullRequests: number;
  /**
   * The number of lines added
   * @format int64
   * @example 100
   */
  linesAdded: number;
  /**
   * The number of lines deleted
   * @format int64
   * @example 50
   */
  linesDeleted: number;
  /**
   * The total lead time from first commit to deployment end in milliseconds
   * @format int64
   * @example 20237000
   */
  leadTime: number;
  /**
   * The pull requests contained in the deployment
   */
  pullRequests?: PullRequestCollectionRep;
  /**
   * The flag references contained in the deployment
   */
  flagReferences?: FlagReferenceCollectionRep;
  /**
   * The lead time stages for the deployment
   */
  leadTimeStages?: LeadTimeStagesRep;
};
