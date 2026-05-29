import type { reposCreateAttestation } from "../../../../types/paths/repos/{owner}/{repo}/attestations.types.js";

export const POST: reposCreateAttestation = async ($) => {
  return $.response[201].random();
};
