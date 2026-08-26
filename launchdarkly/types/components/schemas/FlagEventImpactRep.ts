import type { ImpactReason } from "./ImpactReason.js";
import type { EvaluationsSummary } from "./EvaluationsSummary.js";

export type FlagEventImpactRep = {
  /**
   * The size of the flag event impact. Sizes are defined as: none (0%), small (0-20%), medium (20-80%), large (>80%)
   * @example "medium"
   */
  size?: "none" | "small" | "medium" | "large";
  /**
   * The percentage of the flag event impact
   * @example 50
   */
  percentage?: number;
  /**
   * The reason for the flag event impact
   * @example "evaluations"
   */
  reason?: ImpactReason;
  /**
   * A summary of the change in variation evaluations after the flag event
   */
  evaluationsSummary?: EvaluationsSummary;
};
