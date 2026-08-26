import type { Instructions } from "./Instructions.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { FormVariableConfig } from "./FormVariableConfig.js";

export type createFlagConfigApprovalRequestRequest = {
  /**
   * Optional comment describing the approval request
   * @example "optional comment"
   */
  comment?: string;
  /**
   * A brief description of the changes you're requesting
   * @example "Requesting to update targeting"
   */
  description: string;
  /**
   * List of instructions in semantic patch format to be applied to the feature flag. Review the [Update feature flag](/tag/Feature-flags) documentation for details on available instructions.
   * @example "[{\"kind\": \"addTargets\", \"values\": [ \"context-key-123abc\"], \"variationId\": \"ce67d625-a8b9-4fb5-a344-ab909d9d4f4d\" }]"
   */
  instructions: Instructions;
  /**
   * An array of member IDs. These members are notified to review the approval request.
   * @example ["1234a56b7c89d012345e678f"]
   */
  notifyMemberIds?: Array<string>;
  /**
   * An array of team keys. The members of these teams are notified to review the approval request.
   * @example ["example-reviewer-team"]
   */
  notifyTeamKeys?: Array<string>;
  /**
   * Timestamp for when instructions will be executed
   * @example "1653926400000"
   */
  executionDate?: UnixMillis;
  /**
   * The ID of a scheduled change. Include this if your <code>instructions</code> include editing or deleting a scheduled change.
   * @example "6297ed79dee7dc14e1f9a80c"
   */
  operatingOnId?: string;
  /**
   * Additional approval request fields for third-party integration approval systems. If you are using a third-party integration to manage approval requests, these additional fields will be described in the <code>manifest.json</code> for that integration, at https://github.com/launchdarkly/integration-framework.
   */
  integrationConfig?: FormVariableConfig;
};
