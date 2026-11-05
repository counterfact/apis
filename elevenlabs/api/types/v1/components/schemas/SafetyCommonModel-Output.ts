import type { SafetyEvaluation } from "./SafetyEvaluation.js";
/**
 * Safety object that has the information of safety evaluations based on used voice.
 */
export type SafetyCommonModel_Output = {
  ivc?: SafetyEvaluation;
  non_ivc?: SafetyEvaluation;
};
