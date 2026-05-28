import type { usersDeleteAttestationsById } from "../../../../types/paths/users/{username}/attestations/{attestation_id}.types.js";

export const DELETE: usersDeleteAttestationsById = async ($) => {
  return $.response[200].empty();
};
