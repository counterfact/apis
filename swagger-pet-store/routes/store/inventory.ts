import type { getInventory } from "../../types/paths/store/inventory.types.js";

export const GET: getInventory = async ($) => {
  const inventory = $.context
    .listPets()
    .reduce<Record<string, number>>((counts, pet) => {
      const status = pet.status ?? "unknown";
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    }, {});
  return $.response[200].json(inventory);
};
