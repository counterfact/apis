import type { classroomGetAnAssignment } from "../../types/paths/assignments/{assignment_id}.types.js";

export const GET: classroomGetAnAssignment = async ($) => {
  return $.response[200].random();
};
