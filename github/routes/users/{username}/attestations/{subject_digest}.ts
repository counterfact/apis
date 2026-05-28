import type { usersListAttestations } from "../../../../types/paths/users/{username}/attestations/{subject_digest}.types.js";

export const GET: usersListAttestations = async ($) => {
  return $.response[200].random();
};
