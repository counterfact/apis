import type { ScheduleKind } from "./ScheduleKind.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { DurationUnit } from "./DurationUnit.js";
import type { ConditionKind } from "./ConditionKind.js";

export type ConditionInput = {
  /**
   * Whether the scheduled execution of the workflow stage is relative or absolute. If relative, the <code>waitDuration</code> and <code>waitDurationUnit</code> specify when the execution occurs. If absolute, the <code>executionDate</code> specifies when the execution occurs.
   * @example "relative"
   */
  scheduleKind?: ScheduleKind;
  /**
   * For workflow stages whose scheduled execution is absolute, the time, in Unix milliseconds, when the stage should start.
   * @example "1706810400000"
   */
  executionDate?: UnixMillis;
  /**
   * For workflow stages whose scheduled execution is relative, how far in the future the stage should start.
   * @example 2
   */
  waitDuration?: number;
  /**
   * For workflow stages whose scheduled execution is relative, the unit of measure for the <code>waitDuration</code>.
   * @example "calendarDay"
   */
  waitDurationUnit?: DurationUnit;
  /**
   * Whether the workflow stage should be executed immediately
   * @example false
   */
  executeNow?: boolean;
  /**
   * A description of the approval required for this stage
   * @example "Require example-team approval for final stage"
   */
  description?: string;
  /**
   * A list of member IDs for the members to request approval from for this stage
   * @example ["507f1f77bcf86cd799439011"]
   */
  notifyMemberIds?: Array<string>;
  /**
   * A list of team keys for the teams to request approval from for this stage
   * @example ["example-team"]
   */
  notifyTeamKeys?: Array<string>;
  /**
   * The type of condition to meet before executing this stage of the workflow. Use <code>schedule</code> to schedule a workflow stage. Use <code>ld-approval</code> to add an approval request to a workflow stage.
   * @example "schedule"
   */
  kind?: ConditionKind;
};
