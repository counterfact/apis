import type { ConditionInput } from "./ConditionInput.js";
import type { ActionInput } from "./ActionInput.js";

export type StageInput = {
  /**
   * The stage name
   * @example "10% rollout on day 1"
   */
  name?: string;
  /**
   * Whether to execute the conditions in sequence for the given stage
   * @example true
   */
  executeConditionsInSequence?: boolean;
  /**
   * An array of conditions for the stage
   * @example [{"kind":"schedule","scheduleKind":"relative","waitDuration":2,"waitDurationUnit":"calendarDay"}]
   */
  conditions?: Array<ConditionInput>;
  /**
   * An <code>instructions</code> field containing an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
   * @example "{\"instructions\": [{ \"kind\": \"turnFlagOn\"}]}"
   */
  action?: ActionInput;
};
