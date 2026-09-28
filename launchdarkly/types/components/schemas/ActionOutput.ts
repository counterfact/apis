import type { Instructions } from "./Instructions.js";

export type ActionOutput = {
  /**
   * The type of action for this stage
   * @example "patch"
   */
  kind: string;
  /**
   * An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
   * @example "[{\"kind\": \"turnFlagOn\"}]"
   */
  instructions: Instructions;
};
