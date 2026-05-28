import type { simple_classroom_organization } from "./simple-classroom-organization.js";

/**
 * A GitHub Classroom classroom
 */
export type classroom = {
  /**
   * Unique identifier of the classroom.
   * @example 42
   */
  id: number;
  /**
   * The name of the classroom.
   * @example "Programming Elixir"
   */
  name: string;
  /**
   * Whether classroom is archived.
   * @example false
   */
  archived: boolean;
  organization: simple_classroom_organization;
  /**
   * The URL of the classroom on GitHub Classroom.
   * @example "https://classroom.github.com/classrooms/1-programming-elixir"
   */
  url: string;
};
