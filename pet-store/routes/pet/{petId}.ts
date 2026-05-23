import type { getPetById } from "../../types/paths/pet/{petId}.types.js";
import type { updatePetWithForm } from "../../types/paths/pet/{petId}.types.js";
import type { deletePet } from "../../types/paths/pet/{petId}.types.js";

export const GET: getPetById = async ($) => {
  return $.response[200].random();
};

export const POST: updatePetWithForm = async ($) => {
  return $.response[200].random();
};

export const DELETE: deletePet = async ($) => {
  return $.response[200].empty();
};
