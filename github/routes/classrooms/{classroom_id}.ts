import type { classroomGetAClassroom } from "../../types/paths/classrooms/{classroom_id}.types.js";

export const GET: classroomGetAClassroom = async ($) => {
  return $.response[200].random();
};
