import type { Instructions } from "./Instructions.js";

export type FlagScheduledChangesInput = {
  /**
   * Optional comment describing the update to the scheduled changes
   * @example "optional comment"
   */
  comment?: string;
  /**
   * The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require a <code>value</code> field in the array element.
   * @example "[ { \"kind\": \"replaceScheduledChangesInstructions\", \"value\": [ { \"kind\": \"turnFlagOff\" } ] } ]"
   */
  instructions: Instructions;
};
