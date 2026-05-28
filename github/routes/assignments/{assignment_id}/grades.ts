import type { classroomGetAssignmentGrades } from "../../../types/paths/assignments/{assignment_id}/grades.types.js";

export const GET: classroomGetAssignmentGrades = async ($) => {
  return $.response[200].random();
};
