import type { classroomListClassrooms } from "../types/paths/classrooms.types.js";

export const GET: classroomListClassrooms = async ($) => {
  return $.response[200].random();
};
