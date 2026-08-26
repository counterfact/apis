import type { FeatureWorkflowId } from "./FeatureWorkflowId.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { MemberSummary } from "./MemberSummary.js";
import type { Instructions } from "./Instructions.js";
import type { RecentTriggerBody } from "./RecentTriggerBody.js";

export type TriggerWorkflowRep = {
  /**
   * The ID of this flag trigger
   * @example "12ab3c45de678910abc12345"
   */
  _id?: FeatureWorkflowId;
  /**
   * The flag trigger version
   * @example 1
   */
  _version?: number;
  /**
   * Timestamp of when the flag trigger was created
   * @example "1654104600000"
   */
  _creationDate?: UnixMillis;
  /**
   * The ID of the flag trigger maintainer
   * @example "12ab3c45de678910abc12345"
   */
  _maintainerId?: string;
  /**
   * Details on the member who maintains this flag trigger
   */
  _maintainer?: MemberSummary;
  /**
   * Whether the flag trigger is currently enabled
   * @example true
   */
  enabled?: boolean;
  /**
   * The unique identifier of the integration for your trigger
   * @example "generic-trigger"
   */
  _integrationKey?: string;
  /**
   * Details on the action to perform when triggering
   * @example "[ { \"kind\": \"turnFlagOn\" }]"
   */
  instructions?: Instructions;
  /**
   * Timestamp of when the trigger was most recently executed
   * @example "1654114600000"
   */
  _lastTriggeredAt?: UnixMillis;
  /**
   * Details on recent flag trigger requests.
   */
  _recentTriggerBodies?: Array<RecentTriggerBody>;
  /**
   * Number of times the trigger has been executed
   * @example 3
   */
  _triggerCount?: number;
  /**
   * The unguessable URL for this flag trigger
   */
  triggerURL?: string;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
