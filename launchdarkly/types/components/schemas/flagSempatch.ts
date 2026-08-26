import type { Instructions } from "./Instructions.js";

export type flagSempatch = {
  /**
   * Semantic patch instructions. The same ones that are valid for flags are valid here.
   */
  instructions: Instructions;
  comment?: string;
};
