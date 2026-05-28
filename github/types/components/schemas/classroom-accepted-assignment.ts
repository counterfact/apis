import type { simple_classroom_user } from "./simple-classroom-user.js";
import type { simple_classroom_repository } from "./simple-classroom-repository.js";
import type { simple_classroom_assignment } from "./simple-classroom-assignment.js";

/**
 * A GitHub Classroom accepted assignment
 */
export type classroom_accepted_assignment = {
  /**
   * Unique identifier of the repository.
   * @example 42
   */
  id: number;
  /**
   * Whether an accepted assignment has been submitted.
   * @example true
   */
  submitted: boolean;
  /**
   * Whether a submission passed.
   * @example true
   */
  passing: boolean;
  /**
   * Count of student commits.
   * @example 5
   */
  commit_count: number;
  /**
   * Most recent grade.
   * @example "10/10"
   */
  grade: string;
  students: Array<simple_classroom_user>;
  repository: simple_classroom_repository;
  assignment: simple_classroom_assignment;
};
