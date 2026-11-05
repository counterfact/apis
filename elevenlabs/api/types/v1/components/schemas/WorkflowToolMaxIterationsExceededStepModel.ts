export type WorkflowToolMaxIterationsExceededStepModel = {
  step_latency_secs: number;
  /**
   * @default "max_iterations_exceeded"
   */
  type?: "max_iterations_exceeded";
  max_iterations: number;
};
