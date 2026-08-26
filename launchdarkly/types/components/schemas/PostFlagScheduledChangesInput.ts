import type { UnixMillis } from "./UnixMillis.js";
import type { Instructions } from "./Instructions.js";

export type PostFlagScheduledChangesInput = {
  /**
   * Optional comment describing the scheduled changes
   * @example "optional comment"
   */
  comment?: string;
  /**
   * When the scheduled changes should be executed
   * @example "1636558831870"
   */
  executionDate: UnixMillis;
  /**
   * The actions to perform on the execution date for these scheduled changes. This should be an array with a single object that looks like <code>{"kind": "scheduled_action"}</code>. Supported scheduled actions are <code>turnFlagOn</code> and <code>turnFlagOff</code>.
   * @example "[ { \"kind\": \"turnFlagOn\" }]"
   */
  instructions: Instructions;
};
