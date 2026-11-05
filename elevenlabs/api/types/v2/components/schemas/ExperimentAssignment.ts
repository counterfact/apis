import type { ExperimentAssignmentSource } from "./ExperimentAssignmentSource.js";
/**
 * Experiment membership recorded on a conversation.
 */
export type ExperimentAssignment = {
  /**
   * Experiment key.
   */
  key: string;
  /**
   * Variant identifier: the branch id for server_branch, or the client-supplied variant for client_declared.
   */
  variant: string;
  source: ExperimentAssignmentSource;
  /**
   * The AgentExperiment id, when the assignment maps to a registered experiment.
   */
  experiment_id?: string | null;
};
