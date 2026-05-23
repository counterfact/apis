import type { findPetsByStatus } from "../../types/paths/pet/findByStatus.types.js";

export const GET: findPetsByStatus = async ($) => {
  return $.response[200].random();
};
