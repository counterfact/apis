import type { Instruction } from "./Instruction.js";

export type FlagTriggerInput = {
  /**
   * Optional comment describing the update
   * @example "optional comment"
   */
  comment?: string;
  /**
   * The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "trigger_action"}</code>.
   * @example [{"kind":"disableTrigger"}]
   */
  instructions?: Array<Instruction>;
};
