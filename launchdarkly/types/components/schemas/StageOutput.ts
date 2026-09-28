import type { ConditionOutput } from "./ConditionOutput.js";
import type { ActionOutput } from "./ActionOutput.js";
import type { ExecutionOutput } from "./ExecutionOutput.js";

export type StageOutput = {
  /**
   * The ID of this stage
   * @example "12ab3c45de678910abc12345"
   */
  _id: string;
  /**
   * The stage name
   * @example "10% rollout on day 1"
   */
  name?: string;
  /**
   * An array of conditions for the stage
   * @example [{"_execution":{"status":"completed"},"id":"12ab3c45de678910abc12345","kind":"schedule","scheduleKind":"relative","waitDuration":2,"waitDurationUnit":"calendarDay"}]
   */
  conditions: Array<ConditionOutput>;
  /**
   * The type of instruction, and an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
   * @example "{ \"kind\": \"patch\", \"instructions\": [{ \"kind\": \"turnFlagOn\"}] }"
   */
  action: ActionOutput;
  /**
   * Details on the execution of this stage
   * @example "{ \"status\": \"completed\" }"
   */
  _execution: ExecutionOutput;
};
