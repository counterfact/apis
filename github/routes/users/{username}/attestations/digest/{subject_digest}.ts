import type { usersDeleteAttestationsBySubjectDigest } from "../../../../../types/paths/users/{username}/attestations/digest/{subject_digest}.types.js";

export const DELETE: usersDeleteAttestationsBySubjectDigest = async ($) => {
  return $.response[200].empty();
};
