import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
import type { TestConditionRationaleCommonModel } from "./TestConditionRationaleCommonModel.js";
export type TestConditionResultCommonModel = {
  result: EvaluationSuccessResult;
  rationale?: TestConditionRationaleCommonModel | null;
};
