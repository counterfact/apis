import type { updatePet } from "../types/paths/pet.types.js";
import type { addPet } from "../types/paths/pet.types.js";

export const PUT: updatePet = async ($) => {
  if ($.body.id == null) {
    return $.response[400].empty();
  }

  if (!$.context.petsById.has($.body.id)) {
    return $.response[404].empty();
  }

  return $.response[200].json($.context.savePet($.body));
};

export const POST: addPet = async ($) => {
  return $.response[200].json($.context.savePet($.body));
};
