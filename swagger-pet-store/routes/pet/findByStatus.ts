import type { findPetsByStatus } from "../../types/paths/pet/findByStatus.types.js";

export const GET: findPetsByStatus = async ($) => {
  const pets = [...$.context.petsById.values()].filter(
    (pet) => pet.status === $.query.status,
  );
  return $.response[200].json(pets);
};
