import type { AnalysisRunningTotal } from "./AnalysisRunningTotal.js";
import type { AnalysisRunSnapshot } from "./AnalysisRunSnapshot.js";
/**
 * Cost of running post-call analysis on this conversation.
 * Present once an analysis pass has run, billed or not.
 */
export type AnalysisCharging = {
  total: AnalysisRunningTotal;
  last_run: AnalysisRunSnapshot;
};
