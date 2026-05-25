import type { getPetById } from "../../types/paths/pet/{petId}.types.js";
import type { updatePetWithForm } from "../../types/paths/pet/{petId}.types.js";
import type { deletePet } from "../../types/paths/pet/{petId}.types.js";

export const GET: getPetById = async ($) => {
  if ($.path.petId <= 0) {
    return $.response[400].empty();
  }

  const pet = $.context.getPet($.path.petId);
  if (!pet) {
    return $.response[404].empty();
  }

  return $.response[200].json(pet);
};

export const POST: updatePetWithForm = async ($) => {
  const pet = $.context.getPet($.path.petId);
  if (!pet) {
    return $.response[400].empty();
  }
  if (
    $.query.status &&
    !["available", "pending", "sold"].includes($.query.status)
  ) {
    return $.response[400].empty();
  }

  const updatedPet = { ...pet };
  updatedPet.name = $.query.name ?? updatedPet.name;
  if ($.query.status) {
    updatedPet.status = $.query.status as "available" | "pending" | "sold";
  }

  const savedPet = $.context.savePet(updatedPet);
  return $.response[200].json(savedPet);
};

export const DELETE: deletePet = async ($) => {
  if (!$.context.hasPet($.path.petId)) {
    return $.response[404].empty();
  }
  $.context.deletePet($.path.petId);
  return $.response[200].empty();
};
