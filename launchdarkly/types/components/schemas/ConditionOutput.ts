import type { ExecutionOutput } from "./ExecutionOutput.js";
import type { ScheduleKind } from "./ScheduleKind.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { DurationUnit } from "./DurationUnit.js";
import type { ReviewOutput } from "./ReviewOutput.js";

export type ConditionOutput = {
  _id: string;
  kind?: string;
  _execution: ExecutionOutput;
  scheduleKind?: ScheduleKind;
  executionDate?: UnixMillis;
  waitDuration?: number;
  waitDurationUnit?: DurationUnit;
  description: string;
  notifyMemberIds: Array<string>;
  allReviews: Array<ReviewOutput>;
  reviewStatus: string;
  appliedDate?: UnixMillis;
};
