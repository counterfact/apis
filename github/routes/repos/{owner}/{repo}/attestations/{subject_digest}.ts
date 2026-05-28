import type { reposListAttestations } from "../../../../../types/paths/repos/{owner}/{repo}/attestations/{subject_digest}.types.js";

export const GET: reposListAttestations = async ($) => {
  return $.response[200].random();
};
