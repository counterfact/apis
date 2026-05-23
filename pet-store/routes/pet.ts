import type { updatePet } from "../types/paths/pet.types.js";
import type { addPet } from "../types/paths/pet.types.js";

export const PUT: updatePet = async ($) => {
  return $.response[200].random();
};

export const POST: addPet = async ($) => {
  return $.response[200].random();
};
