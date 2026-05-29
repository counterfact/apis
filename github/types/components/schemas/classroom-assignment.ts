import type { simple_classroom_repository } from "./simple-classroom-repository.js";
import type { classroom } from "./classroom.js";

/**
 * A GitHub Classroom assignment
 */
export type classroom_assignment = {
  /**
   * Unique identifier of the repository.
   * @example 42
   */
  id: number;
  /**
   * Whether an accepted assignment creates a public repository.
   * @example true
   */
  public_repo: boolean;
  /**
   * Assignment title.
   * @example "Intro to Binaries"
   */
  title: string;
  /**
   * Whether it's a group assignment or individual assignment.
   * @example "individual"
   */
  type: "individual" | "group";
  /**
   * The link that a student can use to accept the assignment.
   * @example "https://classroom.github.com/a/Lx7jiUgx"
   */
  invite_link: string;
  /**
   * Whether the invitation link is enabled. Visiting an enabled invitation link will accept the assignment.
   * @example true
   */
  invitations_enabled: boolean;
  /**
   * Sluggified name of the assignment.
   * @example "intro-to-binaries"
   */
  slug: string;
  /**
   * Whether students are admins on created repository when a student accepts the assignment.
   * @example true
   */
  students_are_repo_admins: boolean;
  /**
   * Whether feedback pull request will be created when a student accepts the assignment.
   * @example true
   */
  feedback_pull_requests_enabled: boolean;
  /**
   * The maximum allowable teams for the assignment.
   * @example 0
   */
  max_teams: number;
  /**
   * The maximum allowable members per team.
   * @example 0
   */
  max_members: number;
  /**
   * The selected editor for the assignment.
   * @example "codespaces"
   */
  editor: string;
  /**
   * The number of students that have accepted the assignment.
   * @example 25
   */
  accepted: number;
  /**
   * The number of students that have submitted the assignment.
   * @example 10
   */
  submitted: number;
  /**
   * The number of students that have passed the assignment.
   * @example 10
   */
  passing: number;
  /**
   * The programming language used in the assignment.
   * @example "elixir"
   */
  language: string;
  /**
   * The time at which the assignment is due.
   * @format date-time
   * @example "2011-01-26T19:06:43Z"
   */
  deadline: string;
  starter_code_repository: simple_classroom_repository;
  classroom: classroom;
};
