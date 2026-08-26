import type { UnixMillis } from "./UnixMillis.js";
import type { ReferenceRep } from "./ReferenceRep.js";

export type BranchRep = {
  /**
   * The branch name
   * @example "main"
   */
  name: string;
  /**
   * An ID representing the branch HEAD. For example, a commit SHA.
   * @example "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"
   */
  head: string;
  /**
   * An optional ID used to prevent older data from overwriting newer data
   * @format int64
   * @example 25
   */
  updateSequenceId?: number;
  /**
   * A timestamp indicating when the branch was last synced
   * @example "1636558831870"
   */
  syncTime: UnixMillis;
  /**
   * An array of flag references found on the branch
   */
  references?: Array<ReferenceRep>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
