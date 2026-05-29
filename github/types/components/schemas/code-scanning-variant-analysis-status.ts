/**
 * The new status of the CodeQL variant analysis repository task.
 */
export type code_scanning_variant_analysis_status =
  | "pending"
  | "in_progress"
  | "succeeded"
  | "failed"
  | "canceled"
  | "timed_out";
