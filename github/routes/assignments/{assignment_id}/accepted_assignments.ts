import type { classroomListAcceptedAssignmentsForAnAssignment } from "../../../types/paths/assignments/{assignment_id}/accepted_assignments.types.js";

export const GET: classroomListAcceptedAssignmentsForAnAssignment = async (
  $,
) => {
  return $.response[200].random();
};
