import type { HunkRep } from "./HunkRep.js";

export type ReferenceRep = {
  /**
   * File path of the reference
   * @example "/main/index.js"
   */
  path: string;
  /**
   * Programming language used in the file
   * @example "javascript"
   */
  hint?: string;
  hunks: Array<HunkRep>;
};
