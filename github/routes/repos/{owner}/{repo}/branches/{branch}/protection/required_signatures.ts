import type { reposGetCommitSignatureProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_signatures.types.js";
import type { reposCreateCommitSignatureProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_signatures.types.js";
import type { reposDeleteCommitSignatureProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_signatures.types.js";

export const GET: reposGetCommitSignatureProtection = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateCommitSignatureProtection = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteCommitSignatureProtection = async ($) => {
  return $.response[204].empty();
};
