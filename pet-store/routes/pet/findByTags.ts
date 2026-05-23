import type { findPetsByTags } from "../../types/paths/pet/findByTags.types.js";

export const GET: findPetsByTags = async ($) => {
  return $.response[200].random();
};
