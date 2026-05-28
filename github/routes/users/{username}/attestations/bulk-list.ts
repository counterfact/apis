import type { usersListAttestationsBulk } from "../../../../types/paths/users/{username}/attestations/bulk-list.types.js";

export const POST: usersListAttestationsBulk = async ($) => {
  return $.response[200].random();
};
