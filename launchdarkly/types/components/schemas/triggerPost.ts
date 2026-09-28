import type { Instruction } from "./Instruction.js";

export type triggerPost = {
  /**
   * Optional comment describing the trigger
   * @example "example comment"
   */
  comment?: string;
  /**
   * The action to perform when triggering. This should be an array with a single object that looks like <code>{"kind": "flag_action"}</code>. Supported flag actions are <code>turnFlagOn</code> and <code>turnFlagOff</code>.
   * @example [{"kind":"turnFlagOn"}]
   */
  instructions?: Array<Instruction>;
  /**
   * The unique identifier of the integration for your trigger. Use <code>generic-trigger</code> for integrations not explicitly supported.
   * @example "generic-trigger"
   */
  integrationKey: string;
};
