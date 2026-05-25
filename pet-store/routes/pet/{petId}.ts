import type { getPetById } from "../../types/paths/pet/{petId}.types.js";
import type { updatePetWithForm } from "../../types/paths/pet/{petId}.types.js";
import type { deletePet } from "../../types/paths/pet/{petId}.types.js";

export const GET: getPetById = async ($) => {
  if (!Number.isFinite($.path.petId) || $.path.petId <= 0) {
    return $.response[400].empty();
  }

  const pet = $.context.petsById.get($.path.petId);
  if (!pet) {
    return $.response[404].empty();
  }

  return $.response[200].json(pet);
};

export const POST: updatePetWithForm = async ($) => {
  const pet = $.context.petsById.get($.path.petId);
  if (!pet) {
    return $.response[400].empty();
  }

  const updatedPet = $.context.savePet({
    ...pet,
    ...(typeof $.query.name === "string" ? { name: $.query.name } : {}),
    ...(typeof $.query.status === "string"
      ? {
          status: $.query.status as "available" | "pending" | "sold",
        }
      : {}),
  });
  return $.response[200].json(updatedPet);
};

export const DELETE: deletePet = async ($) => {
  if (!$.context.petsById.has($.path.petId)) {
    return $.response[400].empty();
  }
  $.context.petsById.delete($.path.petId);
  return $.response[200].empty();
};
