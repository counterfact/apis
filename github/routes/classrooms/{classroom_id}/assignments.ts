import type { classroomListAssignmentsForAClassroom } from "../../../types/paths/classrooms/{classroom_id}/assignments.types.js";

export const GET: classroomListAssignmentsForAClassroom = async ($) => {
  return $.response[200].random();
};
