import type { instructionUserRequest } from "./instructionUserRequest.js";

export type patchUsersRequest = {
  /**
   * Optional comment describing the change
   * @example "optional comment"
   */
  comment?: string;
  /**
   * The instructions to perform when updating
   */
  instructions: Array<instructionUserRequest>;
};
