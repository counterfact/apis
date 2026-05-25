import type { findPetsByTags } from "../../types/paths/pet/findByTags.types.js";

export const GET: findPetsByTags = async ($) => {
  const requestedTags = new Set($.query.tags);
  const pets = [...$.context.petsById.values()].filter((pet) =>
    pet.tags?.some((tag) => tag.name && requestedTags.has(tag.name)),
  );
  return $.response[200].json(pets);
};
