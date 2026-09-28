import type { Instruction } from "./Instruction.js";

export type Conflict = {
  /**
   * Instruction in semantic patch format to be applied to the feature flag
   */
  instruction?: Instruction;
  /**
   * Reason why the conflict exists
   */
  reason?: string;
};
