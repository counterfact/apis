import type { Instructions } from "./Instructions.js";

export type teamPatchInput = {
  /**
   * Optional comment describing the update
   * @example "Optional comment about the update"
   */
  comment?: string;
  /**
   * The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require additional parameters as part of this object.
   * @example "[ { \"kind\": \"updateDescription\", \"value\": \"New description for the team\" } ]"
   */
  instructions: Instructions;
};
