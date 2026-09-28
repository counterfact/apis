import type { Instructions } from "./Instructions.js";

export type ExperimentPatchInput = {
  /**
   * Optional comment describing the update
   * @example "Optional comment"
   */
  comment?: string;
  /**
   * The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require a <code>value</code> field in the array element.
   * @example "[{\"kind\": \"updateName\", \"value\": \"Updated experiment name\"}]"
   */
  instructions: Instructions;
};
