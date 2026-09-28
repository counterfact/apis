import type { sourceFlag } from "./sourceFlag.js";

export type createCopyFlagConfigApprovalRequestRequest = {
  /**
   * Optional comment describing the approval request
   * @example "optional comment"
   */
  comment?: string;
  /**
   * A brief description of your changes
   * @example "copy flag settings to another environment"
   */
  description: string;
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
   * The flag to copy
   */
  source: sourceFlag;
  /**
   * Optional list of the flag changes to copy from the source environment to the target environment. You may include either <code>includedActions</code> or <code>excludedActions</code>, but not both. If neither are included, then all flag changes will be copied.
   * @example ["updateOn"]
   */
  includedActions?: Array<
    | "updateOn"
    | "updateFallthrough"
    | "updateOffVariation"
    | "updateRules"
    | "updateTargets"
    | "updatePrerequisites"
  >;
  /**
   * Optional list of the flag changes NOT to copy from the source environment to the target environment. You may include either <code>includedActions</code> or <code>excludedActions</code>, but not both. If neither are included, then all flag changes will be copied.
   * @example ["updateOn"]
   */
  excludedActions?: Array<
    | "updateOn"
    | "updateFallthrough"
    | "updateOffVariation"
    | "updateRules"
    | "updateTargets"
    | "updatePrerequisites"
  >;
};
