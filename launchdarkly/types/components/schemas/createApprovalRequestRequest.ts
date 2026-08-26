import type { Instructions } from "./Instructions.js";
import type { FormVariableConfig } from "./FormVariableConfig.js";

export type createApprovalRequestRequest = {
  /**
   * String representation of a resource
   */
  resourceId: string;
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
   * @example "[{\"kind\": \"addUserTargets\", \"values\": [ \"user-key-123abc\"], \"variationId\": \"ce67d625-a8b9-4fb5-a344-ab909d9d4f4d\" }]"
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
   * Additional approval request fields for third-party integration approval systems. If you are using a third-party integration to manage approval requests, these additional fields will be described in the <code>manifest.json</code> for that integration, at https://github.com/launchdarkly/integration-framework.
   */
  integrationConfig?: FormVariableConfig;
};
