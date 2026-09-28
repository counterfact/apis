import type { Instruction } from "./Instruction.js";

export type patchFlagsRequest = {
  /**
   * Optional comment describing the change
   * @example "optional comment"
   */
  comment?: string;
  /**
   * The instructions to perform when updating
   * @example [{"kind":"addExpireUserTargetDate","userKey":"sandy","value":1686412800000,"variationId":"ce12d345-a1b2-4fb5-a123-ab123d4d5f5d"}]
   */
  instructions: Array<Instruction>;
};
