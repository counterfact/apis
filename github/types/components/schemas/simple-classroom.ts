/**
 * A GitHub Classroom classroom
 */
export type simple_classroom = {
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
   * Returns whether classroom is archived or not.
   * @example false
   */
  archived: boolean;
  /**
   * The url of the classroom on GitHub Classroom.
   * @example "https://classroom.github.com/classrooms/1-programming-elixir"
   */
  url: string;
};
