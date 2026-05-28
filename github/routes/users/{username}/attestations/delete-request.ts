import type { usersDeleteAttestationsBulk } from "../../../../types/paths/users/{username}/attestations/delete-request.types.js";

export const POST: usersDeleteAttestationsBulk = async ($) => {
  return $.response[200].empty();
};
