import type { patchSegmentInstruction } from "./patchSegmentInstruction.js";

export type patchSegmentRequest = {
  /**
   * Optional description of changes
   * @example "optional comment"
   */
  comment?: string;
  /**
   * Semantic patch instructions for the desired changes to the resource
   * @example [{"contextKey":"contextKey","contextKind":"user","kind":"updateExpiringTarget","targetType":"included","value":1587582000000,"version":0}]
   */
  instructions: Array<patchSegmentInstruction>;
};
