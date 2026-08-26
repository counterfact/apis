import type { UnixMillis } from "./UnixMillis.js";
import type { ApprovalRequestServiceKind } from "./ApprovalRequestServiceKind.js";
import type { ReviewResponse } from "./ReviewResponse.js";
import type { Instructions } from "./Instructions.js";
import type { Conflict } from "./Conflict.js";
import type { IntegrationMetadata } from "./IntegrationMetadata.js";
import type { CopiedFromEnv } from "./CopiedFromEnv.js";
import type { CustomWorkflowMeta } from "./CustomWorkflowMeta.js";
import type { ApprovalSettings } from "./ApprovalSettings.js";
import type { Project } from "./Project.js";
import type { Environment } from "./Environment.js";
import type { ExpandedFlagRep } from "./ExpandedFlagRep.js";

export type ExpandableApprovalRequestResponse = {
  /**
   * The ID of this approval request
   * @example "12ab3c45de678910abc12345"
   */
  _id: string;
  /**
   * Version of the approval request
   * @example 1
   */
  _version: number;
  /**
   * Timestamp of when the approval request was created
   * @example "1654104600000"
   */
  creationDate: UnixMillis;
  /**
   * The approval service for this request. May be LaunchDarkly or an external approval service, such as ServiceNow or JIRA.
   * @example "launchdarkly"
   */
  serviceKind: ApprovalRequestServiceKind;
  /**
   * The ID of the member who requested the approval
   * @example "12ab3c45de678910abc12345"
   */
  requestorId?: string;
  /**
   * A human-friendly name for the approval request
   * @example "example: request approval from someone"
   */
  description?: string;
  /**
   * Current status of the review of this approval request
   * @example "pending"
   */
  reviewStatus: "approved" | "declined" | "pending";
  /**
   * An array of individual reviews of this approval request
   */
  allReviews: Array<ReviewResponse>;
  /**
   * An array of member IDs. These members are notified to review the approval request.
   * @example ["1234a56b7c89d012345e678f"]
   */
  notifyMemberIds: Array<string>;
  /**
   * Timestamp of when the approval request was applied
   * @example "1654104600000"
   */
  appliedDate?: UnixMillis;
  /**
   * The member ID of the member who applied the approval request
   * @example "1234a56b7c89d012345e678f"
   */
  appliedByMemberId?: string;
  /**
   * The service token ID of the service token which applied the approval request
   * @example "1234a56b7c89d012345e678f"
   */
  appliedByServiceTokenId?: string;
  /**
   * Current status of the approval request
   * @example "pending"
   */
  status: "pending" | "completed" | "failed" | "scheduled";
  /**
   * List of instructions in semantic patch format to be applied to the feature flag
   * @example "[{\"kind\": \"turnFlagOn\"}]"
   */
  instructions: Instructions;
  /**
   * Details on any conflicting approval requests
   */
  conflicts: Array<Conflict>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * Timestamp for when instructions will be executed
   * @example "1654104600000"
   */
  executionDate?: UnixMillis;
  /**
   * ID of scheduled change to edit or delete
   * @example "12ab3c45de678910abc12345"
   */
  operatingOnId?: string;
  /**
   * Details about the object in an external service corresponding to this approval request, such as a ServiceNow change request or a JIRA ticket, if an external approval service is being used
   */
  integrationMetadata?: IntegrationMetadata;
  /**
   * Details about the source feature flag, if copied
   */
  source?: CopiedFromEnv;
  /**
   * Details about the custom workflow, if this approval request is part of a custom workflow
   */
  customWorkflowMetadata?: CustomWorkflowMeta;
  /**
   * String representation of a resource
   */
  resourceId?: string;
  /**
   * The settings for this approval
   */
  approvalSettings?: ApprovalSettings;
  /**
   * Project the approval request belongs to
   */
  project?: Project;
  /**
   * List of environments the approval impacts
   */
  environments?: Array<Environment>;
  /**
   * Flag the approval request belongs to
   */
  flag?: ExpandedFlagRep;
};
