import type { JSONPatch } from "./JSONPatch.js";

export type PatchWithComment = {
  /**
   * A JSON patch representation of the change to make
   */
  patch: JSONPatch;
  /**
   * Optional comment
   */
  comment?: string;
};
